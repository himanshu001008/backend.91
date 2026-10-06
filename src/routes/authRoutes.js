const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerValidation, loginValidation } = require('../middleware/validationMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Login user & get JWT token
 * @access  Public
 */
router.post('/login', loginValidation, loginUser);

/**
 * @route   GET /api/auth/me
 * @desc    Get logged in user profile
 * @access  Private (Requires valid JWT Bearer Token)
 */
router.get('/me', protect, getMe);

module.exports = router;

