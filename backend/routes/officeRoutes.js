const express = require('express');
const router = express.Router();
const officeController = require('../controllers/officeController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, officeController.getOffice);


router.post('/add',
    verifyToken, 
    roleMiddleware('Admin'),
    officeController.addOffice
);

module.exports = router;