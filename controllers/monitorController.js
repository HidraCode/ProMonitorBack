import { 
    getAllMonitoresService, 
    getActiveMonitoresService, 
    getInactiveMonitoresService,
    getMonitorService, 
    createMonitorService,
    updateMonitorService, 
    getMonitoresProfessorService,
    getTarefasMonitorService
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
    const { codigo_monitor } = req.params;
    
    try {
        const tarefas = await getTarefasMonitorService(codigo_monitor);
        
        if (tarefas.length === 0) {
            return res.status(404).json({ message: 'Nenhuma tarefa encontrada para este monitor.' });
        }

        res.status(200).json(tarefas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar tarefas do monitor.', error: error.message });
    }
};

// Controlador para baixar o arquivo auxiliar de uma tarefa específica
export const downloadArquivoTarefa = async (req, res) => {
    const { codigo_tarefa } = req.params;
    
    try {
        const tarefas = await getTarefasMonitorService(req.params.codigo_monitor);
        const tarefa = tarefas.find(tarefa => tarefa.codigo_tarefa === parseInt(codigo_tarefa));

        if (!tarefa) {
            return res.status(404).json({ message: 'Tarefa não encontrada.' });
        }

        const arquivo = tarefa.arquivo_aux;
        
        if (!arquivo) {
            return res.status(404).json({ message: 'Arquivo não encontrado para essa tarefa.' });
        }

        res.setHeader('Content-Type', 'application/pdf');
        if (tarefa.tipo === 'tarefa')
            res.setHeader('Content-Disposition', `attachment; filename="tarefa_${codigo_tarefa}.pdf"`);
        else if (tarefa.tipo === 'material')
            res.setHeader('Content-Disposition', `attachment; filename="material_apoio_${codigo_tarefa}.pdf"`);
        res.send(arquivo);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao baixar o arquivo.', error: error.message });
    }
};