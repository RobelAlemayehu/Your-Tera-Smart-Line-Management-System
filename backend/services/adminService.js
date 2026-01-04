'use strict';
const { QueueTicket, Service, User } = require('../models');
const mongoose = require('mongoose');

class AdminService {
    // --- CORE QUEUE ACTIONS (from develop) ---

    async callNext(service_id) {
        const serviceObjectId = mongoose.Types.ObjectId.isValid(service_id) 
            ? (typeof service_id === 'string' ? mongoose.Types.ObjectId(service_id) : service_id)
            : service_id;

        const nextTicket = await QueueTicket.findOne({
            service_id: serviceObjectId,
            status: 'Waiting'
        }).sort({ position: 1 });

        if (!nextTicket) throw new Error('No customers waiting for this service.');

        nextTicket.status = 'Serving';
        await nextTicket.save();
        return nextTicket;
    }

    async completeTicket(ticket_id) {
        if (!mongoose.Types.ObjectId.isValid(ticket_id)) {
            throw new Error('Invalid ticket ID format');
        }
        const ticket = await QueueTicket.findById(ticket_id);
        if (!ticket) throw new Error('Ticket not found.');
        ticket.status = 'Completed';
        await ticket.save();
        return ticket;
    }

    async cancelTicket(ticket_id) {
        if (!mongoose.Types.ObjectId.isValid(ticket_id)) {
            throw new Error('Invalid ticket ID format');
        }
        const ticket = await QueueTicket.findById(ticket_id);
        if (!ticket) throw new Error('Ticket not found.');
        ticket.status = 'Cancelled';
        await ticket.save();
        return ticket;
    }

    // --- ADMIN DASHBOARD ACTIONS (from main) ---

    async getQueueAnalytics() {
        const analytics = await QueueTicket.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    status: '$_id',
                    count: 1,
                    _id: 0
                }
            }
        ]);
        return analytics;
    }

    async getAllTickets() {
        return await QueueTicket.find()
            .populate('user_id', 'fullname email phone_number')
            .populate('service_id', 'service_name office_id')
            .sort({ createdAt: -1 });
    }

    async getAllUsers() {
        return await User.find().select('-password');
    }

    async createNewService(serviceData) {
        const service = new Service(serviceData);
        return await service.save();
    }

    async resetQueueForDay(service_id) {
        const serviceObjectId = mongoose.Types.ObjectId.isValid(service_id) 
            ? (typeof service_id === 'string' ? mongoose.Types.ObjectId(service_id) : service_id)
            : service_id;

        const result = await QueueTicket.deleteMany({ 
            service_id: serviceObjectId, 
            status: 'Waiting' 
        });
        return { message: `Successfully cleared ${result.deletedCount} waiting tickets.` };
    }

    async updateUserRole(user_id, role) {
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            throw new Error('Invalid user ID format');
        }
        const user = await User.findByIdAndUpdate(
            user_id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');
        if (!user) throw new Error('User not found');
        return user;
    }

    async toggleServiceStatus(service_id, is_active) {
        if (!mongoose.Types.ObjectId.isValid(service_id)) {
            throw new Error('Invalid service ID format');
        }
        const service = await Service.findByIdAndUpdate(
            service_id,
            { is_active },
            { new: true }
        );
        if (!service) throw new Error('Service not found');
        return service;
    }

    async updateTicketStatus(ticket_id, status) {
        if (!mongoose.Types.ObjectId.isValid(ticket_id)) {
            throw new Error('Invalid ticket ID format');
        }
        const ticket = await QueueTicket.findByIdAndUpdate(
            ticket_id,
            { status },
            { new: true, runValidators: true }
        );
        if (!ticket) throw new Error('Ticket not found');
        return ticket;
    }
}

module.exports = new AdminService();
