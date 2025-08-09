// Route Manager UI
(function() {
    // Create route capacity management UI
    function createRouteCapacityUI() {
        // Create section in admin panel
        const routeManagementSection = document.getElementById('routeManagementSection');
        if (!routeManagementSection) return;
        
        // Create capacity management section
        const capacitySection = document.createElement('div');
        capacitySection.className = 'capacity-management';
        capacitySection.innerHTML = `
            <h4><i class="fas fa-truck"></i> Route Capacity Management</h4>
            <div class="capacity-form">
                <div class="input-group">
                    <label for="dayCapacitySelect">Day</label>
                    <select id="dayCapacitySelect">
                        <option value="Sunday">Sunday</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="defaultCapacityInput">Default Capacity</label>
                    <input type="number" id="defaultCapacityInput" min="1" max="100" placeholder="Default capacity for all routes">
                </div>
                <button id="saveDefaultCapacityBtn" class="save-btn"><i class="fas fa-save"></i> Save Default Capacity</button>
            </div>
            <div class="route-list-container">
                <h4>Route Assignments</h4>
                <div id="routeAssignmentsList"></div>
            </div>
        `;
        
        // Insert before the existing buttons
        const buttonGroup = routeManagementSection.querySelector('.button-group');
        if (buttonGroup) {
            routeManagementSection.insertBefore(capacitySection, buttonGroup);
        } else {
            routeManagementSection.appendChild(capacitySection);
        }
        
        // Initialize capacity management
        initCapacityManagement();
    }
    
    // Initialize capacity management
    function initCapacityManagement() {
        const daySelect = document.getElementById('dayCapacitySelect');
        const capacityInput = document.getElementById('defaultCapacityInput');
        const saveBtn = document.getElementById('saveDefaultCapacityBtn');
        
        if (!daySelect || !capacityInput || !saveBtn) return;
        
        // Load initial capacity
        if (window.MealMap && window.MealMap.routeAssignments) {
            const day = daySelect.value;
            const capacity = window.MealMap.routeAssignments.getDefaultCapacity(day);
            capacityInput.value = capacity;
            
            // Load route assignments
            loadRouteAssignments(day);
        }
        
        // Add event listeners
        daySelect.addEventListener('change', () => {
            const day = daySelect.value;
            if (window.MealMap && window.MealMap.routeAssignments) {
                const capacity = window.MealMap.routeAssignments.getDefaultCapacity(day);
                capacityInput.value = capacity;
                
                // Load route assignments for the selected day
                loadRouteAssignments(day);
            }
        });
        
        saveBtn.addEventListener('click', () => {
            const day = daySelect.value;
            const capacity = parseInt(capacityInput.value, 10);
            
            if (isNaN(capacity) || capacity < 1) {
                if (window.MealMap && typeof window.MealMap.showToast === 'function') {
                    window.MealMap.showToast('Please enter a valid capacity (minimum 1)', 'error');
                } else {
                    alert('Please enter a valid capacity (minimum 1)');
                }
                return;
            }
            
            if (window.MealMap && window.MealMap.routeAssignments) {
                const success = window.MealMap.routeAssignments.updateDefaultCapacity(day, capacity);
                
                if (success) {
                    if (window.MealMap && typeof window.MealMap.showToast === 'function') {
                        window.MealMap.showToast(`Default capacity for ${day} updated to ${capacity}`, 'success');
                    } else {
                        alert(`Default capacity for ${day} updated to ${capacity}`);
                    }
                    
                    // Reload route assignments to reflect the new capacity
                    loadRouteAssignments(day);
                }
            }
        });
    }
    
    // Load route assignments for a day
    function loadRouteAssignments(day) {
        const container = document.getElementById('routeAssignmentsList');
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        if (!window.MealMap || !window.MealMap.routeAssignments) return;
        
        // Get assignments for the day
        const assignments = window.MealMap.routeAssignments.getDayAssignments(day);
        
        // Create table
        const table = document.createElement('table');
        table.className = 'route-assignments-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Van</th>
                    <th>Route Name</th>
                    <th>Driver</th>
                    <th>Capacity</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        
        const tbody = table.querySelector('tbody');
        
        // Add rows for each assignment
        Object.entries(assignments).forEach(([van, data]) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${van}</td>
                <td>${data.name}</td>
                <td>${data.driver}</td>
                <td>${data.capacity}</td>
                <td>
                    <button class="edit-route-assignment" data-van="${van}" data-day="${day}">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
            
            // Add event listener to edit button
            const editBtn = tr.querySelector('.edit-route-assignment');
            editBtn.addEventListener('click', () => {
                editRouteAssignment(day, van);
            });
        });
        
        container.appendChild(table);
    }
    
    // Edit route assignment
    function editRouteAssignment(day, van) {
        if (!window.MealMap || !window.MealMap.routeAssignments) return;
        
        // Get assignment data
        const assignment = window.MealMap.routeAssignments.getRouteAssignment(day, van);
        if (!assignment) return;
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'route-edit-modal';
        modal.innerHTML = `
            <div class="route-edit-content">
                <div class="route-edit-header">
                    <h3>Edit Route Assignment</h3>
                    <button class="close-route-edit">&times;</button>
                </div>
                <div class="route-edit-body">
                    <div class="input-group">
                        <label for="editRouteVan">Van</label>
                        <input type="text" id="editRouteVan" value="${van}" disabled>
                    </div>
                    <div class="input-group">
                        <label for="editRouteDay">Day</label>
                        <input type="text" id="editRouteDay" value="${day}" disabled>
                    </div>
                    <div class="input-group">
                        <label for="editRouteName">Route Name</label>
                        <input type="text" id="editRouteName" value="${assignment.name}">
                    </div>
                    <div class="input-group">
                        <label for="editRouteDriver">Driver</label>
                        <input type="text" id="editRouteDriver" value="${assignment.driver}">
                    </div>
                    <div class="input-group">
                        <label for="editRouteCapacity">Capacity</label>
                        <input type="number" id="editRouteCapacity" value="${assignment.capacity}" min="1" max="100">
                    </div>
                </div>
                <div class="route-edit-footer">
                    <button id="saveRouteAssignmentBtn" class="save-btn">Save Changes</button>
                    <button class="cancel-route-edit cancel-btn">Cancel</button>
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = modal.querySelector('.close-route-edit');
        const cancelBtn = modal.querySelector('.cancel-route-edit');
        const saveBtn = modal.querySelector('#saveRouteAssignmentBtn');
        
        const closeModal = () => {
            modal.remove();
        };
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        saveBtn.addEventListener('click', () => {
            const name = document.getElementById('editRouteName').value;
            const driver = document.getElementById('editRouteDriver').value;
            const capacity = parseInt(document.getElementById('editRouteCapacity').value, 10);
            
            if (isNaN(capacity) || capacity < 1) {
                if (window.MealMap && typeof window.MealMap.showToast === 'function') {
                    window.MealMap.showToast('Please enter a valid capacity (minimum 1)', 'error');
                } else {
                    alert('Please enter a valid capacity (minimum 1)');
                }
                return;
            }
            
            const success = window.MealMap.routeAssignments.updateRouteAssignment(day, van, name, driver, capacity);
            
            if (success) {
                if (window.MealMap && typeof window.MealMap.showToast === 'function') {
                    window.MealMap.showToast(`Route assignment updated for ${van} on ${day}`, 'success');
                } else {
                    alert(`Route assignment updated for ${van} on ${day}`);
                }
                
                // Reload route assignments
                loadRouteAssignments(day);
                
                // Close modal
                closeModal();
            }
        });
    }
    
    // Enhance WorkWave import to use route assignments
    function enhanceWorkwaveImport() {
        // Find the original importWorkwaveOrders function
        const originalImportWorkwave = window.importWorkwaveOrders;
        
        if (!originalImportWorkwave) return;
        
        // Replace with enhanced version
        window.importWorkwaveOrders = function() {
            // Show loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.id = 'workwave-loading';
            loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Importing orders from WorkWave...';
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
                const date = dateStr || today;
                
                apiEndpoint = `/api/workwave/orders?date=${date}`;
                loadingIndicator.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Importing orders for ${date}...`;
            } else {
                // Use current routes endpoint
                apiEndpoint = '/api/workwave/current-orders';
                loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Importing today\'s routes...';
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
                                    routeName: assignment.name,
                                    driver: assignment.driver,
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
                        const dateInfo = dataSource === "planned" && dateStr ? ` for ${dateStr}` : '';
                        if (window.MealMap && typeof window.MealMap.showToast === 'function') {
                            window.MealMap.showToast(`No orders found${dateInfo}. ${data.message || ''}`, 'info');
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
                    if (window.MealMap && typeof window.MealMap.showToast === 'function') {
                        window.MealMap.showToast(`Failed to import WorkWave orders: ${err.message}. Please check your API credentials.`, 'error');
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
    
    // Initialize route manager
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
    
    // Add to window.MealMap object
    window.MealMap = window.MealMap || {};
    window.MealMap.routeManager = {
        init: init
    };
    
    // Initialize when the DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();