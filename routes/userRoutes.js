// routes/userRoutes.js
import express from 'express';
import { getAllUsers, createUser, getUser } from '../controllers/userController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

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
 *     summary: Recupera todos os usuários (alunos e professores)
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
 *                   tipo:
 *                     type: string
 *                     description: Tipo do usuário
 *                     example: aluno
 *                   nome:
 *                     type: string
 *                     description: Nome do usuário
 *                     example: Pedro da Silva
 *                   matricula:
 *                     type: string
 *                     description: Matrícula do usuário
 *                     example: 2020125412
 *                   cpf:
 *                      type: string
 *                      description: CPF do usuário
 *                      example: 15423454317
 *                   telefone:
 *                      type: string
 *                      description: Telefone do usuário
 *                      example: 81995432312
 *                   data_nascimento:
 *                      type: date
 *                      description: Data de nascimento do usuário
 *                      example: 2005-05-25
 *                   email:
 *                      type: string
 *                      description: Email do usuário
 *                      example: pedro@gmail.com
 *                   senha:
 *                      type: string
 *                      description: Senha criptografada do usuário
 *                      example: $2b$10$b0QT8Bojs5BCxHn1uyiJAO.BGuOgAhcHdzjuzPIo83yhmqucy/NIi
 *       500:
 *         description: Erro interno no servidor
 */
// Definir rotas
router.get('/', getAllUsers);
//router.post('/', createUser);

router.get('/personal-data', authenticateToken, getUser)

export default router;
