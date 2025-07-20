import '@testing-library/jest-dom';

// Simple validation functions for testing
const validationUtils = {
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validateCPF: (cpf: string): boolean => {
    // Remove formatting
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    
    if (cleanCPF.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false; // All same digits
    
    // Validate check digits
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cleanCPF.charAt(10));
  },

  formatPhone: (phone: string): string => {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    
    if (cleanPhone.length === 11) {
      return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
    } else if (cleanPhone.length === 10) {
      return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
    }
    
    return phone;
  },

  formatCPF: (cpf: string): string => {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    
    if (cleanCPF.length === 11) {
      return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3, 6)}.${cleanCPF.slice(6, 9)}-${cleanCPF.slice(9)}`;
    }
    
    return cpf;
  },

  validatePassword: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateRequired: (value: any): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },

  validateDate: (date: string): boolean => {
    const dateObj = new Date(date);
    const today = new Date();
    
    // Check if date is valid and not in the future
    return !isNaN(dateObj.getTime()) && dateObj <= today;
  },

  formatCurrency: (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
};

describe('Validation Utils', () => {
  describe('Email Validation', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com'
      ];

      validEmails.forEach(email => {
        expect(validationUtils.validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        'user..name@example.com',
        'user@example',
        ''
      ];

      invalidEmails.forEach(email => {
        expect(validationUtils.validateEmail(email)).toBe(false);
      });
    });
  });

  describe('CPF Validation', () => {
    it('should validate correct CPF numbers', () => {
      const validCPFs = [
        '11144477735',
        '111.444.777-35',
        '12345678909',
        '123.456.789-09'
      ];

      validCPFs.forEach(cpf => {
        expect(validationUtils.validateCPF(cpf)).toBe(true);
      });
    });

    it('should reject invalid CPF numbers', () => {
      const invalidCPFs = [
        '11111111111', // All same digits
        '12345678900', // Invalid check digits
        '123456789', // Too short
        '123456789012', // Too long
        'abc.def.ghi-jk', // Non-numeric
        ''
      ];

      invalidCPFs.forEach(cpf => {
        expect(validationUtils.validateCPF(cpf)).toBe(false);
      });
    });
  });

  describe('Phone Formatting', () => {
    it('should format 11-digit phone numbers', () => {
      expect(validationUtils.formatPhone('11999999999')).toBe('(11) 99999-9999');
      expect(validationUtils.formatPhone('21987654321')).toBe('(21) 98765-4321');
    });

    it('should format 10-digit phone numbers', () => {
      expect(validationUtils.formatPhone('1133334444')).toBe('(11) 3333-4444');
      expect(validationUtils.formatPhone('2133334444')).toBe('(21) 3333-4444');
    });

    it('should return original string for invalid lengths', () => {
      expect(validationUtils.formatPhone('123')).toBe('123');
      expect(validationUtils.formatPhone('123456789012')).toBe('123456789012');
    });

    it('should handle already formatted numbers', () => {
      expect(validationUtils.formatPhone('(11) 99999-9999')).toBe('(11) 99999-9999');
    });
  });

  describe('CPF Formatting', () => {
    it('should format CPF numbers correctly', () => {
      expect(validationUtils.formatCPF('11144477735')).toBe('111.444.777-35');
      expect(validationUtils.formatCPF('12345678909')).toBe('123.456.789-09');
    });

    it('should return original string for invalid lengths', () => {
      expect(validationUtils.formatCPF('123')).toBe('123');
      expect(validationUtils.formatCPF('123456789012')).toBe('123456789012');
    });

    it('should handle already formatted CPF', () => {
      expect(validationUtils.formatCPF('111.444.777-35')).toBe('111.444.777-35');
    });
  });

  describe('Password Validation', () => {
    it('should validate strong passwords', () => {
      const strongPasswords = [
        'Password123',
        'MyStr0ngP@ss',
        'Test123456'
      ];

      strongPasswords.forEach(password => {
        const result = validationUtils.validatePassword(password);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject weak passwords', () => {
      const result = validationUtils.validatePassword('123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Senha deve ter pelo menos 6 caracteres');
      expect(result.errors).toContain('Senha deve conter pelo menos uma letra maiúscula');
      expect(result.errors).toContain('Senha deve conter pelo menos uma letra minúscula');
    });

    it('should provide specific error messages', () => {
      const result = validationUtils.validatePassword('password');
      expect(result.errors).toContain('Senha deve conter pelo menos uma letra maiúscula');
      expect(result.errors).toContain('Senha deve conter pelo menos um número');
    });
  });

  describe('Required Field Validation', () => {
    it('should validate required strings', () => {
      expect(validationUtils.validateRequired('test')).toBe(true);
      expect(validationUtils.validateRequired('  test  ')).toBe(true);
    });

    it('should reject empty or whitespace strings', () => {
      expect(validationUtils.validateRequired('')).toBe(false);
      expect(validationUtils.validateRequired('   ')).toBe(false);
    });

    it('should validate required non-string values', () => {
      expect(validationUtils.validateRequired(123)).toBe(true);
      expect(validationUtils.validateRequired(0)).toBe(true);
      expect(validationUtils.validateRequired(false)).toBe(true);
    });

    it('should reject null and undefined', () => {
      expect(validationUtils.validateRequired(null)).toBe(false);
      expect(validationUtils.validateRequired(undefined)).toBe(false);
    });
  });

  describe('Date Validation', () => {
    it('should validate past dates', () => {
      expect(validationUtils.validateDate('1990-01-01')).toBe(true);
      expect(validationUtils.validateDate('2020-12-31')).toBe(true);
    });

    it('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      
      expect(validationUtils.validateDate(futureDateString)).toBe(false);
    });

    it('should reject invalid date formats', () => {
      expect(validationUtils.validateDate('invalid-date')).toBe(false);
      expect(validationUtils.validateDate('2023-13-01')).toBe(false);
      expect(validationUtils.validateDate('2023-02-30')).toBe(false);
    });
  });

  describe('Currency Formatting', () => {
    it('should format currency correctly', () => {
      expect(validationUtils.formatCurrency(1234.56)).toBe('R$ 1.234,56');
      expect(validationUtils.formatCurrency(0)).toBe('R$ 0,00');
      expect(validationUtils.formatCurrency(999.99)).toBe('R$ 999,99');
    });

    it('should handle large numbers', () => {
      expect(validationUtils.formatCurrency(1000000)).toBe('R$ 1.000.000,00');
    });

    it('should handle negative numbers', () => {
      expect(validationUtils.formatCurrency(-100)).toBe('-R$ 100,00');
    });
  });

  describe('Integration Tests', () => {
    it('should validate complete client data', () => {
      const clientData = {
        nome: 'João Silva',
        email: 'joao@example.com',
        nascimento: '1990-01-01',
        telefone: '11999999999',
        cpf: '11144477735'
      };

      expect(validationUtils.validateRequired(clientData.nome)).toBe(true);
      expect(validationUtils.validateEmail(clientData.email)).toBe(true);
      expect(validationUtils.validateDate(clientData.nascimento)).toBe(true);
      expect(validationUtils.validateCPF(clientData.cpf)).toBe(true);

      // Format data
      const formattedPhone = validationUtils.formatPhone(clientData.telefone);
      const formattedCPF = validationUtils.formatCPF(clientData.cpf);

      expect(formattedPhone).toBe('(11) 99999-9999');
      expect(formattedCPF).toBe('111.444.777-35');
    });

    it('should handle edge cases consistently', () => {
      // Empty strings
      expect(validationUtils.validateEmail('')).toBe(false);
      expect(validationUtils.validateCPF('')).toBe(false);
      expect(validationUtils.validateRequired('')).toBe(false);

      // Whitespace
      expect(validationUtils.validateRequired('   ')).toBe(false);
      expect(validationUtils.formatPhone('   ')).toBe('   ');

      // Special characters
      expect(validationUtils.formatPhone('(11) 99999-9999')).toBe('(11) 99999-9999');
      expect(validationUtils.formatCPF('111.444.777-35')).toBe('111.444.777-35');
    });
  });
});
