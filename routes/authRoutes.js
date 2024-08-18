import express from 'express';
import { passwordRecoveryController, verifyCodeController } from '../controllers/authController.js';

const router = express.Router();

import { authController, verifyCodeController } from '../controllers/authController.js';

// Define a rota de autenticação
router.post('/auth/login', authController);
router.post('/auth/verify-code', verifyCodeController);
router.post('/auth/pass-recovery', passwordRecoveryController)

export default router;