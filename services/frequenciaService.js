import { pool } from "../database/db.js";

export const getPdfAssinadoService = async (documentId) => {
    const connection = await pool.getConnection();

    try {
        const [pdfResult] = await connection.query('SELECT pdf FROM FREQUENCIA WHERE id = ?', documentId);

        if (pdfResult.length === 0 || !pdfResult[0].pdf) {
            throw new Error('Documento não encontrado ou não assinado');
        }

        return pdfResult[0].pdf;
    } catch (error) {
        throw new Error('Erro ao buscar PDF assinado: ' + error.message);
    } finally {
        connection.release();
    }
};