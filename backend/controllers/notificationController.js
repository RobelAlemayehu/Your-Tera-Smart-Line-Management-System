'use strict';
const { Notification } = require('../models');
const mongoose = require('mongoose');

module.exports = {
    sendNotification: async (req, res) => {
        try {
            const { user_id, message, type } = req.body;
            
            if (!user_id || !message) {
                return res.status(400).json({ error: "user_id and message are required" });
            }

            const notification = await Notification.create({
                user_id: mongoose.Types.ObjectId.isValid(user_id) 
                    ? (typeof user_id === 'string' ? mongoose.Types.ObjectId(user_id) : user_id)
                    : user_id,
                message,
                type: type || 'InApp',
                status: 'Pending'
            });

            res.status(201).json({ 
                message: "Notification created successfully", 
                data: notification 
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getNotifications: async (req, res) => {
        try {
            const { userId } = req.params;
            
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ error: "Invalid user ID format" });
            }

            const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
                ? (typeof userId === 'string' ? mongoose.Types.ObjectId(userId) : userId)
                : userId;

            const notifications = await Notification.find({ user_id: userObjectId })
                .sort({ created_at: -1 });
            
            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body; 

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid notification ID format" });
            }

            if (!status || !['Sent', 'Failed', 'Pending', 'Read'].includes(status)) {
                return res.status(400).json({ error: "Valid status is required (Sent, Failed, Pending, Read)" });
            }

            const notification = await Notification.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );

            if (!notification) {
                return res.status(404).json({ error: "Notification not found" });
            }

            res.status(200).json({ 
                message: `Notification ${id} updated to ${status}`,
                notification
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
