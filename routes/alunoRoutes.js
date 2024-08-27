import express from 'express';
import { createAluno, getAllAlunos, updateAluno } from '../controllers/alunoController.js';
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
 *     summary: Recupera todos os alunos
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
 *                   codigo_usuário:
 *                     type: integer
 *                     description: ID do usuário relacionado ao aluno
 *                     example: 2
 *                   codigo_aluno:
 *                     type: integer
 *                     description: ID do aluno
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     description: Nome do aluno
 *                     example: Pedro Silva
 *                   email:
 *                     type: string
 *                     description: Email do aluno
 *                     example: pedro@gmail.com
 *                   telefone:
 *                     type: string
 *                     format: string
 *                     description: Telefone do aluno
 *                     example: 81995673421
 *                   endereco:
 *                      type: string
 *                      description: Endereço do aluno
 *                      example: Rua nome XYZ
 *                   data_nascimento:
 *                      type: date
 *                      description: Data de nascimento do aluno
 *                      example: 2005-05-25
 *                   departamento:
 *                      type: string
 *                      description: Departamento ao qual o aluno pertence
 *                      example: DC
 *                   ativo:
 *                      type: boolean
 *                      description: Informa se o aluno está ativo
 *                      example: true
 *                   senha:
 *                      type: string
 *                      description: Senha criptografada do aluno
 *                      example: df$asm%nvdfiasbsalm$
 *                   comprovante_vinculo:
 *                      type: string
 *                      description: Comprovante de vínculo do aluno
 *                      example: Comprovante de vínculo
 *                   historico_escolar:
 *                      type: string
 *                      dscription: Histórico escolar do aluno
 *                      example: Histórico escolar
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
 *                 description: Nome do aluno
 *                 example: Brenno Araújo
 *               email:
 *                 type: string
 *                 description: Email do aluno
 *                 example: brenno@gmail.com
 *               telefone:
 *                 type: string
 *                 description: Telefone do aluno
 *                 example: "81995953333"
 *               endereco:
 *                 type: string
 *                 description: Endereço do aluno
 *                 example: Rua nome x
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 description: Data de nascimento do aluno
 *                 example: 2005-05-25
 *               departamento:
 *                 type: string
 *                 description: Departamento ao qual o aluno pertence
 *                 example: DC
 *               senha:
 *                 type: string
 *                 description: Senha de acesso do aluno
 *                 example: senha
 *               comprovante_vinculo:
 *                 type: string
 *                 description: Comprovante de vínculo do aluno com a instituição
 *                 example: comprovante de vinculo
 *               historico_escolar:
 *                 type: string
 *                 description: Histórico escolar do aluno
 *                 example: historico escolar
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codigo_usuario:
 *                   type: integer
 *                   description: ID gerado para o aluno
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   description: Nome do aluno
 *                   example: Brenno Araújo
 *                 email:
 *                   type: string
 *                   description: Email do aluno
 *                   example: brenno@gmail.com
 *                 token:
 *                   type: string
 *                   description: Token de autenticação gerado para o aluno
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJwZWRyb0BnbWFpbC5jb20iLCJpYXQiOjE3MjQ3NjE4MTIsImV4cCI6MTcyNDc2NTQxMn0.o6H8RYDdhrOg0X-SGXKlktKaFhJBsQ12GAb37fO3rgM"
 *       400:
 *         description: Erro nos dados fornecidos
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/', createAluno);

/**
 * @swagger
 * /api/alunos/{codigo_usuario}:
 *   put:
 *     summary: Atualiza os dados de um aluno existente
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo_usuario
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código do usuário do aluno a ser atualizado
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               telefone:
 *                 type: string
 *                 description: Telefone do aluno
 *                 example: "81995953333"
 *               endereco:
 *                 type: string
 *                 description: Endereço do aluno
 *                 example: Rua nome x
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
 *                   description: ID do aluno
 *                   example: 1
 *                 telefone:
 *                   type: string
 *                   description: Telefone do aluno
 *                   example: "81995953333"
 *                 endereco:
 *                   type: string
 *                   description: Endereço do aluno
 *                   example: Rua nome x
 *       400:
 *         description: Erro nos dados fornecidos
 *       401:
 *         description: Não autorizado (Token inválido ou ausente)
 *       403:
 *         description: Proibido (Permissões insuficientes)
 *       404:
 *         description: Aluno não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.put('/:codigo_usuario', authenticateToken, authorizeRoles('aluno'), updateAluno);

export default router;