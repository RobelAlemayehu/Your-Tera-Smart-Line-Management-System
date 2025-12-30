const { QueueTicket, Service, User, sequelize } = require('../models');

const getQueueAnalytics = async () => {
    try {
        return await QueueTicket.findAll({
            attributes: [
                'status', 
                [sequelize.fn('COUNT', sequelize.col('ticket_id')), 'count']
            ],
            group: ['status'],
            raw: true 
        });
    } catch (error) {
        throw new Error('Failed to fetch queue analytics: ' + error.message);
    }
};

const resetQueueForDay = async (service_id) => {
    if (!service_id) {
        throw new Error('Service ID is required to reset the queue.');
    }

    try {
        // Matches your DB: uses 'service_id' and 'status'
        const deletedCount = await QueueTicket.destroy({ 
            where: { 
                service_id, 
                status: 'Waiting' 
            } 
        });

        return { message: `Successfully cleared ${deletedCount} waiting tickets.` };
    } catch (error) {
        throw new Error('Error resetting queue: ' + error.message);
    }
};
const deleteSpecificTicket = async (service_id, ticket_id) => {
    try {
        const deletedCount = await QueueTicket.destroy({ 
            where: { 
                service_id: service_id, 
                ticket_id: ticket_id 
            } 
        });

        if (deletedCount === 0) {
            throw new Error('Ticket not found in this service.');
        }

        return { message: `Ticket ${ticket_id} in service ${service_id} deleted successfully.` };
    } catch (error) {
        throw new Error('Error deleting ticket: ' + error.message);
    }
};

const createNewService = async (serviceData) => {
    try {
        // serviceData should contain { service_name, description, etc. }
        const newService = await Service.create(serviceData);
        return {
            message: "New service added successfully",
            service: newService
        };
    } catch (error) {
        // Handle validation errors (e.g., if the service name already exists)
        throw new Error('Failed to create service: ' + error.message);
    }
};

// USER MANAGEMENT
const getAllUsers = async () => {
    return await User.findAll({ attributes: { exclude: ['password'] } });
};

const updateUserRole = async (user_id, role) => {
    const user = await User.findByPk(user_id);
    if (!user) throw new Error('User not found');
    user.role = role;
    await user.save();
    return user;
};

// SERVICE TOGGLE (Soft Delete)
const toggleServiceStatus = async (service_id, is_active) => {
    const service = await Service.findByPk(service_id);
    if (!service) throw new Error('Service not found');
    service.is_active = is_active;
    await service.save();
    return service;
};

// TICKET STATUS CONTROL
const updateTicketStatus = async (ticket_id, status) => {
    const ticket = await QueueTicket.findByPk(ticket_id);
    if (!ticket) throw new Error('Ticket not found');
    ticket.status = status; // e.g., 'In Progress', 'Completed', 'Cancelled'
    await ticket.save();
    return ticket;
};

// GET ALL TICKETS FOR ADMIN
const getAllTickets = async () => {
    return await QueueTicket.findAll({
        include: [
            { model: User, as: 'user', attributes: ['user_id', 'username', 'email', 'phone_number'] },
            { model: Service, as: 'service', attributes: ['service_id', 'service_name'] }
        ],
        order: [['created_at', 'DESC']]
    });
};

module.exports = { 
    getQueueAnalytics, 
    resetQueueForDay, 
    deleteSpecificTicket, 
    createNewService,
    getAllUsers, 
    updateUserRole, 
    toggleServiceStatus, 
    updateTicketStatus,
    getAllTickets
};