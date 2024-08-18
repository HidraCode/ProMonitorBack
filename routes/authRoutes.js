import express from 'express';
import { authController, passwordRecoveryController, verifyCodeController } from '../controllers/authController.js';

const router = express.Router();


// Define a rota de autenticação
router.post('/login', authController);
router.post('/pass-recovery/verify-code', verifyCodeController);
router.post('/pass-recovery', passwordRecoveryController)

export default router;