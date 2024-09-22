import express from 'express';
import { baixarPdfAssinado, autenticarFrequencia, getFrequencia } from "../controllers/frequenciaController.js";

import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';
const router = express.Router();


router.get('/baixar/:id', authenticateToken, authorizeRoles('professor'), baixarPdfAssinado);

router.get('/autenticar/:id', autenticarFrequencia)

router.get ('/:id', authenticateToken, authorizeRoles('professor'), getFrequencia);

export default router;