'use strict';
const axios = require('axios');
const { Notification } = require('../models');
const mongoose = require('mongoose');

/**
 * Combined Notification Service: 
 * 1. Logs to Database (In-app notifications)
 * 2. Sends SMS via Traccar Gateway
 */
class NotificationService {
    constructor() {
        this.traccarToken = 'cKPSK8W0Q3uNnWzGFnR11t:APA91bFzfnlnLXe1vuC_mI_XZuIn3dYrsKbcjENwbb31by4FJ2B_SuwvnNfZcKTIugZ8LzswYlY_tfHl41Hp9VYOCc28URi-f32wQfirZ8Ijt1-L0yXGtDs'; 
        this.traccarUrl = 'https://www.traccar.org/sms/'; 
    }

    /**
     * The Master Function: Logs to DB and then sends SMS
     */
    async notifyUser(user_id, phoneNumber, message, type = 'SMS') {
        // Convert user_id to ObjectId if needed
        const userObjectId = mongoose.Types.ObjectId.isValid(user_id) 
            ? (typeof user_id === 'string' ? mongoose.Types.ObjectId(user_id) : user_id)
            : user_id;

        // 1. Create record in Database first
        const dbNotification = new Notification({
            user_id: userObjectId,
            message: message,
            type: type, 
            status: 'Pending', 
            created_at: new Date() 
        });
        await dbNotification.save();

        // 2. Try to send the actual SMS
        const smsSuccess = await this.sendTicketSMS(phoneNumber, message);

        // 3. Update DB status based on SMS result
        dbNotification.status = smsSuccess ? 'Sent' : 'Failed';
        await dbNotification.save();

        return dbNotification;
    }

    /**
     * Internal: Traccar SMS Logic
     */
    async sendTicketSMS(phoneNumber, message) {
        try {
            console.log(`📡 Sending SMS to ${phoneNumber}...`);
            const response = await axios.post(this.traccarUrl, {
                to: phoneNumber,
                message: message
            }, {
                headers: {
                    'Authorization': this.traccarToken,
                    'Content-Type': 'application/json'
                }
            });

            return response.status === 200 || response.status === 201;
        } catch (error) {
            console.error('❌ Traccar Error:', error.message);
            return false;
        }
    }

    /**
     * Fetching for Frontend
     */
    async getUserNotifications(user_id) {
        const userObjectId = mongoose.Types.ObjectId.isValid(user_id) 
            ? (typeof user_id === 'string' ? mongoose.Types.ObjectId(user_id) : user_id)
            : user_id;

        return await Notification.find({ user_id: userObjectId })
            .sort({ created_at: -1 });
    }

    async markAsRead(notification_id) {
        if (!mongoose.Types.ObjectId.isValid(notification_id)) {
            throw new Error('Invalid notification ID format');
        }
        return await Notification.findByIdAndUpdate(
            notification_id,
            { status: 'Read' },
            { new: true }
        );
    }

    async createNotification(user_id, message, type = 'InApp') {
        const userObjectId = mongoose.Types.ObjectId.isValid(user_id) 
            ? (typeof user_id === 'string' ? mongoose.Types.ObjectId(user_id) : user_id)
            : user_id;

        const notification = new Notification({
            user_id: userObjectId,
            message,
            type,
            status: 'Pending'
        });
        return await notification.save();
    }
}

module.exports = new NotificationService();
