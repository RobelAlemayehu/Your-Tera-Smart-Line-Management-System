'use strict';
const { QueueTicket, User, Service, Sequelize } = require('../models');

module.exports = {
    // 1. Join Queue
    joinQueue: async (user_id, service_id) => {
        // 1. Check if the user already has an active ticket for THIS specific service
        const existingTicket = await QueueTicket.findOne({
        where: {
            user_id,
            service_id,
            status: ['Waiting', 'In Progress'] // Only block if they haven't finished yet
        }
    });

    if (existingTicket) {
        // According to your DB, User 4 already has a 'Waiting' ticket for Service 1
        throw new Error('You already have an active ticket for this service.');
    }

    // 2. Fetch the service to get the current state
    const service = await Service.findByPk(service_id);
    if (!service || !service.is_active) {
        throw new Error('Service is currently unavailable.');
    }
    // 3. Create the ticket with the next ticket number
        // 1. Check if User exists first
        const user = await User.findByPk(user_id);
        if (!user) {
            throw new Error(`User with ID ${user_id} does not exist. Create the user first!`);
        }

        // 2. Check if Service exist
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
    },
    // 2. Get Queue by Service ID
    getQueueByService: async (service_id) => {
        try {
            return await QueueTicket.findAll({
                where: { service_id },
                include: [
                    { 
                        model: User, 
                        as: 'user',  
                        attributes: ['username', 'email'] 
                    }
                ],
                order: [['ticket_number', 'ASC']]
            });
        } catch (error) {
            throw new Error('Error fetching queue: ' + error.message);
        }
    },
    // 3. Get a User's specific active ticket
    getMyActiveTickets: async (user_id) => {
        return await QueueTicket.findAll({
            where: { 
                user_id, 
                status: ['Waiting', 'In Progress'] 
            },
            include: [{ 
                model: Service, 
                as: 'service',
                attributes: ['service_name', 'avg_wait_time'] 
            }],
            order: [['created_at', 'ASC']]
        });
    },
// 4. Get a User's single active ticket
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
// 5. Cancel own ticket
cancelTicket: async (ticket_id, user_id) => {
    const ticket = await QueueTicket.findOne({ where: { ticket_id, user_id } });
    if (!ticket) throw new Error('Ticket not found or unauthorized');
    
    ticket.status = 'Cancelled';
    await ticket.save();
    return { message: "You have left the queue." };
}
};
