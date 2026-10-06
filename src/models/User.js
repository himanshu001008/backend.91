const mongoose = require('mongoose');

/**
 * User Schema for FlexFit Platform
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Excludes password by default in Mongoose queries
    },
    role: {
      type: String,
      enum: {
        values: ['member', 'studio'],
        message: '{VALUE} is not a valid role. Allowed roles are: member, studio'
      },
      default: 'member'
    },
    credits: {
      type: Number,
      default: 10,
      min: [0, 'Credits cannot be negative']
    }
  },
  {
    // Automatically creates and manages createdAt and updatedAt timestamp fields
    timestamps: true
  }
);

/**
 * Remove sensitive fields like password when converting document to JSON
 */
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
