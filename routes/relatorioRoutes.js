import express from 'express';
import { baixarRelatorioAssinado, autenticarRelatorio, getRelatorio } from "../controllers/relatorioController.js";
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/baixar/:id', authenticateToken, authorizeRoles('professor'), baixarRelatorioAssinado);

router.get('/autenticar/:id', autenticarRelatorio)

router.get ('/:id', authenticateToken, authorizeRoles('professor'), getRelatorio);

export default router;