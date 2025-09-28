// backend/models/Coupon.js
const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    event: { // Reference to the event this coupon belongs to
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    coupon_id_short: { // A shorter, human-readable ID, e.g., "C001"
        type: String,
        required: true,
        unique: true, // Ensure each coupon has a unique short ID
        index: true
    },
    secureHash: { // A secure hash embedded in QR for validation
        type: String,
        required: true
    },
    is_redeemed: {
        type: Boolean,
        default: false
    },
    redeemed_at: {
        type: Date,
        default: null
    },
    redeemed_by_validator: { // Optional: ID of the volunteer who scanned it
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Coupon', CouponSchema);