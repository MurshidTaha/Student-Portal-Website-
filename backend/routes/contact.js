const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { 
  submitContact, 
  getContacts 
} = require('../controllers/contactController');
const { auth, authorize } = require('../middleware/auth');

// Validation rules
const contactValidation = [
  body('name').notEmpty().trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').optional().trim(),
  body('message').notEmpty().trim().isLength({ min: 10 })
];

// Public route for submitting contact form
router.post('/submit', contactValidation, submitContact);

// Admin routes (protected)
router.get('/', auth, authorize('admin'), getContacts);

module.exports = router;