'use strict';

const mongoose = require('mongoose');

const queueTicketSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    ticket_number: {
        type: String,
        required: true,
        trim: true
    },
    phone_number: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['Waiting', 'Serving', 'Completed', 'Cancelled'],
        default: 'Waiting',
        required: true
    }
}, {
    timestamps: true,
    collection: 'Queue_Tickets'
});

// Indexes for faster queries
queueTicketSchema.index({ service_id: 1, status: 1 });
queueTicketSchema.index({ user_id: 1 });
queueTicketSchema.index({ ticket_number: 1 }, { unique: true });

const QueueTicket = mongoose.model('QueueTicket', queueTicketSchema);

module.exports = QueueTicket;
