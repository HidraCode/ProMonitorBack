import { loginUserService } from '../services/authService.js';

export const authController = async (req, res) => {
    // Recupera email e senha no corpo da requisição
    const { email, senha, tipoUsuario } = req.body;
    try {
        // Chama o serviço de login
        const user = await loginUserService(email, senha, tipoUsuario);
        res.json(user);
    } catch (error){
        res.status(401).json({ message: 'Credenciais inválidas!', error: error.message });
    }
};