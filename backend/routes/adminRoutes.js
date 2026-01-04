'use strict';
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Admin routes
router.get('/analytics', adminController.getAnalytics);
router.get('/tickets', verifyToken, roleMiddleware('Admin'), adminController.getAllTickets);
router.get('/users', verifyToken, roleMiddleware('Admin'), adminController.getUsers);

router.post('/services', verifyToken, roleMiddleware('Admin'), adminController.addService);

router.patch('/next', verifyToken, roleMiddleware('Admin'), adminController.callNext);
router.patch('/complete/:id', verifyToken, roleMiddleware('Admin'), adminController.completeTicket);
router.patch('/users/:user_id/role', verifyToken, roleMiddleware('Admin'), adminController.changeRole);
router.patch('/services/:service_id', verifyToken, roleMiddleware('Admin'), adminController.patchService);
router.patch('/tickets/:ticket_id/status', verifyToken, roleMiddleware('Admin'), adminController.patchTicket);

router.delete('/tickets/:service_id', verifyToken, roleMiddleware('Admin'), adminController.deleteServiceTickets);
router.delete('/services/:serviceId/tickets/:ticketId', verifyToken, roleMiddleware('Admin'), adminController.adminDeleteTicket);

module.exports = router;