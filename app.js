// Global state management
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
            // ... (keeping map styles as is)
        ],
        dark: [
            {
                "elementType": "geometry",
                "stylers": [{ "color": "#242f3e" }]
            },
            // ... (keeping map styles as is)
        ]
    }
};

// Debug and initialization
console.log("App is initializing...");

// Show loading screen with minimum display time
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
        }
    }, 2000);

    // Detect Google Maps loading issues
    const mapsScript = document.getElementById('googleMapsScript');
    if (mapsScript) {
        mapsScript.addEventListener('error', () => {
            showErrorDialog('Failed to load Google Maps. Please check your internet connection or API key.');
        });
    }
});

// Initialize Google Map
function initMap() {
    console.log("Initializing map...");

    try {
        // Verify routes data
        if (!window.routes || !Array.isArray(window.routes)) {
            console.error("Routes data missing or invalid");
            window.routes = [];
            showToast('error', 'Route data missing or invalid');
        }

        // Create map instance with improved options
        globals.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 34.0522, lng: -118.2437 }, // Los Angeles center
            zoom: 10,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            gestureHandling: 'greedy',
            styles: globals.mapStyles.light,
            minZoom: 8, // Prevent zooming out too far
            maxZoom: 18, // Limit maximum zoom
            restriction: { // Restrict to LA County area
                latLngBounds: {
                    north: 34.8233,
                    south: 33.7037,
                    east: -117.6462,
                    west: -118.9448
                },
                strictBounds: false
            }
        });

        // Expose core instances for legacy scripts
        window.map = globals.map;
        window.currentDay = globals.currentDay;
        window.currentRoutes = globals.currentRoutes;
        window.routePolygons = globals.routePolygons;

        // Initialize services with error handling
        try {
            globals.geocoder = new google.maps.Geocoder();
            globals.infoWindow = new google.maps.InfoWindow({
                maxWidth: 300,
                pixelOffset: new google.maps.Size(0, -30)
            });
            // Make services available to older code
            window.geocoder = globals.geocoder;
            window.infoWindow = globals.infoWindow;
        } catch (error) {
            console.error("Failed to initialize Google Maps services:", error);
            showToast('error', 'Failed to initialize map services');
            return;
        }
        
        // Initialize drawing manager
        initDrawingManager();

        // Set up event listeners
        setupEventListeners();

        // Initial display of routes with loading indicator
        showToast('info', 'Loading routes...');
        displayRoutesByDay(globals.currentDay);

        // Check dark mode preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
            toggleDarkMode();
        }

        // Add map idle event listener for performance
        globals.map.addListener('idle', () => {
            console.log("Map is idle, performing cleanup...");
            if (window.requestIdleCallback) {
                requestIdleCallback(() => {
                    performMapCleanup();
                });
            }
        });

        console.log("Map initialized successfully");
        showToast('success', 'Map loaded successfully');

    } catch (error) {
        console.error("Critical error initializing map:", error);
        showToast('error', 'Critical error initializing map');
        // Show user-friendly error message
        const mapElement = document.getElementById('map');
        if (mapElement) {
            mapElement.innerHTML = `
                <div class="error-message">
                    <h3>Map Loading Error</h3>
                    <p>We encountered an error while loading the map. Please try:</p>
                    <ul>
                        <li>Refreshing the page</li>
                        <li>Checking your internet connection</li>
                        <li>Disabling any ad blockers</li>
                    </ul>
                    <button onclick="location.reload()">Reload Page</button>
                </div>
            `;
        }
    }
}

// Cleanup function for map performance
function performMapCleanup() {
    // Remove unused labels
    globals.routePolygons.forEach(polygon => {
        if (polygon.label && !polygon.getMap()) {
            polygon.label.setMap(null);
        }
    });

    // Clear unused memory
    if (window.gc) {
        window.gc();
    }
}

// Initialize drawing manager with improved options
function initDrawingManager() {
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
            zIndex: 1,
            geodesic: true // More accurate polygon edges
        }
    });

    globals.drawingManager.setMap(globals.map);

    // Share drawing manager with legacy scripts
    window.drawingManager = globals.drawingManager;

    // Add polygon completion listener with error handling
    google.maps.event.addListener(globals.drawingManager, 'polygoncomplete', (polygon) => {
        try {
            handlePolygonComplete(polygon);
        } catch (error) {
            console.error("Error completing polygon:", error);
            showToast('error', 'Error creating zone');
            if (polygon) polygon.setMap(null);
        }
    });
}

[Rest of the code remains the same...]

// Error handling and cleanup improvements
window.addEventListener('unload', function() {
    // Cleanup resources
    if (globals.map) {
        google.maps.event.clearInstanceListeners(globals.map);
    }
    if (globals.drawingManager) {
        globals.drawingManager.setMap(null);
    }
    globals.routePolygons.forEach(polygon => {
        if (polygon.label) polygon.label.setMap(null);
        polygon.setMap(null);
    });
    
    // Clear all intervals and timeouts
    clearAllIntervals();
    clearAllTimeouts();
});

// Enhanced error handling
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    showToast('error', `Error: ${context}`);
    
    // Log to analytics
    if (window.Analytics) {
        window.Analytics.logError(error, context);
    }
    
    // Show user-friendly error message if critical
    if (context === 'critical') {
        showErrorDialog(error.message || 'A critical error occurred');
    }
}

// Add error dialog
function showErrorDialog(message) {
    const dialog = document.createElement('div');
    dialog.className = 'error-dialog';
    dialog.innerHTML = `
        <div class="error-content">
            <h3>Error</h3>
            <p>${message}</p>
            <button onclick="location.reload()">Reload Application</button>
        </div>
    `;
    document.body.appendChild(dialog);
}

// Export public API with error boundaries
window.MealMap = {
    initMap: () => {
        try {
            initMap();
        } catch (error) {
            handleError(error, 'critical');
        }
    },
    searchAddress: (...args) => {
        try {
            searchAddress(...args);
        } catch (error) {
            handleError(error, 'search');
        }
    },
    adminLogin: (...args) => {
        try {
            adminLogin(...args);
        } catch (error) {
            handleError(error, 'admin');
        }
    },
    toggleDarkMode: (...args) => {
        try {
            toggleDarkMode(...args);
        } catch (error) {
            handleError(error, 'theme');
        }
    },
    startTour: () => {
        try {
            walkthrough.start();
        } catch (error) {
            handleError(error, 'tour');
        }
    },
    exportRoutes,
    importRoutes
};