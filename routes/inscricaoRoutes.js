import express from 'express';
import { 
    getAllInscricoes,
    getAllEditalInscricoes,
    getAllInscricoesFromAluno,
    getInscricao,
    createInscricao
 } from '../controllers/inscricaoController';



const router = express.Router();

export default router;