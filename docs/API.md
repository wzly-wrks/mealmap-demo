# MealMap API Documentation

This document provides detailed information about the MealMap API endpoints, request parameters, and response formats.

## Table of Contents

- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [WorkWave Integration API](#workwave-integration-api)
  - [Test API Connection](#test-api-connection)
  - [Get Today's Orders](#get-todays-orders)
  - [Get Orders for a Specific Date](#get-orders-for-a-specific-date)
- [Route Management API](#route-management-api)
  - [Get Route Assignments](#get-route-assignments)
  - [Update Route Assignment](#update-route-assignment)
  - [Delete Route Assignment](#delete-route-assignment)
- [Data Import/Export API](#data-importexport-api)
  - [Export Routes as CSV](#export-routes-as-csv)
  - [Export Routes as GeoJSON](#export-routes-as-geojson)

## Authentication

The MealMap API uses API key authentication for WorkWave integration. API keys should be included in the request headers.

**Headers:**
- `X-WorkWave-Key`: Your WorkWave API key
- `X-Territory-ID`: Your WorkWave territory ID

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests:

- `200 OK`: The request was successful
- `400 Bad Request`: The request was invalid or missing required parameters
- `401 Unauthorized`: Authentication failed
- `404 Not Found`: The requested resource was not found
- `500 Internal Server Error`: An error occurred on the server

Error responses include a JSON object with the following structure:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## WorkWave Integration API

### Test API Connection

Tests the connection to the WorkWave API using the provided credentials.

**Endpoint:**
```
GET /api/workwave/test
```

**Headers:**
- `X-WorkWave-Key`: Your WorkWave API key
- `X-Territory-ID`: Your WorkWave territory ID

**Response:**
```json
{
  "success": true,
  "message": "WorkWave API connection successful",
  "territories": [
    {
      "id": "12345",
      "name": "Los Angeles",
      "description": "Los Angeles Territory"
    }
  ]
}
```

### Get Today's Orders

Fetches the current day's orders from WorkWave Route Manager.

**Endpoint:**
```
GET /api/workwave/current-orders
```

**Headers:**
- `X-WorkWave-Key`: Your WorkWave API key
- `X-Territory-ID`: Your WorkWave territory ID

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "route": "VAN-1",
      "lat": 34.0522,
      "lng": -118.2437,
      "id": "order123",
      "name": "John Doe",
      "address": "123 Main St, Los Angeles, CA 90001",
      "serviceTime": 10,
      "timeWindow": {
        "start": "09:00",
        "end": "12:00"
      },
      "notes": "Leave at door"
    }
  ],
  "message": "Successfully fetched 1 orders from 1 current routes"
}
```

### Get Orders for a Specific Date

Fetches orders for a specific date from WorkWave Route Manager.

**Endpoint:**
```
GET /api/workwave/orders
```

**Headers:**
- `X-WorkWave-Key`: Your WorkWave API key
- `X-Territory-ID`: Your WorkWave territory ID

**Query Parameters:**
- `date`: The date in YYYY-MM-DD format

**Example:**
```
GET /api/workwave/orders?date=2023-01-01
```

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "route": "VAN-1",
      "lat": 34.0522,
      "lng": -118.2437,
      "id": "order123",
      "name": "John Doe",
      "address": "123 Main St, Los Angeles, CA 90001",
      "serviceTime": 10,
      "timeWindow": {
        "start": "09:00",
        "end": "12:00"
      },
      "notes": "Leave at door"
    }
  ],
  "message": "Successfully fetched 1 orders from 1 routes"
}
```

## Route Management API

### Get Route Assignments

Fetches route assignments for a specific day.

**Endpoint:**
```
GET /api/routes/assignments/:day
```

**URL Parameters:**
- `day`: The day of the week (e.g., "Monday", "Tuesday", etc.)

**Response:**
```json
{
  "success": true,
  "assignments": {
    "VAN-1": {
      "name": "Downtown Route",
      "driver": "John Smith",
      "capacity": 40
    },
    "VAN-2": {
      "name": "Hollywood Route",
      "driver": "Jane Doe",
      "capacity": 35
    }
  }
}
```

### Update Route Assignment

Updates a route assignment for a specific day and van.

**Endpoint:**
```
PUT /api/routes/assignments/:day/:van
```

**URL Parameters:**
- `day`: The day of the week (e.g., "Monday", "Tuesday", etc.)
- `van`: The van identifier (e.g., "VAN-1", "VAN-2", etc.)

**Request Body:**
```json
{
  "name": "Downtown Route",
  "driver": "John Smith",
  "capacity": 40
}
```

**Response:**
```json
{
  "success": true,
  "message": "Route assignment updated successfully"
}
```

### Delete Route Assignment

Deletes a route assignment for a specific day and van.

**Endpoint:**
```
DELETE /api/routes/assignments/:day/:van
```

**URL Parameters:**
- `day`: The day of the week (e.g., "Monday", "Tuesday", etc.)
- `van`: The van identifier (e.g., "VAN-1", "VAN-2", etc.)

**Response:**
```json
{
  "success": true,
  "message": "Route assignment deleted successfully"
}
```

## Data Import/Export API

### Export Routes as CSV

Exports routes as a CSV file.

**Endpoint:**
```
GET /api/export/csv
```

**Query Parameters:**
- `day`: The day of the week (optional)
- `format`: The CSV format (default: "standard")

**Response:**
The response is a CSV file with the following headers:
```
Route,Driver,Capacity,Address,Latitude,Longitude,Name,Notes
```

### Export Routes as GeoJSON

Exports routes as a GeoJSON file.

**Endpoint:**
```
GET /api/export/geojson
```

**Query Parameters:**
- `day`: The day of the week (optional)

**Response:**
The response is a GeoJSON file with route and stop features.

## Client-Side API

The MealMap application also provides a client-side JavaScript API for interacting with the map and route data. This API is available through the global `window.MealMap` object.

### Map Manager

```javascript
// Get the map instance
const map = window.MealMap.mapManager.getMap();

// Add a marker to the map
const marker = window.MealMap.mapManager.addMarker({
  lat: 34.0522,
  lng: -118.2437,
  title: 'Los Angeles',
  description: 'City of Angels',
  color: '#ff0000',
  routeId: 'route1',
  orderId: 'order123'
});

// Add a route to the map
window.MealMap.mapManager.addRoute(
  'route1',
  [[-118.2437, 34.0522], [-118.2, 34.05], [-118.19, 34.06]],
  '#ff0000'
);

// Fit the map to show all markers
window.MealMap.mapManager.fitMapToMarkers(50);
```

### Route Assignments

```javascript
// Get the default capacity for a day
const capacity = window.MealMap.routeAssignments.getDefaultCapacity('Monday');

// Update the default capacity for a day
window.MealMap.routeAssignments.updateDefaultCapacity('Monday', 50);

// Get all route assignments for a day
const assignments = window.MealMap.routeAssignments.getDayAssignments('Monday');

// Get a specific route assignment
const assignment = window.MealMap.routeAssignments.getRouteAssignment('Monday', 'VAN-1');

// Update a route assignment
window.MealMap.routeAssignments.updateRouteAssignment(
  'Monday',
  'VAN-1',
  'Downtown Route',
  'John Smith',
  40
);

// Delete a route assignment
window.MealMap.routeAssignments.deleteRouteAssignment('Monday', 'VAN-1');
```

### UI Manager

```javascript
// Show a toast notification
window.MealMap.uiManager.showToast('Operation successful', 'success', 3000);

// Toggle between light and dark theme
window.MealMap.uiManager.toggleTheme();

// Toggle sidebar visibility
window.MealMap.uiManager.toggleSidebar();

// Switch to a different tab
window.MealMap.uiManager.switchTab('routes');
```

### Data Loader

```javascript
// Load data from an API endpoint
const data = await window.MealMap.dataLoader.loadFromApi('/api/data');

// Load data from local storage
const settings = window.MealMap.dataLoader.loadFromStorage('settings', {});

// Save data to local storage
window.MealMap.dataLoader.saveToStorage('settings', { theme: 'dark' });

// Load orders from WorkWave API
const orders = await window.MealMap.dataLoader.loadWorkwaveOrders('2023-01-01', {
  apiKey: 'your-api-key',
  territoryId: 'your-territory-id'
});

// Test WorkWave API connection
const result = await window.MealMap.dataLoader.testWorkwaveApi({
  apiKey: 'your-api-key',
  territoryId: 'your-territory-id'
});

// Parse CSV data
const csvData = window.MealMap.dataLoader.parseCSV(csvText, {
  delimiter: ',',
  hasHeader: true,
  skipEmptyLines: true
});

// Load data from a CSV file
const fileData = await window.MealMap.dataLoader.loadFromCSV(file, {
  delimiter: ',',
  hasHeader: true,
  skipEmptyLines: true
});
```

### HTML Sanitizer

```javascript
// Escape HTML special characters
const safeText = window.MealMap.sanitizer.escapeHTML('<script>alert("XSS")</script>');

// Append safe text to an element
window.MealMap.sanitizer.appendSafeText(element, '<script>alert("XSS")</script>');

// Create a safe element with attributes
const element = window.MealMap.sanitizer.createSafeElement('div', {
  class: 'my-class',
  id: 'my-id'
}, 'Safe content');
```