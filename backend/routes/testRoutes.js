'use strict';

const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');

// Test SMS endpoint
router.post('/sms', async (req, res) => {
    try {
        const { phoneNumber, message } = req.body;
        
        if (!phoneNumber || !message) {
            return res.status(400).json({ 
                error: 'Phone number and message are required' 
            });
        }

        console.log('🧪 Testing SMS functionality...');
        
        // Test the SMS service directly
        const result = await notificationService.sendTicketSMS(phoneNumber, message);
        
        res.json({
            success: result,
            message: result ? 'SMS sent successfully' : 'SMS failed to send',
            phoneNumber,
            testMessage: message
        });
    } catch (error) {
        console.error('❌ SMS Test Error:', error);
        res.status(500).json({ 
            error: error.message,
            success: false 
        });
    }
});

// Test notification service
router.post('/notification', async (req, res) => {
    try {
        const { userId, phoneNumber, message } = req.body;
        
        if (!userId || !phoneNumber || !message) {
            return res.status(400).json({ 
                error: 'userId, phoneNumber, and message are required' 
            });
        }

        console.log('🧪 Testing notification service...');
        
        const notification = await notificationService.notifyUser(
            userId, 
            phoneNumber, 
            message
        );
        
        res.json({
            success: true,
            notification,
            message: 'Notification processed'
        });
    } catch (error) {
        console.error('❌ Notification Test Error:', error);
        res.status(500).json({ 
            error: error.message,
            success: false 
        });
    }
});

module.exports = router;