// Admin Panel Navigation
function initAdminPanelNavigation() {
    const navButtons = document.querySelectorAll('.admin-nav-btn');
    const contentSections = document.querySelectorAll('.admin-content-section');
    
    if (!navButtons.length || !contentSections.length) return;
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
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
    
    // Initialize FAQ editor
    const editFaqBtn = document.getElementById('editFaqBtn');
    if (editFaqBtn) {
        editFaqBtn.addEventListener('click', () => {
            if (window.MealMap && typeof window.MealMap.showToast === 'function') {
                window.MealMap.showToast('FAQ editor not implemented yet', 'info');
            } else {
                alert('FAQ editor not implemented yet');
            }
        });
    }
}

// Add to window.MealMap object when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.MealMap = window.MealMap || {};
    window.MealMap.initAdminPanelNavigation = initAdminPanelNavigation;
});