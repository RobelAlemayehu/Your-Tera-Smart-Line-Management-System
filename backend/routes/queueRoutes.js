const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');
const { verifyToken } = require('../middlewares/authMiddleware'); // Must have curly braces = require('../middlewares/authMiddleware');

router.post('/join', verifyToken, queueController.joinQueue);
router.get('/office/:serviceId', verifyToken, queueController.getOfficeQueue);
router.get('/my-status', verifyToken, queueController.getMyStatus);
router.patch('/cancel/:ticketId', verifyToken, queueController.cancelMyTicket);

module.exports = router;