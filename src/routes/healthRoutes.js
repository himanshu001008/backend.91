const express = require('express');
const router = express.Router();
const { getHealthStatus } = require('../controllers/healthController');

// GET /api/health -> Triggers getHealthStatus controller
router.get('/health', getHealthStatus);

module.exports = router;
