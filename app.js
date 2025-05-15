// Global variables
const globals = {
    map: null,
    drawingManager: null,
    currentPolygon: null,
    currentDay: 'Sunday',
    currentRoutes: [],
    routePolygons: [],
    adminMode: false,
    geocoder: null,
    infoWindow: null,
    darkMode: false,
    mapStyles: {
        light: [
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
        ],
        dark: [
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
        ]
    }
};

// Debug helper
console.log("App.js is loading...");

// Show loading screen for a minimum time
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
        }
    }, 2000); // Minimum 2 seconds loading screen
});

// Initialize Google Map
function initMap() {
    console.log("initMap function called");

    try {
        // Verify routes data is available
        if (!window.routes || !Array.isArray(window.routes)) {
            console.error("Routes data missing or invalid. Check if routes.js is loaded correctly.");
            // Create a placeholder for routes to prevent errors
            window.routes = [];
            showToast('error', 'Route data missing or invalid');
        }

        // Create the map centered on LA County
        globals.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 34.0522, lng: -118.2437 },
            zoom: 10,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            gestureHandling: 'greedy',
            styles: globals.mapStyles.light
        });

        console.log("Map created successfully");

        // Initialize geocoder for address search
        globals.geocoder = new google.maps.Geocoder();

        // Initialize info window for route details
        globals.infoWindow = new google.maps.InfoWindow({
            maxWidth: 300
        });

        // Initialize drawing manager for admin zone creation
        globals.drawingManager = new google.maps.drawing.DrawingManager({
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

        globals.drawingManager.setMap(globals.map);

        // Event listener for when a polygon is completed
        google.maps.event.addListener(globals.drawingManager, 'polygoncomplete', function (polygon) {
            console.log("Polygon completed");
            globals.currentPolygon = polygon;
            globals.drawingManager.setDrawingMode(null);

            const zoneProps = document.getElementById('zoneProperties');
            if (zoneProps) {
                zoneProps.style.display = 'block';
                // Smooth entry animation
                setTimeout(() => {
                    zoneProps.classList.add('form-visible');
                }, 10);
            }

            // Add event listener for polygon clicks
            google.maps.event.addListener(polygon, 'click', function (event) {
                if (globals.adminMode) {
                    // In admin mode, clicking a polygon allows editing its properties
                    editZone(polygon);
                }
            });

            showToast('success', 'Zone drawn successfully! Please provide details.');
        });

        console.log(`Found ${window.routes.length} routes in routes.js`);

        // Set up event listeners
        setupEventListeners();

        // Initial display of routes
        displayRoutesByDay(globals.currentDay);

        // Check for dark mode preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
            toggleDarkMode();
        }

        // Hide loading screen
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
            }
        }, 500);
    } catch (error) {
        console.error("Error in initMap:", error);
        showToast('error', 'Error initializing map');
    }
}

// Display routes for the selected day
function displayRoutesByDay(day) {
    console.log(`Displaying routes for ${day}`);

    // Clear previous routes
    clearRoutePolygons();

    // Filter routes by the selected day
    globals.currentRoutes = window.routes.filter(route => route.day === day);
    console.log(`Found ${globals.currentRoutes.length} routes for ${day}`);

    // Update the routes list in the sidebar
    updateRoutesList();

    // Add each route as a polygon on the map with staggered animation
    globals.currentRoutes.forEach((route, index) => {
        setTimeout(() => {
            addRouteToMap(route);
        }, index * 100); // Stagger by 100ms per route
    });

    // Fit map bounds to show all routes after a delay
    setTimeout(() => {
        if (globals.routePolygons.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            globals.routePolygons.forEach(polygon => {
                polygon.getPath().forEach(path => {
                    bounds.extend(path);
                });
            });
            globals.map.fitBounds(bounds);
        }
    }, globals.currentRoutes.length * 100 + 200); // After all routes are added plus a buffer
}

