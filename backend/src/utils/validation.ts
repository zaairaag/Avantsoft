/**
 * Validation utilities for the Reino dos Brinquedos application
 */

/**
 * Validates a Brazilian CPF (Cadastro de Pessoas Físicas)
 * @param cpf - The CPF string to validate
 * @returns true if valid, false otherwise
 */
export function validarCPF(cpf: string | null | undefined): boolean {
  if (!cpf) return false;

  // Remove formatting and whitespace
  const cleanCPF = cpf.toString().replace(/[^\d]/g, '').trim();

  // Check length
  if (cleanCPF.length !== 11) return false;

  // Check for invalid patterns (all same digits)
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Validate check digits
  let sum = 0;
  let remainder;

  // First check digit
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  // Second check digit
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
}

/**
 * Validates an email address
 * @param email - The email string to validate
 * @returns true if valid, false otherwise
 */
export function validarEmail(email: string | null | undefined): boolean {
  if (!email) return false;

  const cleanEmail = email.toString().trim();
  
  // Basic email regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Additional checks
  if (cleanEmail.length === 0) return false;
  if (cleanEmail.includes('..')) return false; // No consecutive dots
  if (cleanEmail.startsWith('.') || cleanEmail.endsWith('.')) return false;
  if (cleanEmail.includes(' ')) return false; // No spaces
  
  return emailRegex.test(cleanEmail);
}

/**
 * Formats a Brazilian phone number
 * @param telefone - The phone number to format
 * @returns formatted phone number or null if invalid
 */
export function formatarTelefone(telefone: string | null | undefined): string | null {
  if (!telefone) return null;

  // Remove all non-numeric characters
  let cleanPhone = telefone.toString().replace(/[^\d]/g, '');

  // Remove country code if present (55)
  if (cleanPhone.length === 13 && cleanPhone.startsWith('55')) {
    cleanPhone = cleanPhone.substring(2);
  }

  // Check for invalid patterns (all zeros)
  if (cleanPhone === '0000000000' || cleanPhone === '00000000000') {
    return null;
  }

  // Check for valid lengths (10 or 11 digits)
  if (cleanPhone.length === 11) {
    // Mobile: (XX) 9XXXX-XXXX
    return `(${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 7)}-${cleanPhone.substring(7)}`;
  } else if (cleanPhone.length === 10) {
    // Landline: (XX) XXXX-XXXX
    return `(${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 6)}-${cleanPhone.substring(6)}`;
  }

  // Invalid length
  return null;
}

/**
 * Validates a phone number format
 * @param telefone - The phone number to validate
 * @returns true if valid format, false otherwise
 */
export function validarTelefone(telefone: string | null | undefined): boolean {
  if (!telefone) return true; // Optional field

  const formatted = formatarTelefone(telefone);
  return formatted !== null;
}

/**
 * Sanitizes CPF by removing formatting
 * @param cpf - The CPF to sanitize
 * @returns clean CPF string or null
 */
export function sanitizarCPF(cpf: string | null | undefined): string | null {
  if (!cpf) return null;
  
  const clean = cpf.toString().replace(/[^\d]/g, '');
  return clean.length === 11 ? clean : null;
}

/**
 * Validates a date string
 * @param dateString - The date string to validate
 * @returns true if valid date, false otherwise
 */
export function validarData(dateString: string | null | undefined): boolean {
  if (!dateString) return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.getTime() > 0;
}

/**
 * Validates a monetary value
 * @param valor - The value to validate
 * @returns true if valid positive number, false otherwise
 */
export function validarValor(valor: number | string | null | undefined): boolean {
  if (valor === null || valor === undefined) return false;

  const numericValue = typeof valor === 'string' ? parseFloat(valor) : valor;
  return !isNaN(numericValue) && numericValue > 0;
}

/**
 * Validates required string fields
 * @param value - The string to validate
 * @param minLength - Minimum length (default: 1)
 * @param maxLength - Maximum length (default: 255)
 * @returns true if valid, false otherwise
 */
export function validarTextoObrigatorio(
  value: string | null | undefined,
  minLength: number = 1,
  maxLength: number = 255
): boolean {
  if (!value) return false;

  const trimmed = value.toString().trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
}

/**
 * Comprehensive cliente data validation
 * @param clienteData - The cliente data to validate
 * @returns validation result with errors
 */
export function validarDadosCliente(clienteData: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!validarTextoObrigatorio(clienteData.nome, 2, 100)) {
    errors.push('Nome é obrigatório e deve ter entre 2 e 100 caracteres');
  }

  if (!validarEmail(clienteData.email)) {
    errors.push('Email inválido');
  }

  if (!validarData(clienteData.nascimento)) {
    errors.push('Data de nascimento inválida');
  }

  // Optional fields
  if (clienteData.telefone && !validarTelefone(clienteData.telefone)) {
    errors.push('Telefone inválido');
  }

  if (clienteData.cpf && !validarCPF(clienteData.cpf)) {
    errors.push('CPF inválido');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Comprehensive venda data validation
 * @param vendaData - The venda data to validate
 * @returns validation result with errors
 */
export function validarDadosVenda(vendaData: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!validarValor(vendaData.valor)) {
    errors.push('Valor deve ser um número positivo');
  }

  if (!validarData(vendaData.data)) {
    errors.push('Data da venda inválida');
  }

  if (!validarTextoObrigatorio(vendaData.clienteId)) {
    errors.push('Cliente é obrigatório');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
