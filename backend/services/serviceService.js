'use strict';
const { Service } = require('../models');
const mongoose = require('mongoose');

module.exports = {
    createService: async (data) => {
        const { office_id, service_name, avg_wait_time } = data;
        
        // Convert office_id to ObjectId if it's a string
        const officeObjectId = mongoose.Types.ObjectId.isValid(office_id) 
            ? (typeof office_id === 'string' ? mongoose.Types.ObjectId(office_id) : office_id)
            : office_id;

        const service = new Service({
            office_id: officeObjectId,
            service_name,
            avg_wait_time
        });
        return await service.save();
    },

    getAllServices: async () => {
        // Only return active services
        return await Service.find({ is_active: true }).populate('office_id', 'office_name location');
    },

    getServiceById: async (service_id) => {
        if (!mongoose.Types.ObjectId.isValid(service_id)) {
            throw new Error('Invalid service ID format');
        }
        return await Service.findById(service_id).populate('office_id', 'office_name location');
    },

    getServicesByOffice: async (officeId) => {
        if (!mongoose.Types.ObjectId.isValid(officeId)) {
            throw new Error('Invalid office ID format');
        }
        const officeObjectId = mongoose.Types.ObjectId.isValid(officeId) 
            ? (typeof officeId === 'string' ? mongoose.Types.ObjectId(officeId) : officeId)
            : officeId;
        return await Service.find({ office_id: officeObjectId });
    },

    updateService: async (service_id, updateData) => {
        if (!mongoose.Types.ObjectId.isValid(service_id)) {
            throw new Error('Invalid service ID format');
        }
        
        // Convert office_id to ObjectId if it's being updated
        if (updateData.office_id) {
            updateData.office_id = mongoose.Types.ObjectId.isValid(updateData.office_id) 
                ? (typeof updateData.office_id === 'string' ? mongoose.Types.ObjectId(updateData.office_id) : updateData.office_id)
                : updateData.office_id;
        }

        const service = await Service.findByIdAndUpdate(
            service_id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!service) throw new Error('Service not found');
        return service;
    },

    deleteService: async (service_id) => {
        if (!mongoose.Types.ObjectId.isValid(service_id)) {
            throw new Error('Invalid service ID format');
        }
        const service = await Service.findByIdAndDelete(service_id);
        if (!service) throw new Error('Service not found');
        return service;
    }
};
