import { 
    getAllInscricoesService, 
    getAllEditalInscricoesService, 
    getAllInscricoesFromAlunoService,
    getInscricaoService, 
    createInscricaoService
} from "../services/inscricaoService.js";

// Controlador para obter todas as inscrições
export const getAllInscricoes = async (req, res) => {
    try {
        const inscricoes = await getAllInscricoesService();
        return res.status(200).json(inscricoes);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// Controlador para obter todas as inscrições
export const getAllInscricoesFromAluno = async (req, res) => {
    try {
        const { codigo_aluno } = req.params;
        const inscricoes = await getAllInscricoesFromAlunoService(codigo_aluno);
        return res.status(200).json(inscricoes);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// Controlador para obter todas as inscricoes em um edital
export const getAllEditalInscricoes = async (req, res) => {
    try {
        const { codigo_edital } = req.params;
        const inscricoes = await getAllEditalInscricoesService(codigo_edital);
        return res.status(200).json(inscricoes);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// Controlador para obter uma inscrição
export const getInscricao = async (req, res) => {
    try {
        const { codigo_inscricao } = req.params;
        const inscricao = await getInscricaoService(codigo_inscricao);
        return res.status(200).json(inscricao);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// Controlador para a inscrição de um aluno em um edital
export const createInscricao = async (req, res) => {
    try {
        const { codigo_edital, codigo_aluno } = req.params;
        const inscricao = await createInscricaoService(codigo_edital, codigo_aluno);
        return res.status(201).json(inscricao);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};