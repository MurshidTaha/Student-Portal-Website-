// main.js - Main application JavaScript

// DOM Ready function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeComponents();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check and update auth status
    checkAuthStatus();
    
    // Initialize tooltips and popovers
    initializeBootstrapComponents();
});

// Initialize all application components
function initializeComponents() {
    // Initialize navigation
    initNavigation();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize course filters if on courses page
    if (document.querySelector('.course-filters')) {
        initCourseFilters();
    }
    
    // Initialize dashboard widgets
    if (document.querySelector('.dashboard-widgets')) {
        initDashboardWidgets();
    }
    
    // Initialize contact form if exists
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        initContactForm(contactForm);
    }
    
    // Initialize file upload handlers
    initFileUpload();
    
    // Initialize notifications
    initNotifications();
}

// Setup global event listeners
function setupEventListeners() {
    // Global click handler for dynamic content
    document.addEventListener('click', function(e) {
        // Handle external links
        if (e.target.matches('a[href^="http"]')) {
            handleExternalLink(e);
        }
        
        // Handle back to top button
        if (e.target.matches('.back-to-top')) {
            e.preventDefault();
            scrollToTop();
        }
    });
    
    // Window resize handler
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            handleResize();
        }, 250);
    });
    
    // Scroll handler for sticky navigation
    window.addEventListener('scroll', function() {
        handleScroll();
    });
    
    // Before unload handler
    window.addEventListener('beforeunload', function() {
        saveUserPreferences();
    });
}

// Navigation initialization
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            document.querySelector('.mobile-menu-overlay').classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenu.classList.remove('active');
                document.querySelector('.mobile-menu-overlay').classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
    
    // Highlight active navigation item
    highlightActiveNavItem();
}

// Highlight active navigation item based on current URL
function highlightActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || 
            (currentPath.includes(linkPath) && linkPath !== '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    if (searchInput && searchButton) {
        // Search on button click
        searchButton.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
        
        // Live search (with debounce)
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value.length >= 3) {
                    performLiveSearch(this.value);
                }
            }, 300);
        });
    }
}

// Perform search
function performSearch(query) {
    if (!query.trim()) {
        showToast('Please enter a search term', 'warning');
        return;
    }
    
    // Store search query for results page
    sessionStorage.setItem('searchQuery', query);
    
    // Redirect to search results page
    window.location.href = `pages/search.html?q=${encodeURIComponent(query)}`;
}

// Perform live search (for suggestions)
function performLiveSearch(query) {
    // In a real application, this would make an API call
    // For now, we'll just show/hide suggestions
    const suggestions = getSearchSuggestions(query);
    showSearchSuggestions(suggestions);
}

// Get search suggestions (mock data)
function getSearchSuggestions(query) {
    // This would normally come from an API
    const suggestions = [
        'Introduction to Programming',
        'Data Structures',
        'Web Development',
        'Database Management',
        'Computer Networks',
        'Software Engineering',
        'Machine Learning',
        'Mobile App Development'
    ];
    
    return suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
}

// Show search suggestions
function showSearchSuggestions(suggestions) {
    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer) return;
    
    // Remove existing suggestions
    const existingSuggestions = searchContainer.querySelector('.search-suggestions');
    if (existingSuggestions) {
        existingSuggestions.remove();
    }
    
    if (suggestions.length === 0) return;
    
    // Create suggestions dropdown
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'search-suggestions';
    suggestionsDiv.style.cssText = `
        position: absolute;
        background: white;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        width: 300px;
        max-height: 300px;
        overflow-y: auto;
    `;
    
    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('a');
        suggestionItem.href = '#';
        suggestionItem.className = 'search-suggestion-item';
        suggestionItem.style.cssText = `
            display: block;
            padding: 10px 15px;
            color: #333;
            text-decoration: none;
            border-bottom: 1px solid #eee;
        `;
        suggestionItem.textContent = suggestion;
        suggestionItem.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.search-input').value = suggestion;
            performSearch(suggestion);
        });
        suggestionsDiv.appendChild(suggestionItem);
    });
    
    searchContainer.appendChild(suggestionsDiv);
    
    // Close suggestions when clicking outside
    document.addEventListener('click', function closeSuggestions(e) {
        if (!searchContainer.contains(e.target)) {
            suggestionsDiv.remove();
            document.removeEventListener('click', closeSuggestions);
        }
    });
}

