'use strict';
const { Office } = require('../models');
const mongoose = require('mongoose');

module.exports = {
    getAllOffices: async () => {
        return await Office.find();
    },

    getOfficeById: async (id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid office ID format');
        }
        return await Office.findById(id);
    },

    createOffice: async (data) => {
        const office = new Office(data);
        return await office.save();
    },

    updateOffice: async (id, updateData) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid office ID format');
        }
        const office = await Office.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!office) throw new Error('Office not found');
        return office;
    },

    deleteOffice: async (id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid office ID format');
        }
        const office = await Office.findByIdAndDelete(id);
        if (!office) throw new Error('Office not found');
        return office;
    }
};
