import { pool } from '../database/db.js';

// Serviço para obter todos os monitores
export const getAllMonitoresService = async () => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM MONITOR JOIN ALUNO ON MONITOR.codigo_aluno = ALUNO.codigo_aluno JOIN USUARIO ON ALUNO.codigo_usuario = USUARIO.codigo_usuario');
        return rows;
    } finally {
        connection.release();
    }
};

// Serviço para obter todos os monitores ativos
export const getActiveMonitoresService = async () => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM MONITOR JOIN ALUNO ON MONITOR.codigo_aluno = ALUNO.codigo_aluno JOIN USUARIO ON ALUNO.codigo_usuario = USUARIO.codigo_usuario WHERE MONITOR.ativo = true');
        return rows;
    } finally {
        connection.release();
    }
};

// Serviço para obter todos os monitores inativos
export const getInactiveMonitoresService = async () => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM MONITOR JOIN ALUNO ON MONITOR.codigo_aluno = ALUNO.codigo_aluno JOIN USUARIO ON ALUNO.codigo_usuario = USUARIO.codigo_usuario WHERE MONITOR.ativo = false');
        return rows;
    } finally {
        connection.release();
    }
};

// Serviço para obter um monitor pelo codigo
export const getMonitorService = async (codigo_monitor) => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM MONITOR JOIN ALUNO ON MONITOR.codigo_aluno = ALUNO.codigo_aluno JOIN USUARIO ON ALUNO.codigo_usuario = USUARIO.codigo_usuario WHERE MONITOR.codigo_monitor = ?', [codigo_monitor]);
        return rows;
    } finally {
        connection.release();
    }
};

// Serviço para criar um monitor a partir de um aluno
export const createMonitorService = async (monitorData) => {
    const { codigo_aluno, ativo, curso, tipo_monitoria } = monitorData;

    const connection = await pool.getConnection();
    try {
        const query = `
            INSERT INTO MONITOR (codigo_aluno, ativo, curso, tipo_monitoria)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await connection.query(query, [codigo_aluno, ativo, curso, tipo_monitoria]);

        return {
            codigo_monitor: result.insertId,
            codigo_aluno,
            ativo,
            curso,
            tipo_monitoria,
        };
    } catch (error) {
        throw new Error('Erro ao criar monitor: ' + error.message);
    } finally {
        connection.release();
    }
};

// Serviço para atualizar um monitor
export const updateMonitorService = async (codigo_monitor, monitorData) => {
    const { ativo, tipo_monitoria } = monitorData;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction(); // Inicia a transação

        // Construção dinâmica da consulta SQL
        let updateMonitorQuery = 'UPDATE MONITOR SET ';
        let updateMonitorValues = [];
        
        if (ativo) {
            updateMonitorQuery += 'ativo = ?, ';
            updateMonitorValues.push(ativo);
        }
        if (tipo_monitoria) {
            updateMonitorQuery += 'tipo_monitoria = ?, '
            updateMonitorValues.push(tipo_monitoria);
        }

        // Remove a última vírgula e adiciona a cláusula WHERE
        updateMonitorQuery = updateMonitorQuery.slice(0, -2) + ' WHERE codigo_monitor = ?';
        updateMonitorValues.push(codigo_monitor);

        // Atualiza as informações do monitor na tabela MONITOR
        await connection.query(updateMonitorQuery, updateMonitorValues);

        await connection.commit(); // Confirma a transação
        return { codigo_monitor, ativo, tipo_monitoria };
    } catch (error) {
        throw new Error('Erro ao atualizar monitor: ' + error.message);
    } finally {
        connection.release();
    }
};