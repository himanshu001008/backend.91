const express = require('express');
const router = express.Router();
const { getUserCredits } = require('../controllers/creditController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/credits/user/:id
 * @desc    Get credit balance for a user
 * @access  Private (Requires JWT: Owner or Studio role)
 */
router.get('/user/:id', protect, getUserCredits);

module.exports = router;
