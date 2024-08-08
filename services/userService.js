// services/userService.js

// Importa o módulo de promessas do sistema de arquivos e o módulo de caminho
import fs from 'fs/promises';
import path from 'path';

// Define o caminho absoluto para o arquivo JSON do banco de dados
const dbPath = path.resolve('database/db.json');

// Função para ler o arquivo JSON do banco de dados
const readDB = async () => {
  // Lê o conteúdo do arquivo JSON como uma string
  const data = await fs.readFile(dbPath, 'utf8');
  // Analisa a string JSON e retorna um objeto JavaScript
  return JSON.parse(data);
};

// Função para escrever dados no arquivo JSON do banco de dados
const writeDB = async (data) => {
  // Converte o objeto JavaScript em uma string JSON formatada e escreve no arquivo
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
};

// Serviço para obter todos os usuários
export const getAllUsersService = async () => {
  // Lê o banco de dados
  const db = await readDB();
  // Retorna a lista de usuários
  return db.users;
};

// Serviço para criar um novo usuário
export const createUserService = async (user) => {
  // Lê o banco de dados
  const db = await readDB();
  
  // Verifica se o usuário possui um nome, e-mail, telefone, endereço, data de nascimento e departamento
  if (!user.name || !user.email || !user.telefone || !user.endereco || !user.data_nascimento || !user.departamento) {
    throw new Error('Dados inválidos'); // Lança um erro se os dados estiverem faltando
  }

  // Verifica se o email é válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    throw new Error('Email inválido');
  }

  // Verifica se o e-mail já está cadastrado
  const emailExists = db.users.some(existingUser => existingUser.email === user.email);
  if (emailExists) {
      throw new Error('E-mail já cadastrado');
  }
  
  // Verifica se o nome não possui menos de 2 caracteres
  if (user.name.trim().length < 2) {
    throw new Error('Nome inválido');
  }

  // Verifica se o telefone é válido
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(user.telefone)) {
    throw new Error('Telefone inválido');
  }

  // Verifica a data de nascimento
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (!dateRegex.test(user.data_nascimento)) {
    throw new Error('Data de nascimento inválida');
  }
  // Gera um novo ID para o usuário
  user.codigo_usuario = db.users.length ? db.users[db.users.length - 1].codigo_usuario + 1 : 1;
  // Adiciona o novo usuário à lista de usuários
  db.users.push(user);
  // Atualiza o arquivo JSON com os dados modificados
  await writeDB(db);
  // Retorna o usuário recém-criado
  return user;
};