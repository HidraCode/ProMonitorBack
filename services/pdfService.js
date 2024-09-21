import fs from 'fs';
import pdf from 'html-pdf';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Gera o PDF da frequência a partir do HTML
export const generateFrequenciaPDF = async (dados, documentId) => {
    // Obter o diretório atual
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Ajustar o caminho para o template HTML
    const htmlTemplatePath = path.join(__dirname, '..', 'templates', 'template.html'); // Caminho relativo do template
    const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf8');

    // Função para converter imagem para Base64
    const imageToBase64 = (filePath) => {
        const image = fs.readFileSync(filePath);
        return `data:image/png;base64,${image.toString('base64')}`;
    };

    // Converter imagem para Base64
    const brasaoBase64 = imageToBase64(path.join(__dirname, '..', 'templates', 'brasao.png'));

    // Adicionar dados à tabela de horas
    const dias1_15 = dados.horasPorDia.slice(0, 15).map(dia => ({
        dia: dia.dia,
        horas: dia.horas
    }));

    const dias16_30 = dados.horasPorDia.slice(15, 30).map(dia => ({
        dia: dia.dia,
        horas: dia.horas
    }));

    // Substituir placeholders no HTML
    let htmlContent = htmlTemplate;
    htmlContent = htmlContent.replace(/{{data_inicio}}/g, dados.dataInicio);
    htmlContent = htmlContent.replace(/{{nome}}/g, dados.nome);
    htmlContent = htmlContent.replace(/{{departamento}}/g, dados.departamento);
    htmlContent = htmlContent.replace(/{{nome_professor}}/g, dados.orientador);
    htmlContent = htmlContent.replace(/{{total_horas}}/g, dados.totalHoras);
    htmlContent = htmlContent.replace(/{{observacao}}/g, dados.observacao);
    htmlContent = htmlContent.replace(/{{dataAssinatura}}/g, dados.dataAssinatura);
    htmlContent = htmlContent.replace(/{{documentId}}/g, documentId);
    htmlContent = htmlContent.replace(/{{brasao}}/g, brasaoBase64);

    // Adicionar os dados das tabelas de horas
    let diasHtml = '';
    dias1_15.forEach((dia, index) => {
        diasHtml += `<tr>
            <td>${dia.dia}</td>
            <td style={font-style: italic; font-size: 8px;}>Assinado digitalmente</td>
            <td>${dia.horas}</td>
            <td>${dias16_30[index] ? dias16_30[index].dia : ''}</td>
            <td style={font-style: italic; font-size: 8px;}>Assinado digitalmente</td>
            <td>${dias16_30[index] ? dias16_30[index].horas : ''}</td>
        </tr>`;
    });
    // Completa o loop no HTML
    htmlContent = htmlContent.replace('{{#each dias1_15}}', diasHtml);
    htmlContent = htmlContent.replace('{{/each}}', '');

    // Adicionar o desempenho do monitor
    const desempenho = dados.parecer === 'satisfatorio' ? (`    (X) SATISFATÓRIO  ( ) INSATISFATÓRIO`)
        : (`    ( ) SATISFATÓRIO  (X) INSATISFATÓRIO`);

    htmlContent = htmlContent.replace(/{{desempenho}}/g, desempenho);

    // Completa o link para verificação
    htmlContent = htmlContent.replace(/{{documentId}}/g, documentId);

    // Função para gerar o PDF a partir do HTML e retornar como buffer
    const generatePdfFromHtml = (htmlContent) => {
        return new Promise((resolve, reject) => {
            pdf.create(htmlContent, options).toBuffer((err, buffer) => {
                if (err) return reject(err);
                resolve(buffer);
            });
        });
    };

    const buffer = await generatePdfFromHtml(htmlContent);

    console.log('PDF gerado e preenchido com sucesso!');
    return buffer; // Retorna o buffer do PDF gerado
};

// Gera o PDF do relatório a partir do HTML
export const generateRelatorioPDF = async (dados, documentId) => {
    // Obter o diretório atual
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Ajustar o caminho para o template HTML
    const htmlTemplatePath = path.join(__dirname, '..', 'templates', 'rel_final.html'); // Caminho relativo do template
    const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf8');

    // Substituir placeholders no HTML
    let htmlContent = htmlTemplate;
    htmlContent = htmlContent.replace(/{{curso}}/g, dados.curso);
    htmlContent = htmlContent.replace(/{{nome}}/g, dados.nome);
    htmlContent = htmlContent.replace(/{{orientador}}/g, dados.orientador);
    htmlContent = htmlContent.replace(/{{disciplina}}/g, dados.disciplina);
    htmlContent = htmlContent.replace(/{{dificuldades}}/g, replaceLineBreaks(dados.dificuldades));
    htmlContent = htmlContent.replace(/{{atividades}}/g, replaceLineBreaks(dados.atividades));
    htmlContent = htmlContent.replace(/{{objetivos}}/g, replaceLineBreaks(dados.objetivos));
    htmlContent = htmlContent.replace(/{{metodologia}}/g, replaceLineBreaks(dados.metodologia));
    htmlContent = htmlContent.replace(/{{conclusao}}/g, replaceLineBreaks(dados.conclusao));
    htmlContent = htmlContent.replace(/{{dataAssinatura}}/g, dados.dataAssinatura);
    htmlContent = htmlContent.replace(/{{ano}}/g, dados.dataAssinatura.split("/")[2]);
    htmlContent = htmlContent.replace(/{{documentId}}/g, documentId);

    // Função para gerar o PDF a partir do HTML e retornar como buffer
    const generatePdfFromHtml = (htmlContent) => {
        return new Promise((resolve, reject) => {
            pdf.create(htmlContent, options).toBuffer((err, buffer) => {
                if (err) return reject(err);
                resolve(buffer);
            });
        });
    };

    const buffer = await generatePdfFromHtml(htmlContent);

    console.log('PDF gerado e preenchido com sucesso!');
    return buffer; // Retorna o buffer do PDF gerado para ser salvo no banco de dados
};

// Formatação do PDF
const options = {
    format: 'A4',
    height: "11.7in", // Altura do papel A4
    width: "8.3in",    // Largura do papel A4
    border: '75px'     // Define uma margem de 50px em torno da página
};

// Função para substituir quebras de linha por <br>
const replaceLineBreaks = (text) => text.replace(/\n/g, '<br>');