// Add a route to the map with animation
function addRouteToMap(route) {
    const color = route.restricted ? '#e74c3c' : '#00a6d3';

    try {
        // Validate route path
        if (!route.path || !Array.isArray(route.path) || route.path.length < 3) {
            console.error(`Invalid path for route ${route.name}. Skipping.`);
            return;
        }

        const polygon = new google.maps.Polygon({
            paths: route.path,
            strokeColor: color,
            strokeOpacity: 0,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0,
            map: globals.map,
            routeData: route // Store route data with the polygon
        });

        // Animate the polygon appearance
        let opacity = 0;
        const fadeIn = setInterval(() => {
            opacity += 0.05;
            polygon.setOptions({
                strokeOpacity: Math.min(opacity + 0.2, 0.8),
                fillOpacity: Math.min(opacity, route.restricted ? 0.3 : 0.5)
            });

            if (opacity >= (route.restricted ? 0.3 : 0.5)) {
                clearInterval(fadeIn);
            }
        }, 50);

        // Add route label (centered in polygon)
        addRouteLabel(polygon, route);

        // Add click event to show route details
        polygon.addListener('click', function () {
            showRouteInfo(polygon);
        });

        // Add hover effect
        polygon.addListener('mouseover', function () {
            polygon.setOptions({
                strokeWeight: 3,
                strokeOpacity: 1,
                zIndex: 2
            });
        });

        polygon.addListener('mouseout', function () {
            polygon.setOptions({
                strokeWeight: 2,
                strokeOpacity: 0.8,
                zIndex: 1
            });
        });

        // Store the polygon reference
        globals.routePolygons.push(polygon);
    } catch (error) {
        console.error(`Error creating polygon for route ${route.name}:`, error);
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
        map: globals.map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 0,
        },
        label: {
            text: route.name,
            color: route.restricted ? '#721c24' : '#ffffff',
            fontSize: '12px',
            fontWeight: 'bold'
        },
        opacity: 0 // Start with 0 opacity for animation
    });

    // Animate the label appearance
    setTimeout(() => {
        marker.setOpacity(1);
    }, 300);

    // Store the marker reference with the polygon
    polygon.label = marker;

    // Return the marker reference
    return marker;
}

// Show route information in an info window
function showRouteInfo(polygon) {
    const route = polygon.routeData;

    // Calculate the center of the polygon
    const bounds = new google.maps.LatLngBounds();
    polygon.getPath().forEach(path => {
        bounds.extend(path);
    });
    const center = bounds.getCenter();

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

    globals.infoWindow.setContent(content);
    globals.infoWindow.setPosition(center);
    globals.infoWindow.open(globals.map);

    // Highlight the selected polygon
    globals.routePolygons.forEach(p => {
        if (p === polygon) {
            p.setOptions({
                strokeWeight: 3,
                strokeOpacity: 1,
                zIndex: 2
            });
        } else {
            p.setOptions({
                strokeWeight: 2,
                strokeOpacity: 0.8,
                zIndex: 1
            });
        }
    });
}

// Update the sidebar routes list
function updateRoutesList() {
    const routesList = document.getElementById('routesList');
    const routeCount = document.getElementById('routeCount');

    if (!routesList || !routeCount) {
        console.error("Routes list elements not found in DOM");
        return;
    }

    // Clear with animation
    const items = routesList.querySelectorAll('li');
    if (items.length > 0) {
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
            }, index * 50);
        });

        setTimeout(() => {
            routesList.innerHTML = '';
            populateRoutesList(routesList, routeCount);
        }, items.length * 50 + 100);
    } else {
        populateRoutesList(routesList, routeCount);
    }
}

// Populate routes list with animation
function populateRoutesList(routesList, routeCount) {
    // Update count
    routeCount.textContent = `(${globals.currentRoutes.length})`;

    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();

    globals.currentRoutes.forEach((route, index) => {
        const li = document.createElement('li');
        li.style.opacity = '0';
        li.style.transform = 'translateX(20px)';

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
            const polygon = globals.routePolygons.find(p => p.routeData.name === route.name);
            if (polygon) {
                // Calculate the bounds of the polygon
                const bounds = new google.maps.LatLngBounds();
                polygon.getPath().forEach(path => {
                    bounds.extend(path);
                });
                globals.map.fitBounds(bounds);

                // Show route info
                showRouteInfo(polygon);
            }
        });

        fragment.appendChild(li);

        // Animate each item with a delay
        setTimeout(() => {
            li.style.opacity = '1';
            li.style.transform = 'translateX(0)';
        }, index * 50 + 10);
    });

    // Append all elements at once for better performance
    routesList.appendChild(fragment);
}

