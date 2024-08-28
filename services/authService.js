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
    const code = Math.floor(Math.random() * 900000);

    // Formatando para que tenha sempre 4 dígitos
    const formattedCode = code.toString().padStart(6, '0');

    // Definindo a data de expiração
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora a partir de agora

    try {
        // Procura no banco de dados algum usuário com o e-mail recebido do usuário
        const [userData] = await connection.query('SELECT * FROM USUARIO WHERE email = ?', [email]);

        // Verifica se usuário não existe
        if (userData.length === 0) {
            throw new Error('Usuário não encontrado.');
        }

        // Acessa o primeiro item do array e obtém o código do usuário
        const { codigo_usuario } = userData[0];

        // Verifica se o usuário já possui um código de verificação ativo
        const [existingCode] = await connection.query('SELECT * FROM CODIGO_RECUPERACAO WHERE codigo_usuario = ?', [codigo_usuario]);

        // Verifica se o usuário já tem um código enviado ao e-mail
        if (existingCode.length > 0) {
            // Deleta do banco de dados para reinserir um novo
            await connection.query('DELETE FROM CODIGO_RECUPERACAO WHERE codigo_usuario = ?', [codigo_usuario])
        }

        // Insere o código de recuperação no banco de dados
        await connection.query(
            'INSERT INTO CODIGO_RECUPERACAO (codigo_usuario, codigo_esperado, expira_em) VALUES (?, ?, ?)',
            [codigo_usuario, formattedCode, expiresAt]
        );

        // Cria o payload  do token com o código do usuário do código de recuperação
        const payload = { codigo_usuario }
        console.log(payload)
        // Gera o token, definindo a duração do token para 1h
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })

        // Envia o e-mail com o código de recuperação
        sendMail(email, formattedCode);

        // Retorna uma mensagem de sucesso ao front-end
        return { "success": true, "token": token };

    } catch (error) {
        // Lança o erro
        console.error(error);
        return { "success": false, "message": error.message };
    } finally {
        // Libera a conexão
        connection.release();
    }
};

export const verifyCodeService = async (token, verification_code) => {
    const connection = await pool.getConnection();
    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, JWT_SECRET);
        const { codigo_usuario } = decoded;

        // Busca o usuário pelo código no banco de dados
        const [userData] = await connection.query('SELECT * FROM USUARIO WHERE codigo_usuario = ?', [codigo_usuario]);
        // Procura um código de recuperação correspondente ao código de usuário
        const [codeData] = await connection.query('SELECT * FROM CODIGO_RECUPERACAO WHERE codigo_usuario = ?', [codigo_usuario]);

        // Verifica se não há usuário com este codigo_usuario no banco de dados
        if (userData.length === 0) {
            throw new Error('usuário não encontrado.');
        }

        // Verifica se o usuário não possui código cadastrado ou se o código expirou
        if (codeData.length === 0) {
            throw new Error('O usuário não possui códigos de recuperação cadastrados.');
        }
        else if (new Date(codeData[0].expira_em) < new Date()) {
            // Deleta o código do banco de dados
            await connection.query('DELETE FROM CODIGO_RECUPERACAO WHERE codigo_usuario = ?', [codigo_usuario]);
            throw new Error('Código expirado.');
        }

        // Passa para verificar o código esperado e o recebido
        if (codeData[0].codigo_esperado == verification_code) {
            // Deleta o código do banco de dados
            await connection.query('DELETE FROM CODIGO_RECUPERACAO WHERE codigo_usuario = ?', [codigo_usuario]);
            // Retorna a resposta
            return { success: true };
        }
        else {
            // Retorna a resposta
            return { success: false };
        }

    } catch (error) {
        console.error('Erro no serviço de verificação:', error.message);
        throw new Error(error.message);
    } finally {
        connection.release();
    }
};

export const passResetService = async (token, values) => {
    const connection = await pool.getConnection();
    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, JWT_SECRET);
        const { codigo_usuario } = decoded;
        const { senha, confirmar_senha } = values

        // Busca o usuário pelo código no banco de dados
        const [userData] = await connection.query('SELECT * FROM USUARIO WHERE codigo_usuario = ?', [codigo_usuario]);

        // Verifica se não há usuário com o este codigo_usuario
        if (userData.length === 0) {
            throw new Error('usuário não encontrado.');
        }

        // Passa para verificar se a senha e a confirmação da senha são iguais
        if (senha === confirmar_senha) {
            // Altera a senha do usuário no banco de dados
            await connection.query('UPDATE USUARIO SET senha = ? WHERE codigo_usuario = ?', [senha, codigo_usuario]);
            return { success: true };
        }
        else {
            return { success: false };
        }

    } catch (error) {
        console.error('Erro:', error.message);
        throw new Error(error.message);
    } finally {
        connection.release();
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

