import express from 'express';
import { createProfessor, getAllProfessores, updateProfessor } from '../controllers/professorController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Professores
 *  description: Gerenciamento dos professores
 */

/**
 * @swagger
 * /api/professores:
 *  get:
 *      summary: Obtém todos os professores cadastrados no sistema
 *      tags: [Professores]
 *      responses: 
 *              200:
 *                  description: Lista de professores.
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items: 
 *                                  type: object
 *                                  properties: 
 *                              
 */
router.get('/', getAllProfessores); //listar professores

/**
 * @swagger
 * /api/professores:
 *   post:
 *     summary: Cadastra um novo professor
 *     tags: [Professores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do professor
 *                 example: Brenno Araújo
 *               email:
 *                 type: string
 *                 description: Email do professor
 *                 example: brennoaraujo@gmail.com
 *               telefone:
 *                 type: string
 *                 description: Telefone do professor
 *                 example: "81995953330"
 *               endereco:
 *                 type: string
 *                 description: Endereço do professor
 *                 example: Rua nome x
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 description: Data de nascimento do professor
 *                 example: 1984-01-21
 *               departamento:
 *                 type: string
 *                 description: Departamento ao qual o professor pertence
 *                 example: DC
 *               senha:
 *                 type: string
 *                 description: Senha de acesso do professor
 *                 example: senha
 *               isCoordenador:
 *                 type: boolean
 *                 description: Indica se o professor é coordenador
 *                 example: false
 *     responses:
 *       201:
 *         description: Professor cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codigo_usuario:
 *                   type: integer
 *                   description: ID gerado para o professor
 *                   example: 2
 *                 nome:
 *                   type: string
 *                   description: Nome do professor
 *                   example: Brenno Araújo
 *                 email:
 *                   type: string
 *                   description: Email do professor
 *                   example: brennoaraujo@gmail.com
 *                 token:
 *                   type: string
 *                   description: Token de autenticação gerado para o professor
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJwZWRybzFAZ21haWwuY29tIiwiaWF0IjoxNzI0NzYyNDc5LCJleHAiOjE3MjQ3NjYwNzl9.2ZGEOldTU7bn-a5Ybi7kk3RS29vwsGVK2GPPJY99GC4"
 *       400:
 *         description: Erro nos dados fornecidos
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/', createProfessor); //Criar professores
router.put('/:codigo_usuario', updateProfessor);//authenticateToken, authorizeRoles('professor'), updateProfessor);//Atualizar professor

export default router;
