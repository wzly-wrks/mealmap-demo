const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// WorkWave API credentials
const API_KEY = process.env.API_KEY;
const TERRITORY_ID = process.env.TERRITORY_ID;

// WorkWave API base URL
const WORKWAVE_API_BASE = 'https://wwrm.workwave.com/api/v1';

// Endpoint to fetch orders from WorkWave Route Manager using Approved Plans API for today's date
app.get('/api/workwave/current-orders', async (req, res) => {
  try {
    console.log('Fetching current orders from WorkWave Approved Plans API...');
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Get approved routes for today
    const routesResponse = await fetch(
      `${WORKWAVE_API_BASE}/territories/${TERRITORY_ID}/approved_plans?date=${today}`,
      {
        headers: {
          'X-WorkWave-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`Approved routes API response status: ${routesResponse.status} ${routesResponse.statusText}`);
    
    if (!routesResponse.ok) {
      let errorDetails = '';
      try {
        const errorBody = await routesResponse.text();
        errorDetails = ` - ${errorBody}`;
      } catch (e) {
        // Ignore error parsing error
      }
      
      throw new Error(`Failed to fetch approved routes: ${routesResponse.statusText}${errorDetails}`);
    }
    
    const routesData = await routesResponse.json();
    
    // Check if there are any routes
    if (!routesData.routes || routesData.routes.length === 0) {
      return res.json({ 
        success: true, 
        orders: [],
        message: `No approved routes found for today (${today})`
      });
    }
    
    // Extract route IDs
    const routeIds = routesData.routes.map(route => route.id);
    
    // For each route, get the detailed information including orders
    const ordersPromises = routeIds.map(async (routeId) => {
      const routeDetailResponse = await fetch(
        `${WORKWAVE_API_BASE}/territories/${TERRITORY_ID}/approved_plans/${routeId}`,
        {
          headers: {
            'X-WorkWave-Key': API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!routeDetailResponse.ok) {
        console.warn(`Failed to fetch details for approved route ${routeId}: ${routeDetailResponse.statusText}`);
        return [];
      }
      
      const routeDetail = await routeDetailResponse.json();
      const routeName = routeDetail.name || `Route ${routeId}`;
      
      // Extract orders with their locations
      return routeDetail.orders.map(order => ({
        route: routeName,
        lat: order.location.lat,
        lng: order.location.lng,
        id: order.id,
        name: order.name,
        address: order.address,
        serviceTime: order.service_time,
        timeWindow: order.time_window,
        notes: order.notes
      }));
    });
    
    // Wait for all promises to resolve
    const ordersArrays = await Promise.all(ordersPromises);
    
    // Flatten the array of arrays into a single array of orders
    const orders = ordersArrays.flat();
    
    res.json({ 
      success: true, 
      orders,
      message: `Successfully fetched ${orders.length} orders from ${routeIds.length} current routes`
    });
  } catch (error) {
    console.error('Error fetching current WorkWave orders:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to fetch current WorkWave orders' 
    });
  }
});

// Endpoint to test the WorkWave API connection
app.get('/api/workwave/test', async (req, res) => {
  try {
    console.log('Testing WorkWave API connection...');
    console.log("API Key configured (hidden for security)");
    console.log("Territory ID configured (hidden for security)");
    
    // Try to fetch territories as a simple test
    const response = await fetch(
      `${WORKWAVE_API_BASE}/territories`,
      {
        headers: {
          'X-WorkWave-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`Test API response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      let errorDetails = '';
      try {
        const errorBody = await response.text();
        errorDetails = ` - ${errorBody}`;
      } catch (e) {
        // Ignore error parsing error
      }
      
      throw new Error(`API test failed: ${response.statusText}${errorDetails}`);
    }
    
    const data = await response.json();
    res.json({ 
      success: true, 
      message: 'WorkWave API connection successful', 
      territories: data 
    });
  } catch (error) {
    console.error('Error testing WorkWave API:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to test WorkWave API connection' 
    });
  }
});

// Endpoint to fetch orders from WorkWave Route Manager
app.get('/api/workwave/orders', async (req, res) => {
  try {
    // Get the date parameter from the query string, default to today
    const date = req.query.date || new Date().toISOString().split('T')[0];
    
    console.log(`Fetching routes for territory ${TERRITORY_ID} on date ${date}`);
    console.log(`API URL: ${WORKWAVE_API_BASE}/territories/${TERRITORY_ID}/approved_plans?date=${date}`);
    
    // First, get the approved routes for the specified date
    const routesResponse = await fetch(
      `${WORKWAVE_API_BASE}/territories/${TERRITORY_ID}/approved_plans?date=${date}`,
      {
        headers: {
          'X-WorkWave-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`Routes API response status: ${routesResponse.status} ${routesResponse.statusText}`);
    
    if (!routesResponse.ok) {
      // Try to get more details from the error response
      let errorDetails = '';
      try {
        const errorBody = await routesResponse.text();
        errorDetails = ` - ${errorBody}`;
      } catch (e) {
        // Ignore error parsing error
      }
      
      throw new Error(`Failed to fetch routes: ${routesResponse.statusText}${errorDetails}`);
    }
    
    const routesData = await routesResponse.json();
    
    // Check if there are any routes
    if (!routesData.routes || routesData.routes.length === 0) {
      return res.json({ 
        success: true, 
        orders: [],
        message: `No approved routes found for date ${date}`
      });
    }
    
    // Extract route IDs
    const routeIds = routesData.routes.map(route => route.id);
    
    // For each route, get the detailed information including orders
    const ordersPromises = routeIds.map(async (routeId) => {
      const routeDetailResponse = await fetch(
        `${WORKWAVE_API_BASE}/territories/${TERRITORY_ID}/approved_plans/${routeId}`,
        {
          headers: {
            'X-WorkWave-Key': API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!routeDetailResponse.ok) {
        console.warn(`Failed to fetch details for route ${routeId}: ${routeDetailResponse.statusText}`);
        return [];
      }
      
      const routeDetail = await routeDetailResponse.json();
      const routeName = routeDetail.name || `Route ${routeId}`;
      
      // Extract orders with their locations
      return routeDetail.orders.map(order => ({
        route: routeName,
        lat: order.location.lat,
        lng: order.location.lng,
        id: order.id,
        name: order.name,
        address: order.address,
        serviceTime: order.service_time,
        timeWindow: order.time_window,
        notes: order.notes
      }));
    });
    
    // Wait for all promises to resolve
    const ordersArrays = await Promise.all(ordersPromises);
    
    // Flatten the array of arrays into a single array of orders
    const orders = ordersArrays.flat();
    
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching WorkWave orders:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to fetch WorkWave orders' 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});