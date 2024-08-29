import { pool } from '../database/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret_aqui';

// Serviço para realizar login
export const loginUserService = async (email, senha, tipo_usuario) => {
    const connection = await pool.getConnection();
    try {
        if (tipo_usuario == 'aluno') {
            console.log(email, senha, tipo_usuario);
            const [aluno] = await connection.query('SELECT * FROM USUARIO WHERE email = ? AND tipo = ?', [email, tipo_usuario]);

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
        if (tipo_usuario == 'professor') {
            const [professor] = await connection.query('SELECT * FROM USUARIO WHERE email = ? AND tipo = ?', [email, tipo_usuario]);

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
        throw new Error ('Erro ao realizar login: ' + error.message);
    } finally {
        connection.release();
    }
};