import { pool } from "../database/db.js";

// Serviço para obter todas as inscrições do sistema
export const getAllInscricoesService = async () => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM INSCRICAO');
        return rows;
    } catch (error) {
        throw new Error('Erro ao obter inscrições: ' + error.message);
    } finally {
        connection.release();
    }
};

// Serviço para obter todas as inscrições de um aluno
export const getAllInscricoesFromAlunoService = async (codigo_aluno) => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM INSCRICAO WHERE codigo_aluno = ?', [codigo_aluno]);
        return rows;
    } catch (error) {
        throw new Error('Erro ao obter inscrições do aluno: ' + error.message);
    } finally {
        connection.release();
    }
};

// Serviço para obter todas as inscrições de um edital
export const getAllEditalInscricoesService = async (codigo_edital) => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM INSCRICAO WHERE codigo_edital = ?', [codigo_edital]);
        return rows;
    } catch (error) {
        throw new Error('Erro ao obter inscrições do edital: ' + error.message);
    } finally {
        connection.release();
    }
};

// Serviço para obter uma inscríção pelo codigo_inscricao
export const getInscricaoService = async (codigo_inscricao) => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM INSCRICAO WHERE codigo_inscricao = ?', [codigo_inscricao]);
        return rows;
    } catch (error) {
        throw new Error('Erro ao obter inscrições do aluno: ' + error.message);
    } finally {
        connection.release();
    }
};

// Serviço para um aluno se inscrever em um edital
export const createInscricaoService = async (codigo_edital, codigo_aluno) => {
    const connection = await pool.getConnection();

    try {
        const query = `
            INSERT INTO INSCRICAO
            (codigo_edital, codigo_aluno, data_inscricao)
            VALUES (?, ?, ?)
        `;

        const data_atual = new Date();

        const ano = data_atual.getFullYear();
        const mes = String(data_atual.getMonth() + 1).padStart(2, '0');
        const dia = String(data_atual.getDate()).padStart(2, '0');

        const data_inscricao = `${ano}-${mes}-${dia}`;

        const values = [codigo_edital, codigo_aluno, data_inscricao];

        const [result] = await connection.query(query, values);

        return {
            codigo_inscricao: result.insertId,
            codigo_edital,
            codigo_aluno,
            data_inscricao,
        };
    } catch (error) {
        throw new Error('Erro ao se inscrever em edital: ' + error.message);
    } finally {
        connection.release();
    }
};