import express from 'express';
import { 
    getAllMonitores, 
    getActiveMonitores, 
    getInactiveMonitores,
    getMonitor, 
    createMonitor,
    updateMonitor
} from "../controllers/monitorController.js";
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Monitores
 *   description: Gerenciamento de monitores
 */

/**
 * @swagger
 * /api/monitores:
 *   get:
 *     summary: Retorna uma lista de todos os monitores
 *     tags: [Monitores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de monitores retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo_monitor:
 *                     type: integer
 *                     description: Código do monitor
 *                     example: 1
 *                   codigo_aluno:
 *                     type: integer
 *                     description: Código do aluno associado ao monitor
 *                     example: 1
 *                   ativo:
 *                     type: boolean
 *                     description: Status do monitor (1 para ativo, 0 para inativo)
 *                     example: true
 *                   curso:
 *                     type: string
 *                     description: Curso ao qual o monitor pertence
 *                     example: BCC
 *                   tipo_monitoria:
 *                     type: string
 *                     description: Tipo de monitoria (Bolsista ou Voluntário)
 *                     example: Bolsista
 *                   codigo_usuario:
 *                     type: integer
 *                     description: Código do usuário do monitor
 *                     example: 1
 *                   comprovante_vinculo:
 *                     type: string
 *                     description: Comprovante de vínculo do monitor com a instituição
 *                     example: comprovante de vinculo
 *                   historico_escolar:
 *                     type: string
 *                     description: Histórico escolar do monitor
 *                     example: historico escolar
 *                   nome:
 *                     type: string
 *                     description: Nome do monitor
 *                     example: Brenno Araújo
 *                   email:
 *                     type: string
 *                     description: Email do monitor
 *                     example: brenno@gmail.com
 *                   telefone:
 *                     type: string
 *                     description: Telefone do monitor
 *                     example: "81995953333"
 *                   endereco:
 *                     type: string
 *                     description: Endereço do monitor
 *                     example: Rua nome x
 *                   data_nascimento:
 *                     type: string
 *                     format: date
 *                     description: Data de nascimento do monitor
 *                     example: 2005-05-25T00:00:00.000Z
 *                   departamento:
 *                     type: string
 *                     description: Departamento ao qual o monitor pertence
 *                     example: DC
 *                   senha:
 *                     type: string
 *                     description: Senha criptografada do monitor
 *                     example: $2b$10$cmHoGxgCqChO0fNLg0INyO79UQEBkqwbyz7qFM27Vk8UZrm0sYk0i
 *       401:
 *         description: Não autorizado (Token inválido ou ausente)
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/', authenticateToken, getAllMonitores);

/**
 * @swagger
 * /api/monitores/active:
 *   get:
 *     summary: Retorna uma lista de todos os monitores ativos
 *     tags: [Monitores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de monitores ativos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo_monitor:
 *                     type: integer
 *                     description: Código do monitor
 *                     example: 1
 *                   codigo_aluno:
 *                     type: integer
 *                     description: Código do aluno associado ao monitor
 *                     example: 1
 *                   ativo:
 *                     type: boolean
 *                     description: Status do monitor (1 para ativo, 0 para inativo)
 *                     example: true
 *                   curso:
 *                     type: string
 *                     description: Curso ao qual o monitor pertence
 *                     example: BCC
 *                   tipo_monitoria:
 *                     type: string
 *                     description: Tipo de monitoria (Bolsista ou Voluntário)
 *                     example: Bolsista
 *                   codigo_usuario:
 *                     type: integer
 *                     description: Código do usuário do monitor
 *                     example: 1
 *                   comprovante_vinculo:
 *                     type: string
 *                     description: Comprovante de vínculo do monitor com a instituição
 *                     example: comprovante de vinculo
 *                   historico_escolar:
 *                     type: string
 *                     description: Histórico escolar do monitor
 *                     example: historico escolar
 *                   nome:
 *                     type: string
 *                     description: Nome do monitor
 *                     example: Brenno Araújo
 *                   email:
 *                     type: string
 *                     description: Email do monitor
 *                     example: brenno@gmail.com
 *                   telefone:
 *                     type: string
 *                     description: Telefone do monitor
 *                     example: "81995953333"
 *                   endereco:
 *                     type: string
 *                     description: Endereço do monitor
 *                     example: Rua nome x
 *                   data_nascimento:
 *                     type: string
 *                     format: date
 *                     description: Data de nascimento do monitor
 *                     example: 2005-05-25T00:00:00.000Z
 *                   departamento:
 *                     type: string
 *                     description: Departamento ao qual o monitor pertence
 *                     example: DC
 *                   senha:
 *                     type: string
 *                     description: Senha criptografada do monitor
 *                     example: $2b$10$cmHoGxgCqChO0fNLg0INyO79UQEBkqwbyz7qFM27Vk8UZrm0sYk0i
 *       401:
 *         description: Não autorizado (Token inválido ou ausente)
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/active', authenticateToken, getActiveMonitores);

/**
 * @swagger
 * /api/monitores/inactive:
 *   get:
 *     summary: Retorna uma lista de todos os monitores inativos
 *     tags: [Monitores]
 *     responses:
 *       200:
 *         description: Lista de monitores inativos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo_monitor:
 *                     type: integer
 *                     description: Código do monitor
 *                     example: 2
 *                   codigo_aluno:
 *                     type: integer
 *                     description: Código do aluno associado ao monitor
 *                     example: 2
 *                   ativo:
 *                     type: boolean
 *                     description: Status do monitor (0 para inativo)
 *                     example: false
 *                   curso:
 *                     type: string
 *                     description: Curso ao qual o monitor pertence
 *                     example: BCC
 *                   tipo_monitoria:
 *                     type: string
 *                     description: Tipo de monitoria (Bolsista ou Voluntário)
 *                     example: Bolsista
 *                   codigo_usuario:
 *                     type: integer
 *                     description: Código do usuário do monitor
 *                     example: 2
 *                   comprovante_vinculo:
 *                     type: string
 *                     description: Comprovante de vínculo do monitor com a instituição
 *                     example: comprovante de vinculo
 *                   historico_escolar:
 *                     type: string
 *                     description: Histórico escolar do monitor
 *                     example: historico escolar
 *                   nome:
 *                     type: string
 *                     description: Nome do monitor
 *                     example: João Silva
 *                   email:
 *                     type: string
 *                     description: Email do monitor
 *                     example: joao@gmail.com
 *                   telefone:
 *                     type: string
 *                     description: Telefone do monitor
 *                     example: "81995954444"
 *                   endereco:
 *                     type: string
 *                     description: Endereço do monitor
 *                     example: Rua nome y
 *                   data_nascimento:
 *                     type: string
 *                     format: date
 *                     description: Data de nascimento do monitor
 *                     example: 2004-06-15T00:00:00.000Z
 *                   departamento:
 *                     type: string
 *                     description: Departamento ao qual o monitor pertence
 *                     example: DC
 *                   senha:
 *                     type: string
 *                     description: Senha criptografada do monitor
 *                     example: $2b$10$cmHoGxgCqChO0fNLg0INyO79UQEBkqwbyz7qFM27Vk8UZrm0sYk0i
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/inactive', getInactiveMonitores);

/**
 * @swagger
 * /api/monitores/{codigo_monitor}:
 *   get:
 *     summary: Retorna os detalhes de um monitor específico
 *     tags: [Monitores]
 *     parameters:
 *       - in: path
 *         name: codigo_monitor
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código do monitor
 *     responses:
 *       200:
 *         description: Detalhes do monitor retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codigo_monitor:
 *                   type: integer
 *                   description: Código do monitor
 *                   example: 1
 *                 codigo_aluno:
 *                   type: integer
 *                   description: Código do aluno associado ao monitor
 *                   example: 1
 *                 ativo:
 *                   type: boolean
 *                   description: Status do monitor (1 para ativo, 0 para inativo)
 *                   example: true
 *                 curso:
 *                   type: string
 *                   description: Curso ao qual o monitor pertence
 *                   example: BCC
 *                 tipo_monitoria:
 *                   type: string
 *                   description: Tipo de monitoria (Bolsista ou Voluntário)
 *                   example: Bolsista
 *                 codigo_usuario:
 *                   type: integer
 *                   description: Código do usuário do monitor
 *                   example: 1
 *                 comprovante_vinculo:
 *                   type: string
 *                   description: Comprovante de vínculo do monitor com a instituição
 *                   example: comprovante de vinculo
 *                 historico_escolar:
 *                   type: string
 *                   description: Histórico escolar do monitor
 *                   example: historico escolar
 *                 nome:
 *                   type: string
 *                   description: Nome do monitor
 *                   example: Brenno Araújo
 *                 email:
 *                   type: string
 *                   description: Email do monitor
 *                   example: brenno@gmail.com
 *                 telefone:
 *                   type: string
 *                   description: Telefone do monitor
 *                   example: "81995953333"
 *                 endereco:
 *                   type: string
 *                   description: Endereço do monitor
 *                   example: Rua nome x
 *                 data_nascimento:
 *                   type: string
 *                   format: date
 *                   description: Data de nascimento do monitor
 *                   example: 2005-05-25T00:00:00.000Z
 *                 departamento:
 *                   type: string
 *                   description: Departamento ao qual o monitor pertence
 *                   example: DC
 *                 senha:
 *                   type: string
 *                   description: Senha criptografada do monitor
 *                   example: $2b$10$cmHoGxgCqChO0fNLg0INyO79UQEBkqwbyz7qFM27Vk8UZrm0sYk0i
 *       404:
 *         description: Monitor não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/:codigo_monitor', getMonitor);

/**
 * @swagger
 * /api/monitores/create:
 *   post:
 *     summary: Cria um novo monitor
 *     tags: [Monitores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo_aluno:
 *                 type: integer
 *                 description: Código do aluno associado ao monitor
 *                 example: 1
 *               ativo:
 *                 type: boolean
 *                 description: Status do monitor (true para ativo, false para inativo)
 *                 example: true
 *               curso:
 *                 type: string
 *                 description: Curso ao qual o monitor pertence
 *                 example: BCC
 *               tipo_monitoria:
 *                 type: string
 *                 description: Tipo de monitoria (Bolsista ou Voluntário)
 *                 example: Bolsista
 *     responses:
 *       201:
 *         description: Monitor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codigo_monitor:
 *                   type: integer
 *                   description: Código do monitor criado
 *                   example: 1
 *                 codigo_aluno:
 *                   type: integer
 *                   description: Código do aluno associado ao monitor
 *                   example: 1
 *                 ativo:
 *                   type: true
 *                   description: Status do monitor
 *                   example: true
 *                 curso:
 *                  type: string
 *                  description: Curso ao qual o monitor pertence
 *                  example: BCC
 *                 tipo_monitoria:
 *                  type: string
 *                  description: Tipo de monitoria (Bolsista ou Voluntário)
 *                  example: Bolsista
 *       400:
 *         description: Erro na requisição (por exemplo, dados ausentes ou inválidos)
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/create', createMonitor);
//router.put('/:codigo_monitor', updateMonitor);

export default router;