// Van Overlay and Route Management functionality

// Global variables for route management
globals.routeNamesByDay = {
    Sunday: {},
    Monday: {},
    Tuesday: {},
    Wednesday: {},
    Thursday: {},
    Friday: {}
};

// Initialize route names from the Excel data
function initializeRouteNames() {
    // Sunday routes
    globals.routeNamesByDay.Sunday['VAN-01'] = 'PALMDALE';
    globals.routeNamesByDay.Sunday['VAN-02'] = 'NORTHEAST-2';
    globals.routeNamesByDay.Sunday['VAN-03'] = 'NORTHEAST-3';
    globals.routeNamesByDay.Sunday['VAN-04'] = 'SOUTH GATE-5';
    globals.routeNamesByDay.Sunday['VAN-05'] = 'WESTMONT PARK-1';
    globals.routeNamesByDay.Sunday['VAN-06'] = 'WESTSIDE-1';
    globals.routeNamesByDay.Sunday['VAN-07'] = 'EAST LA-4';
    globals.routeNamesByDay.Sunday['VAN-08'] = 'CANYON CNTRY-2';
    globals.routeNamesByDay.Sunday['VAN-09'] = 'ROSEGATE-1';
    globals.routeNamesByDay.Sunday['VAN-10'] = 'CULVER CITY';
    globals.routeNamesByDay.Sunday['VAN-11'] = 'VERDUGO';
    globals.routeNamesByDay.Sunday['VAN-12'] = 'WESTSIDE-3';

    // Monday routes
    globals.routeNamesByDay.Monday['VAN-01'] = 'CANYON CNTRY-1';
    globals.routeNamesByDay.Monday['VAN-02'] = 'EAST LA-1';
    globals.routeNamesByDay.Monday['VAN-03'] = 'EAST LA-2';
    globals.routeNamesByDay.Monday['VAN-04'] = 'EAST LA-3';
    globals.routeNamesByDay.Monday['VAN-05'] = 'MID CITY-1';
    globals.routeNamesByDay.Monday['VAN-06'] = 'MID CITY-2';
    globals.routeNamesByDay.Monday['VAN-07'] = 'MID CITY-3';
    globals.routeNamesByDay.Monday['VAN-08'] = 'ROSECRANS-1';
    globals.routeNamesByDay.Monday['VAN-09'] = 'SOUTH GATE-1';
    globals.routeNamesByDay.Monday['VAN-10'] = 'SAN GABRIEL-2';
    globals.routeNamesByDay.Monday['VAN-11'] = 'ROSECRANS-2';

    // Tuesday routes
    globals.routeNamesByDay.Tuesday['VAN-01'] = 'NO. HOLLYWOOD-2';
    globals.routeNamesByDay.Tuesday['VAN-02'] = 'NORTH VALLEY-1';
    globals.routeNamesByDay.Tuesday['VAN-03'] = 'NORTH VALLEY-2';
    globals.routeNamesByDay.Tuesday['VAN-04'] = 'SILVERLAKE-1';
    globals.routeNamesByDay.Tuesday['VAN-05'] = 'SOUTH GATE-2';
    globals.routeNamesByDay.Tuesday['VAN-06'] = 'SOUTH GATE-3';
    globals.routeNamesByDay.Tuesday['VAN-07'] = 'VERNON-1';
    globals.routeNamesByDay.Tuesday['VAN-08'] = 'WAC-1';
    globals.routeNamesByDay.Tuesday['VAN-09'] = 'WAC-4';
    globals.routeNamesByDay.Tuesday['VAN-10'] = 'VERNON-2';
    globals.routeNamesByDay.Tuesday['VAN-11'] = 'SOUTH LA-1';
    globals.routeNamesByDay.Tuesday['VAN-12'] = 'THE ELITE';

    // Wednesday routes
    globals.routeNamesByDay.Wednesday['VAN-01'] = 'SOUTH BAY-4';
    globals.routeNamesByDay.Wednesday['VAN-02'] = 'LAUREL-2';
    globals.routeNamesByDay.Wednesday['VAN-03'] = 'LONG BEACH-1';
    globals.routeNamesByDay.Wednesday['VAN-04'] = 'FOOTHILL-1';
    globals.routeNamesByDay.Wednesday['VAN-05'] = 'SEPULVEDA-2';
    globals.routeNamesByDay.Wednesday['VAN-06'] = 'SILVERLAKE-3';
    globals.routeNamesByDay.Wednesday['VAN-07'] = 'SOUTH BAY-1';
    globals.routeNamesByDay.Wednesday['VAN-08'] = 'SOUTHEAST-2';
    globals.routeNamesByDay.Wednesday['VAN-09'] = 'WAC-2';
    globals.routeNamesByDay.Wednesday['VAN-10'] = 'WHITTIER-PUENTE-1';
    globals.routeNamesByDay.Wednesday['VAN-11'] = 'SOUTHEAST-4';
    globals.routeNamesByDay.Wednesday['VAN-12'] = 'POMONA-1';

    // Thursday routes
    globals.routeNamesByDay.Thursday['VAN-01'] = 'AGAPE-1';
    globals.routeNamesByDay.Thursday['VAN-02'] = 'DOWNTOWN-1';
    globals.routeNamesByDay.Thursday['VAN-03'] = 'HOLLYWOOD-1';
    globals.routeNamesByDay.Thursday['VAN-04'] = 'LA PUENTE-1';
    globals.routeNamesByDay.Thursday['VAN-05'] = 'LANCASTER-1';
    globals.routeNamesByDay.Thursday['VAN-06'] = 'LANCASTER-2';
    globals.routeNamesByDay.Thursday['VAN-07'] = 'SEPULVEDA-1';
    globals.routeNamesByDay.Thursday['VAN-08'] = 'SOUTH BAY-2';
    globals.routeNamesByDay.Thursday['VAN-09'] = 'SOUTHEAST-1';
    globals.routeNamesByDay.Thursday['VAN-10'] = 'WESTSIDE-2';
    globals.routeNamesByDay.Thursday['VAN-11'] = 'SOUTH BAY PLUS';

    // Friday routes
    globals.routeNamesByDay.Friday['VAN-01'] = 'open';
    globals.routeNamesByDay.Friday['VAN-02'] = 'HUNTINGTON PARK-1';
    globals.routeNamesByDay.Friday['VAN-03'] = 'NORTHEAST-1';
    globals.routeNamesByDay.Friday['VAN-04'] = 'SOUTH BAY-3';
    globals.routeNamesByDay.Friday['VAN-05'] = 'SOUTH GATE-4';
    globals.routeNamesByDay.Friday['VAN-06'] = 'WAC-3';
    globals.routeNamesByDay.Friday['VAN-07'] = 'WEST VALLEY-1';
    globals.routeNamesByDay.Friday['VAN-08'] = 'WEST VALLEY-2';
    globals.routeNamesByDay.Friday['VAN-09'] = 'WEST VALLEY-3';
    globals.routeNamesByDay.Friday['VAN-10'] = 'SOUTHEAST-3';
    globals.routeNamesByDay.Friday['VAN-11'] = 'HUNTINGTON PARK-2';
}

