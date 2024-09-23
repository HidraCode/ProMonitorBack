import express from 'express';
import multer from 'multer';
import { 
    atribuirTarefa,
    createCoordenador,
    createProfessor,
    getAllCoordenadores,
    getAllProfessores,
    updateProfessor,
    createDisciplina,
    createMonitoria,
    getTarefasProfessor
} from '../controllers/professorController.js';
import { assinarFrequencia, assinarRelatorio } from '../controllers/assinaturaController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

// Middleware para upload de arquivos
const storage = multer.memoryStorage(); // Armazena arquivos na memória
const upload = multer({ storage: storage });

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
 *   get:
 *     summary: Retorna uma lista de todos os professores
 *     tags: [Professores]
 *     responses:
 *       200:
 *         description: Lista de professores retornada com sucesso
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
 *                     example: professor
 *                   nome:
 *                     type: string
 *                     description: Nome do professor
 *                     example: Marcelo Araujo Silva
 *                   matricula:
 *                     type: string
 *                     description: Matrícula do professor
 *                     example: 1234567825
 *                   cpf:
 *                     type: string
 *                     description: CPF do professor
 *                     example: 12312312342
 *                   telefone:
 *                     type: string
 *                     description: Telefone do professor
 *                     example: 81095623412
 *                   data_nascimento:
 *                     type: string
 *                     format: date
 *                     description: Data de nascimento do professor
 *                     example: 2005-05-25T00:00:00.000Z
 *                   email:
 *                     type: string
 *                     description: Email do professor
 *                     example: marcelo102@gmail.com
 *                   senha:
 *                     type: string
 *                     description: Senha criptografada do professor
 *                     example: $2b$10$b0QT8Bojs5BCxHn1uyiJAO.BGuOgAhcHdzjuzPIo83yhmqucy/NIi
 *       500:
 *         description: Erro interno no servidor
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
 *                 description: Nome completo do professor
 *                 example: marcelo silva
 *               matricula:
 *                 type: string
 *                 description: Matrícula do professor
 *                 example: 1234567825
 *               cpf:
 *                 type: string
 *                 description: CPF do professor
 *                 example: 12312312342
 *               telefone:
 *                 type: string
 *                 description: Telefone do professor
 *                 example: "81095623412"
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 description: Data de nascimento do professor
 *                 example: 2005-05-25
 *               email:
 *                 type: string
 *                 description: Email do professor
 *                 example: pedro11@gmail.com
 *               senha:
 *                 type: string
 *                 description: Senha para o professor
 *                 example: senhaForte123
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
 *                   description: Código único do usuário (professor)
 *                   example: 1
 *                 token:
 *                   type: string
 *                   description: Token JWT gerado para o professor
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RpZ29fdXN1YXJpbyI6MSwicm9sZSI6InByb2Zlc3NvciIsImVtYWlsIjoicGVkcm8xMUBnbWFpbC5jb20iLCJpYXQiOjE3MjUwMjM3MDcsImV4cCI6MTcyNTAyNzMwN30.83HkTyhA0o4KuNFZ9_x4Gu-E6Y0QOude8vlI9zmAGQc
 *       400:
 *         description: Requisição inválida (faltando campos obrigatórios ou formato incorreto)
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/', createProfessor); //Criar professores

/**
 * @swagger
 * /api/professores/{codigo_usuario}:
 *   put:
 *     summary: Atualiza os dados de um professor
 *     tags: [Professores]
 *     parameters:
 *     - in: path
 *       name: codigo_usuario
 *       schema: 
 *         type: integer
 *       required: true
 *     description: Código de usuário do professor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome completo do professor
 *                 example: Marcelo Araujo Silva
 *               senha:
 *                 type: string
 *                 description: Senha do professor (obrigatória para qualquer atualização)
 *                 example: senhaForte123
 *             required:
 *               - senha
 *     responses:
 *       200:
 *         description: Dados do professor atualizados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codigo_usuario:
 *                   type: integer
 *                   description: Código único do usuário (professor)
 *                   example: 2
 *                 nome:
 *                   type: string
 *                   description: Nome completo do professor (apenas se alterado)
 *                   example: Marcelo Araujo Silva
 *       400:
 *         description: Requisição inválida (faltando senha ou outros erros de validação)
 *       401:
 *         description: Não autorizado (Token inválido ou ausente)
 *       500:
 *         description: Erro interno no servidor
 */
router.put('/:codigo_usuario', updateProfessor);//authenticateToken, authorizeRoles('professor'), updateProfessor);//Atualizar professor

/**
 * @swagger
 * /api/professores/criar-coordenador/{codigo_usuario}:
 *   put:
 *     summary: Atualiza o tipo de um professor para `coordenador`
 *     tags: [Professores]
 *     parameters:
 *     - in: path
 *       name: codigo_usuario
 *       schema: 
 *         type: integer
 *       required: true
 *     description: Código de usuário do professor
 *     responses:
 *       200:
 *         description: Coordenador criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codigo_professor:
 *                   type: integer
 *                   description: Código único do usuário (professor)
 *                   example: 2
 *                 tipo:
 *                   type: string
 *                   description: Novo tipo do professor
 *                   example: coordenador
 *       400:
 *         description: Requisição inválida (faltando senha ou outros erros de validação)
 *       401:
 *         description: Não autorizado (Token inválido ou ausente)
 *       500:
 *         description: Erro interno no servidor
 */
router.put('/criar-coordenador/:codigo_professor', createCoordenador);

/**
 * @swagger
 * /api/professores/coordenadores:
 *   get:
 *     summary: Retorna uma lista de todos os professores coordenadores
 *     tags: [Professores]
 *     responses:
 *       200:
 *         description: Lista de coordenadores retornada com sucesso
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
 *                     example: coordenador
 *                   nome:
 *                     type: string
 *                     description: Nome do professor
 *                     example: Marcelo Araujo Silva
 *                   matricula:
 *                     type: string
 *                     description: Matrícula do professor
 *                     example: 1234567825
 *                   cpf:
 *                     type: string
 *                     description: CPF do professor
 *                     example: 12312312342
 *                   telefone:
 *                     type: string
 *                     description: Telefone do professor
 *                     example: 81095623412
 *                   data_nascimento:
 *                     type: string
 *                     format: date
 *                     description: Data de nascimento do professor
 *                     example: 2005-05-25T00:00:00.000Z
 *                   email:
 *                     type: string
 *                     description: Email do professor
 *                     example: marcelo102@gmail.com
 *                   senha:
 *                     type: string
 *                     description: Senha criptografada do professor
 *                     example: $2b$10$b0QT8Bojs5BCxHn1uyiJAO.BGuOgAhcHdzjuzPIo83yhmqucy/NIi
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/coordenadores', getAllCoordenadores);

router.post('/atribuir-tarefa', upload.single('arquivo_aux'), atribuirTarefa);

router.post('/disciplina/create', createDisciplina); //Criar disciplina

router.post('/monitoria/create', createMonitoria); //Criar monitoria

router.post('/:codigo_usuario/assinar-relatorio', assinarRelatorio);

router.post('/:codigo_usuario/assinar-frequencia', assinarFrequencia);

// rota para obter as tarefas atribuidas por um professor
router.get('/tarefas/:codigo_usuario', getTarefasProfessor);

export default router;
