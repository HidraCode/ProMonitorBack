import {
    getAllMonitoresService,
    getActiveMonitoresService,
    getInactiveMonitoresService,
    getMonitorService,
    createMonitorService,
    updateMonitorService, 
    getMonitoresProfessorService,
    getTarefasMonitorService,
    getMonitoriaService,
    updateTarefaMonitorService,
} from "../services/monitorService.js";

// Controlador para obter todos os monitores
export const getAllMonitores = async (req, res) => {
    try {
        const monitores = await getAllMonitoresService();

        return res.status(200).json(monitores);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// Controlador para obter todos os monitores ativos
export const getActiveMonitores = async (req, res) => {
    try {
        const monitores = await getActiveMonitoresService();

        return res.status(200).json(monitores);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// Controlador para obter todos os monitores inativos
export const getInactiveMonitores = async (req, res) => {
    try {
        const monitores = await getInactiveMonitoresService();

        return res.status(200).json(monitores);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// Controlador para obter monitor pelo codigo
export const getMonitor = async (req, res) => {
    try {
        const { codigo_monitor } = req.params;
        const monitor = await getMonitorService(codigo_monitor);

        return res.status(200).json(monitor);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// Controlador para obter os monitores associados a um professor
export const getMonitoresProfessor = async (req, res) => {
    try {
        const { codigo_professor } = req.params;
        const monitores = await getMonitoresProfessorService(codigo_professor);
        return res.status(200).json(monitores);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// Controlador para criar um monitor a partir de um aluno
export const createMonitor = async (req, res) => {
    try {
        const newMonitor = await createMonitorService(req.body);

        return res.status(201).json(newMonitor);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// Controlador para atualizar os dados de um monitor
export const updateMonitor = async (req, res) => {
    try {
        const { codigo_monitor } = req.params;
        const monitorData = req.body;

        const updatedMonitor = await updateMonitorService(codigo_monitor, monitorData);
        return res.status(200).json(updatedMonitor);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// Controlador para obter todas as tarefas de um monitor
export const getTarefasMonitor = async (req, res) => {
    const { codigo_usuario } = req.params;
    
    try {
        const tarefas = await getTarefasMonitorService(codigo_usuario);

        res.status(200).json(tarefas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar tarefas do monitor.', error: error.message });
    }
};

export const getMonitoria = async (req, res) => {
    const codigo_usuario = req.user.codigo_usuario;
    
    try {
        const result = await getMonitoriaService(codigo_usuario)
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Controlador para baixar o arquivo auxiliar de uma tarefa específica
export const downloadArquivoTarefa = async (req, res) => {
    const { codigo_tarefa, codigo_usuario } = req.params;
    
    try {

        const tarefas = await getTarefasMonitorService(codigo_usuario);
        const tarefa = tarefas.find(tarefa => tarefa.codigo_tarefa === parseInt(codigo_tarefa));

        if (!tarefa) {
            return res.status(404).json({ message: 'Tarefa não encontrada.' });
        }

        const arquivo = tarefa.arquivo_aux;
        
        if (!arquivo) {
            return res.status(404).json({ message: 'Arquivo não encontrado para essa tarefa.' });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="tarefa_${codigo_tarefa}.pdf"`);
        res.send(arquivo);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao baixar o arquivo.', error: error.message });
    }
};

// Controlador para acessar uma tarefa específica
export const getTarefa = async (req, res) => {
    const { codigo_tarefa, codigo_usuario } = req.params;
    
    try {

        const tarefas = await getTarefasMonitorService(codigo_usuario);
        const tarefa = tarefas.find(tarefa => tarefa.codigo_tarefa === parseInt(codigo_tarefa));

        if (!tarefa) {
            return res.status(404).json({ message: 'Tarefa não encontrada.' });
        }

        res.status(200).json(tarefa);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao baixar o arquivo.', error: error.message });
    }
};

// Controlador para quando um monitor concluir uma tarefa
export const updateTarefaMonitor = async (req, res) => {
    try {
        // Processa arquivos enviados
        const files = req.files; // Arquivos enviados, se existirem
        const { codigo_tarefa, codigo_usuario } = req.params;

        // Chama o serviço para atualizar uma nova tarefa
        const updatedTarefa = await updateTarefaMonitorService(files, codigo_usuario, codigo_tarefa);
        return res.status(201).json(updatedTarefa);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};