import express from 'express';

const router = express.Router();

import { authController } from '../controllers/authController.js';

// Define a rota de autenticação
router.post('/login', authController);

export default router;