import express from 'express';
import { 
    getAllInscricoes,
    getAllEditalInscricoes,
    getAllInscricoesFromAluno,
    getInscricao,
    createInscricao,
    updateEstadoInscricao
 } from '../controllers/inscricaoController.js';

const router = express.Router();


router.get('/all', getAllInscricoes);
router.get('/edital/:codigo_edital', getAllEditalInscricoes);
router.get('/aluno/:codigo_aluno', getAllInscricoesFromAluno);
router.get('/inscricao/:codigo_inscricao', getInscricao);
router.post('/create/:codigo_edital/:codigo_aluno', createInscricao);
router.put('/:codigo_inscricao/update', updateEstadoInscricao);

export default router;