import { assinarDocumentoFrequencia, assinarDocumentoRelatorio } from '../services/assinaturaService.js';

// Controlador para o professor assinar um PDF de frequência
export const assinarFrequencia = async (req, res) => {
    const { documentId, dados } = req.body;
    const { codigo_usuario } = req.params;

    try {
        const result = await assinarDocumentoFrequencia(codigo_usuario, documentId, dados);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para o professor assinar um PDF de relatório final
export const assinarRelatorio = async (req, res) => {
    const { documentId, dados} = req.body;
    const { codigo_usuario } = req.params;
    try {
        const result = await assinarDocumentoRelatorio(codigo_usuario, documentId, dados);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};