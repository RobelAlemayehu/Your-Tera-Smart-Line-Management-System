'use strict';
const { Notification } = require('../models');

module.exports = {
    createNotification: async (user_id, message, type) => {
        return await Notification.create({
            user_id: user_id,
            message: message,
            type: type, 
            status: 'Pending', 
            created_at: new Date() 
        });
    },

    getUserNotifications: async (user_id) => {
        return await Notification.findAll({
            where: { user_id },
            order: [['created_at', 'DESC']]
        });
    },
    
    markAsRead: async (notification_id) => {
        return await Notification.update(
            { status: 'Read' },
            { where: { notification_id } }
        );
    },

    markAsSent: async (notification_id) => {
        return await Notification.update(
            { status: 'Sent' },
            { where: { notification_id } }
        );
    },

    markAsFailed: async (notification_id) => {
        return await Notification.update(
            { status: 'Failed' },
            { where: { notification_id } }
        );
    },
    markAsPending: async (notification_id) => {
    return await Notification.update(
        { status: 'Pending' }, // 'Pending' is already allowed in your ENUM
        { where: { notification_id: notification_id } }
    );
  }
};