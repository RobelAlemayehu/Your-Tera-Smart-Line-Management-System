'use strict';
const officeService = require('../services/officeService');

module.exports = {
    // List all offices
    getOffices: async (req, res) => {
        try {
            const offices = await officeService.getAllOffices();
            res.status(200).json(offices);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Add a new office
    addOffice: async (req, res) => {
        try {
            const newOffice = await officeService.createOffice(req.body);
            res.status(201).json(newOffice);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update an office
    updateOffice: async (req, res) => {
        try {
            const updated = await officeService.updateOffice(req.params.id, req.body);
            res.status(200).json(updated);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    // Delete an office
    deleteOffice: async (req, res) => {
        try {
            await officeService.deleteOffice(req.params.id);
            res.status(200).json({ message: "Office deleted successfully" });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
};