// Create van overlays for routes
function createVanOverlays() {
    // Remove existing overlays
    removeVanOverlays();
    
    if (!globals.currentDay) return;
    
    // Get routes for the current day
    const routes = (window.routes || []).filter(r => r.day === globals.currentDay);
    
    routes.forEach(route => {
        if (!route.path || route.path.length === 0 || !route.vanNumber) return;
        
        // Calculate center point of the route
        const center = calculateRouteCenter(route.path);
        
        // Create overlay element
        const overlay = document.createElement('div');
        overlay.className = 'van-overlay';
        overlay.dataset.routeId = routes.indexOf(route);
        overlay.style.borderColor = route.color || '#333';
        
        // Get route name from the mapping or use the route name
        const routeName = globals.routeNamesByDay[globals.currentDay][route.vanNumber] || route.name;
        
        overlay.innerHTML = `<div>${route.vanNumber}</div>`;
        
        // Position the overlay
        overlay.style.left = `${center.x}px`;
        overlay.style.top = `${center.y}px`;
        
        // Add click event
        overlay.addEventListener('click', () => showRouteInfo(route, overlay));
        
        // Add to the map container
        document.querySelector('.map-container').appendChild(overlay);
    });
}

// Calculate center point of a route
function calculateRouteCenter(path) {
    if (!path || path.length === 0) return { x: 0, y: 0 };
    
    // Convert path coordinates to screen coordinates
    const points = path.map(point => {
        const pos = globals.map.project(new mapboxgl.LngLat(point.lng, point.lat));
        return { x: pos.x, y: pos.y };
    });
    
    // Calculate average position
    const center = points.reduce((sum, point) => {
        return { x: sum.x + point.x, y: sum.y + point.y };
    }, { x: 0, y: 0 });
    
    return {
        x: center.x / points.length,
        y: center.y / points.length
    };
}

// Remove all van overlays
function removeVanOverlays() {
    document.querySelectorAll('.van-overlay').forEach(el => el.remove());
    document.querySelectorAll('.route-info-popup').forEach(el => el.remove());
}

