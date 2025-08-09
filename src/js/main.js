/**
 * Main entry point for the MealMap application
 * 
 * This file initializes the application and loads all required modules.
 */

// Import CSS
import '../css/style.css';
import '../css/user_interface.css';

// Import utility modules
import './utils/html-sanitizer';

// Import core modules
import './core/map-manager';
import './core/route-assignments';
import './core/data-loader';
import './core/ui-manager';

// Import feature modules
import './features/route-manager';
import './react/day-selector';

/**
 * Initialize the application when the DOM is fully loaded
 */
function initApp() {
  console.log('MealMap application initializing...');
  
  // Show loading screen
  const loadingScreen = document.getElementById('loading-screen');
  const appContainer = document.getElementById('app-container');
  
  if (loadingScreen && appContainer) {
    // Simulate loading progress
    const progressBar = loadingScreen.querySelector('.loading-progress');
    let progress = 0;
    
    const progressInterval = setInterval(() => {
      progress += 5;
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
      
      if (progress >= 100) {
        clearInterval(progressInterval);
        
        // Hide loading screen and show app
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          appContainer.style.display = 'block';
          
          // Initialize MealMap components
          if (window.MealMap) {
            // Initialize map
            if (window.MealMap.mapManager && typeof window.MealMap.mapManager.init === 'function') {
              window.MealMap.mapManager.init();
            }
            
            // Initialize route manager
            if (window.MealMap.routeManager && typeof window.MealMap.routeManager.init === 'function') {
              window.MealMap.routeManager.init();
            }
            
            // Initialize UI manager
            if (window.MealMap.uiManager && typeof window.MealMap.uiManager.init === 'function') {
              window.MealMap.uiManager.init();
            }
            
            console.log('MealMap application initialized successfully');
          } else {
            console.error('MealMap object not found. Application initialization failed.');
          }
        }, 500);
      }
    }, 50);
  }
}

// Initialize when the DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export the MealMap object for global access
export default window.MealMap;
