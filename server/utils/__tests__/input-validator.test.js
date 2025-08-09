const validator = require('../input-validator');

describe('Input Validator', () => {
  describe('isValidDate', () => {
    test('should return true for valid date format', () => {
      expect(validator.isValidDate('2023-01-01')).toBe(true);
    });

    test('should return false for invalid date format', () => {
      expect(validator.isValidDate('01-01-2023')).toBe(false);
      expect(validator.isValidDate('2023/01/01')).toBe(false);
      expect(validator.isValidDate('not-a-date')).toBe(false);
    });

    test('should return false for invalid dates', () => {
      expect(validator.isValidDate('2023-02-30')).toBe(false); // February doesn't have 30 days
      expect(validator.isValidDate('2023-13-01')).toBe(false); // Month > 12
    });
  });

  describe('sanitizeString', () => {
    test('should sanitize SQL injection attempts', () => {
      expect(validator.sanitizeString("Robert'); DROP TABLE Students;--")).not.toContain(';');
      expect(validator.sanitizeString("Robert'); DROP TABLE Students;--")).not.toContain('--');
    });

    test('should handle non-string inputs', () => {
      expect(validator.sanitizeString(null)).toBe('');
      expect(validator.sanitizeString(undefined)).toBe('');
      expect(validator.sanitizeString(123)).toBe('');
    });
  });

  describe('validateApiCredentials', () => {
    test('should return true for valid API credentials', () => {
      expect(validator.validateApiCredentials('api_key_123', '12345')).toBe(true);
    });

    test('should return false for missing credentials', () => {
      expect(validator.validateApiCredentials('', '12345')).toBe(false);
      expect(validator.validateApiCredentials('api_key_123', '')).toBe(false);
      expect(validator.validateApiCredentials('', '')).toBe(false);
    });

    test('should return false for invalid API key format', () => {
      expect(validator.validateApiCredentials('api key with spaces', '12345')).toBe(false);
      expect(validator.validateApiCredentials('api;key;with;semicolons', '12345')).toBe(false);
    });

    test('should return false for invalid territory ID format', () => {
      expect(validator.validateApiCredentials('api_key_123', 'not-a-number')).toBe(false);
      expect(validator.validateApiCredentials('api_key_123', '123abc')).toBe(false);
    });
  });

  describe('validateRouteId', () => {
    test('should return true for valid route ID', () => {
      expect(validator.validateRouteId('12345')).toBe(true);
    });

    test('should return false for missing route ID', () => {
      expect(validator.validateRouteId('')).toBe(false);
      expect(validator.validateRouteId(null)).toBe(false);
      expect(validator.validateRouteId(undefined)).toBe(false);
    });

    test('should return false for invalid route ID format', () => {
      expect(validator.validateRouteId('route-123')).toBe(false);
      expect(validator.validateRouteId('123abc')).toBe(false);
    });
  });
});