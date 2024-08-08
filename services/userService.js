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
  
  // Verifica se o usuário possui um nome e e-mail válidos
  if (!user.name || !user.email) {
    throw new Error('Dados inválidos'); // Lança um erro se os dados estiverem faltando
  }

  // Gera um novo ID para o usuário
  user.id = db.users.length ? db.users[db.users.length - 1].id + 1 : 1;
  // Adiciona o novo usuário à lista de usuários
  db.users.push(user);
  // Atualiza o arquivo JSON com os dados modificados
  await writeDB(db);
  // Retorna o usuário recém-criado
  return user;
};
