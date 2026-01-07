const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'read', 'replied', 'archived'],
    default: 'pending'
  },
  repliedAt: Date,
  replyMessage: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);