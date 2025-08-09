// User Interface Enhancements for Meal Map
// This file contains user-facing features including:
// - Enhanced pin drop information window
// - User/Admin mode toggle
// - Interactive walkthrough
// - FAQ section

// Global settings for user interface
const userInterface = {
    isUserMode: true,           // Default to user mode
    showWalkthrough: true,      // Show walkthrough by default
    walkthroughStep: 0,         // Current step in walkthrough
    walkthroughDismissed: false, // Whether walkthrough has been dismissed
    searchMarker: null,         // Current search marker
    searchPopup: null,          // Current search popup
};

// Initialize user interface enhancements
function initUserInterface() {
    // Check localStorage for user preferences
    loadUserPreferences();
    
    // Initialize walkthrough if enabled
    if (userInterface.showWalkthrough && !userInterface.walkthroughDismissed) {
        initWalkthrough();
    }
    
    // Initialize FAQ section (but don't show it automatically)
    initFAQ();
    
    // Set initial mode
    setUserMode(userInterface.isUserMode);
    
    // Add FAQ button to the left side
    addHelpButton();
    
    // Initialize password management
    initPasswordManagement();
}

// Load user preferences from localStorage
function loadUserPreferences() {
    try {
        const preferences = JSON.parse(localStorage.getItem('mealMapPreferences')) || {};
        userInterface.isUserMode = preferences.isUserMode !== false; // Default to true
        userInterface.showWalkthrough = preferences.showWalkthrough !== false; // Default to true
        userInterface.walkthroughDismissed = preferences.walkthroughDismissed === true; // Default to false
    } catch (err) {
        console.error('Failed to load user preferences:', err);
        // Use defaults if preferences can't be loaded
    }
}

// Save user preferences to localStorage
function saveUserPreferences() {
    try {
        const preferences = {
            isUserMode: userInterface.isUserMode,
            showWalkthrough: userInterface.showWalkthrough,
            walkthroughDismissed: userInterface.walkthroughDismissed
        };
        localStorage.setItem('mealMapPreferences', JSON.stringify(preferences));
    } catch (err) {
        console.error('Failed to save user preferences:', err);
    }
}

// Set user mode (true) or admin mode (false)
function setUserMode(isUserMode) {
    userInterface.isUserMode = isUserMode;
    
    // Update UI based on mode
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => {
        el.style.display = isUserMode ? 'none' : '';
    });
    
    // Show/hide FAQ based on mode
    const faqSection = document.getElementById('faqSection');
    if (faqSection) {
        faqSection.style.display = isUserMode ? '' : 'none';
    }
    
    // Update admin button
    const adminBtn = document.getElementById('adminPanelButton');
    if (adminBtn) {
        adminBtn.innerHTML = isUserMode ? '<i class="fas fa-lock"></i>' : '<i class="fas fa-unlock"></i>';
        adminBtn.title = isUserMode ? 'Admin Login' : 'Admin Mode Active';
    }
    
    // Hide draw controls in user mode
    if (globals.map && globals.draw) {
        try {
            // First try to remove the control if it exists
            if (globals.map._controls) {
                const hasDrawControl = globals.map._controls.some(control => control instanceof MapboxDraw);
                
                if (hasDrawControl && isUserMode) {
                    globals.map.removeControl(globals.draw);
                } else if (!hasDrawControl && !isUserMode) {
                    globals.map.addControl(globals.draw);
                }
            }
        } catch (err) {
            console.error('Error toggling draw controls:', err);
        }
    }
    
    // Save preference
    saveUserPreferences();
}

