import express from 'express';
import { createAluno, getAllAlunos, updateAluno } from '../controllers/alunoController.js';

const router = express.Router();

router.get('/', getAllAlunos);
router.post('/', createAluno);
router.put('/:codigo_usuario', updateAluno);

export default router;