const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { verifyToken } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');


router.get('/office/:officeId', verifyToken, serviceController.getServiceByOffice);
router.post('/add', verifyToken, roleMiddleware('Admin'), serviceController.createService);


module.exports = router;