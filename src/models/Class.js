const mongoose = require('mongoose');

/**
 * Fitness Class Schema for FlexFit Platform
 */
const classSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Class title is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    instructor: {
      type: String,
      required: [true, 'Instructor name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Class category is required'],
      enum: {
        values: ['Yoga', 'Gym', 'Zumba', 'Cardio', 'Strength', 'Pilates'],
        message: '{VALUE} is not a valid category. Allowed categories: Yoga, Gym, Zumba, Cardio, Strength, Pilates'
      },
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Class date is required']
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      trim: true
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      trim: true
    },
    capacity: {
      type: Number,
      required: [true, 'Maximum class capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    bookedCount: {
      type: Number,
      default: 0,
      min: [0, 'Booked count cannot be negative']
    },
    imageUrl: {
      type: String,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by user reference is required']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Virtual Field: availableSlots
 * Dynamically calculates remaining available seats (capacity - bookedCount)
 */
classSchema.virtual('availableSlots').get(function () {
  return Math.max(0, this.capacity - this.bookedCount);
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
