import express from 'express';
import { createAluno, getAllAlunos, updateAluno, criarEEnviarFrequencia } from '../controllers/alunoController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Alunos
 *  description: Gerenciamento dos alunos
 */

/**
 * @swagger
 * /api/alunos:
 *   get:
 *     summary: Retorna uma lista de todos os alunos
 *     tags: [Alunos]
 *     responses:
 *       200:
 *         description: Lista de alunos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo_usuario:
 *                     type: integer
 *                     description: ID do usuário
 *                     example: 2
 *                   tipo:
 *                     type: string
 *                     description: Tipo de usuário
 *                     example: aluno
 *                   nome:
 *                     type: string
 *                     description: Nome do aluno
 *                     example: Marcelo Araujo Silva
 *                   matricula:
 *                     type: string
 *                     description: Matrícula do aluno
 *                     example: 1234567825
 *                   cpf:
 *                     type: string
 *                     description: CPF do aluno
 *                     example: 12312312342
 *                   telefone:
 *                     type: string
 *                     description: Telefone do aluno
 *                     example: 81095623412
 *                   data_nascimento:
 *                     type: string
 *                     format: date
 *                     description: Data de nascimento do aluno
 *                     example: 2005-05-25T00:00:00.000Z
 *                   email:
 *                     type: string
 *                     description: Email do aluno
 *                     example: marcelo102@gmail.com
 *                   senha:
 *                     type: string
 *                     description: Senha criptografada do professor
 *                     example: $2b$10$b0QT8Bojs5BCxHn1uyiJAO.BGuOgAhcHdzjuzPIo83yhmqucy/NIi
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/', getAllAlunos);

/**
 * @swagger
 * /api/alunos:
 *   post:
 *     summary: Cadastra um novo aluno
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome completo do aluno
 *                 example: marcelo silva
 *               matricula:
 *                 type: string
 *                 description: Matrícula do aluno
 *                 example: 1234567825
 *               cpf:
 *                 type: string
 *                 description: CPF do aluno
 *                 example: 12312312342
 *               telefone:
 *                 type: string
 *                 description: Telefone do aluno
 *                 example: "81095623412"
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 description: Data de nascimento do aluno
 *                 example: 2005-05-25
 *               email:
 *                 type: string
 *                 description: Email do aluno
 *                 example: pedro11@gmail.com
 *               senha:
 *                 type: string
 *                 description: Senha para o aluno
 *                 example: senhaForte123
 *     responses:
 *       201:
 *         description: Aluno cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codigo_usuario:
 *                   type: integer
 *                   description: Código único do usuário
 *                   example: 1
 *                 token:
 *                   type: string
 *                   description: Token JWT gerado para o aluno
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RpZ29fdXN1YXJpbyI6MSwicm9sZSI6InByb2Zlc3NvciIsImVtYWlsIjoicGVkcm8xMUBnbWFpbC5jb20iLCJpYXQiOjE3MjUwMjM3MDcsImV4cCI6MTcyNTAyNzMwN30.83HkTyhA0o4KuNFZ9_x4Gu-E6Y0QOude8vlI9zmAGQc
 *       400:
 *         description: Requisição inválida (faltando campos obrigatórios ou formato incorreto)
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/', createAluno);

/**
 * @swagger
 * /api/alunos/{codigo_usuario}:
 *   put:
 *     summary: Atualiza os dados de um aluno
 *     tags: [Alunos]
 *     parameters:
 *     - in: path
 *       name: codigo_usuario
 *       schema: 
 *         type: integer
 *       required: true
 *     description: Código de usuário do aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome completo do aluno
 *                 example: Marcelo Araujo Silva
 *               senha:
 *                 type: string
 *                 description: Senha do aluno (obrigatória para qualquer atualização)
 *                 example: senhaForte123
 *             required:
 *               - senha
 *     responses:
 *       200:
 *         description: Dados do aluno atualizados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codigo_usuario:
 *                   type: integer
 *                   description: Código único do usuário
 *                   example: 2
 *                 nome:
 *                   type: string
 *                   description: Nome completo do aluno (apenas se alterado)
 *                   example: Marcelo Araujo Silva
 *       400:
 *         description: Requisição inválida (faltando senha ou outros erros de validação)
 *       401:
 *         description: Não autorizado (Token inválido ou ausente)
 *       500:
 *         description: Erro interno no servidor
 */
router.put('/:codigo_usuario', updateAluno); //authenticateToken, authorizeRoles('aluno'), updateAluno);

router.post('/enviar-frequencia', criarEEnviarFrequencia);

export default router;