// Clear all route polygons from the map
function clearRoutePolygons() {
    // Animate removal
    globals.routePolygons.forEach((polygon, index) => {
        setTimeout(() => {
            // Fade out the polygon
            let opacity = polygon.get('fillOpacity') || 0.5;
            const fadeOut = setInterval(() => {
                opacity -= 0.1;
                polygon.setOptions({
                    strokeOpacity: opacity,
                    fillOpacity: opacity
                });

                if (opacity <= 0) {
                    clearInterval(fadeOut);
                    polygon.setMap(null);
                    if (polygon.label) {
                        polygon.label.setMap(null);
                    }
                }
            }, 30);
        }, index * 20); // Stagger removal
    });

    setTimeout(() => {
        globals.routePolygons = [];
    }, globals.routePolygons.length * 20 + 200);
}

// Address search function
function searchAddress() {
    const addressInput = document.getElementById('addressSearch');
    const resultDiv = document.getElementById('searchResult');

    if (!addressInput || !resultDiv) {
        console.error("Address search elements not found");
        return;
    }

    const address = addressInput.value.trim();

    if (!address) {
        resultDiv.innerHTML = 'Please enter an address';
        return;
    }

    resultDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';

    globals.geocoder.geocode({ address: address + ', Los Angeles County, CA' }, function (results, status) {
        if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;

            // Center the map on the searched location with smooth animation
            globals.map.panTo(location);
            setTimeout(() => {
                globals.map.setZoom(14);
            }, 500);

            // Create a marker at the searched location with animation
            const marker = new google.maps.Marker({
                map: globals.map,
                position: location,
                animation: google.maps.Animation.DROP,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: '#E95A0C',
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: 10
                }
            });

            // Pulsating effect for the marker
            let scale = 10;
            let increasing = false;
            const pulse = setInterval(() => {
                if (increasing) {
                    scale += 0.5;
                    if (scale >= 14) increasing = false;
                } else {
                    scale -= 0.5;
                    if (scale <= 10) increasing = true;
                }

                marker.setIcon({
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: '#E95A0C',
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: scale
                });
            }, 50);

            // Check if the location is within any route zone
            let foundRoute = false;

            for (let i = 0; i < globals.routePolygons.length; i++) {
                const polygon = globals.routePolygons[i];
                const routeData = polygon.routeData;

                if (google.maps.geometry.poly.containsLocation(location, polygon)) {
                    foundRoute = true;
                    resultDiv.innerHTML = `
                        <div class="search-result-content">
                            <strong>Address is in zone:</strong> ${routeData.name}<br>
                            <i class="fas fa-user"></i> Driver: ${routeData.driver}<br>
                            <i class="fas fa-calendar-day"></i> Day: ${routeData.day}<br>
                            ${routeData.restricted ? '<span style="color: #e74c3c;"><i class="fas fa-exclamation-triangle"></i> Restricted Zone</span>' : ''}
                        </div>
                    `;

                    // Show route info and highlight polygon
                    showRouteInfo(polygon);

                    // Highlight in the sidebar
                    const routeItems = document.querySelectorAll('#routesList li');
                    routeItems.forEach(item => {
                        if (item.querySelector('span').textContent === routeData.name) {
                            item.classList.add('active');
                            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        } else {
                            item.classList.remove('active');
                        }
                    });

                    break;
                }
            }

            if (!foundRoute) {
                resultDiv.innerHTML = '<i class="fas fa-times-circle" style="color: #e74c3c;"></i> Address is not in any defined zone';
            }

            // Remove marker and stop animation after 8 seconds
            setTimeout(() => {
                clearInterval(pulse);
                marker.setMap(null);
            }, 8000);

            showToast('info', 'Address search completed');
        } else {
            resultDiv.innerHTML = '<i class="fas fa-times-circle" style="color: #e74c3c;"></i> Address not found. Please try again.';
            showToast('error', 'Address not found');
        }
    });
}

// Admin login function
function adminLogin() {
    const passwordInput = document.getElementById('adminPassword');

    if (!passwordInput) {
        console.error("Admin password input not found");
        return;
    }

    const password = passwordInput.value;

    if (password === 'routeadmin2025') {
        globals.adminMode = true;

        // Hide login with fade out
        const adminLogin = document.getElementById('adminLogin');
        const adminControls = document.getElementById('adminControls');

        adminLogin.style.opacity = '0';
        setTimeout(() => {
            adminLogin.style.display = 'none';
            adminControls.style.display = 'block';
            setTimeout(() => {
                adminControls.style.opacity = '1';
            }, 50);
        }, 300);

        showToast('success', 'Admin access granted');
    } else {
        // Shake effect for wrong password
        const modalContent = document.querySelector('.modal-content');
        modalContent.classList.add('animate__animated', 'animate__shakeX');

        setTimeout(() => {
            modalContent.classList.remove('animate__animated', 'animate__shakeX');
        }, 1000);

        showToast('error', 'Incorrect password');
    }
}

