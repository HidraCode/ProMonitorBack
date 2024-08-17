import { pool } from '../database/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_aqui';

// Serviço para realizar login
export const loginUserService = async (email, senha) => {
    const connection = await pool.getConnection();
    try {
        // Verifica se o email existe
        const [user] = await connection.query('SELECT * FROM USUARIO WHERE email = ?', [email]);
  
        if (user.length === 0) {
            throw new Error('Email ou senha incorretos');
        }
  
        const userData = user[0];
        // Compara a senha fornecida com a senha armazenada
        const isPasswordValid = await bcrypt.compare(senha, userData.senha);
    
        if (!isPasswordValid) {
            throw new Error('Email ou senha incorretos');
        }
    
        // Cria o payload do token com o ID do usuário e outras informações 
        const payload = { id: userData.codigo_usuario, email };
        // Cria o token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    
        return {
            id: userData.codigo_usuario,
            email: userData.email,
            token,
        };
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