import express from 'express';
import { createProfessor, getAllProfessores, updateProfessor } from '../controllers/professorController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllProfessores); //listar professores
router.post('/', createProfessor); //Criar professores
router.put('/:codigo_usuario', authenticateToken, authorizeRoles('professor'), updateProfessor);//Atualizar professor

export default router;
