import { getPdfAssinadoService } from "../services/frequenciaService.js";

export const baixarPdfAssinado = async (req, res) => {
    const { documentId } = req.params;

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