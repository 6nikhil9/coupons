// backend/controllers/event.controller.js
const Event = require('../models/Event');
const Coupon = require('../models/Coupon');
const { createQrCodeData } = require('../utils/qrCodeGenerator');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

// @desc    Get all events (for admin dashboard)
// @route   GET /api/events or /api/admin/events
// @access  Private (Admin)
exports.getEvents = async (req, res, next) => {
    try {
        const events = await Event.find({ organizer: req.user.id }).sort({ date: -1 });
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
    try {
        const event = await Event.create({
            name,
            date,
            venue,
            description,
            organizer: req.user.id
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
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }
        event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }
        await Coupon.deleteMany({ event: req.params.id });
        await Event.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Event removed' });
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
        return res.status(400).json({ message: 'Please specify a valid number of coupons.' });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized.' });
        }

        const generatedCoupons = [];
        const existingCouponCount = await Coupon.countDocuments({ event: eventId });

        for (let i = 0; i < count; i++) {
            const secureHash = require('crypto').randomBytes(32).toString('hex');
            const coupon_id_short = `C${(existingCouponCount + i + 1).toString().padStart(4, '0')}`;
            
            generatedCoupons.push({
                event: event._id,
                coupon_id_short,
                secureHash
            });
        }
        
        await Coupon.insertMany(generatedCoupons);

        res.status(201).json({
            message: `${count} coupons generated successfully!`,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all coupons for a specific event
// @route   GET /api/events/:eventId/coupons
// @access  Private (Admin)
exports.getCouponsForEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event || event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized.' });
        }
        const coupons = await Coupon.find({ event: req.params.eventId }).sort({ coupon_id_short: 1 });
        res.status(200).json(coupons);
    } catch (error) {
        next(error);
    }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard-stats
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


// @desc    Generate and download QR code PDF for an event
// @route   GET /api/admin/events/:eventId/download-pdf
// @access  Private (Admin)
exports.downloadQrPdf = async (req, res, next) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const coupons = await Coupon.find({ event: eventId, is_redeemed: false }).sort({ coupon_id_short: 1 });
        if (coupons.length === 0) {
            return res.status(404).json({ message: 'No unredeemed coupons found for this event.' });
        }

        const doc = new PDFDocument({ margin: 30, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="event_${event.name.replace(/\s+/g, '_')}_coupons.pdf"`);
        doc.pipe(res);

        const qrSize = 120;
        const margin = 20;
        const couponsPerRow = 4;
        const rowsPerPage = 5;
        let couponCount = 0;

        for (const coupon of coupons) {
            if (couponCount > 0 && couponCount % (couponsPerRow * rowsPerPage) === 0) {
                doc.addPage();
            }

            const rowIndex = Math.floor((couponCount % (couponsPerRow * rowsPerPage)) / couponsPerRow);
            const colIndex = couponCount % couponsPerRow;
            
            const x = doc.page.margins.left + colIndex * (qrSize + margin);
            const y = doc.page.margins.top + rowIndex * (qrSize + margin + 20); // Extra space for text

            const qrDataString = createQrCodeData(coupon.event, coupon.coupon_id_short, coupon.secureHash);
            const qrDataURL = await QRCode.toDataURL(qrDataString);

            doc.rect(x, y, qrSize, qrSize + 20).stroke(); // Draw a box for the coupon
            doc.image(qrDataURL, x + 10, y + 5, { width: qrSize - 20 });
            doc.fontSize(10).text(event.name, x, y + qrSize + 5, { width: qrSize, align: 'center' });
            doc.fontSize(8).text(coupon.coupon_id_short, x, y + qrSize + 15, { width: qrSize, align: 'center' });
            
            couponCount++;
        }

        doc.end();

    } catch (error) {
        next(error);
    }
};