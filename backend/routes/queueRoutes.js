const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

// Match the 'join' name from your controller
router.post('/join', queueController.join); 

// Add the status update route for the staff side
router.patch('/status/:ticketId', queueController.updateStatus);

module.exports = router;