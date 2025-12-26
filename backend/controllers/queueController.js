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

/**
 * Get the logged-in user's active ticket
 */
exports.getMyStatus = async (req, res) => {
    try {
        const userId = req.user.id; 
        const tickets = await queueService.getMyActiveTickets(userId);

        if (!tickets || tickets.length === 0) {
            return res.status(200).json({ message: "No active tickets found." });
        }

        // Map through all tickets to get specific positions
        const results = await Promise.all(tickets.map(async (t) => {
            const pos = await queueService.getQueuePosition(t.service_id, t.ticket_number);
            return {
                ticket_id: t.ticket_id,
                service_name: t.service.service_name,
                ticket_number: t.ticket_number,
                status: t.status,
                ...pos
            };
        }));

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/**
 * Allow a user to cancel their own ticket
 */
exports.cancelMyTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const result = await queueService.cancelTicket(ticketId, req.user.id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};