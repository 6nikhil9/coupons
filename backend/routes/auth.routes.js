// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', authController.registerUser); // Admin can register, or for initial setup
router.post('/login', authController.loginUser);
router.get('/me', protect, authController.getMe); // Get logged-in user's data

module.exports = router;