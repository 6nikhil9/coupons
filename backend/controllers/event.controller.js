// backend/controllers/event.controller.js
const Event = require('../models/Event');
const Coupon = require('../models/Coupon');
const User = require('../models/User'); // To populate organizer details if needed
const { generateSecureHash, createQrCodeData } = require('../utils/qrCodeGenerator');
const QRCode = require('qrcode'); // For generating actual QR code images (optional for download)

// @desc    Get all events (for admin dashboard)
// @route   GET /api/events
// @access  Private (Admin)
exports.getEvents = async (req, res, next) => {
    try {
        const events = await Event.find({ organizer: req.user.id }).sort({ date: 1 }); // Only show events created by this admin
        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single event
// @route   GET /api/events/:id
// @access  Private (Admin)
exports.getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Ensure only the organizer can view their event
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this event' });
        }

        res.status(200).json(event);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Admin)
exports.createEvent = async (req, res, next) => {
    const { name, date, venue, description } = req.body;

    if (!name || !date || !venue) {
        return res.status(400).json({ message: 'Please include all required event fields: name, date, venue' });
    }

    try {
        const event = await Event.create({
            name,
            date,
            venue,
            description,
            organizer: req.user.id // Set the organizer to the logged-in user
        });
        res.status(201).json(event);
    } catch (error) {
        next(error);
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Admin)
exports.updateEvent = async (req, res, next) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Ensure only the organizer can update their event
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Run schema validators on update
        });

        res.status(200).json(event);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Admin)
exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Ensure only the organizer can delete their event
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        // Optionally, also delete all associated coupons
        await Coupon.deleteMany({ event: req.params.id });

        await Event.deleteOne({ _id: req.params.id }); // Use deleteOne for clarity with findById

        res.status(200).json({ message: 'Event and associated coupons removed' });
    } catch (error) {
        next(error);
    }
};

// @desc    Generate N coupons for a specific event
// @route   POST /api/events/:eventId/generate-coupons
// @access  Private (Admin)
exports.generateCoupons = async (req, res, next) => {
    const { count } = req.body;
    const { eventId } = req.params;

    if (!count || count <= 0) {
        return res.status(400).json({ message: 'Please specify a valid number of coupons to generate.' });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        // Ensure only the organizer can generate coupons for their event
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to generate coupons for this event.' });
        }

        const generatedCoupons = [];
        for (let i = 0; i < count; i++) {
            const secureHash = generateSecureHash();
            // Generate a unique short ID for each coupon
            // This is a basic approach. For very large counts, you might need a more robust system.
            const existingCouponCount = await Coupon.countDocuments({ event: eventId });
            const coupon_id_short = `C${(existingCouponCount + i + 1).toString().padStart(3, '0')}`;

            const newCoupon = await Coupon.create({
                event: event._id,
                coupon_id_short,
                secureHash,
                is_redeemed: false
            });
            generatedCoupons.push(newCoupon);
        }

        // For each generated coupon, create the QR code data string
        const qrCodesData = generatedCoupons.map(coupon =>
            createQrCodeData(coupon.event, coupon.coupon_id_short, coupon.secureHash)
        );

        // Optionally, you can generate actual QR code images here
        // For demonstration, we'll just return the data that the frontend QR scanner expects.
        // If you needed to generate a PDF of QRs on the backend:
        // const qrImages = await Promise.all(qrCodesData.map(data => QRCode.toDataURL(data)));

        res.status(201).json({
            message: `${count} coupons generated successfully!`,
            coupons: generatedCoupons.map(c => ({
                id: c._id,
                coupon_id_short: c.coupon_id_short,
                is_redeemed: c.is_redeemed,
                qr_data: createQrCodeData(c.event, c.coupon_id_short, c.secureHash) // Data to embed in QR
            }))
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get all coupons for a specific event
// @route   GET /api/events/:eventId/coupons
// @access  Private (Admin)
exports.getCouponsForEvent = async (req, res, next) => {
    const { eventId } = req.params;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view coupons for this event.' });
        }

        const coupons = await Coupon.find({ event: eventId }).sort({ coupon_id_short: 1 });

        res.status(200).json(coupons);
    } catch (error) {
        next(error);
    }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard-stats  (accessed via /api/events/dashboard-stats conceptually)
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalEvents = await Event.countDocuments({ organizer: req.user.id });
        const activeEvents = await Event.countDocuments({ organizer: req.user.id, status: 'Active' });

        const eventIds = (await Event.find({ organizer: req.user.id }).select('_id')).map(e => e._id);
        const totalCouponsGenerated = await Coupon.countDocuments({ event: { $in: eventIds } });
        const totalCouponsRedeemed = await Coupon.countDocuments({ event: { $in: eventIds }, is_redeemed: true });

        res.status(200).json({
            totalEvents,
            activeEvents,
            totalCouponsGenerated,
            totalCouponsRedeemed
        });
    } catch (error) {
        next(error);
    }
};
// @desc    Get upcoming events (for admin dashboard)
// @route   GET /api/admin/upcoming-events
// @access  Private (Admin)
exports.getUpcomingEvents = async (req, res, next) => {
    try {
        const events = await Event.find({ organizer: req.user.id, date: { $gte: new Date() } }).sort({ date: 1 });
        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
};