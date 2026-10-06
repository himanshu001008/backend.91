const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @desc    Middleware to protect routes and verify JWT token
 *          Returns HTTP 401 Unauthorized for unauthenticated requests
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check if Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extract token string
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify JWT token using secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find user by decoded ID
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists'
        });
      }

      return next();

    } catch (error) {
      return next(error);
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

/**
 * @desc    Role-Based Access Control (RBAC) Middleware
 *          Returns HTTP 403 Forbidden if user lacks necessary permissions
 * @param   {...String} roles - Allowed user roles (e.g. 'studio', 'member')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role}' is forbidden from accessing this resource. Allowed roles: [${roles.join(', ')}]`
      });
    }
    next();
  };
};

// Alias for authorize
const authorize = authorizeRoles;

module.exports = {
  protect,
  authorize,
  authorizeRoles
};

