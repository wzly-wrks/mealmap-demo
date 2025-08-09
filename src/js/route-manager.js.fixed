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
        
        // Create header with icon
        const header = document.createElement('h4');
        const icon = document.createElement('i');
        icon.className = 'fas fa-truck';
        header.appendChild(icon);
        header.appendChild(document.createTextNode(' Route Capacity Management'));
        
        // Create form container
        const formContainer = document.createElement('div');
        formContainer.className = 'capacity-form';
        
        // Create day select group
        const dayGroup = document.createElement('div');
        dayGroup.className = 'input-group';
        
        const dayLabel = document.createElement('label');
        dayLabel.setAttribute('for', 'dayCapacitySelect');
        dayLabel.textContent = 'Day';
        
        const daySelect = document.createElement('select');
        daySelect.id = 'dayCapacitySelect';
        
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        days.forEach(day => {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            daySelect.appendChild(option);
        });
        
        dayGroup.appendChild(dayLabel);
        dayGroup.appendChild(daySelect);
        
        // Create capacity input group
        const capacityGroup = document.createElement('div');
        capacityGroup.className = 'input-group';
        
        const capacityLabel = document.createElement('label');
        capacityLabel.setAttribute('for', 'defaultCapacityInput');
        capacityLabel.textContent = 'Default Capacity';
        
        const capacityInput = document.createElement('input');
        capacityInput.type = 'number';
        capacityInput.id = 'defaultCapacityInput';
        capacityInput.min = '1';
        capacityInput.max = '100';
        capacityInput.placeholder = 'Default capacity for all routes';
        
        capacityGroup.appendChild(capacityLabel);
        capacityGroup.appendChild(capacityInput);
        
        // Create save button
        const saveBtn = document.createElement('button');
        saveBtn.id = 'saveDefaultCapacityBtn';
        saveBtn.className = 'save-btn';
        
        const saveIcon = document.createElement('i');
        saveIcon.className = 'fas fa-save';
        saveBtn.appendChild(saveIcon);
        saveBtn.appendChild(document.createTextNode(' Save Default Capacity'));
        
        // Append form elements
        formContainer.appendChild(dayGroup);
        formContainer.appendChild(capacityGroup);
        formContainer.appendChild(saveBtn);
        
        // Create route list container
        const routeListContainer = document.createElement('div');
        routeListContainer.className = 'route-list-container';
        
        const routeListHeader = document.createElement('h4');
        routeListHeader.textContent = 'Route Assignments';
        
        const routeAssignmentsList = document.createElement('div');
        routeAssignmentsList.id = 'routeAssignmentsList';
        
        routeListContainer.appendChild(routeListHeader);
        routeListContainer.appendChild(routeAssignmentsList);
        
        // Append all elements to capacity section
        capacitySection.appendChild(header);
        capacitySection.appendChild(formContainer);
        capacitySection.appendChild(routeListContainer);
        
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
                        const sanitizer = window.MealMap.sanitizer || { escapeHTML: str => str };
                        const safeDay = sanitizer.escapeHTML(day);
                        window.MealMap.showToast(`Default capacity for ${safeDay} updated to ${capacity}`, 'success');
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
        
        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const headers = ['Van', 'Route Name', 'Driver', 'Capacity', 'Actions'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        // Add rows for each assignment
        Object.entries(assignments).forEach(([van, data]) => {
            const tr = document.createElement('tr');
            
            // Create cells for data
            const vanCell = document.createElement('td');
            vanCell.textContent = van;
            
            const nameCell = document.createElement('td');
            nameCell.textContent = data.name;
            
            const driverCell = document.createElement('td');
            driverCell.textContent = data.driver;
            
            const capacityCell = document.createElement('td');
            capacityCell.textContent = data.capacity;
            
            // Create actions cell with edit button
            const actionsCell = document.createElement('td');
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-route-assignment';
            editBtn.dataset.van = van;
            editBtn.dataset.day = day;
            
            const editIcon = document.createElement('i');
            editIcon.className = 'fas fa-edit';
            editBtn.appendChild(editIcon);
            
            actionsCell.appendChild(editBtn);
            
            // Add all cells to the row
            tr.appendChild(vanCell);
            tr.appendChild(nameCell);
            tr.appendChild(driverCell);
            tr.appendChild(capacityCell);
            tr.appendChild(actionsCell);
            
            tbody.appendChild(tr);
            
            // Add event listener to edit button
            editBtn.addEventListener('click', () => {
                editRouteAssignment(day, van);
            });
        });
        
        table.appendChild(tbody);
        container.appendChild(table);
    }
    
    // Edit route assignment
    function editRouteAssignment(day, van) {
        if (!window.MealMap || !window.MealMap.routeAssignments) return;
        
        // Get assignment data
        const assignment = window.MealMap.routeAssignments.getRouteAssignment(day, van);
        if (!assignment) return;
        
        const sanitizer = window.MealMap.sanitizer || { escapeHTML: str => str };
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'route-edit-modal';
        
        // Create modal content container
        const modalContent = document.createElement('div');
        modalContent.className = 'route-edit-content';
        
        // Create header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'route-edit-header';
        
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = 'Edit Route Assignment';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-route-edit';
        closeBtn.textContent = '×';
        
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeBtn);
        
        // Create body
        const modalBody = document.createElement('div');
        modalBody.className = 'route-edit-body';
        
        // Create form fields
        const createFormGroup = (id, label, value, disabled = false) => {
            const group = document.createElement('div');
            group.className = 'input-group';
            
            const labelEl = document.createElement('label');
            labelEl.setAttribute('for', id);
            labelEl.textContent = label;
            
            const input = document.createElement('input');
            input.type = id.includes('Capacity') ? 'number' : 'text';
            input.id = id;
            input.value = sanitizer.escapeHTML(value.toString());
            
            if (disabled) {
                input.disabled = true;
            }
            
            if (id.includes('Capacity')) {
                input.min = '1';
                input.max = '100';
            }
            
            group.appendChild(labelEl);
            group.appendChild(input);
            return group;
        };
        
        // Add form fields
        modalBody.appendChild(createFormGroup('editRouteVan', 'Van', van, true));
        modalBody.appendChild(createFormGroup('editRouteDay', 'Day', day, true));
        modalBody.appendChild(createFormGroup('editRouteName', 'Route Name', assignment.name));
        modalBody.appendChild(createFormGroup('editRouteDriver', 'Driver', assignment.driver));
        modalBody.appendChild(createFormGroup('editRouteCapacity', 'Capacity', assignment.capacity));
        
        // Create footer
        const modalFooter = document.createElement('div');
        modalFooter.className = 'route-edit-footer';
        
        const saveBtn = document.createElement('button');
        saveBtn.id = 'saveRouteAssignmentBtn';
        saveBtn.className = 'save-btn';
        saveBtn.textContent = 'Save Changes';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel-route-edit cancel-btn';
        cancelBtn.textContent = 'Cancel';
        
        modalFooter.appendChild(saveBtn);
        modalFooter.appendChild(cancelBtn);
        
        // Assemble modal
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modal.appendChild(modalContent);
        
        // Add modal to body
        document.body.appendChild(modal);
        
        // Add event listeners
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
                    const safeVan = sanitizer.escapeHTML(van);
                    const safeDay = sanitizer.escapeHTML(day);
                    window.MealMap.showToast(`Route assignment updated for ${safeVan} on ${safeDay}`, 'success');
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