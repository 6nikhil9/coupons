// backend/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Route for admin dashboard statistics
router.get('/dashboard-stats', protect, authorize('admin'), eventController.getDashboardStats);

// Route for admin to get their events
router.get('/events', protect, authorize('admin'), eventController.getEvents);

// NEW: Route for admin to download the QR code PDF for a specific event
router.get('/events/:eventId/download-pdf', protect, authorize('admin'), eventController.downloadQrPdf);

module.exports = router;