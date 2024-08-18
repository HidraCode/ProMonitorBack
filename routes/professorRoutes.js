import express from 'express';
import { createProfessor, getAllProfessores, updateProfessor } from '../controllers/professorController.js';

const router = express.Router();

router.get('/', getAllProfessores); //listar professores
router.post('/', createProfessor); //Criar professores
router.put('/:codigo_usuario', updateProfessor);//Atualizar professor

export default router;
