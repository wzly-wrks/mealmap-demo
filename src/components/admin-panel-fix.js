// Fix for Admin Panel Navigation
(function() {
    // Function to initialize admin panel navigation
    function fixAdminPanelNavigation() {
        console.log("Fixing admin panel navigation...");
        
        // Get all navigation buttons and content sections
        const navButtons = document.querySelectorAll('.admin-nav-btn');
        const contentSections = document.querySelectorAll('.admin-content-section');
        
        console.log(`Found ${navButtons.length} nav buttons and ${contentSections.length} content sections`);
        
        if (!navButtons.length || !contentSections.length) return;
        
        // Make sure the first section is visible by default
        if (contentSections.length > 0) {
            contentSections[0].style.display = 'block';
        }
        
        // Make sure the first button is active by default
        if (navButtons.length > 0) {
            navButtons[0].classList.add('active');
        }
        
        // Add click event listeners to navigation buttons
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log(`Clicked on ${btn.id}`);
                
                // Remove active class from all buttons
                navButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Hide all content sections
                contentSections.forEach(section => {
                    section.style.display = 'none';
                });
                
                // Show the corresponding content section
                const sectionId = btn.id.replace('nav', '') + 'Section';
                const section = document.getElementById(sectionId);
                console.log(`Looking for section ${sectionId}: ${section ? 'found' : 'not found'}`);
                
                if (section) {
                    section.style.display = 'block';
                }
            });
        });
        
        // Initialize walkthrough reset button
        initWalkthroughReset();
    }
    
    // Reset walkthrough
    function initWalkthroughReset() {
        const resetBtn = document.getElementById('resetWalkthroughBtn');
        if (!resetBtn) return;
        
        resetBtn.addEventListener('click', () => {
            try {
                // Reset walkthrough preferences
                const preferences = JSON.parse(localStorage.getItem('mealMapPreferences')) || {};
                preferences.walkthroughDismissed = false;
                preferences.showWalkthrough = true;
                localStorage.setItem('mealMapPreferences', JSON.stringify(preferences));
                
                // Show success message
                if (window.MealMap && typeof window.MealMap.showToast === 'function') {
                    window.MealMap.showToast('Walkthrough has been reset', 'success');
                } else {
                    alert('Walkthrough has been reset');
                }
            } catch (err) {
                console.error('Failed to reset walkthrough:', err);
                if (window.MealMap && typeof window.MealMap.showToast === 'function') {
                    window.MealMap.showToast('Failed to reset walkthrough', 'error');
                } else {
                    alert('Failed to reset walkthrough');
                }
            }
        });
    }
    
    // Fix for admin panel login
    function fixAdminPanelLogin() {
        const adminBtn = document.getElementById('adminPanelButton');
        const adminModal = document.getElementById('adminPanel');
        const closeBtn = adminModal?.querySelector('.close');
        
        if (adminBtn && adminModal) {
            // Remove existing click event listeners
            const newAdminBtn = adminBtn.cloneNode(true);
            adminBtn.parentNode.replaceChild(newAdminBtn, adminBtn);
            
            // Add new click event listener
            newAdminBtn.addEventListener('click', () => {
                // If already in admin mode, toggle back to user mode
                if (window.userInterface && !window.userInterface.isUserMode) {
                    if (window.MealMap && typeof window.MealMap.setUserMode === 'function') {
                        window.MealMap.setUserMode(true);
                        if (typeof showModeIndicator === 'function') {
                            showModeIndicator('Switched to View-Only Mode', false);
                        }
                    }
                    return;
                }
                
                // Otherwise show admin login modal
                adminModal.style.display = 'block';
                adminModal.classList.add('animate__fadeInDown');
                
                // Make sure the login form is visible and admin controls are hidden
                const loginSection = document.getElementById('adminLogin');
                const controlsSection = document.getElementById('adminControls');
                
                if (loginSection && controlsSection) {
                    loginSection.style.display = 'block';
                    controlsSection.style.display = 'none';
                }
            });
        }
        
        if (closeBtn) {
            // Remove existing click event listeners
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            
            // Add new click event listener
            newCloseBtn.addEventListener('click', () => {
                adminModal.style.display = 'none';
                adminModal.classList.remove('animate__fadeInDown');
            });
        }
    }
    
    // Fix for exit admin mode button
    function fixExitAdminModeButton() {
        const exitBtn = document.getElementById('exitAdminModeButton');
        if (!exitBtn) return;
        
        // Remove existing click event listeners
        const newExitBtn = exitBtn.cloneNode(true);
        exitBtn.parentNode.replaceChild(newExitBtn, exitBtn);
        
        // Add new click event listener
        newExitBtn.addEventListener('click', () => {
            if (window.MealMap && typeof window.MealMap.setUserMode === 'function') {
                window.MealMap.setUserMode(true);
                if (typeof showModeIndicator === 'function') {
                    showModeIndicator('Switched to View-Only Mode', false);
                } else if (window.MealMap && typeof window.MealMap.showToast === 'function') {
                    window.MealMap.showToast('Switched to View-Only Mode', 'info');
                }
            }
        });
    }
    
    // Apply all fixes when the DOM is loaded
    function applyAllFixes() {
        console.log("Applying admin panel fixes...");
        fixAdminPanelNavigation();
        fixAdminPanelLogin();
        fixExitAdminModeButton();
    }
    
    // Add to window.MealMap object
    window.MealMap = window.MealMap || {};
    window.MealMap.fixAdminPanel = applyAllFixes;
    
    // Apply fixes when the DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyAllFixes);
    } else {
        applyAllFixes();
    }
})();