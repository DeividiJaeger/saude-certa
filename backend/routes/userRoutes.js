const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Rotas públicas
router.post('/login', userController.login);
router.post('/register', userController.register);

// Rotas protegidas
router.get('/profile', authenticateToken, userController.getProfile);

module.exports = router;
