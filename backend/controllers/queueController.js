'use strict';
const queueService = require('../services/queueService');
const notificationService = require('../services/notificationService');

// 1. Join a Queue (Citizen action)
exports.joinQueue = async (req, res) => {
    try {
        // Support both camelCase (develop) and snake_case (main) for frontend flexibility
        const serviceId = req.body.serviceId || req.body.service_id;
        let phoneNumber = req.body.phone_number || req.body.phoneNumber;
        
        // Use user_id from the verified JWT token (authMiddleware)
        const userId = req.user.user_id || req.user.id;

        if (!serviceId) {
            return res.status(400).json({ error: "service_id is required" });
        }

        // If phone number not provided, get it from user profile
        if (!phoneNumber) {
            const { User } = require('../models');
            const user = await User.findById(userId);
            if (!user || !user.phone_number) {
                return res.status(400).json({ error: "Phone number is required" });
            }
            phoneNumber = user.phone_number;
        }

        const ticket = await queueService.joinQueue(userId, serviceId, phoneNumber);

        res.status(201).json({
            success: true,
            message: "Successfully joined the queue!",
            data: ticket
        });
    } catch (error) {
        console.error("Join Queue Error:", error.message);
        res.status(400).json({ success: false, error: error.message });
    }
};

// 2. Get Live Status for Logged-in User (Citizen Dashboard)
exports.getMyStatus = async (req, res) => {
    try {
        const userId = req.user.user_id || req.user.id; 
        const tickets = await queueService.getMyActiveTickets(userId);

        if (!tickets || tickets.length === 0) {
            return res.status(200).json({ message: "No active tickets found.", tickets: [] });
        }

        // Map through tickets to add live position data
        const results = await Promise.all(tickets.map(async (t) => {
            const liveData = await queueService.getLiveStatus(t._id.toString());
            return {
                ticket_id: t._id.toString(),
                service_name: t.service_id?.service_name || 'Unknown',
                ticket_number: t.ticket_number,
                status: t.status,
                ...liveData
            };
        }));

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Update Ticket Status (Staff/Admin action - Call Next/Complete)
exports.updateStatus = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { status } = req.body; 

        const updatedTicket = await queueService.updateTicketStatus(ticketId, status);
        
        res.status(200).json({
            success: true,
            message: `Ticket marked as ${status}`,
            updatedTicket
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 4. Cancel My Ticket (Citizen action)
exports.cancelMyTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const userId = req.user.user_id || req.user.id;

        const result = await queueService.cancelTicket(ticketId, userId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 5. Get All Tickets for a Service (Office Display view)
exports.getOfficeQueue = async (req, res) => { 
    try {
        const { serviceId } = req.params;
        const tickets = await queueService.getQueueByService(serviceId);
        res.status(200).json(tickets); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};