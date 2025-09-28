// backend/models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Event name is required'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Event date is required']
    },
    venue: {
        type: String,
        required: [true, 'Event venue is required'],
        trim: true
    },
    description: { // Food details / description
        type: String,
        required: false,
        default: 'No specific food details provided.'
    },
    organizer: { // Reference to the admin who created the event
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Draft', 'Active', 'Completed', 'Cancelled'],
        default: 'Active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', EventSchema);