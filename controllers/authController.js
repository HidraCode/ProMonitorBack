import { loginUserService, verifyCodeService, passResetService, passRecoveryService } from '../services/authService.js';

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

// Controlador para recuperação de senha
export const passwordRecoveryController = async (req, res) => {
    const { email, resend } = req.body;
    console.log (req.body)

    try {
        const response = await passRecoveryService(email, resend);
        if (response.success){
            return res.status(200).json(response); // Retorna sucesso com os dados
        }
    } catch (error) {
        console.error('Backend Error:', error.message); // Log de erro no backend
        return res.status(400).json({ success: false, message: error.message || 'Erro ao recuperar a senha' });
    }
};

// Controlador para verificação de código de recuperação de senha
export const verifyCodeController = async (req, res) => {
    const { token, verification_code } = req.body;
    try {
        const response = await verifyCodeService(token, verification_code);
        if (response.success) {
            return res.status(200).json({ message: "Código validado com sucesso." });
        }
        return res.status(400).json({ message: "Código de recuperação inválido." });
    } catch (error) {
        console.error('Erro:', error);
        res.status(400).json(error);
    }
};

// Controlador para redefinir senhas
export const passResetController = async (req, res) => {
    const { token, values } = req.body;

    try {
        const response = await passResetService(token, values);
        if (response.success) {
            return res.status(200).json({ message: "Senha redefinida com sucesso." });
        }
        else {
            return res.status(400).json({ message: "A redefinição de senha falhou." });
        }
    } catch (error) {
        console.error('Erro:', error);
        res.status(400).json(error);
    }
};
