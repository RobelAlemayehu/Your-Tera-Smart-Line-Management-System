'use strict';
const { QueueTicket, User, Service, Sequelize } = require('../models');
const notificationService = require('./notificationService'); 

module.exports = {
    // 1. Join Queue (Includes Position 6 check for initial join)
    joinQueue: async (user_id, service_id) => {
        const existingTicket = await QueueTicket.findOne({
            where: { user_id, service_id, status: ['Waiting', 'In Progress'] }
        });
        if (existingTicket) throw new Error('You already have an active ticket for this service.');

        const lastTicket = await QueueTicket.max('ticket_number', { where: { service_id } });
        const newTicket = await QueueTicket.create({
            user_id,
            service_id,
            ticket_number: (lastTicket || 0) + 1,
            status: 'Waiting'
        });

        // Optional: Check position immediately upon joining
        await module.exports.checkAndNotifyNewPositionSix(service_id);
        return newTicket;
    },

    // 2. Helper: Position Shift Detector (Both SMS & InApp for the new #6)
    checkAndNotifyNewPositionSix: async (service_id) => {
        const positionSixTicket = await QueueTicket.findOne({
            where: { service_id: service_id, status: 'Waiting' },
            order: [['ticket_number', 'ASC']],
            offset: 5, 
            include: [{ model: User, as: 'user' }]
        });

        if (positionSixTicket) {
            const userId = positionSixTicket.user_id;
            const message = "You are now at position 6! There are only 5 people in front of you.";
            await notificationService.createNotification(userId, message, 'SMS');
        }
    },

    // 3. Helper: Get Ticket By ID
    getTicketById: async (ticket_id) => {
        return await QueueTicket.findByPk(ticket_id);
    },

    // 4. Cancel Ticket (With specific InApp notification for the canceller)
    cancelTicket: async (ticket_id, user_id) => {
        const ticket = await QueueTicket.findOne({ where: { ticket_id, user_id } });
        if (!ticket) throw new Error('Ticket not found or unauthorized');

        const serviceId = ticket.service_id;
        ticket.status = 'Cancelled';
        await ticket.save();

        // Specific InApp notification for the user who cancelled
        await notificationService.createNotification(
            user_id, 
            `Your queue ticket (Number: ${ticket.ticket_number}) has been cancelled successfully.`, 
            'InApp'
        );

        // Check if the next person in line shifted to position 6
        await module.exports.checkAndNotifyNewPositionSix(serviceId);

        return { message: "Ticket cancelled successfully." };
    },

    // 5. Admin Delete Ticket
    deleteTicket: async (ticket_id) => {
        // 1. Find the ticket first to get user and service info
        const ticket = await QueueTicket.findByPk(ticket_id);
        if (!ticket) throw new Error('Ticket not found');

        const serviceId = ticket.service_id;
        const userId = ticket.user_id;

        // 2. Physically remove or update status
        await ticket.destroy(); 

        // 3. Notification for the deleted user (InApp)
        await notificationService.createNotification(
            userId, 
            `Your queue ticket (Number: ${ticket.ticket_number}) has been removed by an administrator.`, 
            'InApp'
        );

        // 4. Notification for the new 6th person (InApp + SMS)
        await module.exports.checkAndNotifyNewPositionSix(serviceId);

        return { message: "Admin successfully removed ticket and notified users." };
    },
    // 6. Get Queue Position Logic
    getQueuePosition: async (service_id, ticket_number) => {
        const service = await Service.findByPk(service_id);
        const waitPerPerson = service ? service.avg_wait_time : 0;

        const peopleAhead = await QueueTicket.count({
            where: {
                service_id: service_id,
                status: 'Waiting',
                ticket_number: { [Sequelize.Op.lt]: ticket_number }
            }
        });

        return {
            position: peopleAhead + 1,
            estimatedWaitTime: peopleAhead * waitPerPerson
        };
    },

    // 7. Get Queue By Service (for office view)
    getQueueByService: async (service_id) => {
        return await QueueTicket.findAll({
            where: { service_id },
            include: [
                { model: User, as: 'user', attributes: ['user_id', 'username', 'email'] },
                { model: Service, as: 'service', attributes: ['service_id', 'service_name'] }
            ],
            order: [['ticket_number', 'ASC']]
        });
    },

    // 8. Get My Active Tickets
    getMyActiveTickets: async (user_id) => {
        return await QueueTicket.findAll({
            where: {
                user_id: user_id,
                status: ['Waiting', 'Serving']
            },
            include: [
                { model: Service, as: 'service', attributes: ['service_id', 'service_name'] }
            ],
            order: [['created_at', 'DESC']]
        });
    }
};