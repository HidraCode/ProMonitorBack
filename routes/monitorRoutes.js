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
 *                     description: Código único do monitor
 *                     example: 1
 *                   codigo_aluno:
 *                     type: integer
 *                     description: Código do aluno associado ao monitor
 *                     example: 2
 *                   ativo:
 *                     type: integer
 *                     description: Status do monitor (1 para ativo, 0 para inativo)
 *                     example: 1
 *                   codigo_edital:
 *                     type: integer
 *                     description: Código do edital ao qual o monitor está associado
 *                     example: 1
 *                   tipo_monitoria:
 *                     type: string
 *                     description: Tipo de monitoria (por exemplo, 'bolsista', 'voluntario')
 *                     example: bolsista
 *                   codigo_usuario:
 *                     type: integer
 *                     description: Código de usuário do aluno associado ao monitor
 *                     example: 2
 *                   tipo:
 *                     type: string
 *                     description: Tipo de usuário (por exemplo, 'aluno', 'professor')
 *                     example: aluno
 *                   nome:
 *                     type: string
 *                     description: Nome do monitor
 *                     example: Pedro
 *                   matricula:
 *                     type: string
 *                     description: Matrícula do monitor
 *                     example: 1234567821
 *                   cpf:
 *                     type: string
 *                     description: CPF do monitor
 *                     example: 12312312112
 *                   telefone:
 *                     type: string
 *                     description: Telefone do monitor
 *                     example: 81995623412
 *                   data_nascimento:
 *                     type: string
 *                     format: date-time
 *                     description: Data de nascimento do monitor
 *                     example: 2005-05-25T00:00:00.000Z
 *                   email:
 *                     type: string
 *                     description: Email do monitor
 *                     example: pedro1@gmail.com
 *                   senha:
 *                     type: string
 *                     description: Senha criptografada do monitor
 *                     example: $2b$10$.wuAmOqHCCOWUxbCiGF4zOsMzlJ7VX0GKXa4MBLS8wm0cLuO.zP5K
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/', getAllMonitores);//authenticateToken, getAllMonitores);

