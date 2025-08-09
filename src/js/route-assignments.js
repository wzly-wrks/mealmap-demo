// Route Assignments Manager
(function() {
    // Route assignments data structure
    const routeAssignments = {
        Sunday: {},
        Monday: {},
        Tuesday: {},
        Wednesday: {},
        Thursday: {},
        Friday: {}
    };
    
    // Default route capacities (can be overridden by user)
    const defaultRouteCapacities = {
        Sunday: 40,
        Monday: 40,
        Tuesday: 40,
        Wednesday: 40,
        Thursday: 40,
        Friday: 40
    };
    
    // Initialize route assignments from hardcoded data (based on Excel file)
    function initializeRouteAssignments() {
        // Sunday routes
        routeAssignments.Sunday['VAN-01'] = { name: 'PALMDALE', driver: 'LOUIS', capacity: defaultRouteCapacities.Sunday };
        routeAssignments.Sunday['VAN-02'] = { name: 'NORTHEAST-2', driver: 'RAFAEL', capacity: defaultRouteCapacities.Sunday };
        routeAssignments.Sunday['VAN-03'] = { name: 'NORTHEAST-3', driver: 'SAMANTHA', capacity: defaultRouteCapacities.Sunday };
        routeAssignments.Sunday['VAN-04'] = { name: 'SOUTH GATE-5', driver: 'RICKY', capacity: defaultRouteCapacities.Sunday };
        routeAssignments.Sunday['VAN-05'] = { name: 'WESTMONT PARK-1', driver: 'BREE', capacity: defaultRouteCapacities.Sunday };
        routeAssignments.Sunday['VAN-06'] = { name: 'WESTSIDE-1', driver: 'SCOTT C', capacity: defaultRouteCapacities.Sunday };
        routeAssignments.Sunday['VAN-07'] = { name: 'EAST LA-4', driver: 'KEITH', capacity: defaultRouteCapacities.Sunday };
        routeAssignments.Sunday['VAN-08'] = { name: 'CANYON CNTRY-2', driver: 'EZEKIEL', capacity: defaultRouteCapacities.Sunday };
        routeAssignments.Sunday['VAN-09'] = { name: 'ROSEGATE-1', driver: 'DOORDASH', capacity: defaultRouteCapacities.Sunday };
        routeAssignments.Sunday['VAN-10'] = { name: 'CULVER CITY', driver: 'Melissa', capacity: defaultRouteCapacities.Sunday };
        routeAssignments.Sunday['VAN-11'] = { name: 'VERDUGO', driver: 'VOLUNTEERS', capacity: defaultRouteCapacities.Sunday };
        routeAssignments.Sunday['VAN-12'] = { name: 'WESTSIDE-3', driver: 'VOLUNTEERS', capacity: defaultRouteCapacities.Sunday };
        
        // Monday routes
        routeAssignments.Monday['VAN-01'] = { name: 'CANYON CNTRY-1', driver: 'SAMANTHA', capacity: defaultRouteCapacities.Monday };
        routeAssignments.Monday['VAN-02'] = { name: 'EAST LA-1', driver: 'PETER', capacity: defaultRouteCapacities.Monday };
        routeAssignments.Monday['VAN-03'] = { name: 'EAST LA-2', driver: 'FRANCOIS', capacity: defaultRouteCapacities.Monday };
        routeAssignments.Monday['VAN-04'] = { name: 'EAST LA-3', driver: 'CHRIS W', capacity: defaultRouteCapacities.Monday };
        routeAssignments.Monday['VAN-05'] = { name: 'MID CITY-1', driver: 'DAVID', capacity: defaultRouteCapacities.Monday };
        routeAssignments.Monday['VAN-06'] = { name: 'MID CITY-2', driver: 'ERIC', capacity: defaultRouteCapacities.Monday };
        routeAssignments.Monday['VAN-07'] = { name: 'MID CITY-3', driver: 'CHRIS R', capacity: defaultRouteCapacities.Monday };
        routeAssignments.Monday['VAN-08'] = { name: 'ROSECRANS-1', driver: 'KEITH', capacity: defaultRouteCapacities.Monday };
        routeAssignments.Monday['VAN-09'] = { name: 'SOUTH GATE-1', driver: 'RAFAEL', capacity: defaultRouteCapacities.Monday };
        routeAssignments.Monday['VAN-10'] = { name: 'SAN GABRIEL-2', driver: 'SCOTT C', capacity: defaultRouteCapacities.Monday };
        routeAssignments.Monday['VAN-11'] = { name: 'ROSECRANS-2', driver: 'RICKY', capacity: defaultRouteCapacities.Monday };
        
        // Tuesday routes
        routeAssignments.Tuesday['VAN-01'] = { name: 'NO. HOLLYWOOD-2', driver: 'PETER', capacity: defaultRouteCapacities.Tuesday };
        routeAssignments.Tuesday['VAN-02'] = { name: 'NORTH VALLEY-1', driver: 'EZEKIEL', capacity: defaultRouteCapacities.Tuesday };
        routeAssignments.Tuesday['VAN-03'] = { name: 'NORTH VALLEY-2', driver: 'SAMANTHA', capacity: defaultRouteCapacities.Tuesday };
        routeAssignments.Tuesday['VAN-04'] = { name: 'SILVERLAKE-1', driver: 'CHRIS R', capacity: defaultRouteCapacities.Tuesday };
        routeAssignments.Tuesday['VAN-05'] = { name: 'SOUTH GATE-2', driver: 'JUAN CARLOS', capacity: defaultRouteCapacities.Tuesday };
        routeAssignments.Tuesday['VAN-06'] = { name: 'SOUTH GATE-3', driver: 'DAVID', capacity: defaultRouteCapacities.Tuesday };
        routeAssignments.Tuesday['VAN-07'] = { name: 'VERNON-1', driver: 'ERIC', capacity: defaultRouteCapacities.Tuesday };
        routeAssignments.Tuesday['VAN-08'] = { name: 'WAC-1', driver: 'BREE', capacity: defaultRouteCapacities.Tuesday };
        routeAssignments.Tuesday['VAN-09'] = { name: 'WAC-4', driver: 'FRANCOIS', capacity: defaultRouteCapacities.Tuesday };
        routeAssignments.Tuesday['VAN-10'] = { name: 'VERNON-2', driver: 'KEITH', capacity: defaultRouteCapacities.Tuesday };
        routeAssignments.Tuesday['VAN-11'] = { name: 'SOUTH LA-1', driver: 'CHRIS W', capacity: defaultRouteCapacities.Tuesday };
        routeAssignments.Tuesday['VAN-12'] = { name: 'THE ELITE', driver: 'RON', capacity: defaultRouteCapacities.Tuesday };
        
        // Wednesday routes
        routeAssignments.Wednesday['VAN-01'] = { name: 'SOUTH BAY-4', driver: 'LOUIS', capacity: defaultRouteCapacities.Wednesday };
        routeAssignments.Wednesday['VAN-02'] = { name: 'LAUREL-2', driver: 'FRANCOIS', capacity: defaultRouteCapacities.Wednesday };
        routeAssignments.Wednesday['VAN-03'] = { name: 'LONG BEACH-1', driver: 'CHRIS R', capacity: defaultRouteCapacities.Wednesday };
        routeAssignments.Wednesday['VAN-04'] = { name: 'FOOTHILL-1', driver: 'SCOTT C', capacity: defaultRouteCapacities.Wednesday };
        routeAssignments.Wednesday['VAN-05'] = { name: 'SEPULVEDA-2', driver: 'SAMANTHA', capacity: defaultRouteCapacities.Wednesday };
        routeAssignments.Wednesday['VAN-06'] = { name: 'SILVERLAKE-3', driver: 'PETER', capacity: defaultRouteCapacities.Wednesday };
        routeAssignments.Wednesday['VAN-07'] = { name: 'SOUTH BAY-1', driver: 'DAVID', capacity: defaultRouteCapacities.Wednesday };
        routeAssignments.Wednesday['VAN-08'] = { name: 'SOUTHEAST-2', driver: 'CHRIS W', capacity: defaultRouteCapacities.Wednesday };
        routeAssignments.Wednesday['VAN-09'] = { name: 'WAC-2', driver: 'EZEKIEL', capacity: defaultRouteCapacities.Wednesday };
        routeAssignments.Wednesday['VAN-10'] = { name: 'WHITTIER-PUENTE-1', driver: 'JUAN CARLOS', capacity: defaultRouteCapacities.Wednesday };
        routeAssignments.Wednesday['VAN-11'] = { name: 'SOUTHEAST-4', driver: 'ERIC', capacity: defaultRouteCapacities.Wednesday };
        routeAssignments.Wednesday['VAN-12'] = { name: 'POMONA-1', driver: 'RICKY', capacity: defaultRouteCapacities.Wednesday };
        
        // Thursday routes
        routeAssignments.Thursday['VAN-01'] = { name: 'AGAPE-1', driver: 'CHRIS R', capacity: defaultRouteCapacities.Thursday };
        routeAssignments.Thursday['VAN-02'] = { name: 'DOWNTOWN-1', driver: 'TBA', capacity: defaultRouteCapacities.Thursday };
        routeAssignments.Thursday['VAN-03'] = { name: 'HOLLYWOOD-1', driver: 'SAMANTHA', capacity: defaultRouteCapacities.Thursday };
        routeAssignments.Thursday['VAN-04'] = { name: 'LA PUENTE-1', driver: 'SCOTT C', capacity: defaultRouteCapacities.Thursday };
        routeAssignments.Thursday['VAN-05'] = { name: 'LANCASTER-1', driver: 'RAFAEL', capacity: defaultRouteCapacities.Thursday };
        routeAssignments.Thursday['VAN-06'] = { name: 'LANCASTER-2', driver: 'LOUIS', capacity: defaultRouteCapacities.Thursday };
        routeAssignments.Thursday['VAN-07'] = { name: 'SEPULVEDA-1', driver: 'JUAN CARLOS', capacity: defaultRouteCapacities.Thursday };
        routeAssignments.Thursday['VAN-08'] = { name: 'SOUTH BAY-2', driver: 'CHRIS W', capacity: defaultRouteCapacities.Thursday };
        routeAssignments.Thursday['VAN-09'] = { name: 'SOUTHEAST-1', driver: 'ERIC', capacity: defaultRouteCapacities.Thursday };
        routeAssignments.Thursday['VAN-10'] = { name: 'WESTSIDE-2', driver: 'PETER', capacity: defaultRouteCapacities.Thursday };
        routeAssignments.Thursday['VAN-11'] = { name: 'SOUTH BAY PLUS', driver: 'FRANCOIS', capacity: defaultRouteCapacities.Thursday };
        
        // Friday routes
        routeAssignments.Friday['VAN-01'] = { name: 'open', driver: 'open', capacity: defaultRouteCapacities.Friday };
        routeAssignments.Friday['VAN-02'] = { name: 'HUNTINGTON PARK-1', driver: 'RAFAEL', capacity: defaultRouteCapacities.Friday };
        routeAssignments.Friday['VAN-03'] = { name: 'NORTHEAST-1', driver: 'DAVID', capacity: defaultRouteCapacities.Friday };
        routeAssignments.Friday['VAN-04'] = { name: 'SOUTH BAY-3', driver: 'PETER', capacity: defaultRouteCapacities.Friday };
        routeAssignments.Friday['VAN-05'] = { name: 'SOUTH GATE-4', driver: 'LOUIS', capacity: defaultRouteCapacities.Friday };
        routeAssignments.Friday['VAN-06'] = { name: 'WAC-3', driver: 'KEITH', capacity: defaultRouteCapacities.Friday };
        routeAssignments.Friday['VAN-07'] = { name: 'WEST VALLEY-1', driver: 'FRANCOIS', capacity: defaultRouteCapacities.Friday };
        routeAssignments.Friday['VAN-08'] = { name: 'WEST VALLEY-2', driver: 'CHRIS W', capacity: defaultRouteCapacities.Friday };
        routeAssignments.Friday['VAN-09'] = { name: 'WEST VALLEY-3', driver: 'ERIC', capacity: defaultRouteCapacities.Friday };
        routeAssignments.Friday['VAN-10'] = { name: 'SOUTHEAST-3', driver: 'JUAN CARLOS', capacity: defaultRouteCapacities.Friday };
        routeAssignments.Friday['VAN-11'] = { name: 'HUNTINGTON PARK-2', driver: 'CHRIS R', capacity: defaultRouteCapacities.Friday };
        
        // Save to localStorage for persistence
        saveRouteAssignments();
    }
    
    // Save route assignments to localStorage
    function saveRouteAssignments() {
        try {
            localStorage.setItem('routeAssignments', JSON.stringify(routeAssignments));
            localStorage.setItem('defaultRouteCapacities', JSON.stringify(defaultRouteCapacities));
        } catch (err) {
            console.error('Failed to save route assignments:', err);
        }
    }
    
    // Load route assignments from localStorage
    function loadRouteAssignments() {
        try {
            const savedAssignments = localStorage.getItem('routeAssignments');
            const savedCapacities = localStorage.getItem('defaultRouteCapacities');
            
            if (savedAssignments) {
                Object.assign(routeAssignments, JSON.parse(savedAssignments));
            }
            
            if (savedCapacities) {
                Object.assign(defaultRouteCapacities, JSON.parse(savedCapacities));
            }
        } catch (err) {
            console.error('Failed to load route assignments:', err);
        }
    }
    
    // Get route assignment for a specific day and van
    function getRouteAssignment(day, vanNumber) {
        if (!day || !vanNumber) return null;
        
        // Convert day to proper case (e.g., "sunday" -> "Sunday")
        day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
        
        if (routeAssignments[day] && routeAssignments[day][vanNumber]) {
            return routeAssignments[day][vanNumber];
        }
        
        return null;
    }
    
    // Update route assignment
    function updateRouteAssignment(day, vanNumber, name, driver, capacity) {
        if (!day || !vanNumber) return false;
        
        // Convert day to proper case
        day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
        
        if (!routeAssignments[day]) {
            routeAssignments[day] = {};
        }
        
        routeAssignments[day][vanNumber] = {
            name: name || '',
            driver: driver || '',
            capacity: capacity || defaultRouteCapacities[day]
        };
        
        saveRouteAssignments();
        return true;
    }
    
    // Update default capacity for a day
    function updateDefaultCapacity(day, capacity) {
        if (!day || isNaN(capacity)) return false;
        
        // Convert day to proper case
        day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
        
        if (defaultRouteCapacities.hasOwnProperty(day)) {
            defaultRouteCapacities[day] = parseInt(capacity, 10);
            saveRouteAssignments();
            return true;
        }
        
        return false;
    }
    
    // Get all route assignments for a day
    function getDayAssignments(day) {
        if (!day) return {};
        
        // Convert day to proper case
        day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
        
        return routeAssignments[day] || {};
    }
    
    // Get default capacity for a day
    function getDefaultCapacity(day) {
        if (!day) return 40; // Default fallback
        
        // Convert day to proper case
        day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
        
        return defaultRouteCapacities[day] || 40;
    }
    
    // Initialize the module
    function init() {
        loadRouteAssignments();
        
        // If no assignments are loaded, initialize with default data
        if (Object.keys(routeAssignments.Sunday).length === 0) {
            initializeRouteAssignments();
        }
    }
    
    // Add to window.MealMap object
    window.MealMap = window.MealMap || {};
    window.MealMap.routeAssignments = {
        init: init,
        getRouteAssignment: getRouteAssignment,
        updateRouteAssignment: updateRouteAssignment,
        updateDefaultCapacity: updateDefaultCapacity,
        getDayAssignments: getDayAssignments,
        getDefaultCapacity: getDefaultCapacity
    };
    
    // Initialize when the DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();