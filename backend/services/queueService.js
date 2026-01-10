'use strict';
const { QueueTicket, User, Service } = require('../models');
const mongoose = require('mongoose');
const notificationService = require('./notificationService');

class QueueService {
    // 1. Join Queue (With Smart Ticket Numbering & Email Notifications)
    async joinQueue(userId, serviceId, phoneNumber) {
        // Convert IDs to ObjectId
        let userObjectId = userId;
        let serviceObjectId = serviceId;
        
        // Safely convert to ObjectId if string and valid
        if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
            userObjectId = new mongoose.Types.ObjectId(userId);
        }
        if (typeof serviceId === 'string' && mongoose.Types.ObjectId.isValid(serviceId)) {
            serviceObjectId = new mongoose.Types.ObjectId(serviceId);
        }

        // Check for active tickets
        const existingTicket = await QueueTicket.findOne({
            user_id: userObjectId,
            service_id: serviceObjectId,
            status: { $in: ['Waiting', 'Serving'] }
        });
        if (existingTicket) throw new Error('You are already in this queue.');

        const service = await Service.findById(serviceObjectId);
        if (!service) throw new Error('Service not found.');

        // Get user email for notifications
        const user = await User.findById(userObjectId);
        if (!user) throw new Error('User not found.');

        // Calculate Position
        const peopleAhead = await QueueTicket.countDocuments({
            service_id: serviceObjectId,
            status: 'Waiting'
        });
        const nextPosition = peopleAhead + 1;

        // Generate Dynamic Ticket Number (Prefix + Timestamp)
        const prefix = service.service_name ? service.service_name.substring(0, 2).toUpperCase() : 'TK';
        const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
        const ticketNumber = `${prefix}-${timestamp}`;
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

        // Send email notification asynchronously (don't wait for it)
        setImmediate(async () => {
            try {
                console.log(`Sending email notification to user ${userId} at ${user.email}`);
                await notificationService.notifyUser(
                    userId.toString(),
                    user.email,
                    `Your ticket ${ticketNumber} has been created. ${peopleAhead} people ahead of you. Estimated wait time: ${estimatedWaitTime} minutes.`,
                    'Email',
                    'Queue Ticket Created - Your Tera'
                );
                console.log('Email notification sent successfully');
            } catch (error) {
                console.error('Email notification failed:', error.message);
            }
        });

        return ticket;
    }

    // 2. Update Status (With "Turn Notification" and "5-Back Notification" via Email)
    async updateTicketStatus(ticketId, newStatus) {
        if (!mongoose.Types.ObjectId.isValid(ticketId)) {
            throw new Error('Invalid ticket ID format');
        }
        
        const ticket = await QueueTicket.findById(ticketId).populate('user_id', 'email fullname');
        if (!ticket) throw new Error('Ticket not found');

        ticket.status = newStatus;
        await ticket.save();

        if (newStatus === 'Serving') {
            // Notify the person currently called via email
            await notificationService.notifyUser(
                ticket.user_id._id.toString(),
                ticket.user_id.email,
                `It's your turn! Please proceed to the counter for ticket ${ticket.ticket_number}. Thank you for your patience.`,
                'Email',
                'Your Turn - Queue Notification'
            );

            // Notify the person 5 spots behind (Position Shift Detector)
            const targetPosition = ticket.position + 5;
            const personFiveBack = await QueueTicket.findOne({
                position: targetPosition,
                service_id: ticket.service_id,
                status: 'Waiting'
            }).populate('user_id', 'email fullname');

            if (personFiveBack) {
                await notificationService.notifyUser(
                    personFiveBack.user_id._id.toString(),
                    personFiveBack.user_id.email,
                    `Reminder: Only 5 people ahead of you in the queue. Please head to the office now for ticket ${personFiveBack.ticket_number}.`,
                    'Email',
                    'Queue Reminder - Your Tera'
                );
            }
        }
        return ticket;
    }

    // 3. Cancel Ticket (User side) with Email Notification
    async cancelTicket(ticketNumber, userId) {
        // First, find the ticket by ticket number only
        const ticket = await QueueTicket.findOne({ 
            ticket_number: ticketNumber
        }).populate('user_id', 'email fullname');
        
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        // Check if the user owns this ticket (try multiple formats)
        const userIdString = userId.toString();
        const ticketUserIdString = ticket.user_id._id.toString();
        
        if (userIdString !== ticketUserIdString) {
            throw new Error('Unauthorized - ticket belongs to different user');
        }

        // Check if ticket can be cancelled
        if (ticket.status !== 'Waiting') {
            throw new Error('Ticket cannot be cancelled - current status: ' + ticket.status);
        }

        ticket.status = 'Cancelled';
        await ticket.save();

        // Send cancellation email asynchronously
        setImmediate(async () => {
            try {
                await notificationService.notifyUser(
                    userId.toString(),
                    ticket.user_id.email,
                    `Your ticket ${ticket.ticket_number} has been cancelled successfully. You can join the queue again anytime.`,
                    'Email',
                    'Ticket Cancelled - Your Tera'
                );
            } catch (error) {
                console.error('Cancellation email failed:', error.message);
            }
        });
        
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
        let userObjectId = userId;
        
        // Safely convert to ObjectId if string and valid
        if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
            userObjectId = new mongoose.Types.ObjectId(userId);
        }

        return await QueueTicket.find({
            user_id: userObjectId,
            status: { $in: ['Waiting', 'Serving'] }
        })
        .populate({
            path: 'service_id',
            select: 'service_name office_id',
            populate: {
                path: 'office_id',
                select: 'office_name location'
            }
        })
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
        let serviceObjectId = serviceId;
        
        // Safely convert to ObjectId if string and valid
        if (typeof serviceId === 'string' && mongoose.Types.ObjectId.isValid(serviceId)) {
            serviceObjectId = new mongoose.Types.ObjectId(serviceId);
        }

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

    // Get My Tickets with Office and Service Details
    async getMyTicketsWithDetails(userId) {
        let userObjectId = userId;
        
        if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
            userObjectId = new mongoose.Types.ObjectId(userId);
        }

        return await QueueTicket.find({
            user_id: userObjectId
        })
        .populate({
            path: 'service_id',
            select: 'service_name office_id',
            populate: {
                path: 'office_id',
                select: 'office_name location'
            }
        })
        .sort({ createdAt: -1 });
    }

    // Get My Completed Tickets with Date Filter
    async getMyCompletedTickets(userId, startDate, endDate) {
        let userObjectId = userId;
        
        if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
            userObjectId = new mongoose.Types.ObjectId(userId);
        }

        const query = {
            user_id: userObjectId,
            status: { $in: ['Completed', 'Cancelled'] }
        };

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        return await QueueTicket.find(query)
        .populate({
            path: 'service_id',
            select: 'service_name office_id',
            populate: {
                path: 'office_id',
                select: 'office_name location'
            }
        })
        .sort({ createdAt: -1 });
    }
}

module.exports = new QueueService();
