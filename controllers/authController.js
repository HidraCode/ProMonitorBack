import { loginUserService, verifyCode, sendMail } from '../services/authService.js';

// Controlador para login de usuário
export const authController = async (req, res) => {
    const { email, senha, tipoUsuario } = req.body;
    try {
        const response = await loginUserService(email, senha, tipoUsuario);
        res.json(response);  // Retorna a resposta do serviço
    } catch (error) {
        res.status(401).json({ message: 'Credenciais inválidas!', error: error.message });
    }
};

// Controlador para verificação de código
export const verifyCodeController = async (req, res) => {
    const { email, code } = req.body; 
    try {
        const response = await verifyCode(email, code);
        res.json(response);
    } catch (error) {
        res.status(401).json({ message: 'Código não verificado!', error: error.message });
    }
};

// Controlador para recuperação de senha
export const passwordRecoveryController = async (req, res) => {
    const { email } = req.body;  
    try {
        const response = await sendMail(email);
        res.json(response);
    } catch (error) {
        res.status(401).json({ message: 'Erro ao enviar e-mail com o código de recuperação!', error: error.message });
    }
};
