// Authentication Module
const API_BASE_URL = 'http://localhost:5000/api';

class AuthService {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.setAuth(data.token, data.user);
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (data.success) {
                this.setAuth(data.token, data.user);
                return { success: true, user: data.user };
            } else {
                return { success: false, errors: data.errors || data.message };
            }
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    async logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.token = null;
        this.user = null;
        window.location.href = '/';
    }

    async updateProfile(profileData) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (data.success) {
                this.user = { ...this.user, ...data.user };
                localStorage.setItem('user', JSON.stringify(this.user));
                return { success: true, user: this.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    isAuthenticated() {
        return !!this.token;
    }

    isAdmin() {
        return this.user?.role === 'admin';
    }

    isTeacher() {
        return this.user?.role === 'teacher';
    }

    isStudent() {
        return this.user?.role === 'student';
    }

    setAuth(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    }

    getAuthHeader() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }
}

// Initialize auth service
const authService = new AuthService();

// Update navigation based on auth state
function updateNavigation() {
    const authLinks = document.getElementById('auth-links');
    
    if (!authLinks) return;

    if (authService.isAuthenticated()) {
        authLinks.innerHTML = `
            <div class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user-circle me-1"></i> ${authService.user.username}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="dashboard.html"><i class="fas fa-tachometer-alt me-2"></i>Dashboard</a></li>
                    <li><a class="dropdown-item" href="profile.html"><i class="fas fa-user me-2"></i>Profile</a></li>
                    <li><a class="dropdown-item" href="courses.html"><i class="fas fa-book me-2"></i>My Courses</a></li>
                    <li><hr class="dropdown-divider"></li>
                    ${authService.isAdmin() ? `
                        <li><a class="dropdown-item" href="admin.html"><i class="fas fa-cog me-2"></i>Admin Panel</a></li>
                        <li><hr class="dropdown-divider"></li>
                    ` : ''}
                    <li><a class="dropdown-item" href="#" onclick="authService.logout()"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                </ul>
            </div>
        `;
    } else {
        authLinks.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="login.html"><i class="fas fa-sign-in-alt me-1"></i>Login</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="register.html"><i class="fas fa-user-plus me-1"></i>Register</a>
            </li>
        `;
    }
}

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.auth-container') || document.querySelector('.container');
    container.prepend(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    
    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Validation
            if (!validateEmail(email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            if (!validatePassword(password)) {
                showAlert('Password must be at least 6 characters long', 'error');
                return;
            }
            
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Logging in...';
            
            const result = await authService.login(email, password);
            
            if (result.success) {
                showAlert('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showAlert(result.message || 'Login failed. Please try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Login';
            }
        });
    }
    
    // Handle registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const userData = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value,
                fullName: document.getElementById('fullName').value,
                studentId: document.getElementById('studentId').value
            };
            
            // Validation
            if (!validateEmail(userData.email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            if (!validatePassword(userData.password)) {
                showAlert('Password must be at least 6 characters long', 'error');
                return;
            }
            
            if (userData.password !== userData.confirmPassword) {
                showAlert('Passwords do not match', 'error');
                return;
            }
            
            if (userData.username.length < 3) {
                showAlert('Username must be at least 3 characters long', 'error');
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Creating account...';
            
            const result = await authService.register(userData);
            
            if (result.success) {
                showAlert('Registration successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                const errorMessage = result.errors 
                    ? result.errors.map(err => err.msg).join(', ')
                    : result.message || 'Registration failed. Please try again.';
                showAlert(errorMessage, 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Register';
            }
        });
    }
});