import express from 'express';
import { baixarPdfAssinado, autenticarFrequencia, getFrequencia, enviarFrequencia } from "../controllers/frequenciaController.js";
import { assinarFrequencia } from '../controllers/assinaturaController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/enviar-frequencia', authenticateToken, authorizeRoles('monitor'), enviarFrequencia);

router.get('/baixar/:id', authenticateToken, authorizeRoles('professor'), baixarPdfAssinado);

router.get('/autenticar/:id', autenticarFrequencia)

router.get ('/:id', authenticateToken, authorizeRoles('professor'), getFrequencia);

router.post('/assinar', authenticateToken, authorizeRoles('professor'), assinarFrequencia);

export default router;