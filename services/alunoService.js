import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { pool } from '../database/db.js';

dotenv.config();

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_aqui';

// Serviço para consultar todos os alunos
export const getAllAlunosService = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM USUARIO WHERE tipo = ?', ['aluno']);
        return rows;
    } finally {
        connection.release();
    }
}

// Serviço para cadastrar aluno
export const createAlunoService = async (alunoData) => {
    // Recupera os dados do aluno
    const { nome, matricula, cpf, telefone, data_nascimento, email, senha } = alunoData;

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
        if (existingEmail.length > 0){
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

        const [result] = await connection.query(query, ['aluno', nome, matricula, cpf,
             telefone, data_nascimento, email, hashedPassword]);

        // Cria o payload do token com o codigo_usuario, papel e email
        const payload = { codigo_usuario: result.insertId, role: 'aluno', email };
        // Gera o token JWT
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        return { 
            codigo_usuario: result.insertId,
            token,
        };
    } catch (error) {
        throw new Error('Erro ao cadastrar aluno: ' + error.message);
    } finally {
        connection.release();
    }
};

// Serviço para atualizar aluno
export const updateAlunoService = async (codigo_usuario, alunoData) => {
    const { nome, matricula, cpf, telefone, data_nascimento, email, senha } = alunoData;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction(); // Inicia a transação

        // Verifica a senha do aluno
        const [aluno] = await connection.query('SELECT senha FROM USUARIO WHERE codigo_usuario = ?', [codigo_usuario]);
        if (aluno.length === 0 || !(await bcrypt.compare(senha, aluno[0].senha))) {
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
            if (existingEmail.length > 0){
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
        throw new Error('Erro ao atualizar aluno: ' + error.message);
    } finally {
        connection.release();
    }
};