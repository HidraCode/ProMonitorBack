import {
    getAllProfessoresService,
    createProfessorService,
    updateProfessorService,
    createCoordenadorService,
    getAllCoordenadoresService,
    atribuirTarefaService,
    createDisciplinaService,
    createMonitoriaService,
    getTarefasProfessorService,
    getFrequenciaAndRelatorioService,
} from "../services/professorService.js";

// Controlador para obter todos os professores
export const getAllProfessores = async (req, res) => {
    try {
        // Chama o serviço para obter todos os professores
        const professores = await getAllProfessoresService();
        return res.status(200).json(professores);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar professores: ' + error.message });
    }
};

// Controlador para criar um novo professor
export const createProfessor = async (req, res) => {
    try {
        // Chama o serviço para criar um professor
        const newProfessor = await createProfessorService(req.body);
        return res.status(201).json(newProfessor);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao cadastrar professor: ' + error.message });
    }
};

// Controlador para atualizar um professor existente
export const updateProfessor = async (req, res) => {
    try {
        const { codigo_usuario } = req.params;
        const professorData = req.body;

        const updatedProfessor = await updateProfessorService(codigo_usuario, professorData);
        return res.status(200).json(updatedProfessor);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao atualizar professor: ' + error.message });
    }
};

// Controlador para criar um coordenador a partir de um professor
export const createCoordenador = async (req, res) => {
    try {
        const { codigo_professor } = req.params;

        const coordenador = await createCoordenadorService(codigo_professor);
        return res.status(200).json(coordenador);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao criar coordenador: ' + error.message });
    }
};

// Controlador para obter todos os coordenadores
export const getAllCoordenadores = async (req, res) => {
    try {
        const coordenadores = await getAllCoordenadoresService();
        return res.status(200).json(coordenadores);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao obter coordenadores: ' + error.message });
    }
}

// Controlador para atribuir tarefa a monitor
export const atribuirTarefa = async (req, res) => {
    const { codigo_monitor, codigo_professor, titulo, descricao, data_conclusao, disciplina, tipo, status } = req.body;
    const arquivo_aux = req.file;

    try {
        // Chama o serviço para atribuir a tarefa
        const result = await atribuirTarefaService(codigo_monitor, codigo_professor, titulo, descricao, data_conclusao, disciplina, arquivo_aux, tipo, status);

        return res.status(201).json({ message: 'Tarefa criada com sucesso!', result });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao atribuir tarefa.' });
    }
};

// Controlador para criar um novo professor
export const createDisciplina = async (req, res) => {
    try {
        const { nome } = req.body;
        // Chama o serviço para criar uma disciplina
        const newDisciplina = await createDisciplinaService(nome);
        return res.status(201).json(newDisciplina);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao criar uma disciplina: ' + error.message });
    }
};

// Controlador para criar uma nova monitoria
export const createMonitoria = async (req, res) => {
    try {
        // Chama o serviço para criar a monitoria
        const newMonitoria = await createMonitoriaService(req.body);
        return res.status(201).json(newMonitoria);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao criar a monitoria: ' + error.message });
    }
};

// obter frequencias e relatorios
export const getFrequenciaAndRelatorio = async (req, res) => {
    try {
        const { codigo_usuario } = req.params;
        const relatorios_frequencias = await getFrequenciaAndRelatorioService(codigo_usuario);
        return res.status(200).json(relatorios_frequencias);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao obter relatórios e frequências: ' + error.message });
    }
};

// controlador para obter as tarefas que um professor atribuiu 
export const getTarefasProfessor = async (req, res) => {
    try {
        const { codigo_usuario } = req.params;
        const atividades = await getTarefasProfessorService(codigo_usuario);
        return res.status(200).json(atividades);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao obter atividdades: ' + error.message });
    }
};