const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('./generated/prisma');
require('dotenv').config();

// Importando rotas e middlewares
const userRoutes = require('./routes/userRoutes');
const demandsRoutes = require('./routes/demandsRoutes');
const { authenticateToken } = require('./middleware/auth');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
  res.json({ message: 'API Saúde Certa Maps está funcionando!' });
});

// Adicionar log para depuração
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rota de login direta (alternativa)
app.post('/api/login', require('./controllers/userController').login);

// Configurando as rotas de usuário
app.use('/api/users', userRoutes);

// Configurando as rotas de demandas
app.use('/api/demands', demandsRoutes);
console.log('Rotas de demandas configuradas!');

// Rota protegida de exemplo
app.get('/api/admin/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true }
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar perfil' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
