// src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Rotas
import authRoutes from './routes/auth';
import demandRoutes from './routes/demand';
import locationRoutes from './routes/location';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/demands', demandRoutes);
app.use('/api/locations', locationRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API Saúde Certa está funcionando!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Gerenciamento de erros e finalização
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Conexão com o banco de dados fechada');
  process.exit(0);
});
