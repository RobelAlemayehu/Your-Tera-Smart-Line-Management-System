'use strict';
const queueService = require('../services/queueService');

exports.joinQueue = async (req, res) => {
    try {
        // Change this line to read from req.body instead of req.user
        const { user_id, service_id } = req.body; 

        if (!user_id || !service_id) {
            return res.status(400).json({ error: "user_id and service_id are required" });
        }

        const ticket = await queueService.joinQueue(user_id, service_id);
        
        res.status(201).json({
            message: "Ticket created successfully!",
            data: ticket
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOfficeQueue = async (req, res) => { 
    try {
        const { serviceId } = req.params;
        const tickets = await queueService.getQueueByService(serviceId);
        res.status(200).json(tickets); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTicketStatus = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { status } = req.body;
        const ticket = await queueService.updateStatus(ticketId, status);
        res.status(200).json({ message: `Ticket status updated to ${status}`, ticket });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};