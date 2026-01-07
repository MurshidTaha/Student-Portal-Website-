const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true,
        min: 0
    },
    attachment: {
        type: String,
        default: null
    },
    submissions: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        fileUrl: String,
        submittedAt: {
            type: Date,
            default: Date.now
        },
        marks: {
            type: Number,
            min: 0
        },
        feedback: String,
        status: {
            type: String,
            enum: ['submitted', 'graded', 'late', 'missing'],
            default: 'submitted'
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
assignmentSchema.index({ course: 1, dueDate: -1 });
assignmentSchema.index({ instructor: 1 });
assignmentSchema.index({ 'submissions.student': 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);