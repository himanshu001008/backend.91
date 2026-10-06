const mongoose = require('mongoose');

/**
 * Booking Schema for FlexFit Platform
 */
const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class reference is required']
    },
    status: {
      type: String,
      enum: {
        values: ['confirmed', 'cancelled', 'waitlisted'],
        message: '{VALUE} is not a valid booking status. Allowed values: confirmed, cancelled, waitlisted'
      },
      default: 'confirmed'
    },
    bookingDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

/**
 * Compound Index:
 * Ensures uniqueness for active user bookings per class
 */
bookingSchema.index({ user: 1, class: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

