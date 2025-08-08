
// Mapbox based map implementation
// Mapbox access token is provided via config.js as window.MAPBOX_TOKEN
const MAPBOX_TOKEN = window.MAPBOX_TOKEN || '';

const globals = {
    map: null,
    draw: null,
    currentDay: 'Sunday',
    currentRoutes: [],
    routeLayers: [],
    labelLayers: [],
    darkMode: false,
    mapStyles: {
        light: 'mapbox://styles/mapbox/streets-v11',
        dark: 'mapbox://styles/mapbox/dark-v11'
    }
};

async function initMap() {
    if (!MAPBOX_TOKEN) {
        console.error('Mapbox token missing. Did you forget to set it in config.js?');
        alert('Mapbox token is missing. Please check config.js.');
        return;
    }

    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        console.warn('Loading screen timed out after 8 seconds.');
    }, 8000);

    try {
        mapboxgl.accessToken = MAPBOX_TOKEN;
        globals.map = new mapboxgl.Map({
            container: 'map',
            style: globals.mapStyles.light,
            center: [-118.2437, 34.0522],
            zoom: 10
        });

        globals.map.on('load', () => {
            document.getElementById('loading-screen').style.display = 'none';
            console.log('Map has loaded, hiding loading screen.');
        });

        globals.map.addControl(new mapboxgl.NavigationControl());
        globals.draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: { polygon: true, trash: true }
        });
        globals.map.addControl(globals.draw);

        globals.map.on('load', hideLoadingScreen);
        globals.map.on('error', e => {
            console.error('Mapbox error:', e.error);
            hideLoadingScreen();
        });

        document.getElementById('adminControls').style.display = 'none';
        setupEventListeners();
        await loadRoutes();
        displayRoutesByDay(globals.currentDay);
    } catch (err) {
        console.error('Error initializing map:', err);
        hideLoadingScreen();
    }
}

function setupEventListeners() {
    const dayButtons = document.querySelectorAll('.day-buttons button');
    dayButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            globals.currentDay = btn.getAttribute('data-day');
            dayButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            displayRoutesByDay(globals.currentDay);
        });
        if (btn.getAttribute('data-day') === globals.currentDay) {
            btn.classList.add('active');
        }
    });

    const searchBtn = document.getElementById('searchButton');
    if (searchBtn) searchBtn.addEventListener('click', searchAddress);
    const searchInput = document.getElementById('addressSearch');
    if (searchInput) {
        searchInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') searchAddress();
        });
    }

    const darkToggle = document.getElementById('darkModeToggle');
    if (darkToggle) darkToggle.addEventListener('click', toggleDarkMode);

    // === Admin Panel Logic ===
    const adminBtn = document.getElementById('adminPanelButton');
    const adminModal = document.getElementById('adminPanel');
    const closeBtn = adminModal?.querySelector('.close');
    const loginSection = document.getElementById('adminLogin');
    const controlsSection = document.getElementById('adminControls');
    const loginButton = document.getElementById('loginButton');
    const passwordInput = document.getElementById('adminPassword');

    if (adminBtn && adminModal) {
        adminBtn.addEventListener('click', () => {
            adminModal.style.display = 'block';
            adminModal.classList.add('animate__fadeInDown');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            adminModal.style.display = 'none';
            adminModal.classList.remove('animate__fadeInDown');
        });
    }

    window.addEventListener('click', e => {
        if (e.target === adminModal) {
            adminModal.style.display = 'none';
            adminModal.classList.remove('animate__fadeInDown');
        }
    });

    if (loginButton && passwordInput) {
        loginButton.addEventListener('click', () => {
            const pw = passwordInput.value.trim();
            if (pw === 'angel2025') {
                loginSection.style.display = 'none';
                controlsSection.style.display = 'block';
        document.getElementById('adminControls').style.display = 'block';
                passwordInput.value = '';
            } else {
                alert('Incorrect password');
            }
        });
    }
}

