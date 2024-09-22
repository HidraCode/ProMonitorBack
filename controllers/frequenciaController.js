import { getPdfAssinadoService, getFrequenciaService, autenticarFrequenciaService, enviarFrequenciaParaAssinatura } from "../services/frequenciaService.js";

export const baixarPdfAssinado = async (req, res) => {
    const documentId = req.params.id;

    try {
        const pdfAssinado = await getPdfAssinadoService(documentId);

        // cabeçalho para download do arquivo
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="frequencia_assinada_${documentId}.pdf"`);

        return res.status(200).send(pdfAssinado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const enviarFrequencia = async (req, res) => {
    console.log(req.body)
    const dados = req.body;
    const codigo_usuario = req.user.codigo_usuario;

    try {
        const result = await enviarFrequenciaParaAssinatura(dados, codigo_usuario);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const autenticarFrequencia = async (req, res) => {
    try {
        const documentId = req.params.id;
        
        const result = await autenticarFrequenciaService(documentId);
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const getFrequencia = async (req, res) => {
    try {
        const codigo_frequencia = req.params.id;

        const result = await getFrequenciaService(codigo_frequencia);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}