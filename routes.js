// Global variables
let map;
let drawingManager;
let currentPolygon = null;
let currentDay = 'Sunday';
let currentRoutes = [];
let routePolygons = [];
let adminMode = false;
let geocoder;
let infoWindow;
let darkMode = false;

// Initialize Google Map
function initMap() {
    // Create the map centered on LA County
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 34.0522, lng: -118.2437 },
        zoom: 10,
        styles: getLightMapStyle(),
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true
    });

    // Initialize geocoder for address search
    geocoder = new google.maps.Geocoder();

    // Initialize info window for route details
    infoWindow = new google.maps.InfoWindow();

    // Initialize drawing manager for admin zone creation
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        polygonOptions: {
            fillColor: '#2ecc71',
            fillOpacity: 0.3,
            strokeWeight: 2,
            strokeColor: '#2ecc71',
            clickable: true,
            editable: true,
            zIndex: 1
        }
    });

    drawingManager.setMap(map);

    // Event listener for when a polygon is completed
    google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
        currentPolygon = polygon;
        drawingManager.setDrawingMode(null);
        document.getElementById('zoneProperties').style.display = 'flex';

        // Add event listener for polygon clicks
        google.maps.event.addListener(polygon, 'click', function (event) {
            if (adminMode) {
                // In admin mode, clicking a polygon allows editing its properties
                editZone(polygon);
            }
        });
    });

    // Initial display of routes
    displayRoutesByDay(currentDay);

    // Set up event listeners
    setupEventListeners();

    // Check for dark mode preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
        toggleDarkMode();
    }
}

// Get light mode map style
function getLightMapStyle() {
    return [
        {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#444444" }]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{ "color": "#f2f2f2" }]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [{ "visibility": "simplified" }]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{ "color": "#c4e5f9" }, { "visibility": "on" }]
        }
    ];
}

// Get dark mode map style
function getDarkMapStyle() {
    return [
        {
            "elementType": "geometry",
            "stylers": [{ "color": "#242f3e" }]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#242f3e" }]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#746855" }]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#d59563" }]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#d59563" }]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{ "color": "#263c3f" }]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#6b9a76" }]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{ "color": "#38414e" }]
        },
        {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#212a37" }]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#9ca5b3" }]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{ "color": "#746855" }]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#1f2835" }]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#f3d19c" }]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{ "color": "#2f3948" }]
        },
        {
            "featureType": "transit.station",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#d59563" }]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#17263c" }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#515c6d" }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#17263c" }]
        }
    ];
}

// Display routes for the selected day
function displayRoutesByDay(day) {
    // Clear previous routes
    clearRoutePolygons();

    // Filter routes by the selected day
    currentRoutes = window.routes.filter(route => route.day === day);

    // Update the routes list in the sidebar
    updateRoutesList();

    // Add each route as a polygon on the map
    currentRoutes.forEach(route => {
        const color = route.restricted ? '#e74c3c' : '#3498db';

        const polygon = new google.maps.Polygon({
            paths: route.path,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: route.restricted ? 0.3 : 0.5,
            map: map,
            routeData: route // Store route data with the polygon
        });

        // Add route label (centered in polygon)
        addRouteLabel(polygon, route);

        // Add click event to show route details
        polygon.addListener('click', function () {
            showRouteInfo(polygon);
        });

        // Store the polygon reference
        routePolygons.push(polygon);
    });

    // Fit map bounds to show all routes
    if (routePolygons.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        routePolygons.forEach(polygon => {
            polygon.getPath().forEach(path => {
                bounds.extend(path);
            });
        });
        map.fitBounds(bounds);
    }
}

// Add a centered label to the route polygon
function addRouteLabel(polygon, route) {
    // Calculate the center of the polygon
    const bounds = new google.maps.LatLngBounds();
    polygon.getPath().forEach(path => {
        bounds.extend(path);
    });
    const center = bounds.getCenter();

    // Create a marker at the center with a custom label
    const marker = new google.maps.Marker({
        position: center,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 0,
        },
        label: {
            text: route.name,
            color: route.restricted ? '#721c24' : '#ffffff',
            fontSize: '12px',
            fontWeight: 'bold'
        }
    });

    // Store the marker reference with the polygon
    polygon.label = marker;

    // Return the marker reference
    return marker;
}

// Show route information in an info window
function showRouteInfo(polygon) {
    const route = polygon.routeData;
    const center = polygon.getPath().getAt(0);

    const content = `
        <div class="info-window">
            <h3>${route.name}</h3>
            <p><span class="label">Day:</span> ${route.day}</p>
            <p><span class="label">Driver:</span> ${route.driver}</p>
            <p><span class="label">Deliveries:</span> ${route.deliveries}</p>
            <p><span class="label">Capacity:</span> ${(route.capacity * 100).toFixed(0)}%</p>
            <p><span class="label">Restricted:</span> ${route.restricted ? 'Yes' : 'No'}</p>
        </div>
    `;

    infoWindow.setContent(content);
    infoWindow.setPosition(center);
    infoWindow.open(map);
}

