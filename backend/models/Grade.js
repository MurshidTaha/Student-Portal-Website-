const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        default: null
    },
    marks: {
        type: Number,
        required: true,
        min: 0
    },
    totalMarks: {
        type: Number,
        required: true,
        min: 0
    },
    percentage: {
        type: Number,
        min: 0,
        max: 100
    },
    grade: {
        type: String,
        enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'I'],
        required: true
    },
    remarks: {
        type: String,
        default: ''
    },
    gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isFinal: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Calculate percentage before saving
gradeSchema.pre('save', function(next) {
    if (this.marks && this.totalMarks) {
        this.percentage = (this.marks / this.totalMarks) * 100;
        
        // Calculate grade based on percentage
        if (this.percentage >= 97) this.grade = 'A+';
        else if (this.percentage >= 93) this.grade = 'A';
        else if (this.percentage >= 90) this.grade = 'A-';
        else if (this.percentage >= 87) this.grade = 'B+';
        else if (this.percentage >= 83) this.grade = 'B';
        else if (this.percentage >= 80) this.grade = 'B-';
        else if (this.percentage >= 77) this.grade = 'C+';
        else if (this.percentage >= 73) this.grade = 'C';
        else if (this.percentage >= 70) this.grade = 'C-';
        else if (this.percentage >= 60) this.grade = 'D';
        else this.grade = 'F';
    }
    next();
});

// Indexes for faster queries
gradeSchema.index({ student: 1, course: 1 });
gradeSchema.index({ student: 1, createdAt: -1 });
gradeSchema.index({ course: 1, assignment: 1 });

module.exports = mongoose.model('Grade', gradeSchema);