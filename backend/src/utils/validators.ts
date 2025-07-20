export const validarCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Verifica se não são todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digitoVerificador1 = resto < 2 ? 0 : resto;

  if (parseInt(cleanCPF.charAt(9)) !== digitoVerificador1) return false;

  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digitoVerificador2 = resto < 2 ? 0 : resto;

  return parseInt(cleanCPF.charAt(10)) === digitoVerificador2;
};

export const validarTelefone = (telefone: string): boolean => {
  // Remove caracteres não numéricos
  const cleanTelefone = telefone.replace(/\D/g, '');
  
  // Verifica se tem 10 ou 11 dígitos (com ou sem o 9 do celular)
  return cleanTelefone.length === 10 || cleanTelefone.length === 11;
};

export const validarEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatarCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatarTelefone = (telefone: string): string => {
  const cleanTelefone = telefone.replace(/\D/g, '');
  
  if (cleanTelefone.length === 11) {
    return cleanTelefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleanTelefone.length === 10) {
    return cleanTelefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return telefone;
};