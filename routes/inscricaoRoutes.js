import express from 'express';
import { 
    getAllInscricoes,
    getAllEditalInscricoes,
    getAllInscricoesFromAluno,
    getInscricao,
    createInscricao
 } from '../controllers/inscricaoController.js';

//router.get('/all', getAllInscricoes);
//router.get('/edital/:codigo_edital', getAllEditalInscricoes);
//router.get('/aluno/:codigo_aluno', getAllInscricoesFromAluno);
//router.get('/inscricao/:codigo_inscricao', getInscricao);
//router.post('/create/:codigo_edital/:codigo_aluno', createInscricao);

const router = express.Router();

export default router;