const ErrorResponse = require('../utils/ErrorResponse');

/**
 * 404 Not Found Middleware
 */
const notFoundHandler = (req, res, next) => {
  const error = new ErrorResponse(`Route not found - ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Centralized Global Error Handler Middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log error for server debugging
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ Server Error:', err);
  }

  // 1. Mongoose Invalid ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Invalid format for field '${err.path || 'id'}'`;
    error = new ErrorResponse(message, 400);
  }

  // 2. Mongoose Duplicate Key Error (MongoDB Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `Duplicate value entered for '${field}'. Please use a unique value.`;
    error = new ErrorResponse(message, 400);
  }

  // 3. Mongoose Schema Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((val) => val.message);
    const message = 'Validation failed';
    error = new ErrorResponse(message, 400, messages);
  }

  // 4. JWT Verification Error (Invalid Token Signature)
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Authorization denied.';
    error = new ErrorResponse(message, 401);
  }

  // 5. JWT Expiration Error
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired. Please log in again.';
    error = new ErrorResponse(message, 401);
  }

  // Prepare response payload
  const statusCode = error.statusCode || err.statusCode || err.status || 500;
  const message = error.message || 'Internal Server Error';
  const errorPayload = error.error || err.errors || null;

  const response = {
    success: false,
    message
  };

  // Include detailed error payload if present
  if (errorPayload !== null) {
    response.error = errorPayload;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
