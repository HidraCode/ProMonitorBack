// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import specs from './core/swagger.js';
import swaggerUI from 'swagger-ui-express';

import userRoutes from './routes/userRoutes.js';
import alunoRoutes from './routes/alunoRoutes.js';
import professorRoutes from './routes/professorRoutes.js';
import authRoutes from './routes/authRoutes.js';
import editalRoutes from './routes/editalRoutes.js';
import monitorRoutes from './routes/monitorRoutes.js';
import inscricaoRoutes from './routes/inscricaoRoutes.js';
import frequenciaRoutes from './routes/frequenciaRoutes.js';
import tarefaRoutes from './routes/tarefaRoutes.js'
import desempenhoRoutes from './routes/desempenhoRoutes.js'
import relatorioRoutes from './routes/relatorioRoutes.js';

// Configuração das variáveis de ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configurar o CORS para o frontend
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}));

// Middleware
app.use(express.json({ limit: '50mb' }));


// Rotas
app.use('/api/users', userRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/professores', professorRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/editais', editalRoutes);
app.use('/api/monitores', monitorRoutes);
app.use('/api/inscricoes', inscricaoRoutes);
app.use('/api/frequencia', frequenciaRoutes);
app.use('/api/relatorio', relatorioRoutes);
app.use('/api/tarefas', tarefaRoutes)
app.use('/api/desempenhos', desempenhoRoutes)

// Endpoint para verificar se a aplicação está saudável no Render
app.get('/healthcheck', (req, res) => {
  res.status(200).send('OK');
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
