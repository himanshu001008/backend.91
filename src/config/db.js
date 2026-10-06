const mongoose = require('mongoose');

/**
 * @desc    Establishes connection to MongoDB database using Mongoose
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    // Exit process with failure (code 1) if database connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
