const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/join', authMiddleware, queueController.joinQueue);

module.exports = router;