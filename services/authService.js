import { pool } from '../database/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { getAllUsersService } from './userService.js';
import { useState } from 'react';

dotenv.config();

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

// Serviço para realizar login
export const loginUserService = async (email, senha, tipoUsuario) => {
    const connection = await pool.getConnection();
    try {
        if (tipoUsuario == 'aluno') {
            console.log(email, senha, tipoUsuario);
            const [aluno] = await connection.query('SELECT * FROM ALUNO JOIN USUARIO ON ALUNO.codigo_usuario = USUARIO.codigo_usuario WHERE USUARIO.email = ?', [email]);

            if (aluno.length === 0) {
                throw new Error('Email ou senha incorretos');
            }

            const alunoData = aluno[0];
            console.log(alunoData)
            // Compara a senha fornecida com a senha armazenada
            const isPasswordValid = await bcrypt.compare(senha, alunoData.senha);

            if (!isPasswordValid) {
                throw new Error('Email ou senha incorretos');
            }

            // Cria o payload do token com o ID do usuário, role e email
            const payload = { codigo_usuario: alunoData.codigo_usuario, role: 'aluno', email };
            // Cria o token
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

            return {
                codigo_usuario: alunoData.codigo_usuario,
                email: alunoData.email,
                token,
            };
        }
        if (tipoUsuario == 'professor') {
            const [professor] = await connection.query('SELECT * FROM PROFESSOR JOIN USUARIO ON PROFESSOR.codigo_usuario = USUARIO.codigo_usuario WHERE USUARIO.email = ?', [email]);

            if (professor.length === 0) {
                throw new Error('Email ou senha incorretos');
            }

            const professorData = professor[0];
            console.log(professorData)
            // Compara a senha fornecida com a senha armazenada
            const isPasswordValid = await bcrypt.compare(senha, professorData.senha);

            if (!isPasswordValid) {
                throw new Error('Email ou senha incorretos');
            }

            // Cria o payload do token com o ID do usuário, role e email
            const payload = { codigo_usuario: professorData.codigo_usuario, role: 'professor', email };
            // Cria o token
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

            return {
                codigo_usuario: professorData.codigo_usuario,
                email: professorData.email,
                token,
            };
        }
    } catch (error) {
        throw new Error('Erro ao realizar login: ' + error.message);
    } finally {
        connection.release();
    }
}

export const passRecoveryService = async (email) => {
    const connection = await pool.getConnection();

    const code = Math.floor(Math.random() * 9000);
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora de expiração

    try {
        // Procura no banco de dados algum usuário com o e-mail recebido do usuário
        const [userData] = await connection.query('SELECT * FROM USUARIO WHERE email = ?', [email]);
        
        // Verifica se algum usuário foi encontrado com dado e-mail
        if (userData.length === 0) {
            throw new Error('Usuário não encontrado.');
        }

        // Acessa o primeiro item do array e obtém o código do usuário
        const { codigo_usuario } = userData[0];
        
        // Insere o código de recuperação no banco de dados
        const [result] = await connection.query(
            'INSERT INTO codigo_recuperacao (codigo_usuario, codigo_esperado, codigo_recebido, expira_em) VALUES (?, ?, ?, ?)',
            [codigo_usuario, code, null, expiresAt]
        );

        console.log('Código de recuperação inserido com sucesso:', result);
    } catch (error) {
        // Lança o erro
        console.error('Erro ao criar código de recuperação:', error);
        throw error;
    } finally {
        // Libera a conexão
        connection.release();
    }
};
