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
export const getAllInscricoesFromAlunoService = async (codigo_usuario) => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM INSCRICAO WHERE codigo_aluno = ?', [codigo_usuario]);
        return rows;
    } catch (error) {
        throw new Error('Erro ao obter inscrições do aluno: ' + error.message);
    } finally {
        connection.release();
    }
};

// Serviço para obter todas as inscrições em um edital
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
        // Verifica se existe um edital com o codigo informado
        const [editalExistente] = await connection.query('SELECT * FROM EDITAL WHERE codigo_edital = ?', [codigo_edital]);
        if (editalExistente.length === 0) {
            throw new Error('Não existe edital com esse código');
        }
        
        // Verifica se existe um aluno com esse codigo
        const [aluno] = await connection.query('SELECT * from USUARIO WHERE codigo_usuario = ? AND tipo = ?', [codigo_aluno, 'aluno']);
        if (aluno.length === 0) {
            throw new Error('Não existe aluno com esse código!');
        }

        // Verifica se o aluno já está inscrito nesse edital
        const [inscricaoExistente] = await connection.query('SELECT * FROM INSCRICAO WHERE codigo_edital = ? AND codigo_aluno = ?', [codigo_edital, codigo_aluno]);
        if (inscricaoExistente.length > 0) {
            throw new Error('O aluno já está inscrito nesse edital!');
        }

        const query = `
            INSERT INTO INSCRICAO
            (codigo_edital, codigo_aluno, data_inscricao, estado)
            VALUES (?, ?, ?, ?)
        `;

        const data_atual = new Date();

        const ano = data_atual.getFullYear();
        const mes = String(data_atual.getMonth() + 1).padStart(2, '0');
        const dia = String(data_atual.getDate()).padStart(2, '0');

        const data_inscricao = `${ano}-${mes}-${dia}`;

        const values = [codigo_edital, codigo_aluno, data_inscricao, 1]; // estado = 'inscrito'

        const [result] = await connection.query(query, values);

        return {
            codigo_inscricao: result.insertId,
            codigo_edital,
            codigo_aluno,
            data_inscricao,
            estado: 'inscrito',
        };
    } catch (error) {
        throw new Error('Erro ao se inscrever em edital: ' + error.message);
    } finally {
        connection.release();
    }
};

// Serviço para o professor alterar o estado de uma inscrição
export const updateEstadoInscricaoService = async (codigo_inscricao, novo_estado) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const query = `
            UPDATE INSCRICAO
            SET estado = ?
            WHERE codigo_inscricao = ?
        `;

        await connection.query(query, [novo_estado, codigo_inscricao]);
        await connection.commit();

        return {
            codigo_inscricao,
            novo_estado,
        }
    } catch (error) {
        throw new Error('Erro ao atualizar estado do edital: ' + error.message);
    } finally {
        connection.release();
    }
};