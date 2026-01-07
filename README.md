# 🎓 Student Portal

A comprehensive, modern student management system built with the MERN stack (MongoDB, Express.js, React/HTML/CSS/JS, Node.js). This platform provides students, teachers, and administrators with a complete solution for academic management.

![Student Portal Screenshot](https://img.shields.io/badge/Status-Complete-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 👨‍🎓 For Students
- 📚 **Course Management** - View and enroll in courses
- 📝 **Assignment Submission** - Submit assignments with file uploads
- 📊 **Grade Tracking** - Monitor academic performance
- 🗓️ **Academic Calendar** - Stay organized with schedules
- 💬 **Messaging System** - Communicate with instructors and peers
- 📖 **Digital Library** - Access study materials and resources
- 👤 **Profile Management** - Update personal information and skills

### 👨‍🏫 For Instructors/Teachers
- 🏫 **Course Creation** - Create and manage courses
- 📋 **Assignment Management** - Create, grade, and provide feedback
- 📈 **Grade Management** - Enter and manage student grades
- 👥 **Student Management** - View enrolled students and their progress

### 👨‍💼 For Administrators
- 👥 **User Management** - Manage all user accounts
- 🏫 **Course Administration** - Oversee all courses
- 📊 **Analytics Dashboard** - View system statistics and reports
- ⚙️ **System Settings** - Configure platform settings

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mtaha-student/student-portal.git
cd student-portal
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Configure environment variables**
```bash
# Create .env file in backend directory
cd ../backend
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the development servers**

**Option A: Separate terminals**
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm start
```

**Option B: Using the root package.json**
```bash
# From root directory
npm run install-all  # Installs all dependencies
npm run dev          # Starts both servers
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
student-portal/
├── backend/                 # Node.js + Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Authentication & validation
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── uploads/           # File uploads directory
│   └── server.js          # Main server file
├── frontend/               # Frontend application
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── images/            # Static images
│   ├── pages/             # HTML pages
│   └── index.html         # Main entry point
└── docker-compose.yml     # Docker configuration
```

## 🔧 Backend API

### Authentication Endpoints
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # User login
GET    /api/auth/profile       # Get user profile
PUT    /api/auth/profile       # Update profile
```

### Course Endpoints
```
GET    /api/courses           # List all courses
GET    /api/courses/:id       # Get course details
POST   /api/courses           # Create new course (admin)
PUT    /api/courses/:id       # Update course (admin)
DELETE /api/courses/:id       # Delete course (admin)
POST   /api/courses/:id/enroll # Enroll in course
```

### Assignment Endpoints
```
GET    /api/assignments       # List assignments
POST   /api/assignments       # Create assignment (teacher)
PUT    /api/assignments/:id   # Update assignment
POST   /api/assignments/:id/submit # Submit assignment
```

## 🐳 Docker Deployment

### Using Docker Compose

1. **Build and run with Docker Compose**
```bash
docker-compose up -d
```

2. **Access the application**
- Frontend: http://localhost
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Docker Commands
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up -d --build
```

## 🧪 Testing Credentials

### Demo Accounts
```
Student:
Email: student@example.com
Password: Student123!

Teacher:
Email: teacher@example.com
Password: Teacher123!

Admin:
Email: admin@studentportal.edu
Password: Admin123!
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcrypt.js** - Password hashing
- **Multer** - File uploads

### Frontend
- **HTML5** - Markup language
- **CSS3** - Styling
- **JavaScript (ES6+)** - Client-side logic
- **Bootstrap 5** - Responsive design
- **Font Awesome** - Icons
- **Chart.js** - Data visualization (optional)

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server (production)

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Secure file uploads
- ✅ Environment variable management

## 📊 Database Schema

### Main Collections
- **Users** - Students, teachers, administrators
- **Courses** - Academic courses with schedules
- **Assignments** - Course assignments
- **Grades** - Student grades and assessments
- **Submissions** - Assignment submissions

### Relationships
```
User (Student) --- enrolls ---> Course
User (Teacher) --- teaches ---> Course
Assignment --- belongs to ---> Course
Submission --- submitted by ---> User (Student)
Grade --- assigned to ---> User (Student)
```

## 🚀 Deployment

### Production Deployment Steps

1. **Prepare production environment**
```bash
# Set NODE_ENV to production
export NODE_ENV=production

# Update .env with production values
# - Use MongoDB Atlas or managed MongoDB
# - Set secure JWT secret
# - Configure production email service
# - Set appropriate file upload limits
```

2. **Build for production**
```bash
# Build frontend (if using build tools)
cd frontend
npm run build

# Start production server
cd ../backend
npm start
```

3. **Using PM2 for process management**
```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
pm2 start server.js --name "student-portal-api"

# Start frontend server (if needed)
pm2 start serve --name "student-portal-ui" -- -s build -l 3000

# Save PM2 configuration
pm2 save
pm2 startup
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student_portal
JWT_SECRET=your_secure_jwt_secret_here
FRONTEND_URL=https://yourdomain.com
FILE_UPLOAD_LIMIT=10485760
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```
3. **Commit your changes**
```bash
git commit -m 'Add some amazing feature'
```
4. **Push to the branch**
```bash
git push origin feature/amazing-feature
```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation when needed
- Test your changes thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Muhammad Taha**
- GitHub: [@mtaha-student](https://github.com/MurshidTaha)
- Project: Student Portal System

## 🙏 Acknowledgments

- Bootstrap team for the amazing CSS framework
- MongoDB for the excellent database
- Node.js community for endless packages
- All contributors and testers

## 📞 Support

For support, email mtaha.student@example.com or create an issue in the GitHub repository.

---

⭐ **If you found this project useful, please give it a star!** ⭐

---

**Happy Coding!** 🚀
