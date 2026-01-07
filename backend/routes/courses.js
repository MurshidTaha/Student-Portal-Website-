const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { auth, authorize } = require('../middleware/auth');

// Get all courses
router.get('/', async (req, res) => {
    try {
        const { department, semester, search } = req.query;
        let query = { isActive: true };

        if (department) query.department = department;
        if (semester) query.semester = semester;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const courses = await Course.find(query)
            .populate('instructor', 'username profile.fullName')
            .select('-materials -assignments');

        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get single course
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'username profile.fullName email')
            .populate('enrolledStudents', 'username profile.fullName');

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Enroll in course
router.post('/:id/enroll', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Check if already enrolled
        if (course.enrolledStudents.includes(req.user._id)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Already enrolled in this course' 
            });
        }

        course.enrolledStudents.push(req.user._id);
        await course.save();

        res.json({ 
            success: true, 
            message: 'Successfully enrolled in course' 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get course materials
router.get('/:id/materials', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).select('materials');

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Check if user is enrolled or is instructor
        if (!course.enrolledStudents.includes(req.user._id) && 
            course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to access course materials' 
            });
        }

        res.json({ success: true, materials: course.materials });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin: Create course
router.post('/', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const courseData = req.body;
        courseData.instructor = req.user._id;

        const course = new Course(courseData);
        await course.save();

        res.status(201).json({ success: true, course });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Admin: Update course
router.put('/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.json({ success: true, course });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;