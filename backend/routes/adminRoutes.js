const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/analytics', adminController.getAnalytics);
router.delete('/tickets/:service_id', adminController.deleteServiceTickets);
router.delete('/services/:service_id/tickets/:ticket_id', adminController.deleteTicket);
router.post('/services', adminController.addService);

router.get('/users', adminController.getUsers);
router.patch('/users/:user_id/role', adminController.changeRole);
router.patch('/services/:service_id', adminController.patchService);
router.patch('/tickets/:ticket_id/status', adminController.patchTicket);

module.exports = router;