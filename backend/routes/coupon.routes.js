// backend/routes/coupon.routes.js
const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Route for volunteer to validate coupons
router.post('/validate', protect, authorize('volunteer'), couponController.validateCoupon);

module.exports = router;