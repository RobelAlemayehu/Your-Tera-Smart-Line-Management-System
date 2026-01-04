'use strict';
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { verifyToken } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// --- Public Routes (Anyone can see these) ---

// 1. List all active services
router.get('/', serviceController.listServices);

// 2. Get details for one specific service
router.get('/:id', serviceController.getServiceById);

// 3. Get services by office
router.get('/office/:officeId', verifyToken, serviceController.getServiceByOffice);

// --- Admin Protected Routes (Require Token + Admin Role) ---

// 4. Add a new service
router.post('/add', verifyToken, roleMiddleware('Admin'), serviceController.addService);

// 5. Update an existing service
router.put('/:id', verifyToken, roleMiddleware('Admin'), serviceController.updateService);

// 6. Delete a service
router.delete('/:id', verifyToken, roleMiddleware('Admin'), serviceController.deleteService);

module.exports = router;