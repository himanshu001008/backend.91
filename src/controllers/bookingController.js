const Booking = require('../models/Booking');
const Class = require('../models/Class');
const User = require('../models/User');

/**
 * @desc    Book a fitness class
 * @route   POST /api/bookings
 * @access  Private (Member role only)
 */
const createBooking = async (req, res, next) => {
  try {
    const { classId } = req.body;

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid classId'
      });
    }

    // 1. Find the requested fitness class
    const fitnessClass = await Class.findById(classId);
    if (!fitnessClass) {
      return res.status(404).json({
        success: false,
        message: 'Fitness class not found'
      });
    }

    // 2. Check existing booking status (active or cancelled)
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      class: classId
    });

    if (existingBooking && (existingBooking.status === 'confirmed' || existingBooking.status === 'waitlisted')) {
      return res.status(400).json({
        success: false,
        message: 'You have already booked this class'
      });
    }

    // 3. Check user credits balance (Minimum 1 credit required)
    const user = await User.findById(req.user._id);
    if (!user || user.credits < 1) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits. You need at least 1 credit to book a class.'
      });
    }

    // 4. Check if class is fully booked
    if (fitnessClass.bookedCount >= fitnessClass.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Class is fully booked. No available slots remaining.'
      });
    }

    // 5. Atomic Update: Increment bookedCount ONLY if capacity is not exceeded
    const updatedClass = await Class.findOneAndUpdate(
      {
        _id: classId,
        $expr: { $lt: ['$bookedCount', '$capacity'] }
      },
      { $inc: { bookedCount: 1 } },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(400).json({
        success: false,
        message: 'Class is fully booked. No available slots remaining.'
      });
    }

    // 6. Deduct 1 credit from user balance
    await User.findByIdAndUpdate(req.user._id, { $inc: { credits: -1 } });

    // 7. Create or update booking record
    let booking;
    if (existingBooking && existingBooking.status === 'cancelled') {
      existingBooking.status = 'confirmed';
      existingBooking.bookingDate = new Date();
      booking = await existingBooking.save();
    } else {
      booking = await Booking.create({
        user: req.user._id,
        class: classId,
        status: 'confirmed'
      });
    }

    // 8. Return populated booking data
    const populatedBooking = await Booking.findById(booking._id)
      .populate('class', 'title category instructor date startTime endTime capacity bookedCount availableSlots')
      .populate('user', 'name email credits');

    return res.status(201).json({
      success: true,
      message: 'Class booked successfully',
      data: populatedBooking
    });


  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Invalid class ID format'
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already booked this class'
      });
    }

    next(error);
  }
};

/**
 * @desc    Get all bookings for a specific user
 * @route   GET /api/bookings/user/:id
 * @access  Private (Owner member or Studio role)
 */
const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // 1. Ownership Authorization: A user can only view their own bookings unless role is studio
    if (req.user._id.toString() !== userId && req.user.role !== 'studio') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view bookings of another user'
      });
    }

    // 2. Query bookings by user ID and populate User & Class details
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: 'class',
        select: 'title instructor category date startTime endTime imageUrl capacity bookedCount availableSlots'
      })
      .populate({
        path: 'user',
        select: 'name email role credits'
      })
      .sort({ createdAt: -1 });

    // 3. Return 200 OK (empty array if no bookings found)
    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
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

/**
 * @desc    Cancel a booking (Soft delete: update status to cancelled, decrement bookedCount, refund 1 credit)
 * @route   DELETE /api/bookings/:id
 * @access  Private (Owner member or Studio role)
 */
const cancelBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id;

    // 1. Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // 2. Ownership verification: Check if authenticated user owns this booking
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'studio') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // 3. Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // 4. Soft Delete: Update status to 'cancelled'
    booking.status = 'cancelled';
    await booking.save();

    // 5. Refund 1 credit to user balance
    await User.findByIdAndUpdate(booking.user, { $inc: { credits: 1 } });

    // 6. Decrement class bookedCount by 1 (preventing negative count)
    await Class.findOneAndUpdate(
      { _id: booking.class, bookedCount: { $gt: 0 } },
      { $inc: { bookedCount: -1 } }
    );

    // 7. Return updated populated booking details
    const populatedBooking = await Booking.findById(bookingId)
      .populate('class', 'title category instructor date startTime endTime capacity bookedCount availableSlots')
      .populate('user', 'name email credits');

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. 1 credit has been refunded to your account.',
      data: populatedBooking
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Invalid booking ID format'
      });
    }

    next(error);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking
};
