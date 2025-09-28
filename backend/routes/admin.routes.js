// backend/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller'); // Still use eventController for event-related data
const { protect, authorize } = require('../middleware/auth.middleware');

// Route for admin dashboard statistics
router.get('/dashboard-stats', protect, authorize('admin'), eventController.getDashboardStats);

// Route for admin to get their events (could also be part of a general event route)
router.get('/events', protect, authorize('admin'), eventController.getEvents);

// You can add other admin-specific dashboard data routes here
// router.get('/users-overview', protect, authorize('admin'), adminController.getUsersOverview);

module.exports = router;