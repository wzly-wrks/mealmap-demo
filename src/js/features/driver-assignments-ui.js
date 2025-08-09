// Driver assignments UI management

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

        const vanCell = document.createElement('td');
        vanCell.textContent = van;

        const nameCell = document.createElement('td');
        nameCell.textContent = data.name;

        const driverCell = document.createElement('td');
        driverCell.textContent = data.driver;

        const capacityCell = document.createElement('td');
        capacityCell.textContent = data.capacity;

        const actionsCell = document.createElement('td');
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-route-assignment';
        editBtn.dataset.van = van;
        editBtn.dataset.day = day;

        const editIcon = document.createElement('i');
        editIcon.className = 'fas fa-edit';
        editBtn.appendChild(editIcon);

        actionsCell.appendChild(editBtn);

        tr.appendChild(vanCell);
        tr.appendChild(nameCell);
        tr.appendChild(driverCell);
        tr.appendChild(capacityCell);
        tr.appendChild(actionsCell);

        tbody.appendChild(tr);

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

    const modalContent = document.createElement('div');
    modalContent.className = 'route-edit-content';

    const modalHeader = document.createElement('div');
    modalHeader.className = 'route-edit-header';

    const modalTitle = document.createElement('h3');
    modalTitle.textContent = 'Edit Route Assignment';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-route-edit';
    closeBtn.textContent = '\u00d7';

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeBtn);

    const modalBody = document.createElement('div');
    modalBody.className = 'route-edit-body';

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

    modalBody.appendChild(createFormGroup('editRouteVan', 'Van', van, true));
    modalBody.appendChild(createFormGroup('editRouteDay', 'Day', day, true));
    modalBody.appendChild(createFormGroup('editRouteName', 'Route Name', assignment.name));
    modalBody.appendChild(createFormGroup('editRouteDriver', 'Driver', assignment.driver));
    modalBody.appendChild(createFormGroup('editRouteCapacity', 'Capacity', assignment.capacity));

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

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);

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

            loadRouteAssignments(day);
            closeModal();
        }
    });
}

export { loadRouteAssignments, editRouteAssignment };
