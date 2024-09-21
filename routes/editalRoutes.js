import express from 'express';
import { getEditaisByProfessor, getAllEditais, getAllPublicEditais, getEdital, createEdital, updateEdital, getEditalLink } from '../controllers/editalController.js';
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
 *     summary: Retorna uma lista de todos os editais
 *     tags: [Editais]
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
 *                     description: Código único do edital
 *                     example: 2
 *                   codigo_professor:
 *                     type: integer
 *                     description: Código do professor responsável pelo edital
 *                     example: 1
 *                   titulo:
 *                     type: string
 *                     description: Título do edital
 *                     example: Edital de Monitoria 2024.1
 *                   disciplina:
 *                     type: string
 *                     description: Disciplina associada ao edital
 *                     example: Engenharia de Software
 *                   data_inicio:
 *                     type: string
 *                     format: date
 *                     description: Data de início do edital
 *                     example: 2024-10-10T00:00:00.000Z
 *                   data_fim:
 *                     type: string
 *                     format: date
 *                     description: Data de término do edital
 *                     example: 2024-10-20T00:00:00.000Z
 *                   descricao:
 *                     type: string
 *                     description: Descrição do edital
 *                     example: Descrição do edital
 *                   link:
 *                     type: string
 *                     description: Link o documento completo do edital
 *                     example: https://linkdoedital.com.br/12
 *                   publico:
 *                     type: boolean
 *                     description: Indica se o edital é público (true) ou restrito (false)
 *                     example: true
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/', getAllEditais); //authorizeRoles('professor'), getAllEditais);

router.get('/professor/:codigo_professor', authenticateToken, authorizeRoles('professor'), getEditaisByProfessor);

