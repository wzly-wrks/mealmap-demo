/**
 * Data Loader Module
 * 
 * This module handles loading data from various sources including
 * local storage, API endpoints, and file imports.
 * 
 * @module data-loader
 */

(function() {
  // API endpoints
  const API = {
    workwave: {
      test: '/api/workwave/test',
      orders: '/api/workwave/orders',
      currentOrders: '/api/workwave/current-orders'
    }
  };
  
  /**
   * Load data from an API endpoint
   * 
   * @param {string} url - The API endpoint URL
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} - The response data
   */
  async function loadFromApi(url, options = {}) {
    try {
      // Add default headers
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };
      
      // Make the request
      const response = await fetch(url, {
        ...options,
        headers
      });
      
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      // Parse the response
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Failed to load data from API:', error);
      throw error;
    }
  }
  
  /**
   * Load data from local storage
   * 
   * @param {string} key - The storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} - The stored data or default value
   */
  function loadFromStorage(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      
      if (data === null) {
        return defaultValue;
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to load data from storage key "${key}":`, error);
      return defaultValue;
    }
  }
  
  /**
   * Save data to local storage
   * 
   * @param {string} key - The storage key
   * @param {*} data - The data to store
   * @returns {boolean} - True if successful, false otherwise
   */
  function saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Failed to save data to storage key "${key}":`, error);
      return false;
    }
  }
  
  /**
   * Load orders from WorkWave API
   * 
   * @param {string} date - The date in YYYY-MM-DD format (optional)
   * @param {Object} credentials - API credentials
   * @returns {Promise<Object>} - The orders data
   */
  async function loadWorkwaveOrders(date, credentials) {
    try {
      // Validate credentials
      if (!credentials || !credentials.apiKey || !credentials.territoryId) {
        throw new Error('API credentials are required');
      }
      
      // Determine endpoint
      let endpoint = API.workwave.currentOrders;
      
      if (date) {
        endpoint = `${API.workwave.orders}?date=${encodeURIComponent(date)}`;
      }
      
      // Set headers
      const headers = {
        'X-WorkWave-Key': credentials.apiKey,
        'X-Territory-ID': credentials.territoryId
      };
      
      // Make the request
      const data = await loadFromApi(endpoint, { headers });
      
      return data;
    } catch (error) {
      console.error('Failed to load WorkWave orders:', error);
      throw error;
    }
  }
  
  /**
   * Test WorkWave API connection
   * 
   * @param {Object} credentials - API credentials
   * @returns {Promise<Object>} - The test result
   */
  async function testWorkwaveApi(credentials) {
    try {
      // Validate credentials
      if (!credentials || !credentials.apiKey || !credentials.territoryId) {
        throw new Error('API credentials are required');
      }
      
      // Set headers
      const headers = {
        'X-WorkWave-Key': credentials.apiKey,
        'X-Territory-ID': credentials.territoryId
      };
      
      // Make the request
      const data = await loadFromApi(API.workwave.test, { headers });
      
      return data;
    } catch (error) {
      console.error('Failed to test WorkWave API:', error);
      throw error;
    }
  }
  
  /**
   * Parse CSV data
   * 
   * @param {string} csvText - The CSV text to parse
   * @param {Object} options - Parsing options
   * @returns {Array<Object>} - Array of objects representing the CSV rows
   */
  function parseCSV(csvText, options = {}) {
    try {
      const {
        delimiter = ',',
        hasHeader = true,
        skipEmptyLines = true
      } = options;
      
      // Split into lines
      const lines = csvText.split(/\r?\n/);
      
      // Filter empty lines if needed
      const filteredLines = skipEmptyLines ? 
        lines.filter(line => line.trim() !== '') : 
        lines;
      
      if (filteredLines.length === 0) {
        return [];
      }
      
      // Parse header if present
      const startIndex = hasHeader ? 1 : 0;
      const headers = hasHeader ? 
        parseCSVLine(filteredLines[0], delimiter) : 
        null;
      
      // Parse data rows
      const data = [];
      
      for (let i = startIndex; i < filteredLines.length; i++) {
        const line = filteredLines[i];
        const values = parseCSVLine(line, delimiter);
        
        if (hasHeader) {
          // Create object with header keys
          const row = {};
          
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          
          data.push(row);
        } else {
          // Just add array of values
          data.push(values);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Failed to parse CSV data:', error);
      throw error;
    }
  }
  
  /**
   * Parse a single CSV line respecting quotes
   * 
   * @param {string} line - The CSV line to parse
   * @param {string} delimiter - The delimiter character
   * @returns {Array<string>} - Array of values
   */
  function parseCSVLine(line, delimiter) {
    const values = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          currentValue += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        // End of value
        values.push(currentValue);
        currentValue = '';
      } else {
        // Add character to current value
        currentValue += char;
      }
    }
    
    // Add the last value
    values.push(currentValue);
    
    return values;
  }
  
  /**
   * Load data from a CSV file
   * 
   * @param {File} file - The CSV file to load
   * @param {Object} options - Parsing options
   * @returns {Promise<Array<Object>>} - The parsed CSV data
   */
  function loadFromCSV(file, options = {}) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const csvText = event.target.result;
          const data = parseCSV(csvText, options);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsText(file);
    });
  }
  
  // Export the module
  window.MealMap = window.MealMap || {};
  window.MealMap.dataLoader = {
    loadFromApi,
    loadFromStorage,
    saveToStorage,
    loadWorkwaveOrders,
    testWorkwaveApi,
    parseCSV,
    loadFromCSV
  };
})();

export default window.MealMap.dataLoader;