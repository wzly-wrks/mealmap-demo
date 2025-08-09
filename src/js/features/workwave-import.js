// WorkWave import enhancement
function enhanceWorkwaveImport() {
    // Find the original importWorkwaveOrders function
    const originalImportWorkwave = window.importWorkwaveOrders;
    
    if (!originalImportWorkwave) return;
    
    // Replace with enhanced version
    window.importWorkwaveOrders = function() {
        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'workwave-loading';
        
        const spinner = document.createElement('i');
        spinner.className = 'fas fa-spinner fa-spin';
        loadingIndicator.appendChild(spinner);
        loadingIndicator.appendChild(document.createTextNode(' Importing orders from WorkWave...'));
        
        // Style the loading indicator
        loadingIndicator.style.position = 'fixed';
        loadingIndicator.style.top = '50%';
        loadingIndicator.style.left = '50%';
        loadingIndicator.style.transform = 'translate(-50%, -50%)';
        loadingIndicator.style.padding = '20px';
        loadingIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        loadingIndicator.style.color = 'white';
        loadingIndicator.style.borderRadius = '5px';
        loadingIndicator.style.zIndex = '9999';
        
        document.body.appendChild(loadingIndicator);
        
        // Get API credentials from localStorage
        let apiKey = '';
        let territoryId = '';
        try {
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
        } catch (err) {
            console.error('Failed to load API configuration:', err);
        }
        
        // Check if API credentials are available
        if (!apiKey || !territoryId) {
            loadingIndicator.remove();
            if (window.MealMap && typeof window.MealMap.showToast === 'function') {
                window.MealMap.showToast('API credentials not found. Please configure them in the Admin Panel.', 'error');
            } else {
                alert('API credentials not found. Please configure them in the Admin Panel.');
            }
            return;
        }
        
        // Ask user which data source to use
        const dataSource = confirm(
            "Import from WorkWave Route Manager:\n\n" +
            "• Click OK for PLANNED ROUTES (select a date)\n" +
            "• Click Cancel for TODAY'S ROUTES (current date only)"
        ) ? "planned" : "today";
        
        let apiEndpoint;
        let dateStr = '';
        
        if (dataSource === "planned") {
            // Get today's date in YYYY-MM-DD format
            const today = new Date().toISOString().split('T')[0];
            
            // Allow user to select a date
            dateStr = prompt('Enter date (YYYY-MM-DD) or leave blank for today:', today);
            
            // Validate date format
            if (dateStr && !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                loadingIndicator.remove();
                if (window.MealMap && typeof window.MealMap.showToast === 'function') {
                    window.MealMap.showToast('Invalid date format. Please use YYYY-MM-DD format.', 'error');
                } else {
                    alert('Invalid date format. Please use YYYY-MM-DD format.');
                }
                return;
            }
            
            const date = dateStr || today;
            
            // Use encodeURIComponent to safely encode the date parameter
            apiEndpoint = `/api/workwave/orders?date=${encodeURIComponent(date)}`;
            
            // Update loading indicator text
            loadingIndicator.innerHTML = '';
            const newSpinner = document.createElement('i');
            newSpinner.className = 'fas fa-spinner fa-spin';
            loadingIndicator.appendChild(newSpinner);
            loadingIndicator.appendChild(document.createTextNode(` Importing orders for ${date}...`));
        } else {
            // Use current routes endpoint
            apiEndpoint = '/api/workwave/current-orders';
            
            // Update loading indicator text
            loadingIndicator.innerHTML = '';
            const newSpinner = document.createElement('i');
            newSpinner.className = 'fas fa-spinner fa-spin';
            loadingIndicator.appendChild(newSpinner);
            loadingIndicator.appendChild(document.createTextNode(" Importing today's routes..."));
        }
        
        // Create headers with API credentials
        const headers = {
            'X-WorkWave-Key': apiKey,
            'X-Territory-ID': territoryId,
            'Content-Type': 'application/json'
        };
        
        // Fetch orders from our server API
        fetch(apiEndpoint, { headers })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server returned ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data.success) {
                    throw new Error(data.error || 'Unknown error occurred');
                }
                
                // Reset route colors
                globals.routeColors = {};
                globals.colorIndex = 0;
                
                // Get the day of the week for the selected date
                let dayOfWeek = '';
                if (dataSource === "planned" && dateStr) {
                    const date = new Date(dateStr);
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    dayOfWeek = days[date.getDay()];
                } else {
                    const today = new Date();
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    dayOfWeek = days[today.getDay()];
                }
                
                const sanitizer = window.MealMap.sanitizer || { escapeHTML: str => str };
                
                // Process orders and apply route assignments
                const processedOrders = data.orders.filter(o => o.route && !isNaN(o.lat) && !isNaN(o.lng)).map(order => {
                    // Extract van number from route name (if possible)
                    const vanMatch = order.route.match(/VAN-\d+/i);
                    const vanNumber = vanMatch ? vanMatch[0].toUpperCase() : null;
                    
                    // If we have a van number and route assignments, use them
                    if (vanNumber && window.MealMap && window.MealMap.routeAssignments) {
                        const assignment = window.MealMap.routeAssignments.getRouteAssignment(dayOfWeek, vanNumber);
                        
                        if (assignment) {
                            // Update order with route assignment data
                            return {
                                ...order,
                                routeName: sanitizer.escapeHTML(assignment.name),
                                driver: sanitizer.escapeHTML(assignment.driver),
                                capacity: assignment.capacity
                            };
                        }
                    }
                    
                    // Default capacity from day's default
                    let defaultCapacity = 40;
                    if (window.MealMap && window.MealMap.routeAssignments) {
                        defaultCapacity = window.MealMap.routeAssignments.getDefaultCapacity(dayOfWeek);
                    }
                    
                    return {
                        ...order,
                        capacity: defaultCapacity
                    };
                });
                
                // Update orders with the processed data
                globals.orders = processedOrders;
                window.orders = processedOrders;
                
                if (globals.orders.length === 0) {
                    // No orders found
                    const dateInfo = dataSource === "planned" && dateStr ? ` for ${sanitizer.escapeHTML(dateStr)}` : '';
                    const safeMessage = data.message ? sanitizer.escapeHTML(data.message) : '';
                    
                    if (window.MealMap && typeof window.MealMap.showToast === 'function') {
                        window.MealMap.showToast(`No orders found${dateInfo}. ${safeMessage}`, 'info');
                    } else {
                        alert(`No orders found${dateInfo}. ${data.message || ''}`);
                    }
                } else {
                    // Display the orders on the map
                    displayOrders();
                    
                    // Show success message
                    const source = dataSource === "planned" ? "planned routes" : "today's routes";
                    const routeCount = new Set(globals.orders.map(o => o.route)).size;
                    
                    if (window.MealMap && typeof window.MealMap.showToast === 'function') {
                        window.MealMap.showToast(`Successfully imported ${globals.orders.length} orders from ${routeCount} ${source}`, 'success');
                    } else {
                        alert(`Successfully imported ${globals.orders.length} orders from ${routeCount} ${source}`);
                    }
                }
            })
            .catch(err => {
                console.error('Failed to import WorkWave orders:', err);
                
                const sanitizer = window.MealMap.sanitizer || { escapeHTML: str => str };
                const safeErrorMessage = sanitizer.escapeHTML(err.message);
                
                if (window.MealMap && typeof window.MealMap.showToast === 'function') {
                    window.MealMap.showToast(`Failed to import WorkWave orders: ${safeErrorMessage}. Please check your API credentials.`, 'error');
                } else {
                    alert(`Failed to import WorkWave orders: ${err.message}\n\nPlease check your API credentials and try again.`);
                }
            })
            .finally(() => {
                // Remove loading indicator
                const loadingElement = document.getElementById('workwave-loading');
                if (loadingElement) {
                    loadingElement.remove();
                }
            });
    };
}


export { enhanceWorkwaveImport };
