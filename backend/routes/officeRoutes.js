const express = require('express');
const router = express.Router();
const officeController = require('../controllers/officeController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// --- Public Routes ---
// Allow everyone to see the offices (no middleware needed)
router.get('/', officeController.getOffices); 

// --- Admin Only Routes ---
// Only Admins can add, update, or delete
router.post('/add',
    authMiddleware, 
    roleMiddleware('Admin'),
    officeController.addOffice
);

router.put('/:id',
    authMiddleware,
    roleMiddleware('Admin'),
    officeController.updateOffice
);

router.delete('/:id',
    authMiddleware,
    roleMiddleware('Admin'),
    officeController.deleteOffice
);

module.exports = router;