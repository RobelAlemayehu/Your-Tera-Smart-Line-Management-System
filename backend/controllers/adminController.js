'use strict';

const adminService = require('../services/adminService');
const queueService = require('../services/queueService'); 
const notificationService = require('../services/notificationService');
const { QueueTicket } = require('../models'); // Ensure correct model name

module.exports = {
    // --- Queue Management (from develop) ---

    callNext: async (req, res) => {
        try {
            const { service_id } = req.body;
            const ticket = await adminService.callNext(service_id);
            res.status(200).json({ message: "Next customer called", ticket });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    completeTicket: async (req, res) => {
        try {
            const { id } = req.params;
            const ticket = await adminService.completeTicket(id);
            res.status(200).json({ message: "Service completed", ticket });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // --- Advanced Queue Control (from main) ---

    deleteServiceTickets: async (req, res) => {
        try {
            const { service_id } = req.params;

            // 1. Find all users currently in this service's queue BEFORE resetting
            const activeTickets = await QueueTicket.findAll({ 
                where: { service_id, status: 'Waiting' } // Standardized 'Waiting' status
            });

            // 2. Perform the actual mass deletion/reset
            const result = await adminService.resetQueueForDay(service_id); 

            // 3. Notify all affected users via InApp notification
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
    },

    adminDeleteTicket: async (req, res) => {
        try {
            const { ticketId } = req.params;
            const result = await queueService.deleteTicket(ticketId);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // --- Analytics & User Management ---

    getAnalytics: async (req, res) => {
        try {
            const stats = await adminService.getQueueAnalytics();
            res.status(200).json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getUsers: async (req, res) => {
        try {
            const users = await adminService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    changeRole: async (req, res) => {
        try {
            const { user_id } = req.params;
            const { role } = req.body;
            const user = await adminService.updateUserRole(user_id, role);
            res.json({ message: "Role updated", user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // --- Service & Ticket Patching ---

    patchService: async (req, res) => {
        try {
            const { service_id } = req.params;
            const { is_active } = req.body;
            const service = await adminService.toggleServiceStatus(service_id, is_active);
            res.json({ message: "Service status updated", service });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    patchTicket: async (req, res) => {
        try {
            const { ticket_id } = req.params;
            const { status } = req.body;
            const ticket = await adminService.updateTicketStatus(ticket_id, status);
            res.json({ message: "Ticket status updated", ticket });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getAllTickets: async (req, res) => {
        try {
            const tickets = await adminService.getAllTickets();
            res.json(tickets);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    addService: async (req, res) => {
        try {
            const service = await adminService.createService(req.body);
            res.status(201).json({ message: "Service created successfully", service });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};