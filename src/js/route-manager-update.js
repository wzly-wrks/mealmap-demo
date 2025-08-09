// Route Manager Update
// This code should replace lines 288-290 in route-manager.js

const encryptedConfig = localStorage.getItem('apiConfig');
let apiConfig = {};
                
// Try to decrypt if encryption function is available
if (encryptedConfig && typeof window.decryptData === 'function') {
    apiConfig = window.decryptData(encryptedConfig) || {};
} else if (encryptedConfig) {
    // Fallback for backward compatibility
    apiConfig = JSON.parse(encryptedConfig) || {};
}
                
apiKey = apiConfig.apiKey || '';
territoryId = apiConfig.territoryId || '';