/**
 * @swagger
 * /api/editais/public:
 *   get:
 *     summary: Retorna uma lista de todos os editais públicos
 *     tags: [Editais]
 *     responses:
 *       200:
 *         description: Lista de editais públicos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo_edital:
 *                     type: integer
 *                     description: Código único do edital
 *                     example: 2
 *                   codigo_professor:
 *                     type: integer
 *                     description: Código do professor responsável pelo edital
 *                     example: 1
 *                   titulo:
 *                     type: string
 *                     description: Título do edital
 *                     example: Edital de Monitoria 2024.1
 *                   data_inicio:
 *                     type: string
 *                     format: date
 *                     description: Data de início do edital
 *                     example: 2024-10-10T00:00:00.000Z
 *                   data_fim:
 *                     type: string
 *                     format: date
 *                     description: Data de término do edital
 *                     example: 2005-10-20T00:00:00.000Z
 *                   descricao:
 *                     type: string
 *                     description: Descrição do edital
 *                     example: Descrição do edital
 *                   link:
 *                     type: string
 *                     description: Link para mais informações ou documento completo do edital
 *                     example: https://linkdoedital.com.br/12
 *                   publico:
 *                     type: boolean
 *                     description: Indica se o edital é público (true) ou restrito (false)
 *                     example: true
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/public', getAllPublicEditais);

/**
 * @swagger
 * /api/editais/{codigo_edital}:
 *   get:
 *     summary: Retorna um edital específico pelo código
 *     tags: [Editais]
 *     parameters:
 *       - in: path
 *         name: codigo_edital
 *         required: true
 *         description: Código único do edital que deve ser retornado
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Dados do edital retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codigo_edital:
 *                   type: integer
 *                   description: Código único do edital
 *                   example: 2
 *                 codigo_professor:
 *                   type: integer
 *                   description: Código do professor responsável pelo edital
 *                   example: 1
 *                 titulo:
 *                   type: string
 *                   description: Título do edital
 *                   example: Edital de Monitoria 2024.1
 *                 data_inicio:
 *                   type: string
 *                   format: date
 *                   description: Data de início do edital
 *                   example: 2024-10-10T00:00:00.000Z
 *                 data_fim:
 *                   type: string
 *                   format: date
 *                   description: Data de término do edital
 *                   example: 2005-10-20T00:00:00.000Z
 *                 descricao:
 *                   type: string
 *                   description: Descrição do edital
 *                   example: Descrição do edital
 *                 link:
 *                   type: string
 *                   description: Link para mais informações ou documento completo do edital
 *                   example: https://linkdoedital.com.br/12
 *                 publico:
 *                   type: boolean
 *                   description: Indica se o edital é público (true) ou restrito (false)
 *                   example: true
 *       404:
 *         description: Edital não encontrado para o código fornecido
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/:codigo_edital', getEdital);

/**
 * @swagger
 * /api/editais/{codigo_edital}/link:
 *   get:
 *     summary: Retorna o link de um edital específico pelo código
 *     tags: [Editais]
 *     parameters:
 *       - in: path
 *         name: codigo_edital
 *         required: true
 *         description: Código único do edital para o qual o link deve ser retornado
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Link do edital retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 link:
 *                   type: string
 *                   description: Link para o edital
 *                   example: https://linkdoedital.com.br/12
 *       404:
 *         description: Edital não encontrado para o código fornecido
 *       500:
 *         description: Erro interno no servidor
 */
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
 *                 description: Código do professor responsável pelo edital
 *                 example: 1
 *               titulo:
 *                 type: string
 *                 description: Título do edital
 *                 example: Edital de monitoria
 *               disciplina:
 *                 type: string
 *                 description: Disciplina associada ao edital
 *                 example: Engenharia de Software
 *               data_inicio:
 *                 type: string
 *                 format: date
 *                 description: Data de início do edital
 *                 example: 2024-10-01
 *               data_fim:
 *                 type: string
 *                 format: date
 *                 description: Data de término do edital
 *                 example: 2024-10-20
 *               descricao:
 *                 type: string
 *                 description: Descrição do edital
 *                 example: Descrição do edital
 *               link:
 *                 type: string
 *                 description: Link para o documento completo do edital
 *                 example: https://linkdoedital.com/19
 *               publico:
 *                 type: boolean
 *                 description: Indica se o edital é público (true) ou restrito (false)
 *                 example: true
 *     responses:
 *       201:
 *         description: Edital criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codigo_edital:
 *                   type: integer
 *                   description: Código único do edital criado
 *                   example: 2
 *                 codigo_professor:
 *                   type: integer
 *                   description: Código do professor responsável pelo edital
 *                   example: 1
 *                 titulo:
 *                   type: string
 *                   description: Título do edital
 *                   example: Edital de monitoria
 *                 disciplina:
 *                   type: string
 *                   description: Disciplina associada ao edital
 *                   example: Engenharia de Software
 *                 data_inicio:
 *                   type: string
 *                   format: date
 *                   description: Data de início do edital
 *                   example: 2024-10-01
 *                 data_fim:
 *                   type: string
 *                   format: date
 *                   description: Data de término do edital
 *                   example: 2024-10-20
 *                 descricao:
 *                   type: string
 *                   description: Descrição do edital
 *                   example: Descrição do edital
 *                 link:
 *                   type: string
 *                   description: Link para o documento completo do edital
 *                   example: https://linkdoedital.com/19
 *                 publico:
 *                   type: boolean
 *                   description: Indica se o edital é público (true) ou restrito (false)
 *                   example: true
 *       400:
 *         description: Requisição inválida, dados fornecidos são inválidos ou faltantes
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/', createEdital);//, authenticateToken, authorizeRoles('professor'), createEdital);

/**
 * @swagger
 * /api/editais/{codigo_edital}:
 *   put:
 *     summary: Atualiza as informações de um edital específico
 *     tags: [Editais]
 *     parameters:
 *       - in: path
 *         name: codigo_edital
 *         required: true
 *         description: Código único do edital a ser atualizado
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Novo título do edital
 *                 example: edital 2024.1 monitoria
 *     responses:
 *       200:
 *         description: Edital atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codigo_edital:
 *                   type: integer
 *                   description: Código único do edital atualizado
 *                   example: 1
 *                 titulo:
 *                   type: string
 *                   description: Título atualizado do edital
 *                   example: edital 2024.1 monitoria
 *       400:
 *         description: Requisição inválida, dados fornecidos são inválidos ou faltantes
 *       404:
 *         description: Edital não encontrado para o código fornecido
 *       500:
 *         description: Erro interno no servidor
 */
router.put('/:codigo_edital', updateEdital);

export default router;