function displayRoutesByDay(day) {
    removeRouteLayers();
    globals.currentRoutes = (window.routes || []).filter(r => r.day === day);
    globals.currentRoutes.forEach((route, idx) => {
        const id = `route-${idx}`;
        const geojson = {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [route.path.map(p => [p.lng, p.lat])]
            }
        };
        globals.map.addSource(id, { type: 'geojson', data: geojson });
        globals.map.addLayer({
            id,
            type: 'fill',
            source: id,
            paint: {
                'fill-color': route.restricted ? '#e74c3c' : '#3498db',
                'fill-opacity': route.restricted ? 0.3 : 0.5
            }
        });
        const labelId = `${id}-label`;
        globals.map.addLayer({
            id: labelId,
            type: 'symbol',
            source: id,
            layout: {
                'text-field': route.name,
                'text-size': 12
            },
            paint: {
                'text-color': route.restricted ? '#721c24' : '#202020'
            }
        });
        globals.routeLayers.push(id);
        globals.labelLayers.push(labelId);
    });
    const countSpan = document.getElementById('routeCount');
    if (countSpan) countSpan.textContent = `(${globals.currentRoutes.length})`;
}

function removeRouteLayers() {
    [...globals.routeLayers, ...globals.labelLayers].forEach(id => {
        if (globals.map.getLayer(id)) globals.map.removeLayer(id);
        if (globals.map.getSource(id)) globals.map.removeSource(id);
    });
    globals.routeLayers = [];
    globals.labelLayers = [];
}

function hideLoadingScreen() {
    const screen = document.getElementById('loading-screen');
    if (screen) {
        screen.style.opacity = '0';
        setTimeout(() => {
            screen.style.display = 'none';
        }, 500);
    }
}

async function loadRoutes() {
    try {
        const resp = await fetch('/api/routes');
        const data = await resp.json();
        if (!Array.isArray(data)) return;
        window.routes = data.map(route => ({
            name: route.name || 'Unnamed Route',
            day: route.day || 'Sunday',
            restricted: route.restricted || false,
            path: route.path || [] // array of { lat, lng }
        }));
    } catch (err) {
        console.error('Failed to load routes:', err);
        window.routes = [];
    }
}

async function searchAddress() {
    const address = document.getElementById('addressSearch').value;
    const resultDiv = document.getElementById('searchResult');
    if (!address) {
        resultDiv.textContent = 'Please enter an address';
        return;
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}`;

    try {
        const resp = await fetch(url);
        const data = await resp.json();

        if (data.features && data.features.length) {
            const [lng, lat] = data.features[0].center;
            globals.map.flyTo({ center: [lng, lat], zoom: 14 });
            let message = data.features[0].place_name;
            const pt = turf.point([lng, lat]);
            const match = globals.currentRoutes.find(r => {
                const poly = turf.polygon([r.path.map(p => [p.lng, p.lat])]);
                return turf.booleanPointInPolygon(pt, poly);
            });
            if (match) {
                message += ` – Zone: ${match.name}`;
            }
            resultDiv.textContent = message;
        } else {
            resultDiv.textContent = 'Address not found.';
        }
    } catch (err) {
        console.error('Geocoding error:', err);
        resultDiv.textContent = 'Error searching address';
    }
}

function toggleDarkMode() {
    globals.darkMode = !globals.darkMode;
    const style = globals.darkMode ? globals.mapStyles.dark : globals.mapStyles.light;
    globals.map.setStyle(style);
    globals.map.once('styledata', () => {
        displayRoutesByDay(globals.currentDay);
    });
    document.body.classList.toggle('dark-mode', globals.darkMode);
    document.body.classList.toggle('light-mode', !globals.darkMode);
    const icon = globals.darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    const btn = document.getElementById('darkModeToggle');
    if (btn) btn.innerHTML = icon;
}

window.MealMap = { initMap };
