/**
 * Custom Error Response Class extending native Error
 * Allows passing custom HTTP status code and detailed error payloads.
 */
class ErrorResponse extends Error {
  constructor(message, statusCode, error = null) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
