'use strict';
const { Office } = require('../models');

module.exports = {
    getAllOffices: async () => {
        return await Office.findAll();
    },

    getOfficeById: async (id) => {
        return await Office.findByPk(id);
    },

    createOffice: async (data) => {
        return await Office.create(data);
    },

    updateOffice: async (id, updateData) => {
        const office = await Office.findByPk(id);
        if (!office) throw new Error('Office not found');
        return await office.update(updateData);
    },

    deleteOffice: async (id) => {
        const office = await Office.findByPk(id);
        if (!office) throw new Error('Office not found');
        return await office.destroy();
    }
};