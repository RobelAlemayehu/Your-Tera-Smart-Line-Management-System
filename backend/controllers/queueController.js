'use strict';
const { QueueTicket, Service } = require('../models');

module.exports = {

    //Logic for a user to join a queue

    joinQueue: async (req, res) => {
        try {
            const { service_id } = req.body;
            const user_id = req.user.user_id;

            //check if the service exist
            const service = await Service.findByPk(service_id);
            if(!service) return res.status(404).json({ message: "Service not found" });

            //Generate sequential ticket number
            const todayCount = await QueueTicket.count({ where: { service_id} });
            const ticket_number = `T-${100 + todayCount + 1}`;

            const ticket = await QueueTicket.create({
                user_id,
                service_id,
                ticket_number,
                status: 'waiting'
            });

            res.status(201).json({
                message: "Ticket issued successfully",
                ticket
            });

        }catch (error){
            res.status(500).json({ message: error.message });
        }

    }


}