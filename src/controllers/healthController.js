/**
 * @desc    Get Health Status of the API
 * @route   GET /api/health
 * @access  Public
 */
const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FlexFit API is running'
  });
};

module.exports = {
  getHealthStatus
};
