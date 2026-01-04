'use strict';

const { Office } = require('../models');

module.exports = {
    getOffice: async (req, res) => {
        try{
            const offices = await Office.findAll();
            res.status(200).json(offices);
        }catch{
            res.status(500).json({ error: error.message });
        }
    },

    addOffice: async (req, res) => {
        try{
            const { name, location, type } = req.body;
            const newOffice = await Office.create({ name, location, type })  ;
            res.status(201).json(newOffice);
        }catch{
            res.status(500).json({ error: error.message });
        }
    }


};