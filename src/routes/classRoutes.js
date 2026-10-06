const express = require('express');
const router = express.Router();
const {
  getAllClasses,
  getClassById,
  searchClasses,
  createClass,
  updateClass
} = require('../controllers/classController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { createClassValidation, updateClassValidation } = require('../middleware/validationMiddleware');
const { handleImageUpload } = require('../middleware/uploadMiddleware');

/**
 * Public Routes
 */
router.get('/', getAllClasses);
router.get('/search', searchClasses);
router.get('/:id', getClassById);

/**
 * Protected Routes (Requires JWT and 'studio' role)
 * Supports optional multipart/form-data single file upload with field name 'image'
 */
router.post('/', protect, authorizeRoles('studio'), handleImageUpload, createClassValidation, createClass);
router.put('/:id', protect, authorizeRoles('studio'), handleImageUpload, updateClassValidation, updateClass);

module.exports = router;




