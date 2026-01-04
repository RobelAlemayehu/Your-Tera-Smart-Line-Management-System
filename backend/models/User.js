'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false // Don't return password by default
    },
    phone_number: {
        type: String,
        required: true,
        unique: true,
        trim: true
        // Note: phone_number is kept for SMS notifications, not for authentication
    },
    role: {
        type: String,
        enum: ['Customer', 'Admin', 'Student'],
        default: 'Customer',
        required: true
    },
    reset_code: {
        type: String,
        default: null
    },
    reset_expiry: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    collection: 'Users'
});

// Indexes for faster lookups
// Note: email and phone_number indexes are automatically created by unique: true in schema

// Virtual for account relationship
userSchema.virtual('account', {
    ref: 'Accounts',
    localField: '_id',
    foreignField: 'user_id',
    justOne: true
});

// Virtual for tickets relationship
userSchema.virtual('tickets', {
    ref: 'QueueTicket',
    localField: '_id',
    foreignField: 'user_id'
});

// Enable virtual fields in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
