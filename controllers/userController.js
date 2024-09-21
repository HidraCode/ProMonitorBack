// controllers/userController.js

// Importa as funções do serviço de usuário que lidam com as operações de banco de dados.
import { getAllUsersService, createUserService, getUserService } from '../services/userService.js';

// Controlador para a rota GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    // Chama o serviço para obter todos os usuários
    const users = await getAllUsersService();
    // Retorna a lista de usuários no formato JSON
    res.status(200).json(users);
  } catch (error) {
    // Em caso de erro, retorna uma resposta de erro com o status 500
    res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
  }
};

// Controlador para a rota GET /api/user/personal-data
export const getUser = async (req, res) => {
  const { codigo_usuario } = req.user.codigo_usuario;
  try {
    // Chama o serviço para obter os dados de um usuário pelo codigo_usuario
    const user = await getUserService();
    // Retorna a lista de usuários no formato JSON
    res.status(200).json(user);
  } catch (error) {
    // Em caso de erro, retorna uma resposta de erro com o status 500
    res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
  }
};

// Controlador para a rota POST /api/users
export const createUser = async (req, res) => {
  try {
    // Chama o serviço para criar um novo usuário com os dados do corpo da requisição
    const newUser = await createUserService(req.body);
    // Retorna o novo usuário criado com o status 201 (Criado)
    res.status(201).json(newUser);
  } catch (error) {
    // Em caso de erro, retorna uma resposta de erro com o status 500 e a mensagem do erro
    res.status(500).json({ message: 'Erro ao cadastrar usuário: ', error: error.message });
  }
};