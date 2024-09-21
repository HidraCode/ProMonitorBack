// import {
//     getTarefaService,
//     createTarefaService
// } from '../services/tarefaService.js'

// // Controlador para criar uma nova tarefa
// export const createTarefa = async (req, res) => {
//     try {

//         const files = req.files; // Arquivos enviados, se existirem
//         // Dados da tarefa
//         const { codigo_monitoria, titulo, descricao, data_atribuicao, data_prazo, status } = req.body;
//         const codigo_professor = req.user.codigo_usuario; // Código extraído do token


//         // Adiciona anexos_professor aos dados da tarefa
//         const tarefaData = { codigo_monitoria, codigo_professor, titulo, descricao,
//             data_atribuicao, data_prazo, status, anexos_professor: req.file ? req.file.buffer : null
//         };
//         // Chama o serviço para criar uma nova tarefa
//         const newTarefa = await createTarefaService(files, tarefaData);
//         return res.status(201).json(newTarefa);
//     } catch (error) {
//         return res.status(500).json({ message: 'Erro ao criar tarefa: ' + error.message });
//     }
// };

// // Controlador para obter uma tarefa por código da tarefa
// export const getTarefa = async (req, res) => {
//     try {
//         const { codigo_tarefa } = req.params;
//         const tarefas = await getTarefaService(codigo_tarefa)
//         return res.status(200).json(tarefas)

//     } catch (error) {
//         return res.status(500).json(error.message)
//     }
// }



