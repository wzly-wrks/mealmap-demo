import { createRouteCapacityUI } from './route-capacity-ui';
import { enhanceWorkwaveImport } from './workwave-import';

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
