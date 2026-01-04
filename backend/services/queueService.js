'use strict';
const { QueueTicket, Service, sequelize } = require('../models');
const { Op } = require('sequelize');
const notificationService = require('./notificationService');

class QueueService {
    async joinQueue(userId, serviceId, officeId, phoneNumber) {
        // 1. Check for duplicate entries (Match DB column names)
        const existingTicket = await QueueTicket.findOne({
            where: { 
                user_id: userId,        // Changed from userId
                service_id: serviceId,  // Changed from serviceId
                status: 'Waiting' 
            }
        });
        
        if (existingTicket) {
            throw new Error('You are already in this queue.');
        }

        const service = await Service.findByPk(serviceId);
        if (!service) throw new Error('Service not found.');

        const peopleAhead = await QueueTicket.count({
            where: { 
                service_id: serviceId, // Changed from serviceId
                status: 'Waiting' 
            }
        });

        const nextPosition = peopleAhead + 1;
        const prefix = service.service_name ? service.service_name.substring(0, 2).toUpperCase() : 'TK';
        const ticketNumber = `${prefix}-${100 + nextPosition}`;

        // 2. USE avg_wait_time (Matches your DESCRIBE output)
        const estimatedWaitTime = peopleAhead * (service.avg_wait_time || 15);

        // 3. Create record using snake_case keys
        const ticket = await QueueTicket.create({
            user_id: userId,         // Changed to user_id
            service_id: serviceId,   // Changed to service_id
            ticket_number: ticketNumber,
            phone_number: phoneNumber,
            position: nextPosition,
            status: 'Waiting'
        });

        try {
            await notificationService.sendTicketSMS(
                phoneNumber,
                `Smart Line: Your ticket is ${ticketNumber}. There are ${peopleAhead} people ahead of you. Est. wait: ${estimatedWaitTime} mins.`
            );
        } catch (smsError) {
            console.error("SMS Failed but ticket created:", smsError.message);
        }

        return ticket;
    }

    async updateTicketStatus(ticketId, newStatus) {
        const ticket = await QueueTicket.findByPk(ticketId);
        if (!ticket) throw new Error('Ticket not found');

        ticket.status = newStatus;
        await ticket.save();

        if (newStatus === 'Serving') {
            await notificationService.sendTicketSMS(
                ticket.phone_number,
                `Smart Line: It is your turn! Please proceed to the counter with ticket ${ticket.ticket_number}.`
            );

            const targetPosition = ticket.position + 5;
            const personFiveBack = await QueueTicket.findOne({
                where: { 
                    position: targetPosition, 
                    service_id: ticket.service_id, // Changed to service_id
                    status: 'Waiting' 
                }
            });

            if (personFiveBack) {
                await notificationService.sendTicketSMS(
                    personFiveBack.phone_number,
                    `Smart Line: Just a reminder, only 5 people are ahead of you. Please head to the office now.`
                );
            }
        }

        return ticket;
    }

    async getLiveStatus(ticketId) {
        const ticket = await QueueTicket.findByPk(ticketId);
        if (!ticket || ticket.status !== 'Waiting') return { status: 'Served' };

        const position = await QueueTicket.count({
            where: {
                service_id: ticket.service_id, // Changed to service_id
                status: 'Waiting',
                position: { [Op.lt]: ticket.position }
            }
        });

        return {
            ticketNumber: ticket.ticket_number,
            position: position + 1,
            estimatedWaitTime: position * 15
        };
    }
}

module.exports = new QueueService();