// Course filters
function initCourseFilters() {
    const filterForm = document.querySelector('.course-filters');
    const filterInputs = filterForm.querySelectorAll('input[type="checkbox"], select');
    
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            applyCourseFilters();
        });
    });
}

function applyCourseFilters() {
    const filters = {
        department: getSelectedValues('department'),
        semester: getSelectedValues('semester'),
        level: getSelectedValues('level')
    };
    
    // In a real application, this would make an API call
    // For now, we'll just show a loading state and simulate
    showLoading();
    
    setTimeout(() => {
        // Simulate API response
        hideLoading();
        updateCourseList(filters);
    }, 500);
}

function getSelectedValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

// Dashboard widgets
function initDashboardWidgets() {
    // Initialize progress bars
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const width = bar.getAttribute('data-progress') || '0';
        bar.style.width = `${width}%`;
        bar.setAttribute('aria-valuenow', width);
    });
    
    // Initialize calendar
    if (document.querySelector('.dashboard-calendar')) {
        initCalendar();
    }
    
    // Load recent activities
    loadRecentActivities();
}

// Calendar initialization
function initCalendar() {
    // Simple calendar implementation
    const calendarEl = document.querySelector('.dashboard-calendar');
    if (!calendarEl) return;
    
    const today = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    
    calendarEl.innerHTML = `
        <div class="calendar-header">
            <button class="btn btn-sm btn-outline-secondary prev-month">
                <i class="fas fa-chevron-left"></i>
            </button>
            <h5>${monthNames[today.getMonth()]} ${today.getFullYear()}</h5>
            <button class="btn btn-sm btn-outline-secondary next-month">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
        <div class="calendar-grid"></div>
    `;
    
    renderCalendar(today);
    
    // Event listeners for month navigation
    calendarEl.querySelector('.prev-month').addEventListener('click', function() {
        today.setMonth(today.getMonth() - 1);
        renderCalendar(today);
    });
    
    calendarEl.querySelector('.next-month').addEventListener('click', function() {
        today.setMonth(today.getMonth() + 1);
        renderCalendar(today);
    });
}

function renderCalendar(date) {
    const calendarGrid = document.querySelector('.calendar-grid');
    if (!calendarGrid) return;
    
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day-header';
        dayEl.textContent = day;
        calendarGrid.appendChild(dayEl);
    });
    
    // Add days
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Empty days before first day
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;
        
        // Check if today
        const currentDate = new Date();
        if (date.getMonth() === currentDate.getMonth() && 
            date.getFullYear() === currentDate.getFullYear() && 
            day === currentDate.getDate()) {
            dayEl.classList.add('today');
        }
        
        calendarGrid.appendChild(dayEl);
    }
}

// Load recent activities
async function loadRecentActivities() {
    try {
        const activities = await apiService.getRecentActivities();
        const container = document.querySelector('.recent-activities');
        
        if (container && activities) {
            container.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas ${getActivityIcon(activity.type)}"></i>
                    </div>
                    <div class="activity-content">
                        <p class="activity-text">${activity.text}</p>
                        <small class="activity-time">${formatTime(activity.timestamp)}</small>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Failed to load activities:', error);
    }
}

function getActivityIcon(type) {
    const icons = {
        'assignment': 'fa-file-alt',
        'grade': 'fa-chart-line',
        'course': 'fa-book',
        'announcement': 'fa-bullhorn',
        'message': 'fa-comment'
    };
    return icons[type] || 'fa-bell';
}

// Contact form
function initContactForm(form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value,
            message: document.getElementById('contactMessage').value
        };
        
        // Validate form
        if (!validateContactForm(formData)) {
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Sending...';
        
        try {
            const result = await apiService.submitContact(formData);
            
            if (result.success) {
                showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
                form.reset();
            } else {
                showToast(result.message || 'Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            showToast('Network error. Please check your connection.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

function validateContactForm(data) {
    if (!data.name.trim()) {
        showToast('Please enter your name', 'warning');
        return false;
    }
    
    if (!validateEmail(data.email)) {
        showToast('Please enter a valid email address', 'warning');
        return false;
    }
    
    if (!data.message.trim()) {
        showToast('Please enter your message', 'warning');
        return false;
    }
    
    return true;
}

// File upload
function initFileUpload() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                validateAndUploadFile(file, this);
            }
        });
    });
}

