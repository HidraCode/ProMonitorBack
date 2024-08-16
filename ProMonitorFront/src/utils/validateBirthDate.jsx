const isValidDateFormat = (date) => {
  return /^\d{2}\/?\d{2}\/?\d{4}$/.test(date);
};

const isValidDate = (date) => {
  if (!isValidDateFormat(date)) return false;

  // Adiciona as barras manualmente caso estejam faltando
  if (!date.includes('/')) {
    date = date.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1/$2/$3');
  }

  const [day, month, year] = date.split('/').map(Number);
  const d = new Date(year, month - 1, day);

  return d.getFullYear() === year &&
         d.getMonth() === month - 1 &&
         d.getDate() === day;
};

const isValidBirthDate = (date) => {
  if (!isValidDate(date)) return false;

  const [day, month, year] = date.split('/').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  return birthDate <= today;
};

export default isValidBirthDate;