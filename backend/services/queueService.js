'use strict';
const { QueueTicket, User, Service } = require('../models');
const mongoose = require('mongoose');
const notificationService = require('./notificationService');

class QueueService {
    // 1. Join Queue (With Smart Ticket Numbering & SMS)
    async joinQueue(userId, serviceId, phoneNumber) {
        // Convert IDs to ObjectId
        const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
            ? (typeof userId === 'string' ? mongoose.Types.ObjectId(userId) : userId)
            : userId;
        const serviceObjectId = mongoose.Types.ObjectId.isValid(serviceId) 
            ? (typeof serviceId === 'string' ? mongoose.Types.ObjectId(serviceId) : serviceId)
            : serviceId;

        // Check for active tickets
        const existingTicket = await QueueTicket.findOne({
            user_id: userObjectId,
            service_id: serviceObjectId,
            status: { $in: ['Waiting', 'Serving'] }
        });
        if (existingTicket) throw new Error('You are already in this queue.');

        const service = await Service.findById(serviceObjectId);
        if (!service) throw new Error('Service not found.');

        // Calculate Position
        const peopleAhead = await QueueTicket.countDocuments({
            service_id: serviceObjectId,
            status: 'Waiting'
        });
        const nextPosition = peopleAhead + 1;

        // Generate Ticket Number (Prefix-100+Pos)
        const prefix = service.service_name ? service.service_name.substring(0, 2).toUpperCase() : 'TK';
        const ticketNumber = `${prefix}-${100 + nextPosition}`;
        const estimatedWaitTime = peopleAhead * (service.avg_wait_time || 15);

        // Create Ticket
        const ticket = new QueueTicket({
            user_id: userObjectId,
            service_id: serviceObjectId,
            ticket_number: ticketNumber,
            phone_number: phoneNumber,
            position: nextPosition,
            status: 'Waiting'
        });
        await ticket.save();

        // Notify User
        await notificationService.notifyUser(
            userId.toString(),
            phoneNumber,
            `Smart Line: Ticket ${ticketNumber}. ${peopleAhead} ahead. Est. wait: ${estimatedWaitTime} mins.`
        );

        return ticket;
    }

    // 2. Update Status (With "Turn Notification" and "5-Back Notification")
    async updateTicketStatus(ticketId, newStatus) {
        if (!mongoose.Types.ObjectId.isValid(ticketId)) {
            throw new Error('Invalid ticket ID format');
        }
        
        const ticket = await QueueTicket.findById(ticketId).populate('user_id', 'phone_number');
        if (!ticket) throw new Error('Ticket not found');

        ticket.status = newStatus;
        await ticket.save();

        if (newStatus === 'Serving') {
            // Notify the person currently called
            await notificationService.notifyUser(
                ticket.user_id._id.toString(),
                ticket.phone_number,
                `Smart Line: It is your turn! Please proceed to the counter for ${ticket.ticket_number}.`
            );

            // Notify the person 5 spots behind (Position Shift Detector)
            const targetPosition = ticket.position + 5;
            const personFiveBack = await QueueTicket.findOne({
                position: targetPosition,
                service_id: ticket.service_id,
                status: 'Waiting'
            }).populate('user_id');

            if (personFiveBack) {
                await notificationService.notifyUser(
                    personFiveBack.user_id._id.toString(),
                    personFiveBack.phone_number,
                    `Smart Line: Reminder! Only 5 people ahead. Please head to the office now.`
                );
            }
        }
        return ticket;
    }

    // 3. Cancel Ticket (User side)
    async cancelTicket(ticketId, userId) {
        const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
            ? (typeof userId === 'string' ? mongoose.Types.ObjectId(userId) : userId)
            : userId;
        const ticketObjectId = mongoose.Types.ObjectId.isValid(ticketId) 
            ? (typeof ticketId === 'string' ? mongoose.Types.ObjectId(ticketId) : ticketId)
            : ticketId;

        const ticket = await QueueTicket.findOne({ 
            _id: ticketObjectId, 
            user_id: userObjectId 
        });
        if (!ticket) throw new Error('Ticket not found or unauthorized');

        ticket.status = 'Cancelled';
        await ticket.save();

        await notificationService.notifyUser(
            userId.toString(),
            ticket.phone_number,
            `Your ticket ${ticket.ticket_number} has been cancelled.`
        );
        return { message: "Ticket cancelled successfully." };
    }

    // 4. Get Live Status for Frontend
    async getLiveStatus(ticketId) {
        if (!mongoose.Types.ObjectId.isValid(ticketId)) {
            throw new Error('Invalid ticket ID format');
        }

        const ticket = await QueueTicket.findById(ticketId);
        if (!ticket || ticket.status !== 'Waiting') return { status: 'Served' };

        const peopleAhead = await QueueTicket.countDocuments({
            service_id: ticket.service_id,
            status: 'Waiting',
            position: { $lt: ticket.position }
        });

        const service = await Service.findById(ticket.service_id);
        const waitTime = service ? service.avg_wait_time : 15;

        return {
            ticketNumber: ticket.ticket_number,
            position: peopleAhead + 1,
            estimatedWaitTime: peopleAhead * waitTime
        };
    }

    // 5. Get My Active Tickets (For User Dashboard)
    async getMyActiveTickets(userId) {
        const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
            ? (typeof userId === 'string' ? mongoose.Types.ObjectId(userId) : userId)
            : userId;

        return await QueueTicket.find({
            user_id: userObjectId,
            status: { $in: ['Waiting', 'Serving'] }
        })
        .populate('service_id', 'service_name')
        .sort({ createdAt: -1 });
    }

    // Delete ticket
    async deleteTicket(ticketId) {
        if (!mongoose.Types.ObjectId.isValid(ticketId)) {
            throw new Error('Invalid ticket ID format');
        }
        const ticket = await QueueTicket.findByIdAndDelete(ticketId);
        if (!ticket) throw new Error('Ticket not found');
        return { message: "Ticket deleted successfully" };
    }

    // Get queue by service
    async getQueueByService(serviceId) {
        const serviceObjectId = mongoose.Types.ObjectId.isValid(serviceId) 
            ? (typeof serviceId === 'string' ? mongoose.Types.ObjectId(serviceId) : serviceId)
            : serviceId;

        const tickets = await QueueTicket.find({ service_id: serviceObjectId })
            .populate('user_id', 'fullname email phone_number')
            .sort({ position: 1 });

        const service = await Service.findById(serviceObjectId);

        return {
            service: service || null,
            current_serving: tickets.find(t => t.status === 'Serving') || null,
            queue: tickets.filter(t => t.status === 'Waiting')
        };
    }
}

module.exports = new QueueService();
