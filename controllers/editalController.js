import { 
    getAllEditaisService, 
    getAllPublicEditaisService, 
    getEditalService, 
    getEditalLinkService, 
    createEditalService, 
    updateEditalService 
} from "../services/editalService.js";

// Controlador para obter todos os editais
export const getAllEditais = async (req, res) => {
    try {
        const editais = await getAllEditaisService();
        return res.status(200).json(editais);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// Controlador para obter apenas os editais públicos
export const getAllPublicEditais = async (req, res) => {
    try {
        const editais = await getAllPublicEditaisService();
        return res.status(200).json(editais);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// Controlador para obter apenas um edital
export const getEdital = async (req, res) => {
    try {
        const { codigo_edital } = req.params;

        const editais = await getEditalService(codigo_edital);
        return res.status(200).json(editais);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// Controlador para obter o link de um edital
export const getEditalLink = async (req, res) => {
    try {
        const { codigo_edital } = req.params;

        const link = await getEditalLinkService(codigo_edital);
        return res.status(200).json(link);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// Controlador para criar edital
export const createEdital = async (req, res) => {
    try {
        const newEdital = await createEditalService(req.body);
        return res.status(201).json(newEdital);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// Controlador para atualizar um edital
export const updateEdital = async (req, res) => {
    try {
        const { codigo_edital } = req.params;
        const editalData = req.body;

        const updatedEdital = await updateEditalService(codigo_edital, editalData);
        return res.status(200).json(updatedEdital);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};