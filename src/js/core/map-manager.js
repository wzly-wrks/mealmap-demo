/**
 * Map Manager Module
 * 
 * This module handles the map initialization, markers, and route display.
 * It provides functions for adding, updating, and removing map elements.
 * 
 * @module map-manager
 */

(function() {
  // Map instance
  let map = null;
  
  // Map markers
  const markers = [];
  
  // Route layers
  const routeLayers = {};
  
  // Map configuration
  const config = {
    mapboxToken: '',
    defaultCenter: [-118.2437, 34.0522], // Los Angeles
    defaultZoom: 10,
    markerColors: {
      default: '#3388ff',
      selected: '#ff4433',
      highlight: '#33ff88'
    }
  };
  
  /**
   * Initialize the map
   * 
   * @param {string} containerId - The ID of the container element
   * @param {Object} options - Map initialization options
   * @returns {Object} - The map instance
   */
  function initMap(containerId = 'map', options = {}) {
    // Get the map container
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Map container not found: ${containerId}`);
      return null;
    }
    
    // Load token from localStorage or environment
    try {
      const savedConfig = JSON.parse(localStorage.getItem('mapConfig') || '{}');
      config.mapboxToken = savedConfig.mapboxToken || config.mapboxToken;
    } catch (err) {
      console.error('Failed to load map configuration from localStorage:', err);
    }
    
    // Check if token is available
    if (!config.mapboxToken) {
      console.error('Mapbox token not found. Please configure it in the Admin Panel.');
      
      // Show error message in the map container
      container.innerHTML = `
        <div class="map-error">
          <h3>Map Configuration Error</h3>
          <p>Mapbox token not found. Please configure it in the Admin Panel.</p>
        </div>
      `;
      
      return null;
    }
    
    // Set mapbox token
    mapboxgl.accessToken = config.mapboxToken;
    
    // Create map instance
    map = new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: options.center || config.defaultCenter,
      zoom: options.zoom || config.defaultZoom
    });
    
    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      placeholder: 'Search for an address'
    });
    
    map.addControl(geocoder, 'top-left');
    
    // Add event listeners
    map.on('load', () => {
      console.log('Map loaded');
      
      // Initialize map layers
      initMapLayers();
      
      // Dispatch map ready event
      const event = new CustomEvent('map:ready', { detail: { map } });
      document.dispatchEvent(event);
    });
    
    return map;
  }
  
  /**
   * Initialize map layers
   */
  function initMapLayers() {
    if (!map) return;
    
    // Add source for route lines
    map.addSource('routes', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });
    
    // Add layer for route lines
    map.addLayer({
      id: 'route-lines',
      type: 'line',
      source: 'routes',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': ['get', 'color'],
        'line-width': 3,
        'line-opacity': 0.8
      }
    });
  }
  
  /**
   * Add a marker to the map
   * 
   * @param {Object} options - Marker options
   * @returns {Object} - The created marker
   */
  function addMarker(options) {
    if (!map) return null;
    
    const { lat, lng, title, description, color, routeId, orderId } = options;
    
    // Create marker element
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.backgroundColor = color || config.markerColors.default;
    
    // Create marker
    const marker = new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .addTo(map);
    
    // Add popup if title or description is provided
    if (title || description) {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          ${title ? `<h4>${window.MealMap.sanitizer.escapeHTML(title)}</h4>` : ''}
          ${description ? `<p>${window.MealMap.sanitizer.escapeHTML(description)}</p>` : ''}
        `);
      
      marker.setPopup(popup);
    }
    
    // Store marker data
    const markerData = {
      marker,
      options: {
        lat,
        lng,
        title,
        description,
        color,
        routeId,
        orderId
      }
    };
    
    markers.push(markerData);
    
    return markerData;
  }
  
  /**
   * Remove all markers from the map
   */
  function clearMarkers() {
    markers.forEach(({ marker }) => {
      marker.remove();
    });
    
    markers.length = 0;
  }
  
  /**
   * Add a route to the map
   * 
   * @param {string} routeId - The route identifier
   * @param {Array} coordinates - Array of [lng, lat] coordinates
   * @param {string} color - The route color
   */
  function addRoute(routeId, coordinates, color) {
    if (!map) return;
    
    // Create route feature
    const routeFeature = {
      type: 'Feature',
      properties: {
        routeId,
        color: color || getRandomColor()
      },
      geometry: {
        type: 'LineString',
        coordinates
      }
    };
    
    // Store route layer
    routeLayers[routeId] = routeFeature;
    
    // Update routes source
    updateRoutesSource();
  }
  
  /**
   * Remove a route from the map
   * 
   * @param {string} routeId - The route identifier
   */
  function removeRoute(routeId) {
    if (!map || !routeLayers[routeId]) return;
    
    // Remove route layer
    delete routeLayers[routeId];
    
    // Update routes source
    updateRoutesSource();
  }
  
  /**
   * Clear all routes from the map
   */
  function clearRoutes() {
    if (!map) return;
    
    // Clear route layers
    Object.keys(routeLayers).forEach(routeId => {
      delete routeLayers[routeId];
    });
    
    // Update routes source
    updateRoutesSource();
  }
  
  /**
   * Update the routes source with current route layers
   */
  function updateRoutesSource() {
    if (!map) return;
    
    // Get all route features
    const features = Object.values(routeLayers);
    
    // Update source data
    map.getSource('routes').setData({
      type: 'FeatureCollection',
      features
    });
  }
  
  /**
   * Fit the map to show all markers
   * 
   * @param {number} padding - Padding around the bounds
   */
  function fitMapToMarkers(padding = 50) {
    if (!map || markers.length === 0) return;
    
    // Create bounds object
    const bounds = new mapboxgl.LngLatBounds();
    
    // Extend bounds with each marker
    markers.forEach(({ options }) => {
      bounds.extend([options.lng, options.lat]);
    });
    
    // Fit map to bounds
    map.fitBounds(bounds, { padding });
  }
  
  /**
   * Get a random color for routes
   * 
   * @returns {string} - A random color in hex format
   */
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    
    return color;
  }
  
  /**
   * Set the map configuration
   * 
   * @param {Object} newConfig - The new configuration
   */
  function setConfig(newConfig) {
    Object.assign(config, newConfig);
    
    // Save to localStorage
    try {
      localStorage.setItem('mapConfig', JSON.stringify({
        mapboxToken: config.mapboxToken
      }));
    } catch (err) {
      console.error('Failed to save map configuration to localStorage:', err);
    }
  }
  
  /**
   * Initialize the map manager
   */
  function init() {
    // Initialize map when container is available
    const checkInterval = setInterval(() => {
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        clearInterval(checkInterval);
        initMap('map');
      }
    }, 100);
    
    // Stop checking after 10 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
    }, 10000);
  }
  
  // Export the module
  window.MealMap = window.MealMap || {};
  window.MealMap.mapManager = {
    init,
    initMap,
    addMarker,
    clearMarkers,
    addRoute,
    removeRoute,
    clearRoutes,
    fitMapToMarkers,
    setConfig,
    getMap: () => map
  };
})();

export default window.MealMap.mapManager;