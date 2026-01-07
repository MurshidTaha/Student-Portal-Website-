// Dashboard specific functionality
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
    loadRecentActivities();
    loadUpcomingAssignments();
});

async function loadDashboardStats() {
    try {
        const response = await apiService.getDashboardStats();
        if (response.success) {
            document.getElementById('enrolled-courses').textContent = response.stats.courses;
            document.getElementById('pending-assignments').textContent = response.stats.assignments;
            document.getElementById('average-grade').textContent = response.stats.averageGrade + '%';
            document.getElementById('attendance-rate').textContent = response.stats.attendance + '%';
        }
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
    }
}

async function loadRecentActivities() {
    try {
        const response = await apiService.getRecentActivities();
        if (response.success) {
            const container = document.querySelector('.recent-activities');
            if (container) {
                container.innerHTML = response.activities.map(activity => `
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
        }
    } catch (error) {
        console.error('Failed to load activities:', error);
    }
}

async function loadUpcomingAssignments() {
    try {
        const response = await apiService.getUpcomingAssignments();
        if (response.success) {
            // Update assignments list
        }
    } catch (error) {
        console.error('Failed to load assignments:', error);
    }
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function getActivityIcon(type) {
    const icons = {
        'assignment': 'fa-file-alt',
        'grade': 'fa-chart-line',
        'course': 'fa-book',
        'announcement': 'fa-bullhorn'
    };
    return icons[type] || 'fa-bell';
}