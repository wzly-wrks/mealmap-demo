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
    darkMode: false
};

// Initialize the map and app
function initMap() {
    globals.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 34.0522, lng: -118.2437 },
        zoom: 10,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true
    });

    globals.geocoder = new google.maps.Geocoder();
    globals.infoWindow = new google.maps.InfoWindow();

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

    google.maps.event.addListener(globals.drawingManager, 'polygoncomplete', function (polygon) {
        globals.currentPolygon = polygon;
        globals.drawingManager.setDrawingMode(null);
        alert('Polygon drawn. Implement admin editor to save this zone.');
    });

    setupEventListeners();
    displayRoutesByDay(globals.currentDay);
}

function setupEventListeners() {
    const dayButtons = document.querySelectorAll('.day-buttons button');
    dayButtons.forEach(button => {
        button.addEventListener('click', () => {
            globals.currentDay = button.getAttribute('data-day');
            dayButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            displayRoutesByDay(globals.currentDay);
        });
    });
}

function displayRoutesByDay(day) {
    clearRoutePolygons();
    globals.currentRoutes = window.routes.filter(route => route.day === day);
    updateRoutesList();

    globals.currentRoutes.forEach(route => {
        if (!route.path) return;
        const polygon = new google.maps.Polygon({
            paths: route.path,
            strokeColor: '#00a6d3',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#00a6d3',
            fillOpacity: 0.4,
            map: globals.map,
            routeData: route
        });

        polygon.addListener('click', () => showRouteInfo(polygon));
        globals.routePolygons.push(polygon);
    });
}

function showRouteInfo(polygon) {
    const route = polygon.routeData;
    const bounds = new google.maps.LatLngBounds();
    polygon.getPath().forEach(p => bounds.extend(p));
    const center = bounds.getCenter();

    const content = \`
        <div>
            <h3>\${route.name}</h3>
            <p>Driver: \${route.driver}</p>
            <p>Territory: \${route.territory}</p>
            <p>Capacity: \${route.capacity || 'n/a'}</p>
        </div>
    \`;

    globals.infoWindow.setContent(content);
    globals.infoWindow.setPosition(center);
    globals.infoWindow.open(globals.map);
}

function updateRoutesList() {
    const list = document.getElementById('routesList');
    const count = document.getElementById('routeCount');
    list.innerHTML = '';
    globals.currentRoutes.forEach(route => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = route.name;
        li.appendChild(span);
        list.appendChild(li);
    });
    count.textContent = \`(\${globals.currentRoutes.length})\`;
}

function clearRoutePolygons() {
    globals.routePolygons.forEach(p => p.setMap(null));
    globals.routePolygons = [];
}

// Initialize on window load
window.onload = () => {
    if (window.google && google.maps) {
        initMap();
    }
};