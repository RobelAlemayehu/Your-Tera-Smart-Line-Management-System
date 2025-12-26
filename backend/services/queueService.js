'use strict';
const { QueueTicket, User, Service } = require('../models');

module.exports = {
    joinQueue: async (user_id, service_id) => {
        // 1. Check if User exists first
        const user = await User.findByPk(user_id);
        if (!user) {
            throw new Error(`User with ID ${user_id} does not exist. Create the user first!`);
        }

        // 2. Check if Service exists
        const service = await Service.findByPk(service_id);
        if (!service) {
            throw new Error(`Service with ID ${service_id} does not exist.`);
        }

        // 3. Get the next ticket number
        const lastTicket = await QueueTicket.max('ticket_number', { 
            where: { service_id } 
        });

        // 4. Create the ticket
        return await QueueTicket.create({
            user_id,
            service_id,
            ticket_number: (lastTicket || 0) + 1,
            status: 'Waiting'
        });
    }
};