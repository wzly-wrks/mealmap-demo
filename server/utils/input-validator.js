/**
 * Input Validation Utility
 * 
 * This module provides functions to validate user input on the server side
 * to prevent injection attacks and ensure data integrity.
 * 
 * @module input-validator
 */

/**
 * Validates a date string in YYYY-MM-DD format
 * 
 * @param {string} dateStr - The date string to validate
 * @returns {boolean} - True if the date is valid, false otherwise
 */
function isValidDate(dateStr) {
    // Check format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return false;
    }
    
    // Check if it's a valid date
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Additional check to ensure the date parts match what was provided
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
    const day = parseInt(parts[2], 10);
    
    return date.getFullYear() === year && 
           date.getMonth() === month && 
           date.getDate() === day;
}

/**
 * Sanitizes a string to prevent SQL injection
 * 
 * @param {string} str - The string to sanitize
 * @returns {string} - The sanitized string
 */
function sanitizeString(str) {
    if (typeof str !== 'string') {
        return '';
    }
    
    // Remove any SQL injection attempts
    return str
        .replace(/'/g, "''")
        .replace(/--/g, "")
        .replace(/;/g, "")
        .replace(/\/\*/g, "")
        .replace(/\*\//g, "");
}

/**
 * Validates API credentials
 * 
 * @param {string} apiKey - The API key to validate
 * @param {string} territoryId - The territory ID to validate
 * @returns {boolean} - True if the credentials are valid, false otherwise
 */
function validateApiCredentials(apiKey, territoryId) {
    // Check if both values are provided
    if (!apiKey || !territoryId) {
        return false;
    }
    
    // Check if API key is a valid format (alphanumeric)
    if (!/^[a-zA-Z0-9_-]+$/.test(apiKey)) {
        return false;
    }
    
    // Check if territory ID is a valid format (numeric)
    if (!/^\d+$/.test(territoryId)) {
        return false;
    }
    
    return true;
}

/**
 * Validates route ID
 * 
 * @param {string} routeId - The route ID to validate
 * @returns {boolean} - True if the route ID is valid, false otherwise
 */
function validateRouteId(routeId) {
    // Check if route ID is provided
    if (!routeId) {
        return false;
    }
    
    // Check if route ID is a valid format (numeric)
    if (!/^\d+$/.test(routeId)) {
        return false;
    }
    
    return true;
}

module.exports = {
    isValidDate,
    sanitizeString,
    validateApiCredentials,
    validateRouteId
};