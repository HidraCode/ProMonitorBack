// routes/userRoutes.js
import express from 'express';
import { getAllUsers, createUser, updateUser } from '../controllers/userController.js';

const router = express.Router();

// Definir rotas
router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/', updateUser);

export default router;
