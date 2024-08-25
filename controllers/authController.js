import { loginUserService } from '../services/authService.js';
import { passRecoveryService } from '../services/authService.js'

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
    const { email } = req.body;  
    try {
        const response = await passRecoveryService(email);
        res.json(response);
    } catch (error) {
        res.status(401).json({ message: 'Erro ao enviar e-mail com o código de recuperação!', error: error.message });
    }
};

// Controlador para token e reencaminhar para o serviço de 
export const verifyCodeController = async (req, res) => {
    const { token } = req.query;

    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, JWT_SECRET);
        const { email } = decoded;

        // Verifica se o e-mail é válido
        const connection = await pool.getConnection();
        const [userData] = await connection.query('SELECT * FROM USUARIO WHERE email = ?', [email]);
        if (userData.length === 0) {
            return res.status(400).send('Token inválido.');
        }

        // Exibe a página para redefinir a senha ou qualquer outra lógica necessária
        res.send('Token válido. Você pode redefinir sua senha agora.');

        connection.release();
    } catch (error) {
        console.error('Erro:', error);
        res.status(400).send('Token inválido ou expirado.');
    }
};
