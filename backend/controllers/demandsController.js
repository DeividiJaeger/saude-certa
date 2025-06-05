const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

// Controller para listar todas as demandas
exports.getAllDemands = async (req, res) => {
  try {
    console.log('Recebida solicitação para listar todas as demandas');
    const demands = await prisma.demand.findMany();
    console.log(`Encontradas ${demands.length} demandas:`, demands);
    
    // Certificar-se de que a resposta sempre retorne um array, mesmo que vazio
    res.json(demands || []);
  } catch (error) {
    console.error('Erro ao listar demandas:', error);
    // Responder com array vazio em caso de erro para evitar erros no frontend
    res.status(500).json({ message: 'Erro ao buscar demandas', demands: [] });
  }
};

// Controller para obter uma demanda específica
exports.getDemand = async (req, res) => {
  try {
    const { id } = req.params;
    
    const demand = await prisma.demand.findUnique({
      where: { id: Number(id) }
    });
    
    if (!demand) {
      return res.status(404).json({ message: 'Demanda não encontrada' });
    }
    
    res.json(demand);
  } catch (error) {
    console.error('Erro ao buscar demanda:', error);
    res.status(500).json({ message: 'Erro ao buscar demanda' });
  }
};

// Controller para criar uma nova demanda
exports.createDemand = async (req, res) => {
  try {
    console.log('Recebido pedido para criar demanda:', req.body);
    const { name, description } = req.body;
    
    // Validação básica
    if (!name) {
      console.log('Erro de validação: nome é obrigatório');
      return res.status(400).json({ message: 'O nome da demanda é obrigatório' });
    }

    // Cria a nova demanda
    const newDemand = await prisma.demand.create({
      data: {
        name,
        description: description || null
      }
    }).catch(err => {
      console.error('Erro no Prisma ao criar demanda:', err);
      throw new Error(`Erro no banco de dados: ${err.message}`);
    });

    console.log('Demanda criada com sucesso:', newDemand);
    res.status(201).json({
      message: 'Demanda criada com sucesso',
      demand: newDemand
    });
  } catch (error) {
    console.error('Erro detalhado ao criar demanda:', error);
    res.status(500).json({ 
      message: 'Erro ao criar demanda',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Controller para atualizar uma demanda
exports.updateDemand = async (req, res) => {
  try {
    console.log(`Recebido pedido para atualizar demanda ${req.params.id}:`, req.body);
    const { id } = req.params;
    const { name, description } = req.body;
    
    // Validação básica
    if (!name) {
      console.log('Erro de validação: nome é obrigatório');
      return res.status(400).json({ message: 'O nome da demanda é obrigatório' });
    }

    // Verifica se a demanda existe
    const existingDemand = await prisma.demand.findUnique({
      where: { id: Number(id) }
    }).catch(err => {
      console.error('Erro no Prisma ao buscar demanda:', err);
      throw new Error(`Erro no banco de dados: ${err.message}`);
    });

    if (!existingDemand) {
      console.log(`Demanda com ID ${id} não encontrada`);
      return res.status(404).json({ message: 'Demanda não encontrada' });
    }

    // Atualiza a demanda
    const updatedDemand = await prisma.demand.update({
      where: { id: Number(id) },
      data: {
        name,
        description: description || null
      }
    }).catch(err => {
      console.error('Erro no Prisma ao atualizar demanda:', err);
      throw new Error(`Erro no banco de dados: ${err.message}`);
    });

    console.log('Demanda atualizada com sucesso:', updatedDemand);
    res.json({
      message: 'Demanda atualizada com sucesso',
      demand: updatedDemand
    });
  } catch (error) {
    console.error('Erro detalhado ao atualizar demanda:', error);
    res.status(500).json({ 
      message: 'Erro ao atualizar demanda',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Controller para excluir uma demanda
exports.deleteDemand = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verifica se a demanda existe
    const existingDemand = await prisma.demand.findUnique({
      where: { id: Number(id) }
    });

    if (!existingDemand) {
      return res.status(404).json({ message: 'Demanda não encontrada' });
    }

    // Verifica se há relacionamentos com LocationDemand antes de excluir
    const locationDemands = await prisma.locationDemand.findMany({
      where: { demandId: Number(id) }
    });

    if (locationDemands.length > 0) {
      await prisma.locationDemand.deleteMany({
        where: { demandId: Number(id) }
      });
    }

    // Exclui a demanda
    await prisma.demand.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Demanda excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir demanda:', error);
    res.status(500).json({ message: 'Erro ao excluir demanda' });
  }
};