// Update the sidebar routes list
function updateRoutesList() {
    const routesList = document.getElementById('routesList');
    routesList.innerHTML = '';

    // Update count
    document.getElementById('routeCount').textContent = `(${currentRoutes.length})`;

    currentRoutes.forEach(route => {
        const li = document.createElement('li');

        const nameSpan = document.createElement('span');
        nameSpan.textContent = route.name;

        const driverSpan = document.createElement('span');
        driverSpan.className = 'route-driver';
        driverSpan.textContent = route.driver;

        li.appendChild(nameSpan);
        li.appendChild(driverSpan);

        if (route.restricted) {
            li.classList.add('restricted');
        }

        li.addEventListener('click', function () {
            // Remove active class from all list items
            document.querySelectorAll('#routesList li').forEach(item => {
                item.classList.remove('active');
            });

            // Add active class to this item
            li.classList.add('active');

            // Find the corresponding polygon and center the map on it
            const polygon = routePolygons.find(p => p.routeData.name === route.name);
            if (polygon) {
                // Calculate the bounds of the polygon
                const bounds = new google.maps.LatLngBounds();
                polygon.getPath().forEach(path => {
                    bounds.extend(path);
                });
                map.fitBounds(bounds);

                // Show route info
                showRouteInfo(polygon);
            }
        });

        routesList.appendChild(li);
    });
}

// Clear all route polygons from the map
function clearRoutePolygons() {
    routePolygons.forEach(polygon => {
        polygon.setMap(null);
        if (polygon.label) {
            polygon.label.setMap(null);
        }
    });
    routePolygons = [];
}

// Address search function
function searchAddress() {
    const address = document.getElementById('addressSearch').value;
    const resultDiv = document.getElementById('searchResult');

    if (!address) {
        resultDiv.innerHTML = 'Please enter an address';
        return;
    }

    geocoder.geocode({ address: address + ', Los Angeles County, CA' }, function (results, status) {
        if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;

            // Center the map on the searched location
            map.setCenter(location);
            map.setZoom(14);

            // Create a marker at the searched location
            const marker = new google.maps.Marker({
                map: map,
                position: location,
                animation: google.maps.Animation.DROP
            });

            // Check if the location is within any route zone
            let foundRoute = false;

            for (let i = 0; i < routePolygons.length; i++) {
                const polygon = routePolygons[i];
                const routeData = polygon.routeData;

                if (google.maps.geometry.poly.containsLocation(location, polygon)) {
                    foundRoute = true;
                    resultDiv.innerHTML = `
                        Address is in zone: <strong>${routeData.name}</strong><br>
                        Driver: ${routeData.driver}<br>
                        Day: ${routeData.day}<br>
                        ${routeData.restricted ? '<span style="color: red;">Restricted Zone</span>' : ''}
                    `;

                    // Show route info
                    showRouteInfo(polygon);
                    break;
                }
            }

            if (!foundRoute) {
                resultDiv.innerHTML = 'Address is not in any defined zone';
            }

            // Remove marker after 5 seconds
            setTimeout(() => {
                marker.setMap(null);
            }, 5000);
        } else {
            resultDiv.innerHTML = 'Address not found. Please try again.';
        }
    });
}

// Admin login function
function adminLogin() {
    const password = document.getElementById('adminPassword').value;

    if (password === 'routeadmin2025') {
        adminMode = true;
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminControls').style.display = 'block';
    } else {
        alert('Incorrect password');
    }
}

// Start drawing a new zone
function startDrawingZone() {
    // Clear any existing polygon being edited
    if (currentPolygon) {
        currentPolygon.setMap(null);
        currentPolygon = null;
    }

    // Reset form
    document.getElementById('zoneName').value = '';
    document.getElementById('zoneDriver').value = '';
    document.getElementById('zoneDeliveries').value = '';
    document.getElementById('zoneRestricted').checked = false;
    document.getElementById('zoneDay').value = currentDay;

    // Hide zone properties until drawing is complete
    document.getElementById('zoneProperties').style.display = 'none';

    // Set drawing mode to polygon
    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
}

// Save the currently edited zone
function saveZone() {
    if (!currentPolygon) {
        alert('No zone to save');
        return;
    }

    const name = document.getElementById('zoneName').value;
    const day = document.getElementById('zoneDay').value;
    const driver = document.getElementById('zoneDriver').value;
    const deliveries = parseInt(document.getElementById('zoneDeliveries').value) || 0;
    const restricted = document.getElementById('zoneRestricted').checked;

    if (!name) {
        alert('Please enter a zone name');
        return;
    }

    // Get polygon path
    const path = [];
    const polygonPath = currentPolygon.getPath();

    for (let i = 0; i < polygonPath.getLength(); i++) {
        const point = polygonPath.getAt(i);
        path.push({ lat: point.lat(), lng: point.lng() });
    }

    // Create new route object
    const newRoute = {
        name: name,
        driver: driver || 'UNASSIGNED',
        day: day,
        deliveries: deliveries,
        capacity: deliveries > 0 ? Math.min(deliveries / 30, 1) : 0,
        restricted: restricted,
        path: path
    };

    // Add to routes array
    window.routes.push(newRoute);

    // Reset drawing
    currentPolygon.setMap(null);
    currentPolygon = null;
    document.getElementById('zoneProperties').style.display = 'none';

    // Refresh routes display if the new route is for the current day
    if (day === currentDay) {
        displayRoutesByDay(currentDay);
    }
}

