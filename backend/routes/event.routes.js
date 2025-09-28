// backend/routes/event.routes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Routes for Event Convener (Admin)
router.route('/')
    .get(protect, authorize('admin'), eventController.getEvents) // Get all events for the admin
    .post(protect, authorize('admin'), eventController.createEvent); // Create new event

router.route('/:id')
    .get(protect, authorize('admin'), eventController.getEventById) // Get specific event details
    .put(protect, authorize('admin'), eventController.updateEvent) // Update event
    .delete(protect, authorize('admin'), eventController.deleteEvent); // Delete event

// Coupon generation for an event
router.post('/:eventId/generate-coupons', protect, authorize('admin'), eventController.generateCoupons);

// Get coupons associated with a specific event
router.get('/:eventId/coupons', protect, authorize('admin'), eventController.getCouponsForEvent);

// Dashboard stats (conceptually under events, for admin view)

// @desc    Download QR code PDF for an event
// @route   GET /api/events/:eventId/qr-pdf
// @access  Private/Admin
router.get('/:eventId/qr-pdf', protect, authorize('admin'), eventController.downloadQrPdf);

module.exports = router;