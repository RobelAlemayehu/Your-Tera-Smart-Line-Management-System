'use strict';
const serviceService = require('../services/serviceService');

module.exports = {
    // Create a new service (Admin only)
    addService: async (req, res) => {
        try {
            // req.body includes { office_id, service_name, avg_wait_time }
            const newService = await serviceService.createService(req.body);
            res.status(201).json(newService);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // List all services across all offices
    listServices: async (req, res) => {
        try {
            const services = await serviceService.getAllServices();
            res.status(200).json(services);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all services for a specific office (from main)
    getServiceByOffice: async (req, res) => {
        try {
            const services = await serviceService.getServicesByOffice(req.params.officeId);
            res.status(200).json(services);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get details for a single service
    getServiceById: async (req, res) => {
        try {
            const service = await serviceService.getServiceById(req.params.id);
            if (!service) return res.status(404).json({ message: "Service not found" });
            res.status(200).json(service);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update service details
    updateService: async (req, res) => {
        try {
            const updatedService = await serviceService.updateService(req.params.id, req.body);
            if (!updatedService) return res.status(404).json({ message: "Service not found" });
            res.status(200).json(updatedService);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete a service
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