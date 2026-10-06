const { body, param, validationResult } = require('express-validator');

/**
 * Reusable Validation Error Handler Middleware
 * Extracts express-validator results and returns formatted HTTP 400 response if validation fails.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  next();
};

/**
 * 1. User Registration Validation Rules
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('role')
    .optional()
    .isIn(['member', 'studio'])
    .withMessage('Role must be either member or studio'),

  validate
];

/**
 * 2. User Login Validation Rules
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  validate
];

/**
 * 3. Create Fitness Class Validation Rules
 */
const createClassValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Class title is required'),

  body('instructor')
    .trim()
    .notEmpty()
    .withMessage('Instructor name is required'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Class category is required')
    .isIn(['Yoga', 'Gym', 'Zumba', 'Cardio', 'Strength', 'Pilates'])
    .withMessage('Invalid category. Allowed categories: Yoga, Gym, Zumba, Cardio, Strength, Pilates'),

  body('date')
    .notEmpty()
    .withMessage('Class date is required')
    .isISO8601()
    .withMessage('Please provide a valid date format (e.g. YYYY-MM-DD or ISO string)'),

  body('startTime')
    .trim()
    .notEmpty()
    .withMessage('Start time is required'),

  body('endTime')
    .trim()
    .notEmpty()
    .withMessage('End time is required'),

  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required')
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer of at least 1'),

  validate
];

/**
 * 4. Update Fitness Class Validation Rules
 */
const updateClassValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid fitness class ID format'),

  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Class title cannot be empty'),

  body('instructor')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Instructor name cannot be empty'),

  body('category')
    .optional()
    .trim()
    .isIn(['Yoga', 'Gym', 'Zumba', 'Cardio', 'Strength', 'Pilates'])
    .withMessage('Invalid category. Allowed categories: Yoga, Gym, Zumba, Cardio, Strength, Pilates'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date format (e.g. YYYY-MM-DD or ISO string)'),

  body('startTime')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Start time cannot be empty'),

  body('endTime')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('End time cannot be empty'),

  body('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer of at least 1'),

  validate
];

/**
 * 5. Create Booking Validation Rules
 */
const createBookingValidation = [
  body('classId')
    .notEmpty()
    .withMessage('classId is required')
    .isMongoId()
    .withMessage('Invalid classId format'),

  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  createClassValidation,
  updateClassValidation,
  createBookingValidation
};
