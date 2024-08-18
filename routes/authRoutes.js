import express from 'express';

const router = express.Router();

import { authController } from '../controllers/authController.js';

// Define a rota de autenticação
router.post('/auth/verify-code', authController);
router.post('/auth/password-recovery/', authController)

export default router;