import { 
    getAllProfessoresService, 
    createProfessorService, 
    updateProfessorService,
    createCoordenadorService, 
    getAllCoordenadoresService,
    atribuirTarefaService,
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
    const { codigo_monitor, codigo_professor, titulo, descricao, data_conclusao, disciplina, tipo } = req.body;
    const arquivo_aux = req.file;

    try {
        // Chama o serviço para atribuir a tarefa
        const result = await atribuirTarefaService(codigo_monitor, codigo_professor, titulo, descricao, data_conclusao, disciplina, arquivo_aux, tipo);

        return res.status(201).json({ message: 'Tarefa criada com sucesso!', result });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao atribuir tarefa.' + error.message });
    }
};