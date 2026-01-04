'use strict';

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    session_token: {
        type: String,
        required: true,
        unique: true,
        primaryKey: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiry: {
        type: Date,
        required: true
    }
}, {
    timestamps: false,
    collection: 'Sessions'
});

// Index for faster lookups
// Note: session_token index is automatically created by unique: true in schema
sessionSchema.index({ user_id: 1 });
sessionSchema.index({ expiry: 1 }); // For TTL cleanup

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
