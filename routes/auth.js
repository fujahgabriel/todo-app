const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Login User
router.post('/', userController.loginUser);

module.exports = router;
