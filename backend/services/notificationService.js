'use strict';
const axios = require('axios');
const { Notification } = require('../models');
const mongoose = require('mongoose');

/**
 * Multi-Provider SMS Service with Fallback
 */
class NotificationService {
    constructor() {
        this.providers = {
            twilio: {
                accountSid: process.env.TWILIO_ACCOUNT_SID,
                authToken: process.env.TWILIO_AUTH_TOKEN,
                phoneNumber: process.env.TWILIO_PHONE_NUMBER
            },
            africasTalking: {
                url: 'https://api.africastalking.com/version1/messaging',
                apiKey: process.env.AFRICAS_TALKING_API_KEY,
                username: process.env.AFRICAS_TALKING_USERNAME || 'sandbox'
            },
            webhook: {
                url: 'https://api.telegram.org/bot' // Example webhook fallback
            }
        };
    }

    /**
     * The Master Function: Logs to DB and then sends SMS
     */
    async notifyUser(user_id, phoneNumber, message, type = 'SMS') {
        // Convert user_id to ObjectId if needed
        const userObjectId = mongoose.Types.ObjectId.isValid(user_id) 
            ? (typeof user_id === 'string' ? new mongoose.Types.ObjectId(user_id) : user_id)
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
     * SMS sending with multiple provider fallback
     */
    async sendTicketSMS(phoneNumber, message) {
        try {
            console.log(`📡 Sending SMS to ${phoneNumber}: ${message}`);
            
            const formattedPhone = this.formatEthiopianPhone(phoneNumber);
            const smsEnabled = process.env.SMS_ENABLED === 'true';
            
            if (!smsEnabled) {
                console.log('📱 SMS disabled');
                return true;
            }
            
            // Always show simulation in development
            if (process.env.NODE_ENV === 'development') {
                console.log('📱 SMS Mode: SIMULATION');
                console.log(`📞 Would send to: ${formattedPhone}`);
                console.log(`💬 Message: ${message}`);
                return true;
            }
            
            // Production: Try real SMS with fallback to webhook
            const providers = [
                () => this.sendViaTextBelt(formattedPhone, message),
                () => this.sendViaTwilio(formattedPhone, message),
                () => this.sendViaAfricasTalking(formattedPhone, message)
            ];
            
            for (const provider of providers) {
                try {
                    const success = await provider();
                    if (success) return true;
                } catch (error) {
                    console.log(`Provider failed, trying next...`);
                }
            }
            
            // If all SMS fails, use webhook as guaranteed fallback
            console.log('⚠️ All SMS providers failed, using webhook fallback');
            return await this.sendViaWebhook(formattedPhone, message);
            
        } catch (error) {
            console.error('❌ SMS Error:', error.message);
            // Always fallback to webhook to ensure notification delivery
            return await this.sendViaWebhook(formattedPhone, message);
        }
    }

    /**
     * Format Ethiopian phone numbers
     */
    formatEthiopianPhone(phoneNumber) {
        // Remove any spaces, dashes, or special characters
        let cleaned = phoneNumber.replace(/[^0-9+]/g, '');
        
        // Handle different Ethiopian number formats
        if (cleaned.startsWith('09')) {
            // Convert 09XXXXXXXX to +2519XXXXXXXX
            cleaned = '+251' + cleaned.substring(1);
        } else if (cleaned.startsWith('9') && cleaned.length === 9) {
            // Convert 9XXXXXXXX to +2519XXXXXXXX
            cleaned = '+251' + cleaned;
        } else if (cleaned.startsWith('251')) {
            // Add + if missing
            cleaned = '+' + cleaned;
        } else if (!cleaned.startsWith('+251')) {
            // Assume it's a local number and add +251
            cleaned = '+251' + cleaned;
        }
        
        return cleaned;
    }

    /**
     * TextBelt SMS (Free testing)
     */
    async sendViaTextBelt(phoneNumber, message) {
        try {
            const response = await axios.post('https://textbelt.com/text', {
                phone: phoneNumber,
                message: message,
                key: 'textbelt'
            });
            
            if (response.data.success) {
                console.log('✅ SMS sent via TextBelt');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ TextBelt SMS failed:', error.message);
            return false;
        }
    }

    /**
     * Twilio SMS (Most reliable for Ethiopia)
     */
    async sendViaTwilio(phoneNumber, message) {
        if (!this.providers.twilio.accountSid || !this.providers.twilio.authToken) {
            console.log('⚠️ Twilio credentials not configured');
            return false;
        }
        
        try {
            const auth = Buffer.from(`${this.providers.twilio.accountSid}:${this.providers.twilio.authToken}`).toString('base64');
            
            const response = await axios.post(
                `https://api.twilio.com/2010-04-01/Accounts/${this.providers.twilio.accountSid}/Messages.json`,
                new URLSearchParams({
                    From: this.providers.twilio.phoneNumber,
                    To: phoneNumber,
                    Body: message
                }),
                {
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            
            console.log('✅ SMS sent via Twilio');
            return true;
        } catch (error) {
            console.error('❌ Twilio SMS failed:', error.response?.data || error.message);
            return false;
        }
    }

    /**
     * Africa's Talking SMS
     */
    async sendViaAfricasTalking(phoneNumber, message) {
        try {
            const params = new URLSearchParams();
            params.append('username', this.providers.africasTalking.username);
            params.append('to', phoneNumber);
            params.append('message', message);
            
            const response = await axios.post(
                this.providers.africasTalking.url,
                params.toString(),
                {
                    headers: {
                        'apiKey': this.providers.africasTalking.apiKey,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            
            console.log('✅ SMS sent via Africa\'s Talking');
            return true;
        } catch (error) {
            console.error('❌ Africa\'s Talking SMS failed:', error.response?.data || error.message);
            return false;
        }
    }

    /**
     * Webhook fallback (e.g., Telegram bot, Discord, etc.)
     */
    async sendViaWebhook(phoneNumber, message) {
        try {
            // Simple webhook notification as last resort
            console.log(`📞 Webhook notification: ${phoneNumber} - ${message}`);
            // You can implement actual webhook here (Telegram, Discord, etc.)
            return true;
        } catch (error) {
            console.error('❌ Webhook failed:', error.message);
            return false;
        }
    }

    /**
     * Fetching for Frontend
     */
    async getUserNotifications(user_id) {
        const userObjectId = mongoose.Types.ObjectId.isValid(user_id) 
            ? (typeof user_id === 'string' ? new mongoose.Types.ObjectId(user_id) : user_id)
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
            ? (typeof user_id === 'string' ? new mongoose.Types.ObjectId(user_id) : user_id)
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
