import crypto from 'crypto';
import { pool } from '../database/db.js';
import { PDFDocument } from 'pdf-lib';

// Serviço para assinar o PDF
export const assinarDocumentoFrequencia = async (codigo_professor, documentId) => {
    const connection = await pool.getConnection();

    try {
        // Busca o PDF e a chave privada do professor
        const [pdfResult] = await connection.query('SELECT pdf FROM FREQUENCIA WHERE id = ?', [documentId]);
        const [chaveResult] = await connection.query('SELECT chave_privada FROM CHAVES_PROFESSOR WHERE codigo_professor = ?', [codigo_professor]);

        if (pdfResult.length === 0 || chaveResult.length === 0) {
            throw new Error('Documento ou professor não encontrado');
        }

        const pdfBytes = pdfResult[0].pdf;
        const chavePrivada = chaveResult[0].chave_privada;

        // Carrega o PDF e adiciona uma assinatura de texto
        const doc = await PDFDocument.load(pdfBytes);
        const page = doc.getPage(0);
        page.drawText(`Assinado pelo professor ${codigo_professor}`, { x: 50, y: 680 });

        // Assina o PDF com a chave privada
        const sign = crypto.createSign('SHA256');
        sign.update(pdfBytes);
        sign.end();

        const assinatura = sign.sign({
            key: chavePrivada,
            passphrase: 'senha_mega_segura'
        });

        // Aqui, adicionamos a assinatura como texto (de forma simplificada)
        page.drawText(`Assinatura: ${assinatura.toString('base64').slice(0, 40)}...`, { x: 50, y: 660 });

        // Salva o PDF assinado
        const pdfAssinado = await doc.save();
        const pdfAssinadoBuffer = Buffer.from(pdfAssinado);

        console.log('Documento ID:', documentId);
        console.log('PDF assinado:', pdfAssinadoBuffer);

        // Atualiza o PDF no banco de dados com a assinatura
        const updateQuery = 'UPDATE FREQUENCIA SET pdf = ? WHERE id = ?';
        await connection.query(updateQuery, [pdfAssinadoBuffer, documentId]);

        connection.release();
        return { message: 'PDF assinado com sucesso!' };
    } catch (error) {
        throw new Error('Erro ao assinar PDF: ' + error.message);
    }
};

// Serviço para gerar e armazenar as chaves do professor
export const gerarChavesDoProfessor = async (codigo_professor) => {
    try {
        // par de chaves RSA
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: 'senha_mega_segura'
            }
        });

        const connection = await pool.getConnection();
        
        // armazena as chaves
        const query = `
            INSERT INTO CHAVES_PROFESSOR (codigo_professor, chave_publica, chave_privada)
            VALUES (?, ?, ?)
        `;
        const values = [codigo_professor, publicKey, privateKey];
        await connection.query(query, values);
        
        connection.release();
        return { message: 'Chaves geradas e armazenadas com sucesso!' };
    } catch (error) {
        throw new Error('Erro ao gerar chaves: ' + error.message);
    }
};