import { pool } from "../database/db.js";

export const getRelatorioAssinadoService = async (documentId) => {
    const connection = await pool.getConnection();

    try {
        const [pdfResult] = await connection.query('SELECT pdf FROM RELATORIO WHERE id = ?', documentId);

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

export const getRelatorioService = async (codigo_relatorio) => {
    const connection = await pool.getConnection();
    try {
        // Busca o relatório no banco de dados
        const [documentRows] = await connection.query(
            'SELECT * FROM RELATORIO WHERE id = ?',
            [codigo_relatorio]
        );

        if (documentRows.length === 0) {
            throw new Error('Documento não encontrado!');
        }

        const dadosFormulario = JSON.parse(documentRows[0].dados_form || '{}');

        return {
            relatorio: {
                id: documentRows[0].id,
                codigo_aluno: documentRows[0].codigo_aluno,
                codigo_professor: documentRows[0].codigo_professor,
                pdf: documentRows[0].pdf,
                assinatura_professor: documentRows[0].assinatura_professor,
                data_criacao: documentRows[0].data_criacao,
                data_assinatura: documentRows[0].data_assinatura,
                status: documentRows[0].status
            },
            dadosFormulario
        }
    } catch (error) {
        throw new Error('Erro ao obter relatório: ' + error.message);
    } finally {
        connection.release();
    }
}

// Função para verificar a autenticidade do documento usando o ID
export const verificarRelatorioService = async (documentId) => {
    
    // Recupera a assinatura, relatório e código do professor usando o ID do documento
    const [result] = await connection.query(`
    SELECT assinatura_professor, pdf, codigo_professor FROM RELATORIO WHERE id = ?`, [documentId]);

    if (result.length === 0) {
        throw new Error('Professor não encontrado.');
    }

    const assinatura = result[0].assinatura_professor;
    const pdf = result[0].pdf;
    const codigo_professor = result[0].codigo_professor;

    // Recupera a chave pública do professor
    const [chaves] = await connection.query(`SELECT chave_publica FROM CHAVES_PROFESSOR WHERE codigo_professor = ?`, [codigo_professor]);

    // Verifica a assinatura digital
    const verify = crypto.createVerify('SHA256');
    verify.update(pdf);
    verify.end();

    const isValid = verify.verify({
        key: chavePublica,
        padding: crypto.constants.RSA_PKCS1_PADDING,
    }, assinatura);

    return isValid;
};

export const enviarRelatorioParaAssinatura = async (dados, codigo_usuario) => {

    const connection = await pool.getConnection();
    console.log('codigo_usuario:', codigo_usuario);
    console.log('Dados recebidos:', dados);

    try {
        // Busca o professor da monitoria associada ao aluno
        const [professorRows] = await connection.query(`
            SELECT e.codigo_professor
            FROM MONITOR m 
            JOIN EDITAL e ON m.codigo_edital = e.codigo_edital
            WHERE m.codigo_aluno = ?
        `, [codigo_usuario]);

        if (professorRows.length === 0) {
            throw new Error('Professor não encontrado.');
        }

        const codigo_professor = professorRows[0].codigo_professor;

        // Transforma os dados em JSON para armazenamento
        const dadosJSON = JSON.stringify(dados);
        console.log('Dados JSON:', dadosJSON);

        // Insere os dados parciais no banco de dados
        const query = `
            INSERT INTO RELATORIO
            (codigo_aluno, codigo_professor, dados_form)
            VALUES (?, ?, ?)
        `;

        const values = [codigo_usuario, codigo_professor, dadosJSON];
        await connection.query(query, values);

        return { message: 'Relatório enviado para assinatura' };
    } catch (error) {
        throw new Error('Erro ao enviar documento para assinatura: ' + error.message);
    } finally {
        connection.release();
    }
};

// Função para verificar a autenticidade do documento usando o ID
export const autenticarRelatorioService = async (documentId) => {
    
    // Recupera a assinatura, relatório e código do professor usando o ID do documento
    const [result] = await connection.query(`
    SELECT assinatura_professor, pdf, codigo_professor FROM RELATORIO WHERE id = ?`, [documentId]);

    if (result.length === 0) {
        throw new Error('Documento não encontrado.');
    }

    const assinatura = result[0].assinatura_professor;
    const pdf = result[0].pdf;
    const codigo_professor = result[0].codigo_professor;

    // Recupera a chave pública do professor
    const [chaves] = await connection.query(`SELECT chave_publica FROM CHAVES_PROFESSOR WHERE codigo_professor = ?`, [codigo_professor]);

    if (chaves.length == 0) {
        throw new Error('Chaves não encontradas.')
    }

    const chavePublica = chaves[0].chave_publica;
    
    // Verifica a assinatura digital
    const verify = crypto.createVerify('SHA256');
    verify.update(pdf);
    verify.end();

    const isValid = verify.verify({
        key: chavePublica,
        padding: crypto.constants.RSA_PKCS1_PADDING,
    }, assinatura);

    return isValid;
};