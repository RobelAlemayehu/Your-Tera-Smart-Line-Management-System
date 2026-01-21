'use strict';

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    office_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Office',
        required: true
    },
    service_name: {
        type: String,
        required: true,
        trim: true
    },
    avg_wait_time: {
        type: Number,
        required: true,
        min: 0
    },
    is_active: {
        type: Boolean,
        default: true,
        required: true
    },
    required_documents: {
        type: [String],
        default: []
    }
}, {
    timestamps: false,
    collection: 'Services'
});

// Index for faster lookups
serviceSchema.index({ office_id: 1 });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
