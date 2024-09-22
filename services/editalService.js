import { pool } from '../database/db.js';

// Serviço para obter todos os editais
export const getAllEditaisService = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM EDITAL');
        return rows;
    } catch (error) {
        throw new Error('Erro ao obter editais: ' + error.message);
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
    } catch (error) {
        throw new Error('Erro ao obter editais: ' + error.message);
    } finally {
        connection.release();
    }
};

// Serviço para obter um edital pelo codigo_edital
export const getEditalService = async (codigo_edital) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM EDITAL WHERE codigo_edital = ?', [codigo_edital]);
        return rows;
    } catch (error) {
        throw new Error('Erro ao obter edital: ' + error.message);
    } finally {
        connection.release();
    }
};


// Serviço para obter o link de um edital
export const getEditalLinkService = async (codigo_edital) => {
    const connection = await pool.getConnection();
    try {
        const [link] = await connection.query('SELECT link FROM EDITAL WHERE codigo_edital = ?', [codigo_edital]);
        return link[0];
    } catch (error) {
        throw new Error('Erro ao obter link de edital: ' + error.message);
    } finally {
        connection.release();
    }
};

// Serviço para criar edital
export const createEditalService = async (editalData) => {
    const { codigo_professor, titulo, disciplina, data_inicio, data_fim, descricao, link, publico } = editalData;

    const connection = await pool.getConnection();
    try {
        // Valida a existencia de um professor com codigo_professor
        const [existingProfessor] = await connection.query('SELECT * FROM USUARIO WHERE codigo_usuario = ? AND tipo = ?', [codigo_professor, 'professor']);
        if (existingProfessor.length < 1) {
            throw new Error('Não existe professor com o código informado');
        }

        // Insere os dados do edital na tabela EDITAL
        const query = `
            INSERT INTO EDITAL (codigo_professor, titulo, disciplina, data_inicio, data_fim, descricao, link, publico)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `

        const values = [codigo_professor, titulo, disciplina, data_inicio, data_fim, descricao, link, publico];
        const [result] = await connection.query(query, values);

        return {
            codigo_edital: result.insertId,
            codigo_professor,
            titulo,
            disciplina,
            data_inicio,
            data_fim,
            descricao,
            link,
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
    const { titulo, data_inicio, data_fim, descricao, link, publico } = editalData;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction(); // Inicia a transação

        // Construção dinâmica da consulta SQL
        let updateEditalQuery = 'UPDATE EDITAL SET ';
        let updateEditalValues = [];

        if (titulo) {
            updateEditalQuery += 'titulo = ?, ';
            updateEditalValues.push(titulo);
        }
        if (data_inicio) {
            updateEditalQuery += 'data_inicio = ?, ';
            updateEditalValues.push(data_inicio);
        }
        if (data_fim) {
            updateEditalQuery += 'data_fim = ?, ';
            updateEditalValues.push(data_fim);
        }
        if (descricao) {
            updateEditalQuery += 'descricao = ?, ';
            updateEditalValues.push(descricao);
        }
        if (link) {
            updateEditalQuery += 'link = ?, ';
            updateEditalValues.push(link);
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
        return { titulo, codigo_edital, data_inicio, data_fim, descricao, link, publico };
    } catch (error) {
        throw new Error('Erro ao atualizar edital: ' + error.message);
    } finally {
        connection.release();
    }
};