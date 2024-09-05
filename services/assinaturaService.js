import crypto from 'crypto';
import fs from 'fs';

export const assinarDocumento = async (privateKeyPath, pdfBytes) => {
    const sign = crypto.createSign('SHA256');
    sign.update(pdfBytes);
    sign.end();

    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    const signature = sign.sign(privateKey, 'hex'); // assina o PDF com a chave privada do professor

    return signature;
};