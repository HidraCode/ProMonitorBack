import { 
    getAllAlunosService, 
    createAlunoService, 
    updateAlunoService,
    enviarFrequenciaParaAssinatura,
} from "../services/alunoService.js";

export const getAllAlunos = async (req, res) => {
    try {
        // Chama o serviço
        const alunos = await getAllAlunosService();
        return res.status(200).json(alunos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar alunos: ' + error.message});
    }
};

export const createAluno = async (req, res) => {
    try {
        // Chama o serviço para cadastro de aluno
        const newAluno = await createAlunoService(req.body);
        return res.status(201).json(newAluno);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao cadastrar aluno: ' + error.message });
    }
};

export const updateAluno = async (req, res) => {
    try {
        const { codigo_usuario } = req.params;
        const alunoData = req.body;

        const updatedAluno = await updateAlunoService(codigo_usuario, alunoData);
        return res.status(200).json(updatedAluno);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao atualizar aluno: ' + error.message });
    }
};

export const criarEEnviarFrequencia = async (req, res) => {
    const { nome, horas, data, codigo_aluno, codigo_professor } = req.body;

    try {
        const result = await enviarFrequenciaParaAssinatura(nome, horas, data, codigo_aluno, codigo_professor);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};