const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const eventController = require('../controllers/eventController');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Event routes - moved to /api/events (will be handled in index.js)

module.exports = router;