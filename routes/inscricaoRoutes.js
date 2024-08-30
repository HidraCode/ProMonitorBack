import express from 'express';
import { 
    getAllInscricoes,
    getAllEditalInscricoes,
    getAllInscricoesFromAluno,
    getInscricao,
    createInscricao,
    updateEstadoInscricao
 } from '../controllers/inscricaoController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Inscrições
 *   description: Gerencia as inscrições de alunos em editais
 */

/**
 * @swagger
 * /api/inscricoes/all:
 *   get:
 *     summary: Retorna uma lista de todas as inscrições
 *     tags: [Inscrições]
 *     responses:
 *       200:
 *         description: Lista de inscrições retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo_inscricao:
 *                     type: integer
 *                     description: Código único da inscrição
 *                     example: 1
 *                   codigo_edital:
 *                     type: integer
 *                     description: Código do edital ao qual a inscrição está associada
 *                     example: 1
 *                   codigo_aluno:
 *                     type: integer
 *                     description: Código do aluno que fez a inscrição
 *                     example: 1
 *                   data_inscricao:
 *                     type: string
 *                     format: date-time
 *                     description: Data em que a inscrição foi realizada
 *                     example: 2024-08-30T00:00:00.000Z
 *                   estado:
 *                     type: string
 *                     description: Estado atual da inscrição (por exemplo, 'inscrito', 'aprovado', 'rejeitado')
 *                     example: inscrito
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/all', getAllInscricoes);

/**
 * @swagger
 * /api/inscricoes/edital/{codigo_edital}:
 *   get:
 *     summary: Retorna uma lista de todas as inscrições para um edital específico
 *     tags: [Inscrições]
 *     parameters:
 *       - in: path
 *         name: codigo_edital
 *         required: true
 *         description: Código do edital para o qual as inscrições devem ser retornadas
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Lista de inscrições para o edital específico retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo_inscricao:
 *                     type: integer
 *                     description: Código único da inscrição
 *                     example: 1
 *                   codigo_edital:
 *                     type: integer
 *                     description: Código do edital ao qual a inscrição está associada
 *                     example: 1
 *                   codigo_aluno:
 *                     type: integer
 *                     description: Código do aluno que fez a inscrição
 *                     example: 1
 *                   data_inscricao:
 *                     type: string
 *                     format: date-time
 *                     description: Data em que a inscrição foi realizada
 *                     example: 2024-08-30T00:00:00.000Z
 *                   estado:
 *                     type: string
 *                     description: Estado atual da inscrição (por exemplo, 'inscrito', 'aprovado', 'rejeitado')
 *                     example: inscrito
 *       404:
 *         description: Edital não encontrado para o código fornecido
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/edital/:codigo_edital', getAllEditalInscricoes);

/**
 * @swagger
 * /api/inscricoes/aluno/{codigo_aluno}:
 *   get:
 *     summary: Retorna uma lista de todas as inscrições de um aluno específico
 *     tags: [Inscrições]
 *     parameters:
 *       - in: path
 *         name: codigo_aluno
 *         required: true
 *         description: Código do aluno para o qual as inscrições devem ser retornadas
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Lista de inscrições do aluno específico retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo_inscricao:
 *                     type: integer
 *                     description: Código único da inscrição
 *                     example: 1
 *                   codigo_edital:
 *                     type: integer
 *                     description: Código do edital ao qual a inscrição está associada
 *                     example: 1
 *                   codigo_aluno:
 *                     type: integer
 *                     description: Código do aluno que fez a inscrição
 *                     example: 1
 *                   data_inscricao:
 *                     type: string
 *                     format: date-time
 *                     description: Data em que a inscrição foi realizada
 *                     example: 2024-08-30T00:00:00.000Z
 *                   estado:
 *                     type: string
 *                     description: Estado atual da inscrição (por exemplo, 'inscrito', 'aprovado', 'rejeitado')
 *                     example: inscrito
 *       404:
 *         description: Aluno não encontrado para o código fornecido
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/aluno/:codigo_aluno', getAllInscricoesFromAluno);

/**
 * @swagger
 * /api/inscricoes/inscricao/{codigo_inscricao}:
 *   get:
 *     summary: Retorna detalhes de uma inscrição específica
 *     tags: [Inscrições]
 *     parameters:
 *       - in: path
 *         name: codigo_inscricao
 *         required: true
 *         description: Código da inscrição que deve ser retornada
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Detalhes da inscrição retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codigo_inscricao:
 *                   type: integer
 *                   description: Código único da inscrição
 *                   example: 1
 *                 codigo_edital:
 *                   type: integer
 *                   description: Código do edital ao qual a inscrição está associada
 *                   example: 1
 *                 codigo_aluno:
 *                   type: integer
 *                   description: Código do aluno que fez a inscrição
 *                   example: 1
 *                 data_inscricao:
 *                   type: string
 *                   format: date-time
 *                   description: Data em que a inscrição foi realizada
 *                   example: 2024-08-30T00:00:00.000Z
 *                 estado:
 *                   type: string
 *                   description: Estado atual da inscrição (por exemplo, 'inscrito', 'aprovado', 'rejeitado')
 *                   example: inscrito
 *       404:
 *         description: Inscrição não encontrada para o código fornecido
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/inscricao/:codigo_inscricao', getInscricao);

/**
 * @swagger
 * /api/inscricoes/create/{codigo_edital}/{codigo_aluno}:
 *   post:
 *     summary: Cria uma nova inscrição para um edital específico e um aluno específico
 *     tags: [Inscrições]
 *     parameters:
 *       - in: path
 *         name: codigo_edital
 *         required: true
 *         description: Código do edital para o qual a inscrição deve ser criada
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: path
 *         name: codigo_aluno
 *         required: true
 *         description: Código do aluno que está se inscrevendo
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       201:
 *         description: Inscrição criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codigo_inscricao:
 *                   type: integer
 *                   description: Código único da inscrição criada
 *                   example: 1
 *                 codigo_edital:
 *                   type: integer
 *                   description: Código do edital para o qual a inscrição foi criada
 *                   example: 1
 *                 codigo_aluno:
 *                   type: integer
 *                   description: Código do aluno que fez a inscrição
 *                   example: 1
 *                 data_inscricao:
 *                   type: string
 *                   format: date-time
 *                   description: Data em que a inscrição foi realizada
 *                   example: 2024-08-30T00:00:00.000Z
 *                 estado:
 *                   type: string
 *                   description: Estado atual da inscrição (por exemplo, 'inscrito', 'aprovado', 'rejeitado')
 *                   example: inscrito
 *       400:
 *         description: Dados inválidos (por exemplo, se o código do edital ou do aluno for inválido)
 *       404:
 *         description: Edital ou aluno não encontrado para os códigos fornecidos
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/create/:codigo_edital/:codigo_aluno', createInscricao);

/**
 * @swagger
 * /api/inscricoes/{codigo_inscricao}/update:
 *   put:
 *     summary: Atualiza o estado de uma inscrição específica
 *     tags: [Inscrições]
 *     parameters:
 *       - in: path
 *         name: codigo_inscricao
 *         required: true
 *         description: Código da inscrição cuja estado deve ser atualizado
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
 *               novo_estado:
 *                 type: string
 *                 description: Novo estado da inscrição (por exemplo, 'aceito', 'rejeitado', 'pendente')
 *                 example: aceito
 *     responses:
 *       200:
 *         description: Estado da inscrição atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codigo_inscricao:
 *                   type: integer
 *                   description: Código único da inscrição
 *                   example: 1
 *                 novo_estado:
 *                   type: string
 *                   description: Novo estado da inscrição
 *                   example: aceito
 *       400:
 *         description: Dados inválidos (por exemplo, estado fornecido inválido)
 *       404:
 *         description: Inscrição não encontrada para o código fornecido
 *       500:
 *         description: Erro interno no servidor
 */
router.put('/:codigo_inscricao/update', updateEstadoInscricao);

export default router;