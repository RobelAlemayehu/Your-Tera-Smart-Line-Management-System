'use strict';
const serviceService = require('../services/serviceService');

module.exports = {
    addService: async (req, res) => {
        try {
            const newService = await serviceService.createService(req.body);
            res.status(201).json(newService);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    listServices: async (req, res) => {
        try {
            const services = await serviceService.getAllServices();
            res.status(200).json(services);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getServiceById: async (req, res) => {
        try {
            // FIX: Call the service layer, not the Model directly
            const service = await serviceService.getServiceById(req.params.id);
            if (!service) return res.status(404).json({ message: "Service not found" });
            res.status(200).json(service);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateService: async (req, res) => {
        try {
            const updatedService = await serviceService.updateService(req.params.id, req.body);
            if (!updatedService) return res.status(404).json({ message: "Service not found" });
            res.status(200).json(updatedService);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteService: async (req, res) => {
        try {
            const deleted = await serviceService.deleteService(req.params.id);
            if (!deleted) return res.status(404).json({ message: "Service not found" });
            res.status(200).json({ message: "Service deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};