// Start drawing a new zone
function startDrawingZone() {
    // Clear any existing polygon being edited
    if (globals.currentPolygon) {
        globals.currentPolygon.setMap(null);
        globals.currentPolygon = null;
    }

    // Reset form
    const formElements = {
        name: document.getElementById('zoneName'),
        driver: document.getElementById('zoneDriver'),
        deliveries: document.getElementById('zoneDeliveries'),
        restricted: document.getElementById('zoneRestricted'),
        day: document.getElementById('zoneDay'),
        props: document.getElementById('zoneProperties')
    };

    // Check all form elements exist
    if (!formElements.name || !formElements.driver ||
        !formElements.deliveries || !formElements.restricted ||
        !formElements.day || !formElements.props) {
        console.error("Zone property form elements not found");
        return;
    }

    formElements.name.value = '';
    formElements.driver.value = '';
    formElements.deliveries.value = '';
    formElements.restricted.checked = false;
    formElements.day.value = globals.currentDay;

    // Hide zone properties with animation
    formElements.props.classList.remove('form-visible');
    setTimeout(() => {
        formElements.props.style.display = 'none';
    }, 300);

    // Set drawing mode to polygon
    globals.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);

    showToast('info', 'Draw a new zone on the map');
}

// Save the currently edited zone
function saveZone() {
    if (!globals.currentPolygon) {
        showToast('error', 'No zone to save');
        return;
    }

    const formElements = {
        name: document.getElementById('zoneName'),
        day: document.getElementById('zoneDay'),
        driver: document.getElementById('zoneDriver'),
        deliveries: document.getElementById('zoneDeliveries'),
        restricted: document.getElementById('zoneRestricted'),
        props: document.getElementById('zoneProperties')
    };

    // Check all form elements exist
    if (!formElements.name || !formElements.day ||
        !formElements.driver || !formElements.deliveries ||
        !formElements.restricted || !formElements.props) {
        console.error("Zone property form elements not found");
        return;
    }

    const name = formElements.name.value.trim();
    const day = formElements.day.value;
    const driver = formElements.driver.value.trim();
    const deliveries = parseInt(formElements.deliveries.value) || 0;
    const restricted = formElements.restricted.checked;

    if (!name) {
        formElements.name.classList.add('error-input');
        setTimeout(() => {
            formElements.name.classList.remove('error-input');
        }, 1000);
        showToast('error', 'Please enter a zone name');
        return;
    }

    // Get polygon path
    const path = [];
    const polygonPath = globals.currentPolygon.getPath();

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

    // Reset drawing with animation
    globals.currentPolygon.setMap(null);
    globals.currentPolygon = null;

    // Hide form with animation
    formElements.props.classList.remove('form-visible');
    setTimeout(() => {
        formElements.props.style.display = 'none';

        // Refresh routes display if the new route is for the current day
        if (day === globals.currentDay) {
            displayRoutesByDay(globals.currentDay);
        }

        showToast('success', `Zone "${name}" saved successfully!`);
    }, 300);
}

// Cancel the current zone drawing/editing
function cancelZone() {
    if (globals.currentPolygon) {
        // Fade out the polygon
        let opacity = globals.currentPolygon.get('fillOpacity') || 0.3;
        const fadeOut = setInterval(() => {
            opacity -= 0.1;
            globals.currentPolygon.setOptions({
                strokeOpacity: opacity,
                fillOpacity: opacity
            });

            if (opacity <= 0) {
                clearInterval(fadeOut);
                globals.currentPolygon.setMap(null);
                globals.currentPolygon = null;
            }
        }, 30);
    }

    const zoneProps = document.getElementById('zoneProperties');
    if (zoneProps) {
        zoneProps.classList.remove('form-visible');
        setTimeout(() => {
            zoneProps.style.display = 'none';
        }, 300);
    }

    globals.drawingManager.setDrawingMode(null);
    showToast('info', 'Zone editing cancelled');
}

