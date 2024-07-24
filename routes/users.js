const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register User
router.post('/', userController.registerUser);

module.exports = router;
