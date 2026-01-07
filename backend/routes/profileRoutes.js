'use strict';

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, profileController.getProfile);
router.patch('/', verifyToken, profileController.updateProfile);
router.patch('/password', verifyToken, profileController.changePassword);

module.exports = router;