// Edit an existing zone
function editZone(polygon) {
    // Store the route data
    const routeData = polygon.routeData;

    // Form elements
    const formElements = {
        name: document.getElementById('zoneName'),
        driver: document.getElementById('zoneDriver'),
        deliveries: document.getElementById('zoneDeliveries'),
        restricted: document.getElementById('zoneRestricted'),
        day: document.getElementById('zoneDay'),
        props: document.getElementById('zoneProperties')
    };

    // Check all form elements exist
    if (!formElements.name || !formElements.day ||
        !formElements.driver || !formElements.deliveries ||
        !formElements.restricted || !formElements.props) {
        console.error("Zone property form elements not found");
        return;
    }

    // Remove the existing polygon from the map with animation
    let opacity = polygon.get('fillOpacity') || 0.5;
    const fadeOut = setInterval(() => {
        opacity -= 0.1;
        polygon.setOptions({
            strokeOpacity: opacity,
            fillOpacity: opacity
        });

        if (opacity <= 0) {
            clearInterval(fadeOut);
            polygon.setMap(null);

            // Create a new editable polygon
            globals.currentPolygon = new google.maps.Polygon({
                paths: routeData.path,
                strokeColor: routeData.restricted ? '#e74c3c' : '#00a6d3',
                strokeOpacity: 0,
                strokeWeight: 2,
                fillColor: routeData.restricted ? '#e74c3c' : '#00a6d3',
                fillOpacity: 0,
                map: globals.map,
                editable: true
            });

            // Animate the new polygon appearance
            let newOpacity = 0;
            const fadeIn = setInterval(() => {
                newOpacity += 0.05;
                globals.currentPolygon.setOptions({
                    strokeOpacity: Math.min(newOpacity + 0.2, 0.8),
                    fillOpacity: Math.min(newOpacity, routeData.restricted ? 0.3 : 0.5)
                });

                if (newOpacity >= (routeData.restricted ? 0.3 : 0.5)) {
                    clearInterval(fadeIn);
                }
            }, 30);
        }
    }, 30);

    // Fill form with route data
    formElements.name.value = routeData.name;
    formElements.driver.value = routeData.driver;
    formElements.deliveries.value = routeData.deliveries;
    formElements.restricted.checked = routeData.restricted;
    formElements.day.value = routeData.day;

    // Show zone properties panel with animation
    formElements.props.style.display = 'block';
    setTimeout(() => {
        formElements.props.classList.add('form-visible');
    }, 10);

    // Remove the original route from the routes array
    const index = window.routes.findIndex(route =>
        route.name === routeData.name && route.day === routeData.day);

    if (index !== -1) {
        window.routes.splice(index, 1);
    }

    // Remove from current display
    const polyIndex = globals.routePolygons.findIndex(p => p === polygon);
    if (polyIndex !== -1) {
        if (globals.routePolygons[polyIndex].label) {
            globals.routePolygons[polyIndex].label.setMap(null);
        }
        globals.routePolygons.splice(polyIndex, 1);
    }

    showToast('info', `Editing zone: ${routeData.name}`);
}

// Export routes to JSON
function exportRoutes() {
    try {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.routes, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "routes.json");
        document.body.appendChild(downloadAnchorNode);

        // Animation for download
        showToast('success', 'Routes exported successfully!');

        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    } catch (error) {
        console.error("Error exporting routes:", error);
        showToast('error', 'Failed to export routes');
    }
}

// Import routes from JSON
function importRoutes() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = e => {
        if (!e.target.files.length) return;

        const file = e.target.files[0];
        const reader = new FileReader();

        showToast('info', 'Reading file...');

        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
            try {
                const content = readerEvent.target.result;
                const routes = JSON.parse(content);

                if (Array.isArray(routes)) {
                    // Animate transition to new routes
                    clearRoutePolygons();

                    setTimeout(() => {
                        window.routes = routes;
                        displayRoutesByDay(globals.currentDay);
                        showToast('success', `Imported ${routes.length} routes successfully!`);
                    }, 500);
                } else {
                    throw new Error('Invalid format - data is not an array');
                }
            } catch (error) {
                console.error("Import error:", error);
                showToast('error', 'Error importing routes: ' + error.message);
            }
        };

        reader.onerror = error => {
            console.error("File reading error:", error);
            showToast('error', 'Error reading file');
        };
    };

    input.click();
}

