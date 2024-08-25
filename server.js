// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import alunoRoutes from './routes/alunoRoutes.js';
import professorRoutes from './routes/professorRoutes.js';
import authRoutes from './routes/authRoutes.js';
import editalRoutes from './routes/editalRoutes.js';
import monitorRoutes from './routes/monitorRoutes.js';

// Configuração das variáveis de ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/professores', professorRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/editais', editalRoutes);
app.use('/api/monitores', monitorRoutes);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
