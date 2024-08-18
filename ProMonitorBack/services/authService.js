import { pool } from '../database/db.js';;
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
        throw new Error('Erro ao realizar login: ' + error.message);
    } finally {
        connection.release();
    }
}

//Cria um código para redefinição de senha
export const createVerificationCode = async (userId) => {
    const code = generateSixDigitCode();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora de expiração

    try {
        const [result] = await pool.query(
            'INSERT INTO verification_codes (user_id, code, expires_at) VALUES (?, ?, ?)',
            [userId, code, expiresAt]
        );
        return { code, expiresAt };
    } catch (error) {
        console.error('Error creating verification code:', error);
        throw new Error('Unable to create verification code');
    }
};

export const sendMail = async (email) => {
    const connection = await pool.getConnection();
    try {
        console.log(email);
        const [user] = await connection.query('SELECT * FROM USUARIO WHERE USUARIO.email = ?', [email]);

        if (user.length === 0) {
            throw new Error('Nenhum usuário cadastrado com o e-mail informado.');
        }

        const userData = user[0];
        console.log(userData)

        const [codeData] = await createVerificationCode(userData.id)

        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "promonitorufrpe@gmail.com",
                pass: "oiinyikrxaihamqg",
            },

        });

        const emailBody = '<p>Recuperação de Senha</p>';

        const mailOptions = {
            from: "promonitorufrpe@gmail.com",
            to: email,
            subject: "Código de recuperação de senha ProMonitor",
            text: "Olá, seu código de verificação do ProMonitor: " + codeData.code + ". Esse código expira em 1 hora.",
            html: emailBody,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Erro ao enviar o e-mail:", error);
            } else {
                console.log("E-mail enviado:", info.res);
            }
        });

    }
    catch (error) {
        throw new Error('Erro ao enviar código de verificação: ' + error.message);
    }
    finally {
        connection.release();
    }
}

export const verifyCode = async (email, code) => {
    const connection = await pool.getConnection();
    try {
        const [user] = await connection.query('SELECT * FROM USUARIO WHERE USUARIO.email = ?', [email])
        if (user.length === 0) {
            console.log("Usuário não encontrado.")
        }
        const userData = user[0];
        console.log(userData)

        const [results] = await pool.query(
            'SELECT * FROM verification_codes WHERE user_id = ? AND code = ? AND expires_at > NOW()',
            [userData.id, code]
        );

        if (results.length === 0) {
            throw new Error('Código inválido ou expirado.');
        }

        // Código é válido
        return true;
    }
    catch (error) {
        throw new Error('Erro ao validar o código de verificação: ' + error.message);
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