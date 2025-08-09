import { createRouteCapacityUI } from './features/route-capacity-ui.js';
import { enhanceWorkwaveImport } from './features/workwave-import.js';

(function() {
    function init() {
        // Wait for admin panel to be ready
        const checkInterval = setInterval(() => {
            const routeManagementSection = document.getElementById('routeManagementSection');
            if (routeManagementSection) {
                clearInterval(checkInterval);
                createRouteCapacityUI();
                enhanceWorkwaveImport();
            }
        }, 500);

        // Stop checking after 10 seconds
        setTimeout(() => {
            clearInterval(checkInterval);
        }, 10000);
    }

    window.MealMap = window.MealMap || {};
    window.MealMap.routeManager = {
        init
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