// Enhanced address search with custom popup
function enhancedSearchAddress() {
    const address = document.getElementById('addressSearch').value;
    const resultDiv = document.getElementById('searchResult');
    
    if (!address) {
        resultDiv.textContent = 'Please enter an address';
        return;
    }

    resultDiv.textContent = 'Searching...';
    
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}`;

    fetch(url)
        .then(resp => resp.json())
        .then(data => {
            if (data.features && data.features.length) {
                const [lng, lat] = data.features[0].center;
                
                // Remove previous marker and popup if they exist
                if (userInterface.searchMarker) {
                    userInterface.searchMarker.remove();
                }
                if (userInterface.searchPopup) {
                    userInterface.searchPopup.remove();
                }
                
                // Create a new marker
                userInterface.searchMarker = new mapboxgl.Marker({
                    color: '#e74c3c'
                })
                .setLngLat([lng, lat])
                .addTo(globals.map);
                
                // Fly to the location
                globals.map.flyTo({
                    center: [lng, lat],
                    zoom: 14
                });
                
                // Check if the point is within any route
                const pt = turf.point([lng, lat]);
                const match = globals.currentRoutes.find(r => {
                    const poly = turf.polygon([r.path.map(p => [p.lng, p.lat])]);
                    return turf.booleanPointInPolygon(pt, poly);
                });
                
                // Create popup content
                let popupContent;
                
                if (match) {
                    // Get route name from the mapping or use the route name
                    const routeName = globals.routeNamesByDay[globals.currentDay][match.vanNumber] || match.name;
                    
                    popupContent = `
                        <div class="address-popup">
                            <h3>Route Information</h3>
                            <p><strong>Route:</strong> ${routeName}</p>
                            <p><strong>Day:</strong> ${globals.currentDay}</p>
                            <button class="close-popup-btn"><i class="fas fa-times"></i></button>
                        </div>
                    `;
                    
                    resultDiv.textContent = `${data.features[0].place_name} – Route: ${routeName} (${globals.currentDay})`;
                } else {
                    popupContent = `
                        <div class="address-popup">
                            <h3>No Route Available</h3>
                            <p>There is no delivery route for this location on ${globals.currentDay}.</p>
                            <button class="close-popup-btn"><i class="fas fa-times"></i></button>
                        </div>
                    `;
                    
                    resultDiv.textContent = `${data.features[0].place_name} – No route available for ${globals.currentDay}`;
                }
                
                // Create and add the popup
                userInterface.searchPopup = new mapboxgl.Popup({
                    closeButton: false,
                    className: 'route-info-popup'
                })
                .setLngLat([lng, lat])
                .setHTML(popupContent)
                .addTo(globals.map);
                
                // Add event listener to close button
                setTimeout(() => {
                    const closeBtn = document.querySelector('.close-popup-btn');
                    if (closeBtn) {
                        closeBtn.addEventListener('click', () => {
                            userInterface.searchPopup.remove();
                        });
                    }
                }, 100);
                
            } else {
                resultDiv.textContent = 'Address not found.';
            }
        })
        .catch(err => {
            console.error('Geocoding error:', err);
            resultDiv.textContent = 'Error searching address';
        });
}

// Add FAQ button to the left side near map name
function addHelpButton() {
    // Create FAQ button in the title wrapper instead of controls
    const titleWrapper = document.querySelector('.title-wrapper');
    if (!titleWrapper) return;
    
    const faqButton = document.createElement('button');
    faqButton.id = 'faqButton';
    faqButton.className = 'faq-btn';
    faqButton.title = 'Frequently Asked Questions';
    faqButton.textContent = 'FAQ';
    
    faqButton.addEventListener('click', toggleHelpResources);
    
    // Add the button after the subtitle
    titleWrapper.appendChild(faqButton);
}

// Toggle help resources (FAQ only)
function toggleHelpResources() {
    const faqSection = document.getElementById('faqSection');
    
    if (faqSection && faqSection.style.display !== 'none') {
        // FAQ is visible, hide it
        faqSection.style.display = 'none';
    } else if (faqSection) {
        // Show FAQ
        faqSection.style.display = '';
    } else {
        // Create FAQ if it doesn't exist
        createFAQSection();
        document.getElementById('faqSection').style.display = '';
    }
}

// Initialize walkthrough
function initWalkthrough() {
    // Create walkthrough elements if they don't exist
    if (!document.getElementById('tour-overlay')) {
        createWalkthroughElements();
    }
    
    // Start the walkthrough
    showWalkthroughStep(0);
}

// Create walkthrough elements
function createWalkthroughElements() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'tour-overlay';
    document.body.appendChild(overlay);
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.id = 'tour-tooltip';
    tooltip.innerHTML = `
        <h3 id="tour-title">Welcome to Meal Map</h3>
        <div id="tour-content"></div>
        <div id="tour-buttons">
            <button id="tour-skip">Skip Tour</button>
            <div>
                <button id="tour-prev" style="display:none">Previous</button>
                <button id="tour-next">Next</button>
            </div>
        </div>
    `;
    document.body.appendChild(tooltip);
    
    // Add event listeners
    document.getElementById('tour-skip').addEventListener('click', skipWalkthrough);
    document.getElementById('tour-prev').addEventListener('click', () => {
        showWalkthroughStep(userInterface.walkthroughStep - 1);
    });
    document.getElementById('tour-next').addEventListener('click', () => {
        showWalkthroughStep(userInterface.walkthroughStep + 1);
    });
}

// Define walkthrough steps
const walkthroughSteps = [
    {
        title: "Welcome to Meal Map",
        content: "This guide will help you learn how to use the Meal Map application. Click 'Next' to continue or 'Skip Tour' to exit.",
        target: null,
        position: "center"
    },
    {
        title: "Select a Day",
        content: "Start by selecting a delivery day. This will show all routes available on that day.",
        target: ".day-selector",
        position: "right"
    },
    {
        title: "Search for an Address",
        content: "Enter an address to see if it's on a delivery route. The map will show you the location and which route serves it.",
        target: ".search-container",
        position: "right"
    },
    {
        title: "View Route Information",
        content: "When you search for an address, a pin will drop on the map. A popup will show you the route name and delivery day, or tell you if no route is available.",
        target: "#map",
        position: "left"
    },
    {
        title: "Close Popup",
        content: "You can close the popup by clicking the X button, but the pin will remain on the map for reference.",
        target: "#map",
        position: "left"
    },
    {
        title: "Get Help Anytime",
        content: "Click the help button in the top right corner to see this walkthrough again or view the FAQ section.",
        target: "#helpButton",
        position: "left"
    },
    {
        title: "You're Ready!",
        content: "You now know how to use the Meal Map. Click 'Finish' to start using the application.",
        target: null,
        position: "center"
    }
];

// Show walkthrough step
function showWalkthroughStep(stepIndex) {
    // Validate step index
    if (stepIndex < 0 || stepIndex >= walkthroughSteps.length) {
        endWalkthrough();
        return;
    }
    
    // Update current step
    userInterface.walkthroughStep = stepIndex;
    
    const step = walkthroughSteps[stepIndex];
    const overlay = document.getElementById('tour-overlay');
    const tooltip = document.getElementById('tour-tooltip');
    
    // Update tooltip content
    document.getElementById('tour-title').textContent = step.title;
    document.getElementById('tour-content').textContent = step.content;
    
    // Update buttons
    const prevBtn = document.getElementById('tour-prev');
    const nextBtn = document.getElementById('tour-next');
    
    prevBtn.style.display = stepIndex > 0 ? '' : 'none';
    nextBtn.textContent = stepIndex === walkthroughSteps.length - 1 ? 'Finish' : 'Next';
    
    // Position tooltip
    if (step.target) {
        const targetEl = document.querySelector(step.target);
        if (targetEl) {
            // Add highlight class to target
            targetEl.classList.add('tour-highlight');
            
            // Position tooltip relative to target
            const rect = targetEl.getBoundingClientRect();
            
            // Set overlay highlight
            overlay.classList.add('with-highlight');
            overlay.style.setProperty('--highlight-top', `${rect.top}px`);
            overlay.style.setProperty('--highlight-left', `${rect.left}px`);
            overlay.style.setProperty('--highlight-width', `${rect.width}px`);
            overlay.style.setProperty('--highlight-height', `${rect.height}px`);
            
            // Position tooltip based on position property
            switch (step.position) {
                case 'right':
                    tooltip.style.top = `${rect.top + rect.height/2 - tooltip.offsetHeight/2}px`;
                    tooltip.style.left = `${rect.right + 20}px`;
                    break;
                case 'left':
                    tooltip.style.top = `${rect.top + rect.height/2 - tooltip.offsetHeight/2}px`;
                    tooltip.style.left = `${rect.left - tooltip.offsetWidth - 20}px`;
                    break;
                case 'top':
                    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 20}px`;
                    tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
                    break;
                case 'bottom':
                    tooltip.style.top = `${rect.bottom + 20}px`;
                    tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
                    break;
            }
        }
    } else {
        // Center tooltip for steps without a target
        overlay.classList.remove('with-highlight');
        tooltip.style.top = '50%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translate(-50%, -50%)';
    }
    
    // Show overlay and tooltip
    overlay.style.display = 'block';
    tooltip.style.display = 'block';
    
    // Remove highlight from all elements
    document.querySelectorAll('.tour-highlight').forEach(el => {
        if (el !== document.querySelector(step.target)) {
            el.classList.remove('tour-highlight');
        }
    });
}

