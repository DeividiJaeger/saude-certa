// src/routes/location.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import authMiddleware from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();

// Listar todos os locais
router.get('/', async (req, res) => {
  try {
    const { demandId } = req.query;
    
    // Se demandId foi fornecido, filtra por demanda
    if (demandId) {
      const locations = await prisma.location.findMany({
        where: {
          LocationDemand: {
            some: {
              demandId: Number(demandId),
            },
          },
        },
        include: {
          LocationDemand: {
            include: {
              demand: true,
            },
          },
        },
      });
      
      return res.json(locations);
    }
    
    // Sem filtro, retorna todos
    const locations = await prisma.location.findMany({
      include: {
        LocationDemand: {
          include: {
            demand: true,
          },
        },
      },
    });
    
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar locais' });
  }
});

// Buscar um local específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const location = await prisma.location.findUnique({
      where: { id: Number(id) },
      include: {
        LocationDemand: {
          include: {
            demand: true,
          },
        },
      },
    });
    
    if (!location) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }
    
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar local' });
  }
});

// Adicionar um novo local (protegido)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { 
      name, 
      address, 
      neighborhood, 
      latitude, 
      longitude, 
      phone, 
      openingHours,
      demandIds 
    } = req.body;
    
    // Cria o local
    const newLocation = await prisma.location.create({
      data: {
        name,
        address,
        neighborhood,
        latitude,
        longitude,
        phone,
        openingHours,
      },
    });
    
    // Se houver demandIds, cria as relações
    if (demandIds && Array.isArray(demandIds) && demandIds.length > 0) {
      await Promise.all(
        demandIds.map((demandId) =>
          prisma.locationDemand.create({
            data: {
              locationId: newLocation.id,
              demandId: Number(demandId),
            },
          })
        )
      );
    }
    
    // Retorna o local criado com suas demandas
    const locationWithDemands = await prisma.location.findUnique({
      where: { id: newLocation.id },
      include: {
        LocationDemand: {
          include: {
            demand: true,
          },
        },
      },
    });
    
    res.status(201).json(locationWithDemands);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar local' });
  }
});

// Atualizar um local (protegido)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      address, 
      neighborhood, 
      latitude, 
      longitude, 
      phone, 
      openingHours,
      demandIds 
    } = req.body;
    
    // Atualiza o local
    const updatedLocation = await prisma.location.update({
      where: { id: Number(id) },
      data: {
        name,
        address,
        neighborhood,
        latitude,
        longitude,
        phone,
        openingHours,
      },
    });
    
    // Se houver demandIds, atualiza as relações
    if (demandIds && Array.isArray(demandIds)) {
      // Remove todas as relações existentes
      await prisma.locationDemand.deleteMany({
        where: { locationId: Number(id) },
      });
      
      // Cria as novas relações
      if (demandIds.length > 0) {
        await Promise.all(
          demandIds.map((demandId) =>
            prisma.locationDemand.create({
              data: {
                locationId: Number(id),
                demandId: Number(demandId),
              },
            })
          )
        );
      }
    }
    
    // Retorna o local atualizado com suas demandas
    const locationWithDemands = await prisma.location.findUnique({
      where: { id: Number(id) },
      include: {
        LocationDemand: {
          include: {
            demand: true,
          },
        },
      },
    });
    
    res.json(locationWithDemands);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar local' });
  }
});

// Excluir um local (protegido)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Remove primeiro as relações de demanda
    await prisma.locationDemand.deleteMany({
      where: { locationId: Number(id) },
    });
    
    // Depois remove o local
    await prisma.location.delete({
      where: { id: Number(id) },
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir local' });
  }
});

export default router;
