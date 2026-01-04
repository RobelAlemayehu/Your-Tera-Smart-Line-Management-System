'use strict';
const { Service, Office } = require('../models');


module.exports = {
    //Create a new service (Admin only)
    createService: async (req, res) => {
        try{
            const { office_id, service_name, avg_wait_time } = req.body;
            const newService = await Service.create({
                office_id,
                service_name,
                avg_wait_time
            });
            res.status(201).json(newService);
        }catch (error){
            res.status(500).json({ error: error.message });
        }
    },

    //Get all services for a specific office

    getServiceByOffice: async (req, res) => {
        try{
            const result = await Service.findAll({
                where: { office_id: req.params.officeId }
            });
            res.status(200).json(result);
        } catch(error) {
            res.status(500).json({ error: error.message });
        }
    }


};