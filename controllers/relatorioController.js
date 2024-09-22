import { getRelatorioAssinadoService, verificarRelatorioService, 
    getRelatorioService, autenticarRelatorioService, enviarRelatorioParaAssinatura } from "../services/relatorioService.js";

export const baixarRelatorioAssinado = async (req, res) => {
    const documentId = req.params.id;

    try {
        const pdfAssinado = await getRelatorioAssinadoService(documentId);

        // cabeçalho para download do arquivo
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="relatorio_assinado_${documentId}.pdf"`);

        return res.status(200).send(pdfAssinado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const verificarRelatorio = async (req, res) => {
    try {
        const documentId = req.params;
        
        const result = await verificarRelatorioService(documentId);
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const getRelatorio = async (req, res) => {
    try {
        const codigo_relatorio = req.params.id
        
        const result = await getRelatorioService(codigo_relatorio);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const enviarRelatorio = async (req, res) => {
    console.log(req.body)
    const dados = req.body;
    const codigo_usuario = req.user.codigo_usuario;

    try {
        const result = await enviarRelatorioParaAssinatura(dados, codigo_usuario);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const autenticarRelatorio = async (req, res) => {
    try {
        const documentId = req.params.id;
        
        const result = await autenticarRelatorioService(documentId);
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}