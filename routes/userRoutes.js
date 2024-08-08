// routes/userRoutes.js
import express from 'express';
import { getAllUsers, createUser } from '../controllers/userController.js';

const router = express.Router();

// Definir rotas
router.get('/', getAllUsers);
router.post('/', createUser);

export default router;
