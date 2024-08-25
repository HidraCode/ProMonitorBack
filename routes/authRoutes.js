import express from 'express';
import { authController, passwordRecoveryController } from '../controllers/authController.js';

const router = express.Router();


// Define a rota de autenticação
router.post('/login', authController);
router.post('/pass-recovery/verify-code', passwordRecoveryController);
router.post('/pass-recovery', passwordRecoveryController)

export default router;