const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  schedule: {
    days: [String],
    time: String,
    room: String
  },
  materials: [{
    title: String,
    type: String,
    url: String,
    uploadDate: Date
  }],
  assignments: [{
    title: String,
    description: String,
    dueDate: Date,
    totalMarks: Number,
    submissions: [{
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      fileUrl: String,
      submittedAt: Date,
      marks: Number,
      feedback: String
    }]
  }],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);