function validateAndUploadFile(file, input) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 
                         'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (file.size > maxSize) {
        showToast('File size must be less than 10MB', 'error');
        input.value = '';
        return;
    }
    
    if (!allowedTypes.includes(file.type)) {
        showToast('Please upload a valid file type (JPG, PNG, PDF, DOC)', 'error');
        input.value = '';
        return;
    }
    
    // Show upload progress
    showUploadProgress(file.name);
}

// Notifications
function initNotifications() {
    // Check for new notifications
    checkNewNotifications();
    
    // Setup notification polling
    setInterval(checkNewNotifications, 300000); // Every 5 minutes
}

async function checkNewNotifications() {
    if (!authService.isAuthenticated()) return;
    
    try {
        const notifications = await apiService.getNotifications();
        updateNotificationBadge(notifications.filter(n => !n.read).length);
    } catch (error) {
        console.error('Failed to fetch notifications:', error);
    }
}

function updateNotificationBadge(count) {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Utility Functions
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.custom-toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#28a745' : 
                     type === 'error' ? '#dc3545' : 
                     type === 'warning' ? '#ffc107' : '#17a2b8'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1060;
        animation: slideIn 0.3s ease;
    `;
    
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                          type === 'error' ? 'fa-exclamation-circle' : 
                          type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    loader.innerHTML = `
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.querySelector('.loading-overlay');
    if (loader) {
        loader.remove();
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function handleExternalLink(e) {
    // Add target="_blank" and rel="noopener" to external links
    if (!e.target.target) {
        e.target.target = '_blank';
        e.target.rel = 'noopener noreferrer';
    }
}

function handleResize() {
    // Update any responsive elements
    const isMobile = window.innerWidth < 768;
    document.body.classList.toggle('is-mobile', isMobile);
}

function handleScroll() {
    // Sticky navigation
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
}

function saveUserPreferences() {
    // Save user preferences to localStorage
    const preferences = {
        theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light',
        fontSize: document.documentElement.style.fontSize || '16px'
    };
    
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

function checkAuthStatus() {
    if (authService.isAuthenticated()) {
        document.body.classList.add('logged-in');
        
        // Load user data
        loadUserData();
    } else {
        document.body.classList.remove('logged-in');
    }
}

async function loadUserData() {
    try {
        const userData = await apiService.getUserProfile();
        if (userData.success) {
            // Update UI with user data
            updateUserUI(userData.user);
        }
    } catch (error) {
        console.error('Failed to load user data:', error);
    }
}

function updateUserUI(user) {
    // Update user display name
    const userElements = document.querySelectorAll('.user-name, .user-display');
    userElements.forEach(el => {
        el.textContent = user.profile?.fullName || user.username;
    });
    
    // Update user avatar
    const avatarElements = document.querySelectorAll('.user-avatar');
    avatarElements.forEach(el => {
        if (user.profile?.avatar) {
            el.src = user.profile.avatar;
        }
    });
}

// Initialize Bootstrap components
function initializeBootstrapComponents() {
    // Initialize all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize all popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// Animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .navbar.scrolled {
        background: rgba(44, 62, 80, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    }
    
    .back-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1000;
    }
    
    .back-to-top.visible {
        opacity: 1;
    }
    
    .back-to-top:hover {
        background: var(--secondary-color);
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);

// Export for use in other modules
window.studentPortal = {
    showToast,
    showLoading,
    hideLoading,
    validateEmail,
    scrollToTop
};