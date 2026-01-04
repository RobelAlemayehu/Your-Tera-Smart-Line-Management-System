const express = require('express');
const router = express.Router();
const officeController = require('../controllers/officeController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { verifyToken } = require('../middlewares/authMiddleware');


// --- Public Routes ---
// Allow everyone to see the offices (no middleware needed)


// --- Admin Only Routes ---
// Only Admins can add, update, or delete

router.get('/', verifyToken, officeController.getOffices);



router.post('/add',
    verifyToken, 
    roleMiddleware('Admin'),
    officeController.addOffice
);

router.put('/:id',
    verifyToken,
    roleMiddleware('Admin'),
    officeController.updateOffice
);

router.delete('/:id',
    verifyToken,
    roleMiddleware('Admin'),
    officeController.deleteOffice
);

module.exports = router;