// Toggle dark mode
function toggleDarkMode() {
    globals.darkMode = !globals.darkMode;

    if (globals.darkMode) {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');

        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        // Change map style for dark mode with transition
        if (globals.map) {
            globals.map.setOptions({
                styles: globals.mapStyles.dark
            });
        }
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');

        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }

        // Reset map style for light mode with transition
        if (globals.map) {
            globals.map.setOptions({
                styles: globals.mapStyles.light
            });
        }
    }
}

// Show toast notification
function showToast(type, message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-times-circle"></i>';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
    }

    toast.innerHTML = `${icon} <span>${message}</span>`;
    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.pointerEvents = 'auto';
    }, 10);

    // Remove after delay
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}

// Set up all event listeners
function setupEventListeners() {
    console.log("Setting up event listeners");

    try {
        // Helper function to add event listeners with error handling
        function addListener(element, event, handler) {
            if (element) {
                element.addEventListener(event, handler);
            } else {
                console.error(`Element for ${event} event not found`);
            }
        }

        // Day selector buttons
        const dayButtons = document.querySelectorAll('.day-buttons button');
        dayButtons.forEach(button => {
            button.addEventListener('click', function () {
                const newDay = this.getAttribute('data-day');

                if (newDay === globals.currentDay) return; // No change needed

                globals.currentDay = newDay;
                console.log(`Day button clicked: ${globals.currentDay}`);

                // Update active button with animation
                dayButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.style.transform = '';
                });

                this.classList.add('active');
                this.style.transform = 'translateY(-2px)';

                // Update routes display
                displayRoutesByDay(globals.currentDay);
            });

            // Set active class for default day
            if (button.getAttribute('data-day') === globals.currentDay) {
                button.classList.add('active');
            }
        });

        // Address search
        addListener(document.getElementById('searchButton'), 'click', searchAddress);

        const addressSearch = document.getElementById('addressSearch');
        addListener(addressSearch, 'keypress', function (e) {
            if (e.key === 'Enter') {
                searchAddress();
            }
        });

        // Admin panel
        addListener(document.getElementById('adminPanelButton'), 'click', function () {
            const adminPanel = document.getElementById('adminPanel');
            const modalContent = document.querySelector('.modal-content');

            if (adminPanel) {
                adminPanel.style.display = 'block';

                // Animation for modal
                modalContent.classList.add('animate__animated', 'animate__fadeInDown');
                setTimeout(() => {
                    modalContent.classList.remove('animate__animated', 'animate__fadeInDown');
                }, 1000);
            }
        });

        // Close modal
        addListener(document.querySelector('.close'), 'click', function () {
            const adminPanel = document.getElementById('adminPanel');
            const modalContent = document.querySelector('.modal-content');

            if (adminPanel && modalContent) {
                modalContent.classList.add('animate__animated', 'animate__fadeOutUp');

                setTimeout(() => {
                    adminPanel.style.display = 'none';
                    modalContent.classList.remove('animate__animated', 'animate__fadeOutUp');
                }, 500);
            }
        });

        // Admin login
        addListener(document.getElementById('loginButton'), 'click', adminLogin);

        const adminPassword = document.getElementById('adminPassword');
        addListener(adminPassword, 'keypress', function (e) {
            if (e.key === 'Enter') {
                adminLogin();
            }
        });

        // Draw zone
        addListener(document.getElementById('drawZoneButton'), 'click', startDrawingZone);

        // Save zone
        addListener(document.getElementById('saveZoneButton'), 'click', saveZone);

        // Cancel zone
        addListener(document.getElementById('cancelZoneButton'), 'click', cancelZone);

        // Export routes
        addListener(document.getElementById('exportRoutes'), 'click', exportRoutes);

        // Import routes
        addListener(document.getElementById('importRoutes'), 'click', importRoutes);

        // Dark mode toggle
        addListener(document.getElementById('darkModeToggle'), 'click', toggleDarkMode);

        // Click outside modal to close
        window.addEventListener('click', function (event) {
            const modal = document.getElementById('adminPanel');
            const modalContent = document.querySelector('.modal-content');

            if (event.target === modal) {
                modalContent.classList.add('animate__animated', 'animate__fadeOutUp');

                setTimeout(() => {
                    modal.style.display = 'none';
                    modalContent.classList.remove('animate__animated', 'animate__fadeOutUp');
                }, 500);
            }
        });

        // CSS class for form visibility transitions
        const style = document.createElement('style');
        style.innerHTML = `
            #zoneProperties {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            #zoneProperties.form-visible {
                opacity: 1;
                transform: translateY(0);
            }
            #adminControls {
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            #adminLogin {
                opacity: 1;
                transition: opacity 0.3s ease;
            }
            .error-input {
                animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                border-color: #e74c3c !important;
            }
            @keyframes shake {
                10%, 90% { transform: translate3d(-1px, 0, 0); }
                20%, 80% { transform: translate3d(2px, 0, 0); }
                30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                40%, 60% { transform: translate3d(4px, 0, 0); }
            }
        `;
        document.head.appendChild(style);

        console.log("Event listeners set up successfully");
    } catch (error) {
        console.error("Error setting up event listeners:", error);
    }
}

