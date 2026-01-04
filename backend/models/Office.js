'use strict';

const mongoose = require('mongoose');

const officeSchema = new mongoose.Schema({
    office_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: false,
    collection: 'Offices'
});

const Office = mongoose.model('Office', officeSchema);

module.exports = Office;
