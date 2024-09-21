// import { pool } from '../database/db.js';

// // Serviço para criar tarefa
// export const createTarefaService = async (files, tarefaData) => {
//     const { codigo_monitoria, codigo_professor, titulo, descricao, data_atribuicao, data_prazo, status } = tarefaData;

//     // Verifica se há arquivos e processa se necessário
//     let anexos_professor = null;

//     if (files && files.length > 0) {
//         // Array para armazenar os arquivos com suas informações
//         const anexosArray = files.map(file => ({
//             fileName: file.originalname,
//             mimeType: file.mimetype,
//             buffer: file.buffer.toString('base64')
//         }));
    
//         // Armazena os anexos como JSON para manter a estrutura
//         anexos_professor = JSON.stringify(anexosArray);
//     }

//     console.log(tarefaData);
//     if (!codigo_monitoria || !codigo_professor || !titulo || !descricao || !data_atribuicao || !data_prazo || !status) {
//         throw new Error('Dados inválidos'); // Lança um erro se os dados estiverem faltando
//     }

//     // Verifica se o status é um dos valores permitidos
//     const validStatus = ['pendente', 'concluida', 'atrasada'];
//     if (!validStatus.includes(status.toLowerCase())) {
//         throw new Error('O status da tarefa deve ser "pendente", "concluida" ou "atrasada"');
//     }

//     // Converte as datas para objetos Date para comparação
//     const atribuicaoDate = new Date(data_atribuicao);
//     const prazoDate = new Date(data_prazo);

//     // Valida se o prazo é anterior à data de atribuição
//     if ( prazoDate < atribuicaoDate ) {
//         throw new Error('A data de conclusão não pode ser anterior à data de atribuição');
//     }

//     const connection = await pool.getConnection();
//     try {
//         // Valida a existencia de um professor com codigo_professor
//         const [existingProfessor] = await connection.query('SELECT * FROM USUARIO WHERE codigo_usuario = ? AND tipo = ?', [codigo_professor, 'professor']);
//         if (existingProfessor.length < 1) {
//             throw new Error('Não existe professor com o código informado');
//         }

//         // Valida a existencia de uma monitoria com o codigo_monitoria
//         const [existingMonitoria] = await connection.query('SELECT * FROM MONITORIA WHERE codigo_monitoria = ?', [codigo_monitoria]);
//         if (existingMonitoria.length < 1) {
//             throw new Error('Não existe monitoria com o código informado');
//         }

//         // Insere os dados da tarefa na tabela TAREFA
//         const query = `
//             INSERT INTO TAREFA (codigo_monitoria, codigo_professor,
//         titulo, descricao, data_atribuicao, data_prazo, status, anexos_professor)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//         `;

//         const values = [codigo_monitoria, codigo_professor, titulo, descricao, data_atribuicao, data_prazo, status, anexos_professor];
//         const [result] = await connection.query(query, values);

//         return {
//             codigo_monitoria, codigo_professor,
//             descricao, data_atribuicao, data_prazo, status,
//             anexos_professor // Inclui anexos na resposta se necessário
//         };
//     } catch (error) {
//         throw new Error('Erro ao criar tarefa: ' + error.message);
//     } finally {
//         connection.release();
//     }
// };

// // Serviço para obter o anexo da tarefa
// export const getAnexosProfessorTarefaService = async (codigo_tarefa) => {
//     const connection = await pool.getConnection();

//     try {
//         const [rows] = await connection.query(`
//             SELECT anexos_professor FROM TAREFA 
//             WHERE codigo_tarefa = ?`, [codigo_tarefa]);

//         if (rows.length === 0 || !rows[0].anexos_professor) {
//             throw new Error('Documento não encontrado');
//         }

//         // Faz o parsing do JSON para recuperar o array de anexos
//         const anexos = JSON.parse(rows[0].anexos_professor);

//         return anexos;
//     } catch (error) {
//         throw new Error('Erro ao buscar anexo da tarefa: ' + error.message);
//     } finally {
//         connection.release();
//     }
// };
