const Course = require('../models/Course');
const Assignment = require('../models/Assignment');

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('instructor', 'username profile.fullName')
            .select('-materials -assignments');
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'username profile.fullName');
        res.json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.enrollCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course.enrolledStudents.includes(req.user._id)) {
            course.enrolledStudents.push(req.user._id);
            await course.save();
        }
        res.json({ success: true, message: 'Enrolled successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};