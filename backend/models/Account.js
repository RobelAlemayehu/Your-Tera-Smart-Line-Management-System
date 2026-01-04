'use strict';

const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    password_hash: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: null,
        trim: true,
        sparse: true // Allows multiple nulls but enforces uniqueness for non-null values
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    collection: 'Accounts'
});

// Index for faster lookups
accountSchema.index({ user_id: 1 }, { unique: true });

const Accounts = mongoose.model('Accounts', accountSchema);

module.exports = Accounts;
