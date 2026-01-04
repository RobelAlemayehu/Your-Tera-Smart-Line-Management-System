'use strict';

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['SMS', 'InApp'],
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Sent', 'Failed', 'Pending'],
        default: 'Pending',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: false,
    collection: 'Notifications'
});

// Index for faster lookups
notificationSchema.index({ user_id: 1 });
notificationSchema.index({ created_at: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
