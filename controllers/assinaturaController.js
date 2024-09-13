import { gerarChavesDoProfessor, assinarDocumentoFrequencia } from '../services/assinaturaService.js';

// Controlador para gerar e armazenar as chaves de um professor
export const gerarChavesProfessor = async (req, res) => {
    const { codigo_professor } = req.body; 

    try {
        const result = await gerarChavesDoProfessor(codigo_professor);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para o professor assinar um PDF
export const assinarDocumento = async (req, res) => {
    const { codigo_professor, documentId } = req.body;

    try {
        const result = await assinarDocumentoFrequencia(codigo_professor, documentId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};