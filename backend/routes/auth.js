const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { 
  register, 
  login, 
  getProfile, 
  updateProfile 
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Validation rules
const registerValidation = [
  body('username').notEmpty().trim().isLength({ min: 3 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('studentId').optional().trim()
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;