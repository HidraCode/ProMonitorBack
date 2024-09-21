import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../database/db.js';
import { gerarChavesDoProfessor } from "../services/assinaturaService.js"

dotenv.config();

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_aqui';

// Serviço para consultar todos os professores
export const getAllProfessoresService = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM USUARIO WHERE tipo = ?', ['professor']);
        return rows;
    } finally {
        connection.release();
    }
}

// Serviço para cadastrar professor
export const createProfessorService = async (professorData) => {
    // Recupera os dados do professor
    const { nome, matricula, cpf, telefone, data_nascimento, email, senha } = professorData;

    // Encripta a senha
    const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

    if (!nome || !matricula || !cpf || !telefone || !data_nascimento || !email || !senha) {
        throw new Error('Dados inválidos'); // Lança um erro se os dados estiverem faltando
    }

    // Verifica se o email é válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Email inválido');
    }

    // Verifica se o nome não possui menos de 2 caracteres
    if (nome.trim().length < 2) {
        throw new Error('Nome inválido');
    }

    // Verifica se o telefone é válido
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(telefone)) {
        throw new Error('Telefone inválido');
    }

    // Verifica se o cpf está no formato válido
    const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
    if (!cpfRegex.test(cpf)) {
        throw new Error('CPF inválido');
    }

    const connection = await pool.getConnection();
    try {
        // Verificar se o email já está cadastrado
        const [existingEmail] = await connection.query('SELECT * FROM USUARIO WHERE email = ?', [email]);
        if (existingEmail.length > 0) {
            throw new Error('Email já está em uso!');
        }

        // Verifica se o telefone já está cadastrado
        const [existingPhone] = await connection.query('SELECT * FROM USUARIO WHERE telefone = ?', [telefone]);
        if (existingPhone.length > 0) {
            throw new Error('Telefone já está em uso!');
        }

        const query = `
            INSERT INTO USUARIO (tipo, nome, matricula, cpf, telefone, data_nascimento, email, senha)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await connection.query(query, ['professor', nome, matricula, cpf,
            telefone, data_nascimento, email, hashedPassword]);

        // Gera as chaves públicas e privadas do professor
        await gerarChavesDoProfessor (result.insertId)

        // Cria o payload do token com o codigo_usuario, papel e email
        const payload = { codigo_usuario: result.insertId, role: 'professor', email };
        // Gera o token JWT
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        return {
            codigo_usuario: result.insertId,
            token,
        };
    } catch (error) {
        throw new Error('Erro ao cadastrar professor: ' + error.message);
    } finally {
        connection.release();
    }
};

// Serviço para atualizar professor
export const updateProfessorService = async (codigo_usuario, professorData) => {
    const { nome, matricula, cpf, telefone, data_nascimento, email, senha } = professorData;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction(); // Inicia a transação

        // Verifica a senha do professor
        const [professor] = await connection.query('SELECT senha FROM USUARIO WHERE codigo_usuario = ?', [codigo_usuario]);
        if (professor.length === 0 || !(await bcrypt.compare(senha, professor[0].senha))) {
            throw new Error('Senha incorreta!');
        }

        // Construção dinâmica da consulta SQL
        let updateUsuarioQuery = 'UPDATE USUARIO SET ';
        let updateUsuarioValues = [];

        if (nome) {
            updateUsuarioQuery += 'nome = ?, ';
            updateUsuarioValues.push(nome);
        }
        if (matricula) {
            updateUsuarioQuery += 'matricula = ?, ';
            updateUsuarioValues.push(matricula);
        }
        if (email) {
            // Verificar se o email já está cadastrado
            const [existingEmail] = await connection.query('SELECT * FROM USUARIO WHERE email = ?', [email]);
            if (existingEmail.length > 0) {
                throw new Error('Email já está em uso!');
            }
            updateUsuarioQuery += 'email = ?, ';
            updateUsuarioValues.push(email);
        }
        if (telefone) {
            // Verifica se o telefone já está cadastrado
            const [existingPhone] = await connection.query('SELECT * FROM USUARIO WHERE telefone = ?', [telefone]);
            if (existingPhone.length > 0) {
                throw new Error('Telefone já está em uso!');
            }
            updateUsuarioQuery += 'telefone = ?, ';
            updateUsuarioValues.push(telefone);
        }
        if (data_nascimento) {
            updateUsuarioQuery += 'data_nascimento = ?, ';
            updateUsuarioValues.push(data_nascimento);
        }

        // Remove a última vírgula e adiciona a cláusula WHERE
        updateUsuarioQuery = updateUsuarioQuery.slice(0, -2) + ' WHERE codigo_usuario = ?';
        updateUsuarioValues.push(codigo_usuario);

        // Atualiza as informações do usuário na tabela USUARIO
        await connection.query(updateUsuarioQuery, updateUsuarioValues);

        await connection.commit(); // Confirma a transação

        return { codigo_usuario, nome, matricula, cpf, telefone, data_nascimento, email };
    } catch (error) {
        await connection.rollback(); // Reverte a transação em caso de erro
        throw new Error('Erro ao atualizar professor: ' + error.message);
    } finally {
        connection.release();
    }
};

// Serviço para transformar um professor em coordenador a partir do seu codigo_usuario, atualizando o seu tipo
export const createCoordenadorService = async (codigo_professor) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Testa se existe um professor com esse código
        const [existingProfessor] = await connection.query(`
            SELECT *
            FROM USUARIO
            WHERE codigo_usuario = ? AND tipo = ?
            `, [codigo_professor, 'professor']);

        if (existingProfessor.length === 0) {
            throw new Error('Não existe professor com esse código');
        }

        // Se existir professor, atualiza o tipo para coordenador
        const updateProfessorQuery = `
            UPDATE USUARIO
            SET tipo = ?
            WHERE codigo_usuario = ?
        `;
        await connection.query(updateProfessorQuery, ['coordenador', codigo_professor]);

        (await connection).commit();

        return {
            codigo_professor,
            tipo: 'coordenador',
        };
    } catch (error) {
        (await connection).rollback();
        throw new Error('Erro ao criar coordenador: ' + error.message);
    } finally {
        connection.release();
    }
};

// Listar coordenadores
export const getAllCoordenadoresService = async () => {
    const connection = await pool.getConnection();

    try {
        const [coordenadores] = await connection.query(`
            SELECT *
            FROM USUARIO
            WHERE tipo = 'coordenador'
        `);

        return coordenadores;
    } catch (error) {
        throw new Error('Erro ao obter coordenadores: ' + error.message);
    } finally {
        connection.release();
    }
};

export const createDisciplinaService = async (nome) => {
    // Recupera os dados da disciplina
    const connection = await pool.getConnection();
    try {

        // Insere os dados da disciplina na table DISCIPLINA
        const query = `
            INSERT INTO DISCIPLINA (nome) VALUES (?)`

        const values = [nome];
        const [result] = await connection.query(query, values);

        return nome;
    } catch (error) {
        throw new Error('Erro ao criar disciplina: ' + error.message);
    } finally {
        connection.release();
    }
}

export const createMonitoriaService = async (monitoriaData) => {
    // Recupera os dados da disciplina
    const { codigo_monitor, codigo_disciplina, data_inicio, data_fim, ativo } = monitoriaData;

    const connection = await pool.getConnection();
    try {

        // Insere os dados do edital na tabela EDITAL
        const query = `
            INSERT INTO MONITORIA ( codigo_monitor, codigo_disciplina, data_inicio, data_fim, ativo)
            VALUES (?, ?, ?, ?, ?)
        `

        const values = [codigo_monitor, codigo_disciplina, data_inicio, data_fim, ativo];
        const [result] = await connection.query(query, values);

        return {
            codigo_monitor,
            codigo_disciplina,
            data_inicio,
            data_fim,
            ativo
        };

    } catch (error) {
        throw new Error('Erro ao criar monitoria: ' + error.message);
    } finally {
        connection.release();
    }
}