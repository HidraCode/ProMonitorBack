import bcrypt from 'bcrypt';
import { pool } from '../database/db.js';
import { createUserService } from './userService.js';

// Serviço para consultar todos os professores
export const getAllProfessoresService = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM PROFESSOR JOIN USUARIO ON PROFESSOR.codigo_usuario = USUARIO.codigo_usuario');
        return rows;
    } finally {
        connection.release();
    }
}

// Serviço para cadastrar professor
export const createProfessorService = async (professorData) => {
    // Recupera os dados do professor
    const { nome, email, telefone, endereco, data_nascimento, departamento, senha, is_coordenador } = professorData;

    const connection = await pool.getConnection();
    try {
        // Cria o usuário genérico
        const usuario = await createUserService({ nome, email, telefone, endereco, data_nascimento, departamento, senha });

        // Insere os dados específicos de professor
        const query = `
            INSERT INTO PROFESSOR (codigo_professor, codigo_usuario, is_coordenador)
            VALUES (?, ?, ?)
        `;
        const codigo_professor = usuario.codigo_usuario; //O codigo do professor vai ser iqual o de usuario
        await connection.query(query, [codigo_professor, usuario.codigo_usuario, is_coordenador]);

        return { ...usuario, is_coordenador };
    } catch (error) {
        throw new Error('Erro ao cadastrar professor: ' + error.message);
    } finally {
        connection.release();
    }
}

// Serviço para atualizar professor
export const updateProfessorService = async (codigo_usuario, professorData) => {
    const { nome, email, telefone, endereco, data_nascimento, departamento, senha, is_coordenador } = professorData;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction(); // Inicia a transação

        // Construção dinâmica da consulta SQL
        let updateUsuarioQuery = 'UPDATE USUARIO SET ';
        let updateUsuarioValues = [];
        
        if (nome) {
            updateUsuarioQuery += 'nome = ?, ';
            updateUsuarioValues.push(nome);
        }
        if (email) {
            updateUsuarioQuery += 'email = ?, ';
            updateUsuarioValues.push(email);
        }
        if (telefone) {
            updateUsuarioQuery += 'telefone = ?, ';
            updateUsuarioValues.push(telefone);
        }
        if (endereco) {
            updateUsuarioQuery += 'endereco = ?, ';
            updateUsuarioValues.push(endereco);
        }
        if (data_nascimento) {
            updateUsuarioQuery += 'data_nascimento = ?, ';
            updateUsuarioValues.push(data_nascimento);
        }
        if (departamento) {
            updateUsuarioQuery += 'departamento = ?, ';
            updateUsuarioValues.push(departamento);
        }
        if (senha) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(senha, saltRounds);
            updateUsuarioQuery += 'senha = ?, ';
            updateUsuarioValues.push(hashedPassword);
        }

        // Remove a última vírgula e adiciona a cláusula WHERE
        updateUsuarioQuery = updateUsuarioQuery.slice(0, -2) + ' WHERE codigo_usuario = ?';
        updateUsuarioValues.push(codigo_usuario);

        // Atualiza as informações do usuário na tabela USUARIO
        await connection.query(updateUsuarioQuery, updateUsuarioValues);

        // Atualiza as informações específicas do professor na tabela PROFESSOR
        const queryProfessor = `
            UPDATE PROFESSOR
            SET is_coordenador = ?
            WHERE codigo_usuario = ?
        `;
        await connection.query(queryProfessor, [is_coordenador, codigo_usuario]);

        await connection.commit(); // Confirma a transação
        return { codigo_usuario, nome, email, telefone, endereco, data_nascimento, departamento, is_coordenador };
    } catch (error) {
        await connection.rollback(); // Reverte a transação em caso de erro
        throw new Error('Erro ao atualizar professor: ' + error.message);
    } finally {
        connection.release();
    }
};
