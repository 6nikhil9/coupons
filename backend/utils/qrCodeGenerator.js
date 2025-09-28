// backend/utils/qrCodeGenerator.js
const crypto = require('crypto');

/**
 * Generates a unique secure hash for a coupon.
 * @returns {string} A SHA256 hash.
 */
const generateSecureHash = () => {
    return crypto.randomBytes(32).toString('hex'); // Generates a 64-character hex string
};

/**
 * Creates the data string that will be encoded into the QR code.
 * This data is then used by the frontend to send to the validation endpoint.
 * @param {string} eventId - MongoDB ObjectId for the event.
 * @param {string} couponIdShort - The human-readable short coupon ID.
 * @param {string} secureHash - The unique secure hash for this specific coupon.
 * @returns {string} A JSON string containing the necessary validation data.
 */
const createQrCodeData = (eventId, couponIdShort, secureHash) => {
    const qrData = {
        event_id: eventId.toString(), // Convert ObjectId to string
        coupon_id: couponIdShort,
        secureHash: secureHash
    };
    return JSON.stringify(qrData);
};

module.exports = {
    generateSecureHash,
    createQrCodeData
};