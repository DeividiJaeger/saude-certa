const express = require('express');
const router = express.Router();
const demandsController = require('../controllers/demandsController');
const { authenticateToken } = require('../middleware/auth');

// Rotas públicas para visualização
router.get('/', demandsController.getAllDemands);
router.get('/:id', demandsController.getDemand);

// Rotas protegidas que requerem autenticação
router.post('/', authenticateToken, demandsController.createDemand);
router.put('/:id', authenticateToken, demandsController.updateDemand);
router.delete('/:id', authenticateToken, demandsController.deleteDemand);

module.exports = router;
