import { pool } from '../database/db.js';

// Serviço para obter todos os editais
export const getAllEditaisService = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM EDITAL');
        return rows;
    } finally {
        connection.release();
    }
};

// Serviço para obter todos os editais publicos
export const getAllPublicEditaisService = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM EDITAL WHERE publico = 1');
        return rows;
    } finally {
        connection.release();
    }
};

// Serviço para obter um edital pelo id
export const getEditalService = async (codigo_edital) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM EDITAL WHERE codigo_edital = ?', [codigo_edital]);
        return rows;
    } finally { 
        connection.release();
    }
};

// Serviço para criar edital
export const createEditalService = async (edital) => {
    const { codigo_professor, descricao, publico } = edital;

    // Valida a existencia de um professor com codigo_professor
    const connection = await pool.getConnection();

    try {
        const [existingProfessor] = await connection.query('SELECT * FROM PROFESSOR WHERE codigo_professor = ?', [codigo_professor]);
        if (existingProfessor.length < 1) {
            throw new Error('Não existe professor com o código informado');
        }

        // Insere os dados do edital na tabela EDITAL
        const query = `
            INSERT INTO EDITAL (codigo_professor, data_postagem, descricao, publico)
            VALUES (?, ?, ?, ?)
        `

        const data_atual = new Date();

        const ano = data_atual.getFullYear();
        const mes = String(data_atual.getMonth() + 1).padStart(2, '0');
        const dia = String(data_atual.getDate()).padStart(2, '0');

        const data_postagem = `${ano}-${mes}-${dia}`;

        const values = [codigo_professor, data_postagem, descricao, publico];
        const [result] = await connection.query(query, values);

        return {
            codigo_edital: result.insertId,
            codigo_professor,
            data_postagem,
            descricao,
            publico,
        };
    } catch (error) {
        throw new Error('Erro ao criar edital: ' + error.message);
    } finally {
        connection.release();
    }  
};

// Serviço para atualizar as informações de um edital
export const updateEditalService = async (codigo_edital, editalData) => {
    const { descricao, publico } = editalData;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction(); // Inicia a transação

        // Construção dinâmica da consulta SQL
        let updateEditalQuery = 'UPDATE EDITAL SET ';
        let updateEditalValues = [];
        
        if (descricao) {
            updateEditalQuery += 'descricao = ?, ';
            updateEditalValues.push(descricao);
        }
        if (publico) {
            updateEditalQuery += 'publico = ?, '
            updateEditalValues.push(publico);
        }

        // Remove a última vírgula e adiciona a cláusula WHERE
        updateEditalQuery = updateEditalQuery.slice(0, -2) + ' WHERE codigo_edital = ?';
        updateEditalValues.push(codigo_edital);

        // Atualiza as informações do edital na tabela EDITAL
        await connection.query(updateEditalQuery, updateEditalValues);

        await connection.commit(); // Confirma a transação
        return { codigo_edital, descricao, publico };
    } catch (error) {
        throw new Error('Erro ao atualizar edital: ' + error.message);
    } finally {
        connection.release();
    }
};