// Cancel the current zone drawing/editing
function cancelZone() {
    if (currentPolygon) {
        currentPolygon.setMap(null);
        currentPolygon = null;
    }

    document.getElementById('zoneProperties').style.display = 'none';
    drawingManager.setDrawingMode(null);
}

// Edit an existing zone
function editZone(polygon) {
    // Store the route data
    const routeData = polygon.routeData;

    // Remove the existing polygon from the map
    polygon.setMap(null);

    // Create a new editable polygon
    currentPolygon = new google.maps.Polygon({
        paths: routeData.path,
        strokeColor: routeData.restricted ? '#e74c3c' : '#3498db',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: routeData.restricted ? '#e74c3c' : '#3498db',
        fillOpacity: routeData.restricted ? 0.3 : 0.5,
        map: map,
        editable: true
    });

    // Fill form with route data
    document.getElementById('zoneName').value = routeData.name;
    document.getElementById('zoneDriver').value = routeData.driver;
    document.getElementById('zoneDeliveries').value = routeData.deliveries;
    document.getElementById('zoneRestricted').checked = routeData.restricted;
    document.getElementById('zoneDay').value = routeData.day;

    // Show zone properties panel
    document.getElementById('zoneProperties').style.display = 'flex';

    // Remove the original route from the routes array
    const index = window.routes.findIndex(route =>
        route.name === routeData.name && route.day === routeData.day);

    if (index !== -1) {
        window.routes.splice(index, 1);
    }

    // Remove from current display
    const polyIndex = routePolygons.findIndex(p => p === polygon);
    if (polyIndex !== -1) {
        if (routePolygons[polyIndex].label) {
            routePolygons[polyIndex].label.setMap(null);
        }
        routePolygons.splice(polyIndex, 1);
    }
}

// Export routes to JSON
function exportRoutes() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.routes, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "routes.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Import routes from JSON
function importRoutes() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
            try {
                const content = readerEvent.target.result;
                const routes = JSON.parse(content);

                if (Array.isArray(routes)) {
                    window.routes = routes;
                    displayRoutesByDay(currentDay);
                    alert('Routes imported successfully');
                } else {
                    throw new Error('Invalid format');
                }
            } catch (error) {
                alert('Error importing routes: ' + error.message);
            }
        };
    };

    input.click();
}

// Toggle dark mode
function toggleDarkMode() {
    darkMode = !darkMode;

    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        document.getElementById('darkModeToggle').innerHTML = '<i class="fas fa-sun"></i>';

        // Change map style for dark mode
        map.setOptions({
            styles: getDarkMapStyle()
        });
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        document.getElementById('darkModeToggle').innerHTML = '<i class="fas fa-moon"></i>';

        // Reset map style for light mode
        map.setOptions({
            styles: getLightMapStyle()
        });
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Day selector buttons
    const dayButtons = document.querySelectorAll('.day-buttons button');
    dayButtons.forEach(button => {
        button.addEventListener('click', function () {
            currentDay = this.getAttribute('data-day');

            // Update active button
            dayButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update routes display
            displayRoutesByDay(currentDay);
        });

        // Set active class for default day
        if (button.getAttribute('data-day') === currentDay) {
            button.classList.add('active');
        }
    });

    // Address search
    document.getElementById('searchButton').addEventListener('click', searchAddress);
    document.getElementById('addressSearch').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchAddress();
        }
    });

    // Admin panel
    document.getElementById('adminPanelButton').addEventListener('click', function () {
        document.getElementById('adminPanel').style.display = 'block';
    });

    // Close modal
    document.querySelector('.close').addEventListener('click', function () {
        document.getElementById('adminPanel').style.display = 'none';
    });

    // Admin login
    document.getElementById('loginButton').addEventListener('click', adminLogin);
    document.getElementById('adminPassword').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            adminLogin();
        }
    });

    // Draw zone
    document.getElementById('drawZoneButton').addEventListener('click', startDrawingZone);

    // Save zone
    document.getElementById('saveZoneButton').addEventListener('click', saveZone);

    // Cancel zone
    document.getElementById('cancelZoneButton').addEventListener('click', cancelZone);

    // Export routes
    document.getElementById('exportRoutes').addEventListener('click', exportRoutes);

    // Import routes
    document.getElementById('importRoutes').addEventListener('click', importRoutes);

    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

    // Click outside modal to close
    window.addEventListener('click', function (event) {
        const modal = document.getElementById('adminPanel');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}