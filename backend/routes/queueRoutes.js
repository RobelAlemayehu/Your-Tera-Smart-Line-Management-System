const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Queue routes
router.post('/join', verifyToken, queueController.joinQueue);
router.get('/office/:serviceId', verifyToken, queueController.getOfficeQueue);
router.get('/my-status', verifyToken, queueController.getMyStatus);
router.get('/my-tickets', verifyToken, queueController.getMyTickets);
router.get('/my-history', verifyToken, queueController.getMyCompletedTickets);
router.patch('/cancel/:ticketId', verifyToken, queueController.cancelMyTicket);
router.patch('/status/:ticketId', queueController.updateStatus);

module.exports = router;