/**
 * @swagger
 * /api/monitores/active:
 *   get:
 *     summary: Retorna uma lista de todos os monitores ativos
 *     tags: [Monitores]
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
 *                     description: Código único do monitor
 *                     example: 1
 *                   codigo_aluno:
 *                     type: integer
 *                     description: Código do aluno associado ao monitor
 *                     example: 2
 *                   ativo:
 *                     type: integer
 *                     description: Status do monitor (1 para ativo)
 *                     example: 1
 *                   codigo_edital:
 *                     type: integer
 *                     description: Código do edital ao qual o monitor está associado
 *                     example: 1
 *                   tipo_monitoria:
 *                     type: string
 *                     description: Tipo de monitoria (por exemplo, 'bolsista', 'voluntário')
 *                     example: bolsista
 *                   codigo_usuario:
 *                     type: integer
 *                     description: Código do usuário do monitor
 *                     example: 2
 *                   tipo:
 *                     type: string
 *                     description: Tipo de usuário (por exemplo, 'aluno', 'professor')
 *                     example: aluno
 *                   nome:
 *                     type: string
 *                     description: Nome do monitor
 *                     example: Pedro
 *                   matricula:
 *                     type: string
 *                     description: Matrícula do monitor
 *                     example: 1234567821
 *                   cpf:
 *                     type: string
 *                     description: CPF do monitor
 *                     example: 12312312112
 *                   telefone:
 *                     type: string
 *                     description: Telefone do monitor
 *                     example: 81995623412
 *                   data_nascimento:
 *                     type: string
 *                     format: date-time
 *                     description: Data de nascimento do monitor
 *                     example: 2005-05-25T00:00:00.000Z
 *                   email:
 *                     type: string
 *                     description: Email do monitor
 *                     example: pedro1@gmail.com
 *                   senha:
 *                     type: string
 *                     description: Senha criptografada do monitor
 *                     example: $2b$10$.wuAmOqHCCOWUxbCiGF4zOsMzlJ7VX0GKXa4MBLS8wm0cLuO.zP5K
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/active', getActiveMonitores);//authenticateToken, getActiveMonitores);

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
 *                     description: Código único do monitor
 *                     example: 1
 *                   codigo_aluno:
 *                     type: integer
 *                     description: Código do aluno associado ao monitor
 *                     example: 2
 *                   ativo:
 *                     type: integer
 *                     description: Status do monitor (0 para inativo)
 *                     example: 0
 *                   codigo_edital:
 *                     type: integer
 *                     description: Código do edital ao qual o monitor está associado
 *                     example: 1
 *                   tipo_monitoria:
 *                     type: string
 *                     description: Tipo de monitoria (por exemplo, 'bolsista', 'voluntário')
 *                     example: voluntário
 *                   codigo_usuario:
 *                     type: integer
 *                     description: Código do usuário do monitor
 *                     example: 2
 *                   tipo:
 *                     type: string
 *                     description: Tipo de usuário (por exemplo, 'aluno', 'professor')
 *                     example: aluno
 *                   nome:
 *                     type: string
 *                     description: Nome do monitor
 *                     example: Pedro
 *                   matricula:
 *                     type: string
 *                     description: Matrícula do monitor
 *                     example: 1234567821
 *                   cpf:
 *                     type: string
 *                     description: CPF do monitor
 *                     example: 12312312112
 *                   telefone:
 *                     type: string
 *                     description: Telefone do monitor
 *                     example: 81995623412
 *                   data_nascimento:
 *                     type: string
 *                     format: date-time
 *                     description: Data de nascimento do monitor
 *                     example: 2005-05-25T00:00:00.000Z
 *                   email:
 *                     type: string
 *                     description: Email do monitor
 *                     example: pedro1@gmail.com
 *                   senha:
 *                     type: string
 *                     description: Senha criptografada do monitor
 *                     example: $2b$10$.wuAmOqHCCOWUxbCiGF4zOsMzlJ7VX0GKXa4MBLS8wm0cLuO.zP5K
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
 *       - name: codigo_monitor
 *         in: path
 *         required: true
 *         description: Código único do monitor para identificar o monitor específico
 *         schema:
 *           type: integer
 *           example: 1
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
 *                   description: Código único do monitor
 *                   example: 1
 *                 codigo_aluno:
 *                   type: integer
 *                   description: Código do aluno associado ao monitor
 *                   example: 2
 *                 ativo:
 *                   type: integer
 *                   description: Status do monitor (1 para ativo, 0 para inativo)
 *                   example: 1
 *                 codigo_edital:
 *                   type: integer
 *                   description: Código do edital ao qual o monitor está associado
 *                   example: 1
 *                 tipo_monitoria:
 *                   type: string
 *                   description: Tipo de monitoria (por exemplo, 'bolsista', 'voluntário')
 *                   example: bolsista
 *                 codigo_usuario:
 *                   type: integer
 *                   description: Código de usuário do aluno associado ao monitor
 *                   example: 2
 *                 tipo:
 *                   type: string
 *                   description: Tipo de usuário (por exemplo, 'aluno', 'professor')
 *                   example: aluno
 *                 nome:
 *                   type: string
 *                   description: Nome do monitor
 *                   example: Pedro
 *                 matricula:
 *                   type: string
 *                   description: Matrícula do monitor
 *                   example: 1234567821
 *                 cpf:
 *                   type: string
 *                   description: CPF do monitor
 *                   example: 12312312112
 *                 telefone:
 *                   type: string
 *                   description: Telefone do monitor
 *                   example: 81995623412
 *                 data_nascimento:
 *                   type: string
 *                   format: date-time
 *                   description: Data de nascimento do monitor
 *                   example: 2005-05-25T00:00:00.000Z
 *                 email:
 *                   type: string
 *                   description: Email do monitor
 *                   example: pedro1@gmail.com
 *                 senha:
 *                   type: string
 *                   description: Senha criptografada do monitor
 *                   example: $2b$10$.wuAmOqHCCOWUxbCiGF4zOsMzlJ7VX0GKXa4MBLS8wm0cLuO.zP5K
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
 *               codigo_usuario:
 *                 type: integer
 *                 description: Código do usuário associado ao monitor
 *                 example: 2
 *               ativo:
 *                 type: boolean
 *                 description: Status do monitor (true para ativo, false para inativo)
 *                 example: true
 *               codigo_edital:
 *                 type: integer
 *                 description: Código do edital ao qual o monitor está associado
 *                 example: 1
 *               tipo_monitoria:
 *                 type: string
 *                 description: Tipo de monitoria (por exemplo, 'bolsista', 'voluntário')
 *                 example: voluntario
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
 *                   description: Código único do novo monitor
 *                   example: 3
 *                 codigo_usuario:
 *                   type: integer
 *                   description: Código do usuário associado ao monitor
 *                   example: 2
 *                 ativo:
 *                   type: boolean
 *                   description: Status do monitor (true para ativo)
 *                   example: true
 *                 codigo_edital:
 *                   type: integer
 *                   description: Código do edital ao qual o monitor está associado
 *                   example: 1
 *                 tipo_monitoria:
 *                   type: string
 *                   description: Tipo de monitoria (por exemplo, 'bolsista', 'voluntário')
 *                   example: voluntario
 *       400:
 *         description: Requisição mal formatada ou dados inválidos
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/create', createMonitor);

/**
 * @swagger
 * /api/monitores/{codigo_monitor}:
 *   put:
 *     summary: Atualiza as informações de um monitor
 *     tags: [Monitores]
 *     parameters:
 *       - in: path
 *         name: codigo_monitor
 *         required: true
 *         description: Código do monitor a ser atualizado
 *         schema:
 *           type: integer
 *           example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ativo:
 *                 type: boolean
 *                 description: Status do monitor (true para ativo, false para inativo)
 *                 example: true
 *               tipo_monitoria:
 *                 type: string
 *                 description: Tipo de monitoria (por exemplo, 'bolsista', 'voluntário')
 *                 example: bolsista
 *     responses:
 *       200:
 *         description: Informações do monitor atualizadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codigo_monitor:
 *                   type: integer
 *                   description: Código único do monitor
 *                   example: 2
 *                 ativo:
 *                   type: boolean
 *                   description: Status atualizado do monitor (true para ativo)
 *                   example: true
 *                 tipo_monitoria:
 *                   type: string
 *                   description: Tipo de monitoria atualizado (por exemplo, 'bolsista', 'voluntário')
 *                   example: bolsista
 *       400:
 *         description: Requisição mal formatada ou dados inválidos
 *       404:
 *         description: Monitor não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.put('/:codigo_monitor', updateMonitor);

export default router;