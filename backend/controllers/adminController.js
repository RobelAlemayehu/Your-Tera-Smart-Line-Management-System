const adminService = require('../services/adminService');

// Make sure the name 'deleteServiceTickets' matches EXACTLY what you call in the route
exports.deleteServiceTickets = async (req, res) => {
    try {
        const { service_id } = req.params;
        const result = await adminService.resetQueueForDay(service_id); 
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTicket = async (req, res) => {
    try {
        const { service_id, ticket_id } = req.params; // Extracts both from the URL
        const result = await adminService.deleteSpecificTicket(service_id, ticket_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Also ensure your analytics function is exported
exports.getAnalytics = async (req, res) => {
    try {
        const stats = await adminService.getQueueAnalytics();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addService = async (req, res) => {
    try {
        // req.body contains the info sent from Postman
        const result = await adminService.createNewService(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



exports.getUsers = async (req, res) => {
    try {
        const users = await adminService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.changeRole = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { role } = req.body;
        const user = await adminService.updateUserRole(user_id, role);
        res.json({ message: "Role updated", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.patchService = async (req, res) => {
    try {
        const { service_id } = req.params;
        const { is_active } = req.body;
        const service = await adminService.toggleServiceStatus(service_id, is_active);
        res.json({ message: "Service status updated", service });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.patchTicket = async (req, res) => {
    try {
        const { ticket_id } = req.params;
        const { status } = req.body;
        const ticket = await adminService.updateTicketStatus(ticket_id, status);
        res.json({ message: "Ticket status updated", ticket });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
