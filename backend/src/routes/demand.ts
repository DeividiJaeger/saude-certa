// src/routes/demand.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import authMiddleware from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();

// Listar todas as demandas
router.get('/', async (req, res) => {
  try {
    const demands = await prisma.demand.findMany();
    res.json(demands);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar demandas' });
  }
});

// Buscar uma demanda específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const demand = await prisma.demand.findUnique({
      where: { id: Number(id) },
    });
    
    if (!demand) {
      return res.status(404).json({ error: 'Demanda não encontrada' });
    }
    
    res.json(demand);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar demanda' });
  }
});

// Adicionar uma nova demanda (protegido)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const newDemand = await prisma.demand.create({
      data: {
        name,
        description,
      },
    });
    
    res.status(201).json(newDemand);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar demanda' });
  }
});

// Atualizar uma demanda (protegido)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const updatedDemand = await prisma.demand.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
      },
    });
    
    res.json(updatedDemand);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar demanda' });
  }
});

// Excluir uma demanda (protegido)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.demand.delete({
      where: { id: Number(id) },
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir demanda' });
  }
});

export default router;