// Show route info popup
function showRouteInfo(route, overlay) {
    // Remove any existing popups
    document.querySelectorAll('.route-info-popup').forEach(el => el.remove());
    
    // Get route name from the mapping or use the route name
    const routeName = globals.routeNamesByDay[globals.currentDay][route.vanNumber] || route.name;
    
    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'route-info-popup';
    
    // Calculate capacity percentage
    const capacityPercentage = route.capacity > 0 ? Math.min(100, (route.deliveries / route.capacity) * 100) : 0;
    
    // Determine color based on capacity
    let capacityColor = '#4CAF50'; // Green
    if (capacityPercentage > 90) {
        capacityColor = '#F44336'; // Red
    } else if (capacityPercentage > 75) {
        capacityColor = '#FF9800'; // Orange
    }
    
    // Create popup content
    popup.innerHTML = `
        <h3>${route.vanNumber}: ${routeName}</h3>
        <div class="driver-info">
            <strong>Driver:</strong> ${route.driver || 'Not assigned'}
        </div>
        <div>
            <strong>Deliveries:</strong> ${route.deliveries || 0}
        </div>
        <div>
            <strong>Capacity:</strong>
            <div class="capacity-bar-container">
                <div class="capacity-bar" style="width: ${capacityPercentage}%; background-color: ${capacityColor};"></div>
            </div>
            <div class="capacity-text">${route.deliveries || 0} / ${route.capacity || 'Unlimited'}</div>
        </div>
        <div class="button-group" style="margin-top: 12px;">
            <button class="edit-route-btn" data-route-id="${window.routes.indexOf(route)}">
                <i class="fas fa-edit"></i> Edit Route
            </button>
        </div>
    `;
    
    // Position the popup
    const rect = overlay.getBoundingClientRect();
    popup.style.left = `${rect.right + 10}px`;
    popup.style.top = `${rect.top}px`;
    
    // Add to the map container
    document.querySelector('.map-container').appendChild(popup);
    
    // Add event listener to edit button
    popup.querySelector('.edit-route-btn').addEventListener('click', () => {
        showRouteManagementPanel(route);
    });
}

// Show route management panel
function showRouteManagementPanel(route) {
    const panel = document.getElementById('routeManagementPanel');
    if (!panel) return;
    
    // Set values
    document.getElementById('routeDay').value = route.day;
    
    // Populate van dropdown
    const vanSelect = document.getElementById('routeVan');
    vanSelect.innerHTML = '';
    for (let i = 1; i <= 12; i++) {
        const vanNumber = `VAN-${i.toString().padStart(2, '0')}`;
        const option = document.createElement('option');
        option.value = vanNumber;
        option.textContent = vanNumber;
        vanSelect.appendChild(option);
    }
    vanSelect.value = route.vanNumber || '';
    
    // Set route name
    const routeName = globals.routeNamesByDay[route.day][route.vanNumber] || route.name;
    document.getElementById('routeName').value = routeName;
    
    // Set driver, deliveries, and capacity
    document.getElementById('routeDriver').value = route.driver || '';
    document.getElementById('routeDeliveries').value = route.deliveries || 0;
    document.getElementById('routeCapacity').value = route.capacity || '';
    
    // Store the route reference
    panel.dataset.routeId = window.routes.indexOf(route);
    
    // Show the panel
    panel.style.display = 'block';
    panel.querySelector('.modal-content').classList.add('animate__fadeInDown');
    
    // Add event listeners
    document.getElementById('saveRouteEdit').onclick = saveRouteChanges;
    document.getElementById('cancelRouteEdit').onclick = closeRoutePanel;
    document.getElementById('closeRoutePanel').onclick = closeRoutePanel;
    
    // Update route name when van changes
    document.getElementById('routeVan').addEventListener('change', function() {
        const day = document.getElementById('routeDay').value;
        const van = this.value;
        if (globals.routeNamesByDay[day] && globals.routeNamesByDay[day][van]) {
            document.getElementById('routeName').value = globals.routeNamesByDay[day][van];
        }
    });
    
    // Close panel when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === panel) {
            closeRoutePanel();
        }
    });
}

// Close route management panel
function closeRoutePanel() {
    const panel = document.getElementById('routeManagementPanel');
    if (!panel) return;
    
    panel.querySelector('.modal-content').classList.remove('animate__fadeInDown');
    panel.style.display = 'none';
}

