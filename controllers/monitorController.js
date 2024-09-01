import { 
    getAllMonitoresService, 
    getActiveMonitoresService, 
    getInactiveMonitoresService,
    getMonitorService, 
    createMonitorService,
    updateMonitorService, 
    getMonitoresProfessorService
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