import { pool } from '../database/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret_aqui';

// Serviço para realizar login
export const loginUserService = async (email, senha, tipo_usuario) => {
    const connection = await pool.getConnection();
    try {
        if (tipo_usuario == 'aluno') {
            console.log(email, senha, tipo_usuario);
            const [aluno] = await connection.query('SELECT * FROM USUARIO WHERE email = ? AND tipo = ?', [email, tipo_usuario]);

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
        if (tipo_usuario == 'professor') {
            const [professor] = await connection.query('SELECT * FROM USUARIO WHERE email = ? AND tipo = ?', [email, tipo_usuario]);

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

export const passRecoveryService = async (email, resend) => {
    const connection = await pool.getConnection();
    // Criando código de recuperação
    const code = Math.floor(Math.random() * 900000);
    // Formatando para que tenha sempre 6 dígitos
    const formattedCode = code.toString().padStart(6, '0');
    // Definindo a data de expiração
    const expiresAt = new Date(new Date(Date.now() + 60 * 60 * 1000));
    // 1 hora a partir de agora
    try {
        // Procura no banco de dados algum usuário com o e-mail recebido do usuário
        const [userData] = await connection.query('SELECT * FROM USUARIO WHERE email = ?', [email]);

        // Verifica se há usuário cadastrado com o e-mail
        if (userData.length === 0) {
            throw new Error('e-mail não cadastrado.');
        }

        // Acessa o primeiro item do array e obtém o código do usuário
        const { codigo_usuario } = userData[0];

        // Verifica se o usuário já possui um código de verificação ativo
        const [existingCode] = await connection.query('SELECT * FROM CODIGO_RECUPERACAO WHERE codigo_usuario = ?', [codigo_usuario]);

        // Se não houver código cadastrado, mas o resend = true, lança um erro
        if (existingCode.length == 0 && resend) {
            throw new Error('Usuário não possui código cadastrado.');
        }

        // Verifica se o usuário já tem um código válido enviado ao e-mail
        if (existingCode.length > 0) {
            // Se o código expirou, atualiza do banco de dados com novo código e data de expiração
            if (new Date(existingCode[0].expiresAt) < new Date()) {
                await connection.query(
                    'UPDATE CODIGO_RECUPERACAO SET codigo_esperado = ?, expira_em = ? WHERE codigo_usuario = ?',
                    [formattedCode, expiresAt, codigo_usuario]
                );
                // Envia o e-mail com o novo código de recuperação
                sendMail(email, formattedCode);
            }
            if (resend) {
                // Se o parâmetro para reenvio está ativado, atualiza apenas a data de expiração
                await connection.query(
                    'UPDATE CODIGO_RECUPERACAO SET expira_em = ? WHERE codigo_usuario = ?',
                    [expiresAt, codigo_usuario]
                );
                // Reenvia o e-mail com o código de recuperação existente
                sendMail(email, existingCode[0].codigo_esperado);
            } 
        } else {
            // Insere o código de recuperação no banco de dados
            await connection.query(
                'INSERT INTO CODIGO_RECUPERACAO (codigo_usuario, codigo_esperado, expira_em) VALUES (?, ?, ?)',
                [codigo_usuario, formattedCode, expiresAt]
            );
            // Envia o e-mail com o novo código de recuperação
            sendMail(email, formattedCode);
        }

        // Cria o payload  do token com o código do usuário e email
        const payload = { codigo_usuario, email }
        // Gera o token, definindo a duração do token para 1h
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })

        // Retorna uma mensagem de sucesso
        return { success: true, token: token, email: email};
    } catch (error) {
        console.error('Backend Error:', error.message); // detalhes do erro
        throw new Error(error.message);
    }  finally {
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
            throw new Error('o usuário não possui códigos de recuperação cadastrados.');
        }
        else if (new Date(codeData[0].expira_em) < new Date()) {
            // Deleta o código do banco de dados caso tenha expirado
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

;