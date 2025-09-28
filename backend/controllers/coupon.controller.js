// backend/controllers/coupon.controller.js
const Coupon = require('../models/Coupon');
const Event = require('../models/Event');
const { createQrCodeData } = require('../utils/qrCodeGenerator'); // For re-generating QR data to compare

// @desc    Validate and redeem a coupon
// @route   POST /api/coupons/validate
// @access  Private (Volunteer)
exports.validateCoupon = async (req, res, next) => {
    const { eventId, couponId, secureHash } = req.body; // couponId is coupon_id_short

    if (!eventId || !couponId || !secureHash) {
        return res.status(400).json({ message: 'Missing coupon validation data.' });
    }

    try {
        const coupon = await Coupon.findOne({ event: eventId, coupon_id_short: couponId });

        if (!coupon) {
            return res.status(404).json({ valid: false, message: 'Coupon not found.' });
        }

        if (coupon.is_redeemed) {
            return res.status(400).json({ valid: false, message: 'Coupon already redeemed.' });
        }

        // Re-generate the expected QR data and compare secureHash
        // This prevents someone from just guessing eventId and couponId
        const expectedQrData = JSON.parse(createQrCodeData(coupon.event, coupon.coupon_id_short, coupon.secureHash));
        if (expectedQrData.secureHash !== secureHash) {
            return res.status(400).json({ valid: false, message: 'Invalid coupon signature.' });
        }
        
        // Optional: Check event status/expiration
        const event = await Event.findById(coupon.event);
        if (!event || event.status !== 'Active' || event.date < new Date()) {
            return res.status(400).json({ valid: false, message: 'Event is not active or has expired.' });
        }


        // Redeem the coupon
        coupon.is_redeemed = true;
        coupon.redeemed_at = new Date();
        coupon.redeemed_by_validator = req.user.id; // Volunteer who scanned it
        await coupon.save();

        res.status(200).json({
            valid: true,
            message: 'Coupon Valid! Meal Served.',
            coupon: {
                coupon_id: coupon.coupon_id_short,
                event_name: event.name,
                food_details: event.description,
                redeemed_at: coupon.redeemed_at
            }
        });

    } catch (error) {
        next(error);
    }
};