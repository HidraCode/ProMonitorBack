import express from 'express';
import { getAllEditais, getAllPublicEditais, getEdital, createEdital, updateEdital, getEditalLink } from '../controllers/editalController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Editais
 *   description: Gerenciamento de editais
 */

/**
 * @swagger
 * /api/editais:
 *   get:
 *     summary: Recupera todos os editais
 *     tags: [Editais]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de editais retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo_edital:
 *                     type: integer
 *                     description: ID do edital
 *                     example: 1
 *                   descricao:
 *                     type: string
 *                     description: Descrição do edital
 *                     example: Descrição do edital de monitoria para o ano de 2024.
 *                   data_postagem:
 *                     type: string
 *                     format: date
 *                     description: Data de publicação do edital
 *                     example: 2024-08-01
 *                   publico:
 *                      type: boolean
 *                      description: Informa se o edital é público ou privado
 *                      example: true
 *       401:
 *         description: Não autorizado (Token inválido ou ausente)
 *       403:
 *         description: Proibido (Usuário não tem permissão para acessar esta rota)
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/', getAllEditais); //authorizeRoles('professor'), getAllEditais);

/**
 * @swagger
 * /api/editais/public:
 *   get:
 *     summary: Recupera todos os editais públicos
 *     tags: [Editais]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de editais retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo_edital:
 *                     type: integer
 *                     description: ID do edital
 *                     example: 1
 *                   descricao:
 *                     type: string
 *                     description: Descrição do edital
 *                     example: Descrição do edital de monitoria.
 *                   data_postagem:
 *                     type: string
 *                     format: date
 *                     description: Data de publicação do edital
 *                     example: 2024-08-01
 *                   publico:
 *                      type: boolean
 *                      description: Informa se o edital é público ou privado
 *                      example: true
 *       401:
 *         description: Não autorizado (Token inválido ou ausente)
 *       403:
 *         description: Proibido (Usuário não tem permissão para acessar esta rota)
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/public', getAllPublicEditais);

/**
 * @swagger
 * /api/editais/{codigo_edital}:
 *   get:
 *     summary: Recupera um edital pelo codigo_edital
 *     tags: [Editais]
 *     parameters:
 *       - in: path
 *         name: codigo_edital
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código do edital
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Edital retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo_edital:
 *                     type: integer
 *                     description: ID do edital
 *                     example: 1
 *                   descricao:
 *                     type: string
 *                     description: Descrição do edital
 *                     example: Descrição do edital de monitoria para o ano de 2024.
 *                   data_postagem:
 *                     type: string
 *                     format: date
 *                     description: Data de publicação do edital
 *                     example: 2024-08-01
 *                   publico:
 *                      type: boolean
 *                      description: Informa se o edital é público ou privado
 *                      example: true
 *       401:
 *         description: Não autorizado (Token inválido ou ausente)
 *       403:
 *         description: Proibido (Usuário não tem permissão para acessar esta rota)
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/:codigo_edital', getEdital);
router.get('/:codigo_edital/link', getEditalLink);
/**
 * @swagger
 * /api/editais:
 *   post:
 *     summary: Cria um novo edital
 *     tags: [Editais]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo_professor:
 *                 type: integer
 *                 description: Código do professor que está lançando o edital
 *                 example: 3
 *               descricao:
 *                 type: string
 *                 description: Descrição do edital lançado
 *                 example: Descrição edital de monitora 2024.1
 *               publico:
 *                 type: boolean
 *                 description: Informa se o edital será público ou privado
 *                 example: true
 *     responses:
 *       201:
 *         description: Edital criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *               codigo_edital:
 *                 type: integer
 *                 description: Código do edital lançado
 *                 example: 1
 *               codigo_professor:
 *                 type: integer
 *                 description: Código do professor que está lançando o edital
 *                 example: 3
 *               descricao:
 *                 type: string
 *                 description: Descrição do edital lançado
 *                 example: Descrição edital de monitora 2024.1
 *               publico:
 *                 type: boolean
 *                 description: Informa se o edital será público ou privado
 *                 example: true
 *       400:
 *         description: Erro na requisição (por exemplo, dados ausentes ou inválidos)
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/', createEdital);//, authenticateToken, authorizeRoles('professor'), createEdital);
router.put('/:codigo_edital', updateEdital);

export default router;