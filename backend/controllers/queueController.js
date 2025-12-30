'use strict';
const queueService = require('../services/queueService');
const notificationService = require('../services/notificationService');

exports.joinQueue = async (req, res) => {
    try {
        const { user_id, service_id } = req.body; 

        if (!user_id || !service_id) {
            return res.status(400).json({ error: "user_id and service_id are required" });
        }

        const ticket = await queueService.joinQueue(user_id, service_id);
        await notificationService.createNotification(user_id, "You have successfully joined the queue!", "InApp");

        const posData = await queueService.getQueuePosition(service_id, ticket.ticket_number);
        if (posData.position === 6) {
            await notificationService.createNotification(user_id, "There are 5 people in front of you.", "SMS");
        }

        res.status(201).json({
            message: "Ticket created successfully!",
            data: ticket
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.cancelMyTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const user_id = req.user.user_id; // Standardized key from your updated jwt.sign

        // This call will now work because getTicketById is defined above
        const ticket = await queueService.getTicketById(ticketId);
        
        if (!ticket || ticket.user_id !== user_id) {
            return res.status(404).json({ error: "Ticket not found or unauthorized" });
        }

        const result = await queueService.cancelTicket(ticketId, user_id);
        
        // After cancellation, the service automatically checks for position 6 shifts
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
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

exports.getMyStatus = async (req, res) => {
    try {
        const userId = req.user.user_id || req.user.id; 
        const tickets = await queueService.getMyActiveTickets(userId);

        if (!tickets || tickets.length === 0) {
            return res.status(200).json({ message: "No active tickets found." });
        }

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