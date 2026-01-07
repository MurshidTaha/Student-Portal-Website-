// API Service Module
class ApiService {
    constructor() {
        this.baseUrl = 'http://localhost:5000/api';
        this.authService = authService;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.authService.isAuthenticated()) {
            headers['Authorization'] = `Bearer ${this.authService.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle 401 Unauthorized
                if (response.status === 401) {
                    this.authService.logout();
                    window.location.href = '/login.html';
                    return null;
                }
                
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // Course endpoints
    async getCourses(filters = {}) {
        const query = new URLSearchParams(filters).toString();
        return this.request(`/courses?${query}`);
    }

    async getCourse(id) {
        return this.request(`/courses/${id}`);
    }

    async enrollCourse(courseId) {
        return this.request(`/courses/${courseId}/enroll`, {
            method: 'POST'
        });
    }

    // Contact endpoints
    async submitContact(formData) {
        return this.request('/contact/submit', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
    }

    // User endpoints
    async getUserProfile() {
        return this.request('/auth/profile');
    }

    async updateUserProfile(profileData) {
        return this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    // Assignment endpoints
    async submitAssignment(courseId, assignmentId, formData) {
        // For file uploads, use FormData instead of JSON
        const url = `${this.baseUrl}/courses/${courseId}/assignments/${assignmentId}/submit`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.authService.token}`
            },
            body: formData
        });

        return response.json();
    }

    // Utility methods
    async uploadFile(file, type) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await fetch(`${this.baseUrl}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.authService.token}`
            },
            body: formData
        });

        return response.json();
    }
}

// Initialize API service
const apiService = new ApiService();