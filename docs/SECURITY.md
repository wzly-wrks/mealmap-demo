# Security Documentation

This document outlines the security measures implemented in the MealMap application to protect user data and prevent common web vulnerabilities.

## Table of Contents

- [Overview](#overview)
- [Security Features](#security-features)
- [Input Validation](#input-validation)
- [Output Encoding](#output-encoding)
- [Authentication](#authentication)
- [API Security](#api-security)
- [Data Storage](#data-storage)
- [Client-Side Security](#client-side-security)
- [Security Headers](#security-headers)
- [Dependency Management](#dependency-management)
- [Security Testing](#security-testing)
- [Reporting Security Issues](#reporting-security-issues)

## Overview

The MealMap application is designed with security in mind, implementing various measures to protect against common web vulnerabilities such as Cross-Site Scripting (XSS), SQL Injection, Cross-Site Request Forgery (CSRF), and more.

## Security Features

- **Input Validation**: All user inputs are validated on both client and server sides
- **Output Encoding**: HTML content is properly escaped to prevent XSS attacks
- **Content Security Policy**: Restricts the sources of executable scripts
- **HTTPS Support**: Secure communication between client and server
- **Secure Headers**: Implementation of security-related HTTP headers
- **API Key Protection**: Secure storage and transmission of API keys
- **Error Handling**: Prevents leakage of sensitive information

## Input Validation

### Server-Side Validation

The application uses a dedicated input validation module (`input-validator.js`) to validate all user inputs on the server side:

- **Date Validation**: Ensures dates are in the correct format (YYYY-MM-DD)
- **String Sanitization**: Removes potential SQL injection patterns
- **API Credential Validation**: Validates the format of API keys and territory IDs
- **Route ID Validation**: Ensures route IDs are in the correct format

Example of date validation:

```javascript
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
```

### Client-Side Validation

Client-side validation is implemented to provide immediate feedback to users:

- Form inputs are validated before submission
- Date inputs are restricted to valid formats
- Numeric inputs are restricted to appropriate ranges
- Required fields are checked before form submission

## Output Encoding

### HTML Sanitization

The application uses a dedicated HTML sanitizer module (`html-sanitizer.js`) to prevent XSS attacks:

- **HTML Escaping**: Special characters are escaped before being inserted into the DOM
- **Safe Text Nodes**: Text is inserted as text nodes rather than using innerHTML
- **Safe Element Creation**: Elements are created with safely escaped attributes

Example of HTML escaping:

```javascript
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
```

## Authentication

The application uses API key authentication for WorkWave integration:

- API keys are stored securely in environment variables on the server
- API keys are stored encrypted in localStorage on the client
- API keys are transmitted securely over HTTPS
- API keys are never exposed in client-side code or URLs

## API Security

### Request Validation

All API requests are validated:

- Required parameters are checked
- Parameter formats are validated
- API credentials are validated
- Rate limiting is implemented to prevent abuse

### Response Security

API responses are designed to prevent information leakage:

- Error messages are generic and don't expose implementation details
- Stack traces are never returned to the client
- Sensitive data is filtered from responses

## Data Storage

### Server-Side Storage

- Environment variables are used for sensitive configuration
- API credentials are stored in environment variables
- No sensitive data is stored in code repositories

### Client-Side Storage

- Sensitive data in localStorage is encrypted
- No sensitive data is stored in cookies
- Session data is cleared on logout

## Client-Side Security

### DOM Security

- Direct DOM manipulation is avoided in favor of safe methods
- Event handlers use safe patterns to prevent XSS
- innerHTML is never used with untrusted content

### AJAX Security

- CSRF protection is implemented for state-changing requests
- Content-Type headers are properly set
- Response types are validated

## Security Headers

The application sets the following security headers:

```javascript
// Security middleware
app.use((req, res, next) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com https://api.mapbox.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://api.mapbox.com; img-src 'self' data: https://api.mapbox.com; connect-src 'self' https://api.mapbox.com");
  next();
});
```

- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-XSS-Protection**: Enables browser XSS filtering
- **Content-Security-Policy**: Restricts the sources of executable scripts

## Dependency Management

- Regular updates of dependencies to patch security vulnerabilities
- Use of npm audit to identify and fix security issues
- Minimizing the use of third-party libraries

## Security Testing

- Regular security audits
- Automated vulnerability scanning
- Manual penetration testing
- Code reviews with security focus

## Reporting Security Issues

If you discover a security vulnerability, please send an email to security@ninjatech.ai instead of opening a public issue. We will work with you to address the vulnerability promptly.

Please include the following information in your report:

- Type of issue (e.g., XSS, CSRF, SQL injection)
- Location of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

We appreciate your help in keeping MealMap secure!