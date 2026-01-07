const User = require('../models/User');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Grade = require('../models/Grade');
const bcrypt = require('bcryptjs');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password -resetPasswordToken -resetPasswordExpires');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user's courses
        const courses = await Course.find({ 
            enrolledStudents: user._id,
            isActive: true 
        }).select('title code instructor');

        // Get upcoming assignments
        const assignments = await Assignment.find({
            'submissions.student': user._id,
            dueDate: { $gte: new Date() },
            isActive: true
        }).select('title dueDate course').limit(5);

        // Get recent grades
        const grades = await Grade.find({ student: user._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('course', 'title code');

        res.json({
            success: true,
            user: {
                ...user.toObject(),
                courses: courses,
                upcomingAssignments: assignments,
                recentGrades: grades
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        
        // Remove restricted fields
        delete updates.password;
        delete updates.email;
        delete updates.role;
        delete updates.isActive;

        // If updating profile sub-document
        if (updates.profile) {
            Object.keys(updates.profile).forEach(key => {
                req.user.profile[key] = updates.profile[key];
            });
            delete updates.profile;
        }

        // Merge updates with existing user
        Object.keys(updates).forEach(key => {
            req.user[key] = updates[key];
        });

        await req.user.save();

        res.json({
            success: true,
            user: req.user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, req.user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        req.user.password = newPassword;
        await req.user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, role, search } = req.query;
        
        const query = {};
        
        if (role) {
            query.role = role;
        }
        
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { 'profile.fullName': { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password -resetPasswordToken -resetPasswordExpires')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Remove sensitive fields
        delete updates.password;
        delete updates.email;

        const user = await User.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password -resetPasswordToken -resetPasswordExpires');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Don't allow self-deletion
        if (id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deactivated successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get user statistics (admin only)
exports.getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const students = await User.countDocuments({ role: 'student' });
        const teachers = await User.countDocuments({ role: 'teacher' });
        
        // Get recent signups (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentSignups = await User.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        res.json({
            success: true,
            stats: {
                totalUsers,
                activeUsers,
                students,
                teachers,
                recentSignups
            }
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};