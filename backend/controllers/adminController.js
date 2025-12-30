const adminService = require('../services/adminService');
const queueService = require('../services/queueService'); 
const notificationService = require('../services/notificationService');

exports.deleteServiceTickets = async (req, res) => {
    try {
        const { service_id } = req.params;

        // 1. Find all users currently in this service's queue BEFORE deleting them
        const activeTickets = await Queue.findAll({ 
            where: { service_id, status: 'active' } 
        });

        // 2. Perform the actual mass deletion
        const result = await adminService.resetQueueForDay(service_id); 

        // 3. Notify all affected users
        if (activeTickets.length > 0) {
            await Promise.all(activeTickets.map(ticket => 
                notificationService.createNotification(
                    ticket.user_id, 
                    "The service queue has been reset and your ticket was removed.", 
                    "InApp"
                )
            ));
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// controllers/adminController.js

exports.adminDeleteTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const result = await queueService.deleteTicket(ticketId);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
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

exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await adminService.getAllTickets();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};