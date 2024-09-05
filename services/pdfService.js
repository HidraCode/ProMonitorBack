import { PDFDocument } from 'pdf-lib';

export const generatePDF = async (dados) => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([600, 800]);

    // Adiciona conteúdo ao PDF
    page.drawText(`Nome: ${dados.nome}`, { x: 50, y: 750 });
    page.drawText(`Horas: ${dados.horas}`, { x: 50, y: 730 });
    page.drawText(`Data: ${dados.data}`, { x: 50, y: 710 });

    const pdfBytes = await doc.save();
    return pdfBytes;
};