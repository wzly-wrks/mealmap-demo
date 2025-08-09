import { loadRouteAssignments } from './driver-assignments-ui';

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

export { createRouteCapacityUI, initCapacityManagement };
