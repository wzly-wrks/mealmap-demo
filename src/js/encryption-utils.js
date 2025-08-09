// Encryption utilities for sensitive data
(function() {
    // Simple encryption key (in production, use a more secure approach)
    const encryptionKey = 'mealmap-secure-key-' + navigator.userAgent.replace(/\D+/g, '');
    
    // Encrypt data
    window.encryptData = function(data) {
        try {
            // Convert the data to a JSON string
            const jsonString = JSON.stringify(data);
            
            // Create a simple encryption (XOR with key)
            let encrypted = '';
            for (let i = 0; i < jsonString.length; i++) {
                const charCode = jsonString.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length);
                encrypted += String.fromCharCode(charCode);
            }
            
            // Convert to base64 for storage
            return btoa(encrypted);
        } catch (err) {
            console.error('Encryption failed:', err);
            return null;
        }
    };
    
    // Decrypt data
    window.decryptData = function(encryptedData) {
        try {
            // Decode from base64
            const encrypted = atob(encryptedData);
            
            // Decrypt (XOR with key)
            let decrypted = '';
            for (let i = 0; i < encrypted.length; i++) {
                const charCode = encrypted.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length);
                decrypted += String.fromCharCode(charCode);
            }
            
            // Parse the JSON string back to an object
            return JSON.parse(decrypted);
        } catch (err) {
            console.error('Decryption failed:', err);
            return null;
        }
    };
})();