// Add a 'load' event listener to ensure everything is properly initialized
window.addEventListener('load', function () {
    console.log("Window load event fired");
    // If Google Maps API is already loaded but map isn't initialized
    if (window.google && window.google.maps && !globals.map) {
        console.log("Google Maps API loaded but map not initialized. Running initMap manually.");
        initMap();
    }
});

// Walkthrough tour for first-time users
const walkthrough = {
    steps: [
        {
            element: '.logo-container',
            title: 'Welcome to Meal Map',
            content: 'This application helps you manage Project Angel Food delivery routes across LA County. Let\'s take a quick tour to help you get started.',
            position: 'bottom'
        },
        {
            element: '.day-selector',
            title: 'Day Selection',
            content: 'Select a day to view all delivery routes scheduled for that day. Routes will appear on the map and in the list below.',
            position: 'right'
        },
        {
            element: '.route-list',
            title: 'Route List',
            content: 'Browse all routes for the selected day here. Click on any route to center the map and see detailed information.',
            position: 'right'
        },
        {
            element: '.search-container',
            title: 'Address Search',
            content: 'Enter any address to find which delivery zone it belongs to, along with driver and day information.',
            position: 'right'
        },
        {
            element: '#map',
            title: 'Interactive Map',
            content: 'This map shows all delivery routes. Blue zones are regular routes, while red zones indicate restricted areas. Click on any zone for details.',
            position: 'left'
        },
        {
            element: '#darkModeToggle',
            title: 'Dark Mode',
            content: 'Toggle between light and dark modes for comfortable viewing in different environments.',
            position: 'bottom'
        },
        {
            element: '#adminPanelButton',
            title: 'Admin Panel',
            content: 'Administrators can click here to access route editing tools and import/export functionality.',
            position: 'bottom'
        },
        {
            element: null,
            title: 'You\'re All Set!',
            content: 'You\'re now ready to use the Meal Map application. If you need this tour again, click the help button in the top right corner.',
            position: 'center'
        }
    ],
    currentStep: 0,
    tourStarted: false,

    init: function () {
        // Check if this is the first visit
        if (!localStorage.getItem('mealMapTourComplete')) {
            // Add a slight delay to allow the app to fully initialize
            setTimeout(() => {
                this.start();
            }, 2500);
        }

        // Add help button to restart the tour
        this.addHelpButton();
    },

    addHelpButton: function () {
        const controls = document.querySelector('.controls');
        if (controls) {
            const helpButton = document.createElement('button');
            helpButton.id = 'helpButton';
            helpButton.className = 'animated-btn';
            helpButton.title = 'Help';
            helpButton.innerHTML = '<i class="fas fa-question"></i>';
            helpButton.addEventListener('click', () => this.start());
            controls.appendChild(helpButton);
        }
    },

    start: function () {
        this.tourStarted = true;
        this.currentStep = 0;
        this.createTourOverlay();
        this.showStep(this.currentStep);
    },

    createTourOverlay: function () {
        // Remove existing overlay if present
        const existingOverlay = document.getElementById('tour-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Create overlay elements
        const overlay = document.createElement('div');
        overlay.id = 'tour-overlay';

        const tooltip = document.createElement('div');
        tooltip.id = 'tour-tooltip';
        tooltip.className = 'animate__animated animate__fadeIn';

        const tooltipTitle = document.createElement('h3');
        tooltipTitle.id = 'tour-title';

        const tooltipContent = document.createElement('div');
        tooltipContent.id = 'tour-content';

        const tooltipButtons = document.createElement('div');
        tooltipButtons.id = 'tour-buttons';

        const skipButton = document.createElement('button');
        skipButton.id = 'tour-skip';
        skipButton.textContent = 'Skip Tour';
        skipButton.addEventListener('click', () => this.end());

        const prevButton = document.createElement('button');
        prevButton.id = 'tour-prev';
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => this.prevStep());

        const nextButton = document.createElement('button');
        nextButton.id = 'tour-next';
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => this.nextStep());

        // Assemble the tooltip
        tooltip.appendChild(tooltipTitle);
        tooltip.appendChild(tooltipContent);
        tooltipButtons.appendChild(skipButton);
        tooltipButtons.appendChild(prevButton);
        tooltipButtons.appendChild(nextButton);
        tooltip.appendChild(tooltipButtons);

        // Add to DOM
        overlay.appendChild(tooltip);
        document.body.appendChild(overlay);
    },

    showStep: function (stepIndex) {
        const step = this.steps[stepIndex];
        const tooltip = document.getElementById('tour-tooltip');
        const title = document.getElementById('tour-title');
        const content = document.getElementById('tour-content');
        const prevButton = document.getElementById('tour-prev');
        const nextButton = document.getElementById('tour-next');

        // Update content
        title.textContent = step.title;
        content.textContent = step.content;

        // Update buttons
        prevButton.style.display = stepIndex > 0 ? 'inline-block' : 'none';
        nextButton.textContent = stepIndex < this.steps.length - 1 ? 'Next' : 'Finish';

        // Position the tooltip
        if (step.element) {
            const targetElement = document.querySelector(step.element);
            if (!targetElement) return;

            // Highlight the target element
            this.highlightElement(targetElement);

            // Position tooltip relative to the element
            const rect = targetElement.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            let top, left;

            switch (step.position) {
                case 'top':
                    top = rect.top - tooltipRect.height - 10;
                    left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                    break;
                case 'right':
                    top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                    left = rect.right + 10;
                    break;
                case 'bottom':
                    top = rect.bottom + 10;
                    left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                    break;
                case 'left':
                    top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                    left = rect.left - tooltipRect.width - 10;
                    break;
                default:
                    top = rect.bottom + 10;
                    left = rect.left;
            }

            // Keep tooltip within viewport
            if (left < 10) left = 10;
            if (left + tooltipRect.width > window.innerWidth - 10) {
                left = window.innerWidth - tooltipRect.width - 10;
            }
            if (top < 10) top = 10;
            if (top + tooltipRect.height > window.innerHeight - 10) {
                top = window.innerHeight - tooltipRect.height - 10;
            }

            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
        } else {
            // Center tooltip for steps without a specific element
            tooltip.style.top = '50%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';

            // Remove highlight
            this.removeHighlight();
        }

        // Animate tooltip
        tooltip.classList.remove('animate__fadeIn');
        void tooltip.offsetWidth; // Trigger reflow
        tooltip.classList.add('animate__fadeIn');
    },

    highlightElement: function (element) {
        // Remove existing highlight
        this.removeHighlight();

        // Add highlight effect
        element.classList.add('tour-highlight');

        const overlay = document.getElementById('tour-overlay');
        const rect = element.getBoundingClientRect();

        overlay.style.setProperty('--highlight-top', `${rect.top}px`);
        overlay.style.setProperty('--highlight-left', `${rect.left}px`);
        overlay.style.setProperty('--highlight-width', `${rect.width}px`);
        overlay.style.setProperty('--highlight-height', `${rect.height}px`);
        overlay.classList.add('with-highlight');
    },

    removeHighlight: function () {
        // Remove highlight from all elements
        document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
        });

        const overlay = document.getElementById('tour-overlay');
        if (overlay) {
            overlay.classList.remove('with-highlight');
        }
    },

    nextStep: function () {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.showStep(this.currentStep);
        } else {
            this.end();
        }
    },

    prevStep: function () {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    },

    end: function () {
        const overlay = document.getElementById('tour-overlay');
        if (overlay) {
            overlay.remove();
        }

        // Remove any lingering highlights
        document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
        });

        this.tourStarted = false;

        // Mark tour as completed
        localStorage.setItem('mealMapTourComplete', 'true');

        // Show toast notification
        showToast('success', 'Tour completed! You can restart it anytime with the help button.');
    }
};

// Initialize the walkthrough after the app is loaded
window.addEventListener('load', function () {
    // Initialize walkthrough after a short delay to ensure all elements are ready
    setTimeout(() => {
        walkthrough.init();
    }, 2000);
});