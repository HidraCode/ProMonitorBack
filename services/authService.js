import { pool } from '../database/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

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

            // Cria o payload do token com o ID do usuário, role e email
            const payload = { codigo_usuario: alunoData.codigo_usuario, role: 'aluno', email };
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
            console.log(professorData)
            // Compara a senha fornecida com a senha armazenada
            const isPasswordValid = await bcrypt.compare(senha, professorData.senha);

            if (!isPasswordValid) {
                throw new Error('Email ou senha incorretos');
            }

            // Cria o payload do token com o ID do usuário, role e email
            const payload = { codigo_usuario: professorData.codigo_usuario, role: 'professor', email };
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

export const passRecoveryService = async (email) => {
    const connection = await pool.getConnection();

    // Criando código de recuperação
    const code = Math.floor(Math.random() * 9000);

    // Formatando para que tenha sempre 4 dígitos
    const formattedCode = code.toString().padStart(4, '0');

    // Definindo a data de expiração
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora a partir de agora

    try {
        // Procura no banco de dados algum usuário com o e-mail recebido do usuário
        const [userData] = await connection.query('SELECT * FROM USUARIO WHERE email = ?', [email]);
        // Verifica se o usuário já possui um código de verificação ativo
        const [existingCode] = await connection.query('SELECT * FROM CODIGO_RECUPERACAO WHERE codigo_usuario = ?', [codigo_usuario]);


        // Verifica se usuário não existe
        if (userData.length === 0) {
            throw new Error('Usuário não encontrado.');
        }

        // Verifica se usuário já tem um código enviado ao e-mail
        if (existingCode.length > 0) {
            throw new Error('Usuário já possui um código de recuperação válido. Verifique seu e-mail.');
        }

        // Acessa o primeiro item do array e obtém o código do usuário
        const { codigo_usuario } = userData[0];

        // Insere o código de recuperação no banco de dados
        await connection.query(
            'INSERT INTO CODIGO_RECUPERACAO (codigo_usuario, codigo_esperado, codigo_recebido, expira_em) VALUES (?, ?, ?, ?)',
            [codigo_usuario, formattedCode, null, expiresAt]
        );

        // Cria o payload do token
        const payload = { email }

        // Gera o token, definindo a duração do link para 1h, mesma duração do código
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })

        // Envia o e-mail com o link de recuperação
        const recoveryLink = `http://localhost:3000/pass-recovery/verify-code?token=${token}`;
        sendMail(email, formattedCode, recoveryLink);

        console.log('Código de recuperação inserido com sucesso.');

        // Retorna uma mensagem de sucesso ao front-end
        return { success: true };

    } catch (error) {
        // Lança o erro
        console.error('Erro:', error);
        throw error;
    } finally {
        // Libera a conexão
        connection.release();
    }
};

export const verifyCodeService = async (token) => {
    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, JWT_SECRET);
        const { email } = decoded;

        // Conecta ao banco de dados
        const connection = await pool.getConnection();
        // Verifica se o e-mail é válido
        const [userData] = await connection.query('SELECT * FROM USUARIO WHERE email = ?', [email]);

        if (userData.length === 0) {
            throw new Error('usuário não encontrado.');
        }

        // Token válido, envia a resposta de sucesso
        return { success: true, message: 'Token válido. Você pode redefinir sua senha agora.' };

    } catch (error) {
        console.error('Erro no serviço de verificação:', error);
        throw new Error('Token inválido ou expirado.');
    } finally {
        // Libera a conexão
        if (connection) connection.release();
    }
};


const sendMail = async (email, code) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "promonitorufrpe@gmail.com",
            pass: "oiinyikrxaihamqg",
        },
    });

    const emailBody = `
        <p>Recuperação de Senha</p>
        <p>Olá, seu código de verificação do ProMonitor: <strong>${code}</strong>. Esse código expira em 1 hora.</p>
        <p>Para redefinir sua senha, clique no link abaixo e insira o código:</p>
        <a href="${recoveryLink}">Redefinir Senha</a>
        `;

    const mailOptions = {
        from: "promonitorufrpe@gmail.com",
        to: email,
        subject: "Código de recuperação de senha ProMonitor",
        text: `Olá, seu código de verificação do ProMonitor: ${code}. Esse código expira em 1 hora.`,
        html: emailBody,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("E-mail enviado:", info.response);
    } catch (error) {
        console.error("Erro ao enviar o e-mail:", error);
        throw new Error('Erro ao enviar o e-mail com o código de recuperação: ' + error.message);
    }
};

