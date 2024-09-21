import crypto from 'crypto';
import { pool } from '../database/db.js';
import { generateRelatorioPDF, generateFrequenciaPDF } from '../services/pdfService.js'

// Serviço para assinar o PDF de frequência
export const assinarDocumentoFrequencia = async (codigo_professor, documentId, dados) => {
    const connection = await pool.getConnection();

    try {
        // Cria o PDF
        const pdfCreated = await generateFrequenciaPDF(dados, documentId);

        // Busca a chave privada do professor
        const [chaveResult] = await connection.query('SELECT chave_privada FROM CHAVES_PROFESSOR WHERE codigo_professor = ?', [codigo_professor]);

        if (chaveResult.length === 0) {
            throw new Error('Chave não encontrada');
        }

        const chavePrivada = chaveResult[0].chave_privada;

        // Assina o PDF com a chave privada
        const sign = crypto.createSign('SHA256');
        sign.update(pdfCreated);
        sign.end();

        const assinatura = sign.sign({
            key: chavePrivada,
            passphrase: 'senha_mega_segura'
        });

        // Transforma o buffer do PDF e a assinatura em string base64 para armazenamento
        const assinaturaBase64 = assinatura.toString('base64');
        // Converter os dados para string JSON
        const dadosFormJson = JSON.stringify(dados);

        // Armazenar PDF, assinatura e dados do form no banco de dados
        const updateQuery = 'UPDATE FREQUENCIA SET pdf = ?, assinatura_professor = ?, data_assinatura = NOW(), dados_form = ? WHERE id = ?';
        await connection.query(updateQuery, [pdfCreated, assinaturaBase64, dadosFormJson, documentId]);

        console.log('Documento ID:', documentId);
        console.log('PDF assinado:', pdfCreated);

        connection.release();
        return { message: 'PDF assinado com sucesso!' };
    } catch (error) {
        throw new Error('Erro ao assinar PDF: ' + error.message);
    }
};

// Serviço para assinar o PDF de relatório final
export const assinarDocumentoRelatorio = async (codigo_professor, documentId, dados) => {
    const connection = await pool.getConnection();

    try {
        // Cria o PDF
        const pdfCreated = await generateRelatorioPDF(dados, documentId);

        // Busca a chave privada do professor
        const [chaveResult] = await connection.query('SELECT chave_privada FROM CHAVES_PROFESSOR WHERE codigo_professor = ?', [codigo_professor]);

        if (chaveResult.length === 0) {
            throw new Error('Chave não encontrada');
        }

        const chavePrivada = chaveResult[0].chave_privada;

        // Assina o PDF com a chave privada
        const sign = crypto.createSign('SHA256');
        sign.update(pdfCreated);
        sign.end();

        const assinatura = sign.sign({
            key: chavePrivada,
            passphrase: 'senha_mega_segura'
        });

        // Transforma o buffer do PDF e a assinatura em string base64 para armazenamento
        const assinaturaBase64 = assinatura.toString('base64');
        // Converter os dados para string JSON
        const dadosFormJson = JSON.stringify(dados);

        // Armazenar PDF e assinatura no banco de dados
        const updateQuery = 'UPDATE RELATORIO SET pdf = ?, assinatura_professor = ?, data_assinatura = NOW(), dados_form = ? WHERE id = ?';
        await connection.query(updateQuery, [pdfCreated, assinaturaBase64, dadosFormJson, documentId]);

        console.log('Documento ID:', documentId);
        console.log('PDF assinado:', pdfCreated);

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

// Serviço para obter a chave pública do professor
export const getChavePublicaDoProfessorService = async (codigo_professor) => {
    try {
        const connection = await pool.getConnection();

        const [chaveResult] = await connection.query('SELECT chave_publica FROM CHAVES_PROFESSOR WHERE codigo_professor = ?', [codigo_professor]);
        const chavePublica = chaveResult[0].chave_publica;

        connection.release();
        return chavePublica;
    } catch (error) {
        throw new Error('Erro ao gerar chaves: ' + error.message);
    }
};