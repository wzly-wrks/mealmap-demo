/**
 * Route Assignments Module
 * 
 * This module manages route assignments for different days of the week.
 * It handles capacity management, driver assignments, and route naming.
 * 
 * @module route-assignments
 */

(function() {
  // Default capacities for each day
  const DEFAULT_CAPACITIES = {
    'Sunday': 30,
    'Monday': 40,
    'Tuesday': 40,
    'Wednesday': 40,
    'Thursday': 40,
    'Friday': 40,
    'Saturday': 30
  };
  
  // Route assignments storage
  const routeAssignments = {
    'Sunday': {},
    'Monday': {},
    'Tuesday': {},
    'Wednesday': {},
    'Thursday': {},
    'Friday': {},
    'Saturday': {}
  };
  
  /**
   * Get the default capacity for a specific day
   * 
   * @param {string} day - The day of the week
   * @returns {number} - The default capacity for the day
   */
  function getDefaultCapacity(day) {
    return DEFAULT_CAPACITIES[day] || 40;
  }
  
  /**
   * Update the default capacity for a specific day
   * 
   * @param {string} day - The day of the week
   * @param {number} capacity - The new default capacity
   * @returns {boolean} - True if the update was successful
   */
  function updateDefaultCapacity(day, capacity) {
    if (!day || !DEFAULT_CAPACITIES.hasOwnProperty(day)) {
      console.error(`Invalid day: ${day}`);
      return false;
    }
    
    if (isNaN(capacity) || capacity < 1) {
      console.error(`Invalid capacity: ${capacity}`);
      return false;
    }
    
    DEFAULT_CAPACITIES[day] = capacity;
    
    // Save to localStorage
    try {
      const savedCapacities = JSON.parse(localStorage.getItem('defaultCapacities') || '{}');
      savedCapacities[day] = capacity;
      localStorage.setItem('defaultCapacities', JSON.stringify(savedCapacities));
    } catch (err) {
      console.error('Failed to save default capacities to localStorage:', err);
    }
    
    return true;
  }
  
  /**
   * Get all route assignments for a specific day
   * 
   * @param {string} day - The day of the week
   * @returns {Object} - The route assignments for the day
   */
  function getDayAssignments(day) {
    return routeAssignments[day] || {};
  }
  
  /**
   * Get a specific route assignment
   * 
   * @param {string} day - The day of the week
   * @param {string} van - The van identifier
   * @returns {Object|null} - The route assignment or null if not found
   */
  function getRouteAssignment(day, van) {
    if (!day || !routeAssignments.hasOwnProperty(day)) {
      return null;
    }
    
    return routeAssignments[day][van] || null;
  }
  
  /**
   * Update a route assignment
   * 
   * @param {string} day - The day of the week
   * @param {string} van - The van identifier
   * @param {string} name - The route name
   * @param {string} driver - The driver name
   * @param {number} capacity - The route capacity
   * @returns {boolean} - True if the update was successful
   */
  function updateRouteAssignment(day, van, name, driver, capacity) {
    if (!day || !routeAssignments.hasOwnProperty(day)) {
      console.error(`Invalid day: ${day}`);
      return false;
    }
    
    if (!van) {
      console.error('Van identifier is required');
      return false;
    }
    
    if (isNaN(capacity) || capacity < 1) {
      console.error(`Invalid capacity: ${capacity}`);
      return false;
    }
    
    // Create or update the assignment
    routeAssignments[day][van] = {
      name: name || `Route ${van}`,
      driver: driver || 'Unassigned',
      capacity: capacity
    };
    
    // Save to localStorage
    try {
      localStorage.setItem('routeAssignments', JSON.stringify(routeAssignments));
    } catch (err) {
      console.error('Failed to save route assignments to localStorage:', err);
    }
    
    return true;
  }
  
  /**
   * Delete a route assignment
   * 
   * @param {string} day - The day of the week
   * @param {string} van - The van identifier
   * @returns {boolean} - True if the deletion was successful
   */
  function deleteRouteAssignment(day, van) {
    if (!day || !routeAssignments.hasOwnProperty(day)) {
      console.error(`Invalid day: ${day}`);
      return false;
    }
    
    if (!van) {
      console.error('Van identifier is required');
      return false;
    }
    
    if (!routeAssignments[day][van]) {
      console.error(`Route assignment not found for ${van} on ${day}`);
      return false;
    }
    
    // Delete the assignment
    delete routeAssignments[day][van];
    
    // Save to localStorage
    try {
      localStorage.setItem('routeAssignments', JSON.stringify(routeAssignments));
    } catch (err) {
      console.error('Failed to save route assignments to localStorage:', err);
    }
    
    return true;
  }
  
  /**
   * Load saved data from localStorage
   */
  function loadSavedData() {
    try {
      // Load default capacities
      const savedCapacities = JSON.parse(localStorage.getItem('defaultCapacities') || '{}');
      Object.entries(savedCapacities).forEach(([day, capacity]) => {
        if (DEFAULT_CAPACITIES.hasOwnProperty(day)) {
          DEFAULT_CAPACITIES[day] = capacity;
        }
      });
      
      // Load route assignments
      const savedAssignments = JSON.parse(localStorage.getItem('routeAssignments') || '{}');
      Object.entries(savedAssignments).forEach(([day, assignments]) => {
        if (routeAssignments.hasOwnProperty(day)) {
          routeAssignments[day] = assignments;
        }
      });
    } catch (err) {
      console.error('Failed to load saved data from localStorage:', err);
    }
  }
  
  // Initialize the module
  function init() {
    loadSavedData();
    console.log('Route assignments module initialized');
  }
  
  // Load saved data on initialization
  init();
  
  // Export the module
  window.MealMap = window.MealMap || {};
  window.MealMap.routeAssignments = {
    getDefaultCapacity,
    updateDefaultCapacity,
    getDayAssignments,
    getRouteAssignment,
    updateRouteAssignment,
    deleteRouteAssignment
  };
})();

export default window.MealMap.routeAssignments;