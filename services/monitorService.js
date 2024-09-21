import { pool } from '../database/db.js';

// Serviço para obter todos os monitores
export const getAllMonitoresService = async () => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM MONITOR JOIN USUARIO ON MONITOR.codigo_aluno = USUARIO.codigo_usuario');
        return rows;
    } finally {
        connection.release();
    }
};

// Serviço para obter todos os monitores ativos
export const getActiveMonitoresService = async () => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM MONITOR JOIN USUARIO ON MONITOR.codigo_aluno = USUARIO.codigo_usuario WHERE MONITOR.ativo = true');
        return rows;
    } finally {
        connection.release();
    }
};

// Serviço para obter todos os monitores inativos
export const getInactiveMonitoresService = async () => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM MONITOR JOIN USUARIO ON MONITOR.codigo_aluno = USUARIO.codigo_usuario WHERE MONITOR.ativo = false');
        return rows;
    } finally {
        connection.release();
    }
};

// Serviço para obter um monitor pelo codigo
export const getMonitorService = async (codigo_monitor) => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM MONITOR JOIN USUARIO ON MONITOR.codigo_aluno = USUARIO.codigo_usuario WHERE MONITOR.codigo_monitor = ?', [codigo_monitor]);
        return rows;
    } finally {
        connection.release();
    }
};

// Serviço para obter os monitores de um professor
export const getMonitoresProfessorService = async (codigo_professor) => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query(`SELECT * FROM MONITOR
            JOIN USUARIO ON MONITOR.codigo_aluno = USUARIO.codigo_usuario
            JOIN EDITAL ON MONITOR.codigo_edital = EDITAL.codigo_edital
            WHERE EDITAL.codigo_professor = ?`, [codigo_professor]);
        return rows;
    } finally {
        connection.release();
    }
};

// Serviço para criar um monitor a partir de um aluno
export const createMonitorService = async (monitorData) => {
    const { codigo_usuario, ativo, codigo_edital, tipo_monitoria } = monitorData;

    const connection = await pool.getConnection();
    try {
        // Checar se o codigo_usuario pertence a um aluno
        const [check] = await connection.query(
            'SELECT * FROM USUARIO WHERE codigo_usuario = ? AND tipo = ?',
            [codigo_usuario, 'aluno']
        );
        // Verificando se algum aluno foi encontrado
        if (check.length < 1) {
            throw new Error('Não existe aluno com esse código');
        }
        // Associando a disciplina do edital ao monitor
        const [disciplina] = await connection.query(`
            SELECT disciplina
            FROM EDITAL
            WHERE codigo_edital = ?    
        `, [codigo_edital]);
        const disciplinaMonitor = disciplina[0].disciplina;

        const query = `
            INSERT INTO MONITOR (codigo_aluno, ativo, codigo_edital, disciplina, tipo_monitoria)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await connection.query(query, [codigo_usuario, ativo, codigo_edital, disciplinaMonitor, tipo_monitoria]);

        return {
            codigo_monitor: result.insertId,
            codigo_usuario,
            ativo,
            codigo_edital,
            disciplina: disciplinaMonitor,
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

// // Serviço para filtrar todos os feedbacks dados por um professor a um determinado monitor
// export const getAllDesempenhosMonitorService = async (codigo_usuario) => {
//     const connection = await pool.getConnection();

//     try {
//         console.log(codigo_usuario)
//         // Obtendo o código do monitor a partir do código do aluno (usuário)
//         const [monitorResult] = await connection.query(`
//             SELECT codigo_monitor 
//             FROM MONITOR 
//             WHERE codigo_aluno = ? AND ativo = 1`, [codigo_usuario]);

//         if (monitorResult.length === 0) {
//             throw new Error('Monitor não encontrado para o código de usuário fornecido.');
//         }

//         const codigo_monitor = monitorResult[0].codigo_monitor;

//         // Obtendo os desempenhos associados ao monitor juntamente com o nome do professor e nome da disciplina
//         const [desempenhoResult] = await connection.query(`
//         SELECT D.*, U.nome AS nome_professor, DI.nome AS nome_disciplina 
//         FROM DESEMPENHO D 
//         JOIN USUARIO U ON D.codigo_professor = U.codigo_usuario
//         JOIN MONITORIA M ON D.codigo_monitor = M.codigo_monitor
//         JOIN DISCIPLINA DI ON M.codigo_disciplina = DI.codigo_disciplina
//         WHERE D.codigo_monitor = ?`, [codigo_monitor]);


//         console.log(desempenhoResult);

//         // Função para formatar a data
//         const formatDate = (dateString) => {
//             const date = new Date(dateString);
//             if (isNaN(date.getTime())) {
//                 return dateString; // Retorna a string original se não for uma data válida
//             }
//             const day = String(date.getUTCDate()).padStart(2, '0');
//             const month = String(date.getUTCMonth() + 1).padStart(2, '0');
//             const year = date.getUTCFullYear();
//             return `${day}/${month}/${year}`; // Formato: dd/MM/yyyy
//         };

//         // Formatar as datas
//         const formattedData = desempenhoResult.map(row => ({
//             ...row,
//             data_avaliacao: formatDate(row.data_avaliacao)
//         }));

//         return formattedData;

//     } finally {
//         connection.release();
//     }
// };

// Serviço para obter os dados da monitoria de um monitor
export const getMonitoriaService = async (codigo_usuario) => {
    const connection = await pool.getConnection();  // Se conecta ao banco de dados
    try {
        console.log(codigo_usuario)
        const [data] = await connection.query(`
            SELECT * FROM USUARIO u 
            JOIN MONITOR m ON u.codigo_usuario = m.codigo_aluno 
            JOIN MONITORIA mo ON mo.codigo_monitoria = m.codigo_monitor
            WHERE codigo_usuario = ?`, [codigo_usuario]);

        console.log('Dados retornados:', data);  // Adiciona log para verificação

        if (data.length === 0) {
            throw new Error('Usuário não encontrado.');
        }

        const dadosMonitoria = data[0];

        // Busca o edital correspondente a monitoria
        const [editalData] = await connection.query(`
            SELECT * FROM EDITAL WHERE codigo_edital = ?`, [dadosMonitoria.codigo_edital]);
        
        if (editalData.length === 0) {
            throw new Error('Edital não encontrado.');
        }

        const edital = editalData[0];
        
        // Busca o professor correspondente a monitoria
        const [professorData] = await connection.query(`
            SELECT * FROM USUARIO WHERE codigo_usuario = ?`, [edital.codigo_professor]);

            console.log('Professores retornados:', professorData);  // Adiciona log para verificação

        if (professorData.length === 0) {
            throw new Error('Professor não encontrado.');
        }
        const professor = professorData[0];

        return { nome_monitor: dadosMonitoria.nome, tipo_monitoria: dadosMonitoria.tipo_monitoria, 
            orientador: professor.nome, disciplina:edital.disciplina, data_inicio: dadosMonitoria.data_inicio, data_fim: dadosMonitoria.data_fim, ativo: dadosMonitoria.ativo};
    } finally {
        connection.release();
    }
};