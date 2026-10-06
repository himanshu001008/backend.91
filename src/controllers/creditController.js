const mongoose = require('mongoose');
const User = require('../models/User');

/**
 * @desc    Get credit balance for a specific user
 * @route   GET /api/credits/user/:id
 * @access  Private (Owner member or Studio role)
 */
const getUserCredits = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // 1. Validate User ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // 2. Authorization Check: Members can only view their own credits; Studio users can view any member's credits
    if (req.user._id.toString() !== userId && req.user.role !== 'studio') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view credits of another user'
      });
    }

    // 3. Find user in database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // 4. Return structured response with user ID and credit balance (Never returns password)
    return res.status(200).json({
      success: true,
      userId: user._id,
      credits: user.credits
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    next(error);
  }
};

module.exports = {
  getUserCredits
};

