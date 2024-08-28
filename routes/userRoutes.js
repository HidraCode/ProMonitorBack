// routes/userRoutes.js
import express from 'express';
import { getAllUsers, createUser } from '../controllers/userController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Usuários
 *  description: Gerencia os usuários genéricos do sistema
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Recupera todos os usuários genéricos
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo_usuário:
 *                     type: integer
 *                     description: ID do usuário
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     description: Nome do usuário
 *                     example: Pedro Silva
 *                   email:
 *                     type: string
 *                     description: Email do usuário
 *                     example: pedro@gmail.com
 *                   telefone:
 *                     type: string
 *                     format: string
 *                     description: Telefone do usuário
 *                     example: 81995673421
 *                   endereco:
 *                      type: string
 *                      description: Endereço do usuário
 *                      example: Rua nome XYZ
 *                   data_nascimento:
 *                      type: date
 *                      description: Data de nascimento do usuário
 *                      example: 2005-05-25
 *                   departamento:
 *                      type: string
 *                      description: Departamento ao qual o usuário pertence
 *                      example: DC
 *                   ativo:
 *                      type: boolean
 *                      description: Informa se o usuário está ativo
 *                      example: true
 *                   senha:
 *                      type: string
 *                      description: Senha criptografada do usuário
 *                      example: df$asm%nvdfiasbsalm$
 *       500:
 *         description: Erro interno no servidor
 */
// Definir rotas
router.get('/', getAllUsers);
router.post('/', createUser);

export default router;
