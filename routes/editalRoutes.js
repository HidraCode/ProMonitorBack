import express from 'express';
import { getAllEditais, getAllPublicEditais, getEdital, createEdital, updateEdital } from '../controllers/editalController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authorizeRoles('professor'), getAllEditais);
router.get('/public', getAllPublicEditais);
router.get('/:codigo_edital', getEdital);
router.post('/', createEdital, authenticateToken, authorizeRoles('professor'));
router.put('/:codigo_edital', updateEdital);

export default router;