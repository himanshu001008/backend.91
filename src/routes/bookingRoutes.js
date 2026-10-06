const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  cancelBooking
} = require('../controllers/bookingController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { createBookingValidation } = require('../middleware/validationMiddleware');

/**
 * @route   POST /api/bookings
 * @desc    Book a fitness class
 * @access  Private (Requires JWT and 'member' role)
 */
router.post('/', protect, authorizeRoles('member'), createBookingValidation, createBooking);

/**
 * @route   GET /api/bookings/user/:id
 * @desc    Get all bookings for a user
 * @access  Private (Requires JWT: Owner user or 'studio' role)
 */
router.get('/user/:id', protect, getUserBookings);

/**
 * @route   DELETE /api/bookings/:id
 * @desc    Cancel a booking (Soft delete, refund 1 credit, decrement bookedCount)
 * @access  Private (Requires JWT: Owner member or 'studio' role)
 */
router.delete('/:id', protect, cancelBooking);

module.exports = router;


