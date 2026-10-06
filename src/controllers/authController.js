const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate JWT Token helper
 * Includes user ID and role in token payload
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '1d' // Token valid for 1 day
  });
};

/**
 * @desc    Register a new user (Member or Studio)
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Basic Field Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // 2. Email format validation regex
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // 3. Password length validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // 4. Check if user with given email already exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // 5. Hash password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Role assignment & Default credits (10 credits default)
    const userRole = role && ['member', 'studio'].includes(role) ? role : 'member';

    // 7. Create user in MongoDB
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: userRole,
      credits: 10
    });

    // 8. Return 201 Created response
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email address already registered'
      });
    }
    next(error);
  }
};

/**
 * @desc    Login user & return JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate request body
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // 2. Find user by email and explicitly select password field (+password)
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    // 3. If user does not exist, return 401 Unauthorized
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 4. Compare entered plain text password with stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 5. Generate JWT token with user ID and role
    const token = generateToken(user._id, user.role);

    // 6. Return response (password is automatically omitted by toJSON schema transform)
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in user profile
 * @route   GET /api/auth/me
 * @access  Private (Protected by authMiddleware)
 */
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
