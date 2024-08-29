import { pool } from '../database/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// Serviço para obter todos os usuários
export const getAllUsersService = async () => {
  const connection = await pool.getConnection();  // Se conecta ao banco de dados
  try {
    // Realiza e retorna a consulta
    const [rows] = await connection.query('SELECT * FROM USUARIO');
    return rows;
  } finally {
    connection.release();
  }
};

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_aqui';

// Serviço para criar um novo usuário
export const createUserService = async (user) => {
  const { nome, email, telefone, endereco, data_nascimento, departamento, senha } = user;
  
  // Encripta a senha
  const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

  if (!user.nome || !user.email || !user.telefone || !user.endereco || !user.data_nascimento || !user.departamento || !user.senha) {
    throw new Error('Dados inválidos'); // Lança um erro se os dados estiverem faltando
  }

  // Verifica se o email é válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    throw new Error('Email inválido');
  }

  // Verifica se o nome não possui menos de 2 caracteres
  if (user.nome.trim().length < 2) {
    throw new Error('Nome inválido');
  }

  // Verifica se o telefone é válido
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(user.telefone)) {
    throw new Error('Telefone inválido');
  }

  // Cria uma conexão com o banco de dados
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
      INSERT INTO USUARIO (nome, email, telefone, endereco, data_nascimento, departamento, senha)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [nome, email, telefone, endereco, data_nascimento, departamento, hashedPassword];

    // Realiza a consulta inserindo os dados
    const [result] = await connection.query(query, values);

    // Cria o payload do token com o ID do usuário e outras informações relevantes
    const payload = { id: result.insertId, email };
    // Gera o token JWT
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return {
      codigo_usuario: result.insertId,
      nome,
      email,
      token,
    };
  } catch (error) {
    throw new Error('Erro ao cadastrar usuário: ' + error.message);
  } finally {
    connection.release();
  }
};