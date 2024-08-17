import { pool } from '../database/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_aqui';

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
        
            // Cria o payload do token com o ID do usuário e outras informações 
            const payload = { codigo_usuario: alunoData.codigo_usuario, email };
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
            console.log(alunoData)
            // Compara a senha fornecida com a senha armazenada
            const isPasswordValid = await bcrypt.compare(senha, professorData.senha);
        
            if (!isPasswordValid) {
                throw new Error('Email ou senha incorretos');
            }
        
            // Cria o payload do token com o ID do usuário e outras informações 
            const payload = { codigo_usuario: professorData.codigo_usuario, email };
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
}

// Função para verificar token
export const verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;     // Retorna o payload do token
    } catch (error) {
        throw new Error('Token inválido ou expirado');
    }
}