'use strict';
const axios = require('axios');

/**
 * Notification Service - Bridge between Backend and Traccar SMS Gateway
 */
class NotificationService {
    constructor() {
        // Replace with your actual Cloud Token from the Traccar App
        this.traccarToken = 'cKPSK8W0Q3uNnWzGFnR11t:APA91bFzfnlnLXe1vuC_mI_XZuIn3dYrsKbcjENwbb31by4FJ2B_SuwvnNfZcKTIugZ8LzswYlY_tfHl41Hp9VYOCc28URi-f32wQfirZ8Ijt1-L0yXGtDs'; 
        this.traccarUrl = 'https://www.traccar.org/sms/'; 
    }

    /**
     * Sends an SMS via the Traccar Android Gateway
     * @param {string} phoneNumber - The recipient's phone number (e.g., +2519...)
     * @param {string} message - The text content
     */
    async sendTicketSMS(phoneNumber, message) {
        try {
            console.log(`📡 Attempting to send SMS to ${phoneNumber}...`);

            const response = await axios.post(this.traccarUrl, {
                to: phoneNumber,
                message: message
            }, {
                headers: {
                    'Authorization': this.traccarToken,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200 || response.status === 201) {
                console.log(`✅ SMS successfully sent to ${phoneNumber}`);
                return true;
            }
        } catch (error) {
            // This will print the specific error from the Traccar Server
            console.error('❌ Traccar SMS Error Details:', 
                error.response ? error.response.status : 'No Response', 
                error.response ? error.response.data : error.message
            );
            return false;
        }
    }
}

module.exports = new NotificationService();