/**
 * HTML Sanitizer Utility
 * 
 * This module provides functions to safely escape HTML content to prevent XSS attacks.
 * 
 * @module html-sanitizer
 */

/**
 * Escapes HTML special characters to prevent XSS attacks
 * 
 * @param {string} unsafeText - The text that needs to be escaped
 * @returns {string} - The escaped text safe for insertion into HTML
 */
function escapeHTML(unsafeText) {
    if (typeof unsafeText !== 'string') {
        return '';
    }
    
    return unsafeText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Creates a safe text node instead of using innerHTML
 * 
 * @param {HTMLElement} element - The element to append text to
 * @param {string} text - The text to append
 */
function appendSafeText(element, text) {
    if (!element || typeof text !== 'string') {
        return;
    }
    
    const textNode = document.createTextNode(text);
    element.appendChild(textNode);
}

/**
 * Creates an element with safely escaped attributes
 * 
 * @param {string} tagName - The HTML tag name
 * @param {Object} attributes - Key-value pairs of attributes
 * @param {string|HTMLElement} [content] - Optional content to append
 * @returns {HTMLElement} - The created element
 */
function createSafeElement(tagName, attributes = {}, content = null) {
    const element = document.createElement(tagName);
    
    // Set attributes safely
    Object.entries(attributes).forEach(([key, value]) => {
        if (typeof value === 'string') {
            element.setAttribute(key, value);
        }
    });
    
    // Add content if provided
    if (content) {
        if (typeof content === 'string') {
            appendSafeText(element, content);
        } else if (content instanceof HTMLElement) {
            element.appendChild(content);
        }
    }
    
    return element;
}

// Export the functions
window.MealMap = window.MealMap || {};
window.MealMap.sanitizer = {
    escapeHTML,
    appendSafeText,
    createSafeElement
};