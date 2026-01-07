// Courses page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadCourses();
    setupFilters();
    setupSearch();
});

async function loadCourses() {
    try {
        const response = await apiService.getCourses();
        if (response.success) {
            renderCourses(response.courses);
        }
    } catch (error) {
        console.error('Failed to load courses:', error);
    }
}

function renderCourses(courses) {
    const container = document.getElementById('courses-container');
    if (!container) return;

    container.innerHTML = courses.map(course => `
        <div class="course-card">
            <h3>${course.title}</h3>
            <p>${course.code} - ${course.instructor?.username || 'Instructor'}</p>
            <p>${course.description?.substring(0, 100)}...</p>
            <button onclick="enrollCourse('${course._id}')" class="btn btn-primary">
                Enroll Now
            </button>
        </div>
    `).join('');
}

function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterCourses(filter);
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('course-search');
    searchInput.addEventListener('input', function() {
        searchCourses(this.value);
    });
}

async function enrollCourse(courseId) {
    try {
        const response = await apiService.enrollCourse(courseId);
        if (response.success) {
            studentPortal.showToast('Successfully enrolled!', 'success');
            loadCourses(); // Refresh list
        }
    } catch (error) {
        studentPortal.showToast('Failed to enroll', 'error');
    }
}