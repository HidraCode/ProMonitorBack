const isValidCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');  // Remove pontos e traço

  if (cpf.length !== 11) return false;

  // Elimina CPFs com todos os dígitos iguais, que são inválidos
  if (/^(\d)\1+$/.test(cpf)) return false;

  const calculateCheckDigit = (cpf, factor) => {
    let total = 0;
    for (let i = 0; i < cpf.length; i++) {
      total += cpf[i] * factor--;
    }
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  // Validar primeiro dígito verificador
  const firstCheckDigit = calculateCheckDigit(cpf.slice(0, 9), 10);
  if (firstCheckDigit != cpf[9]) return false;

  // Validar segundo dígito verificador
  const secondCheckDigit = calculateCheckDigit(cpf.slice(0, 10), 11);
  if (secondCheckDigit != cpf[10]) return false;

  return true;
};

export default isValidCPF