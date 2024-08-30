import express from 'express';
import { authController, passwordRecoveryController, verifyCodeController, passResetController } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Login
 *  description: Rota de login
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza o login de alunos e professores no sistema
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *                 example: pedro11@gmail.com
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: senhaForte123
 *               tipo_usuario:
 *                 type: string
 *                 description: Informa se o usuário que está realizando login é aluno ou professor
 *                 example: aluno
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codigo_usuario:
 *                   type: integer
 *                   description: Código do usuário logado
 *                   example: 2
 *                 email:
 *                   type: string
 *                   description: Email do usuário
 *                   example: pedro11@gmail.com
 *                 token:
 *                   type: string
 *                   description: Token de autenticação gerado para o usuário contendo seu papel no sistema (aluno ou professor)
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJwZWRybzFAZ21haWwuY29tIiwiaWF0IjoxNzI0NzYyNDc5LCJleHAiOjE3MjQ3NjYwNzl9.2ZGEOldTU7bn-a5Ybi7kk3RS29vwsGVK2GPPJY99GC4"
 *       400:
 *         description: Erro nos dados fornecidos
 *       500:
 *         description: Erro interno no servidor
 */
// Define a rota de autenticação
router.post('/login', authController);
router.post('/pass-recovery/verify-code', verifyCodeController);
router.post('/pass-recovery', passwordRecoveryController);
router.post('/pass-reset', passResetController);
export default router;