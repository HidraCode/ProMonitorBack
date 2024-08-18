import bcrypt from 'bcrypt';
import { pool } from '../database/db.js';
import { createUserService } from './userService.js';

// Serviço para consultar todos os alunos
export const getAllAlunosService = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM ALUNO JOIN USUARIO ON ALUNO.codigo_usuario = USUARIO.codigo_usuario');
        return rows;
    } finally {
        connection.release();
    }
}

// Serviço para cadastrar aluno
export const createAlunoService = async (alunoData) => {
    // Recupera os dados do aluno
    const { nome, email, telefone, endereco, data_nascimento, departamento, senha, comprovante_vinculo, historico_escolar } = alunoData;

    const connection = await pool.getConnection();
    try {
        // Cria o usuário genérico
        const usuario = await createUserService({ nome, email, telefone, endereco, data_nascimento, departamento, senha });

        // Insere os dados específicos de aluno
        const query = `
            INSERT INTO ALUNO (codigo_usuario, comprovante_vinculo, historico_escolar)
            VALUES (?, ?, ?)
        `;
        await connection.query(query, [usuario.codigo_usuario, comprovante_vinculo, historico_escolar]);

        return { ...usuario, comprovante_vinculo, historico_escolar };
    } catch (error) {
        throw new Error('Erro ao cadastrar aluno: ' + error.message);
    } finally {
        connection.release();
    }
}

// Serviço para atualizar aluno
export const updateAlunoService = async (codigo_usuario, alunoData) => {
    const { nome, email, telefone, endereco, data_nascimento, departamento, senha, comprovante_vinculo, historico_escolar } = alunoData;

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

        // Atualiza as informações específicas do aluno na tabela ALUNO
        const queryAluno = `
            UPDATE ALUNO
            SET comprovante_vinculo = ?, historico_escolar = ?
            WHERE codigo_usuario = ?
        `;
        await connection.query(queryAluno, [comprovante_vinculo, historico_escolar, codigo_usuario]);

        await connection.commit(); // Confirma a transação
        return { codigo_usuario, nome, email, telefone, endereco, data_nascimento, departamento, comprovante_vinculo, historico_escolar };
    } catch (error) {
        await connection.rollback(); // Reverte a transação em caso de erro
        throw new Error('Erro ao atualizar aluno: ' + error.message);
    } finally {
        connection.release();
    }
};
