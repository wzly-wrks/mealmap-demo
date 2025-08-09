/**
 * UI Manager Module
 * 
 * This module handles UI interactions, theme switching, and notifications.
 * 
 * @module ui-manager
 */

(function() {
  // UI state
  const state = {
    darkMode: false,
    sidebarOpen: true,
    activeTab: 'routes'
  };
  
  /**
   * Initialize UI manager
   */
  function init() {
    // Load saved state
    loadState();
    
    // Initialize theme
    initTheme();
    
    // Initialize sidebar
    initSidebar();
    
    // Initialize tabs
    initTabs();
    
    // Initialize toast notifications
    initToasts();
    
    console.log('UI manager initialized');
  }
  
  /**
   * Load saved state from localStorage
   */
  function loadState() {
    try {
      const savedState = JSON.parse(localStorage.getItem('uiState') || '{}');
      
      // Apply saved state
      if (savedState.hasOwnProperty('darkMode')) {
        state.darkMode = savedState.darkMode;
      }
      
      if (savedState.hasOwnProperty('sidebarOpen')) {
        state.sidebarOpen = savedState.sidebarOpen;
      }
      
      if (savedState.hasOwnProperty('activeTab')) {
        state.activeTab = savedState.activeTab;
      }
    } catch (err) {
      console.error('Failed to load UI state from localStorage:', err);
    }
  }
  
  /**
   * Save current state to localStorage
   */
  function saveState() {
    try {
      localStorage.setItem('uiState', JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save UI state to localStorage:', err);
    }
  }
  
  /**
   * Initialize theme
   */
  function initTheme() {
    // Apply current theme
    applyTheme();
    
    // Add theme toggle event listener
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
      
      // Update toggle button state
      updateThemeToggle();
    }
  }
  
  /**
   * Apply the current theme
   */
  function applyTheme() {
    if (state.darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }
  
  /**
   * Update theme toggle button
   */
  function updateThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    if (!icon) return;
    
    if (state.darkMode) {
      icon.className = 'fas fa-sun';
      themeToggle.setAttribute('title', 'Switch to Light Mode');
    } else {
      icon.className = 'fas fa-moon';
      themeToggle.setAttribute('title', 'Switch to Dark Mode');
    }
  }
  
  /**
   * Toggle between light and dark theme
   */
  function toggleTheme() {
    state.darkMode = !state.darkMode;
    
    // Apply theme
    applyTheme();
    
    // Update toggle button
    updateThemeToggle();
    
    // Save state
    saveState();
    
    // Show toast notification
    showToast(`Switched to ${state.darkMode ? 'Dark' : 'Light'} Mode`, 'info');
  }
  
  /**
   * Initialize sidebar
   */
  function initSidebar() {
    // Apply current sidebar state
    applySidebarState();
    
    // Add sidebar toggle event listener
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', toggleSidebar);
    }
  }
  
  /**
   * Apply the current sidebar state
   */
  function applySidebarState() {
    const sidebar = document.getElementById('sidebar');
    const mapContainer = document.getElementById('mapContainer');
    
    if (!sidebar || !mapContainer) return;
    
    if (state.sidebarOpen) {
      sidebar.classList.remove('collapsed');
      mapContainer.classList.remove('expanded');
    } else {
      sidebar.classList.add('collapsed');
      mapContainer.classList.add('expanded');
    }
  }
  
  /**
   * Toggle sidebar visibility
   */
  function toggleSidebar() {
    state.sidebarOpen = !state.sidebarOpen;
    
    // Apply sidebar state
    applySidebarState();
    
    // Save state
    saveState();
  }
  
  /**
   * Initialize tabs
   */
  function initTabs() {
    // Get all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    
    // Add click event listeners
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        if (tabId) {
          switchTab(tabId);
        }
      });
    });
    
    // Set active tab
    switchTab(state.activeTab, false);
  }
  
  /**
   * Switch to a different tab
   * 
   * @param {string} tabId - The ID of the tab to switch to
   * @param {boolean} saveToState - Whether to save the tab change to state
   */
  function switchTab(tabId, saveToState = true) {
    // Get all tab buttons and content
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Deactivate all tabs
    tabButtons.forEach(button => {
      button.classList.remove('active');
    });
    
    tabContents.forEach(content => {
      content.classList.remove('active');
    });
    
    // Activate the selected tab
    const selectedButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    const selectedContent = document.getElementById(`${tabId}Tab`);
    
    if (selectedButton) {
      selectedButton.classList.add('active');
    }
    
    if (selectedContent) {
      selectedContent.classList.add('active');
    }
    
    // Update state
    if (saveToState) {
      state.activeTab = tabId;
      saveState();
    }
  }
  
  /**
   * Initialize toast notifications
   */
  function initToasts() {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toastContainer');
    
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastContainer';
      document.body.appendChild(toastContainer);
    }
  }
  
  /**
   * Show a toast notification
   * 
   * @param {string} message - The message to display
   * @param {string} type - The type of notification (success, error, warning, info)
   * @param {number} duration - How long to show the notification in milliseconds
   */
  function showToast(message, type = 'info', duration = 3000) {
    // Get toast container
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Use sanitizer if available
    const sanitizer = window.MealMap && window.MealMap.sanitizer ? 
      window.MealMap.sanitizer : { escapeHTML: str => str };
    
    // Set toast content
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fas ${getIconForType(type)}"></i>
      </div>
      <div class="toast-content">
        ${sanitizer.escapeHTML(message)}
      </div>
      <button class="toast-close">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Add animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Add close button event
    const closeButton = toast.querySelector('.toast-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        closeToast(toast);
      });
    }
    
    // Auto close after duration
    setTimeout(() => {
      closeToast(toast);
    }, duration);
  }
  
  /**
   * Close a toast notification
   * 
   * @param {HTMLElement} toast - The toast element to close
   */
  function closeToast(toast) {
    // Remove show class
    toast.classList.remove('show');
    
    // Remove element after animation
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }
  
  /**
   * Get icon class for notification type
   * 
   * @param {string} type - The notification type
   * @returns {string} - The icon class
   */
  function getIconForType(type) {
    switch (type) {
      case 'success':
        return 'fa-check-circle';
      case 'error':
        return 'fa-exclamation-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'info':
      default:
        return 'fa-info-circle';
    }
  }
  
  // Export the module
  window.MealMap = window.MealMap || {};
  window.MealMap.uiManager = {
    init,
    toggleTheme,
    toggleSidebar,
    switchTab,
    showToast
  };
})();

export default window.MealMap.uiManager;