// Skip walkthrough
function skipWalkthrough() {
    userInterface.walkthroughDismissed = true;
    saveUserPreferences();
    endWalkthrough();
}

// End walkthrough
function endWalkthrough() {
    const overlay = document.getElementById('tour-overlay');
    const tooltip = document.getElementById('tour-tooltip');
    
    if (overlay) overlay.style.display = 'none';
    if (tooltip) tooltip.style.display = 'none';
    
    // Remove highlight from all elements
    document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
    });
}

// Initialize FAQ section
function initFAQ() {
    // Create FAQ section if it doesn't exist
    if (!document.getElementById('faqSection')) {
        createFAQSection();
    }
}

// Create FAQ section
function createFAQSection() {
    const faqSection = document.createElement('div');
    faqSection.id = 'faqSection';
    faqSection.className = 'faq-section';
    
    faqSection.innerHTML = `
        <div class="faq-header">
            <h2><i class="fas fa-question-circle"></i> Frequently Asked Questions</h2>
            <button id="closeFAQ" class="close-btn"><i class="fas fa-times"></i></button>
        </div>
        <div class="faq-content">
            <div class="faq-item">
                <div class="faq-question">
                    <h3>How do I check if an address is on a delivery route?</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>Enter the address in the search box and click the search button. A pin will drop on the map showing the location. A popup will appear showing the route name and delivery day if available, or "No route available" if the address is not on a delivery route.</p>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <h3>How do I change the delivery day?</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>Click on one of the day buttons at the top of the sidebar. The map will update to show routes for the selected day.</p>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <h3>What do the colors on the map mean?</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>Each route is displayed in a different color. Blue areas are standard delivery routes, while red areas indicate restricted zones with special delivery requirements.</p>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <h3>How do I close the popup but keep the pin on the map?</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>Click the X button in the top-right corner of the popup. The popup will close, but the pin will remain on the map for reference.</p>
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question">
                    <h3>How do I see the walkthrough guide again?</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>Click the help button (question mark icon) in the top-right corner of the screen to start the walkthrough guide again.</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(faqSection);
    
    // Add event listeners
    document.getElementById('closeFAQ').addEventListener('click', () => {
        faqSection.style.display = 'none';
    });
    
    // Add click handlers for FAQ items
    const faqItems = document.querySelectorAll('.faq-question');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.nextElementSibling;
            const icon = item.querySelector('i');
            
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                icon.className = 'fas fa-chevron-down';
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.className = 'fas fa-chevron-up';
            }
        });
    });
    
    // Initially hide FAQ
    faqSection.style.display = 'none';
}

// Password management functionality
function initPasswordManagement() {
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (!changePasswordBtn) return;
    
    changePasswordBtn.addEventListener('click', changeAdminPassword);
}

// Change admin password
function changeAdminPassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
        showToast('Please fill in all password fields', 'error');
        return;
    }
    
    // Check if current password is correct
    if (currentPassword !== 'angel2025') {
        showToast('Current password is incorrect', 'error');
        return;
    }
    
    // Check if new passwords match
    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
    }
    
    // Check password strength
    if (newPassword.length < 8) {
        showToast('New password must be at least 8 characters long', 'error');
        return;
    }
    
    // Store new password in localStorage
    try {
        localStorage.setItem('adminPassword', newPassword);
        showToast('Password changed successfully', 'success');
        
        // Clear password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    } catch (err) {
        console.error('Failed to save new password:', err);
        showToast('Failed to change password', 'error');
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Make the toast visible
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.pointerEvents = 'auto';
    }, 10);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}

// Add to window.MealMap object
window.MealMap = window.MealMap || {};
window.MealMap.initUserInterface = initUserInterface;
window.MealMap.enhancedSearchAddress = enhancedSearchAddress;
window.MealMap.setUserMode = setUserMode;
window.MealMap.toggleHelpResources = toggleHelpResources;
window.MealMap.initPasswordManagement = initPasswordManagement;