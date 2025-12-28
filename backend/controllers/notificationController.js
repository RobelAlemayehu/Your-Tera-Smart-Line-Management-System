'use strict';
const notificationService = require('../services/notificationService');

module.exports = {
    sendNotification: async (req, res) => {
    try {
        const { user_id, message } = req.body;
        
        if (!user_id || !message) {
            return res.status(400).json({ error: "user_id and message are required" });
        }

        const newNotification = await notificationService.createNotification(user_id, message);
        res.status(201).json({ 
            message: "Notification created successfully", 
            data: newNotification 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},
    getNotifications: async (req, res) => {
        try {
            const { userId } = req.params;
            const notifications = await notificationService.getUserNotifications(userId);
            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateStatus: async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 

        if (status === 'Sent') {
            await notificationService.markAsSent(id);
        } else if (status === 'Failed') {
            await notificationService.markAsFailed(id);
        } else if (status === 'Read') {
            await notificationService.markAsRead(id);
        } else {
            await notificationService.markAsPending(id);
        }
        const finalStatus = status || 'Pending';
        res.status(200).json({ message: `Notification ${id} updated to ${finalStatus}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }
};