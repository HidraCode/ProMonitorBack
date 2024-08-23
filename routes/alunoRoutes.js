import express from 'express';
import { createAluno, getAllAlunos, updateAluno } from '../controllers/alunoController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllAlunos);
router.post('/', createAluno);
router.put('/:codigo_usuario', authenticateToken, authorizeRoles('aluno'), updateAluno);

export default router;