// Save route changes
function saveRouteChanges() {
    const panel = document.getElementById('routeManagementPanel');
    if (!panel || !panel.dataset.routeId) return;
    
    const routeIndex = parseInt(panel.dataset.routeId);
    if (isNaN(routeIndex) || !window.routes || routeIndex >= window.routes.length) return;
    
    const route = window.routes[routeIndex];
    const day = document.getElementById('routeDay').value;
    const vanNumber = document.getElementById('routeVan').value;
    const routeName = document.getElementById('routeName').value;
    const driver = document.getElementById('routeDriver').value;
    const deliveries = parseInt(document.getElementById('routeDeliveries').value) || 0;
    const capacity = parseInt(document.getElementById('routeCapacity').value) || 0;
    
    // Validate capacity
    if (capacity > 0 && deliveries > capacity) {
        if (window.MealMap && typeof window.MealMap.showToast === 'function') {
            window.MealMap.showToast('Deliveries cannot exceed capacity', 'error');
        } else {
            alert('Deliveries cannot exceed capacity');
        }
        return;
    }
    
    // Update route
    route.day = day;
    route.vanNumber = vanNumber;
    route.name = routeName;
    route.driver = driver;
    route.deliveries = deliveries;
    route.capacity = capacity;
    
    // Update route name in the global mapping
    if (!globals.routeNamesByDay[day]) {
        globals.routeNamesByDay[day] = {};
    }
    globals.routeNamesByDay[day][vanNumber] = routeName;
    
    // Hide panel
    closeRoutePanel();
    
    // Show success message
    if (window.MealMap && typeof window.MealMap.showToast === 'function') {
        window.MealMap.showToast('Route updated successfully', 'success');
    }
    
    // Refresh display
    displayRoutesByDay(globals.currentDay);
    createVanOverlays();
}

// Initialize the new day selector
function initializeFloatingDaySelector() {
    const daySelect = document.getElementById('daySelect');
    if (!daySelect) return;
    
    daySelect.addEventListener('change', function() {
        const day = this.value;
        if (day) {
            globals.currentDay = day;
            displayRoutesByDay(day);
            createVanOverlays();
        }
    });
    
    // Initialize address search
    const searchBtn = document.getElementById('searchBtn');
    const addressInput = document.getElementById('addressSearch');
    
    if (searchBtn && addressInput) {
        searchBtn.addEventListener('click', function() {
            searchAddress(addressInput.value);
        });
        
        addressInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchAddress(this.value);
            }
        });
    }
}

// Search for an address
function searchAddress(address) {
    if (!address) return;
    
    // Create a geocoder if it doesn't exist
    if (!globals.geocoder) {
        globals.geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        });
    }
    
    // Forward geocode the address
    globals.geocoder.query(address);
    
    // Add a marker at the location
    globals.geocoder.on('result', function(e) {
        const coordinates = e.result.geometry.coordinates;
        
        // Remove previous search marker if it exists
        if (globals.searchMarker) {
            globals.searchMarker.remove();
        }
        
        // Create a new marker
        globals.searchMarker = new mapboxgl.Marker({
            color: '#FF0000'
        })
        .setLngLat(coordinates)
        .addTo(globals.map);
        
        // Fly to the location
        globals.map.flyTo({
            center: coordinates,
            zoom: 14
        });
        
        // Find the closest route
        findClosestRoute(coordinates);
    });
}

// Find the closest route to a location
function findClosestRoute(coordinates) {
    if (!globals.currentDay || !window.routes || window.routes.length === 0) {
        alert('Please select a day first to find available routes.');
        return;
    }
    
    // Get routes for the current day
    const routes = window.routes.filter(r => r.day === globals.currentDay);
    
    if (routes.length === 0) {
        alert(`No routes found for ${globals.currentDay}.`);
        return;
    }
    
    // Calculate distances to each route
    const routeDistances = routes.map(route => {
        if (!route.path || route.path.length === 0) return { route, distance: Infinity };
        
        // Find the minimum distance to any point in the route
        const distances = route.path.map(point => {
            return turf.distance(
                [coordinates[0], coordinates[1]],
                [point.lng, point.lat],
                { units: 'kilometers' }
            );
        });
        
        return {
            route,
            distance: Math.min(...distances)
        };
    });
    
    // Sort by distance
    routeDistances.sort((a, b) => a.distance - b.distance);
    
    // Get the closest route
    const closest = routeDistances[0];
    
    if (closest && closest.distance !== Infinity) {
        // Create a popup with route information
        const popup = new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat(coordinates)
            .setHTML(`
                <h3>Closest Route</h3>
                <p><strong>Day:</strong> ${closest.route.day}</p>
                <p><strong>Van:</strong> ${closest.route.vanNumber || 'N/A'}</p>
                <p><strong>Route:</strong> ${globals.routeNamesByDay[closest.route.day][closest.route.vanNumber] || closest.route.name || 'Unnamed'}</p>
                <p><strong>Distance:</strong> ${closest.distance.toFixed(2)} km</p>
            `)
            .addTo(globals.map);
    } else {
        alert('Could not find any routes near this location.');
    }
}

// Add these functions to the window.MealMap object
window.MealMap = window.MealMap || {};
window.MealMap.initializeRouteNames = initializeRouteNames;
window.MealMap.createVanOverlays = createVanOverlays;
window.MealMap.removeVanOverlays = removeVanOverlays;
window.MealMap.initializeFloatingDaySelector = initializeFloatingDaySelector;