const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/analytics', adminController.getAnalytics);
router.get('/tickets', verifyToken, isAdmin, adminController.getAllTickets);
router.delete('/tickets/:service_id', adminController.deleteServiceTickets);
// router.delete('/services/:service_id/tickets/:ticket_id', adminController.deleteTicket);
router.post('/services', adminController.addService);

router.get('/users', verifyToken, isAdmin, adminController.getUsers);
router.patch('/users/:user_id/role', adminController.changeRole);
router.patch('/services/:service_id', adminController.patchService);
router.patch('/tickets/:ticket_id/status', adminController.patchTicket);
router.delete('/services/:serviceId/tickets/:ticketId', verifyToken, isAdmin, adminController.adminDeleteTicket);

module.exports = router;