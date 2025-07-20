import { validarCPF, validarEmail, formatarTelefone } from '../../src/utils/validation';

describe('Validation Utils', () => {
  describe('CPF Validation', () => {
    it('should validate correct CPF', () => {
      const validCPFs = [
        '11144477735',
        '12345678909',
        '98765432100'
      ];

      validCPFs.forEach(cpf => {
        expect(validarCPF(cpf)).toBe(true);
      });
    });

    it('should reject invalid CPF', () => {
      const invalidCPFs = [
        '12345678900', // Invalid check digits
        '11111111111', // All same digits
        '00000000000', // All zeros
        '123456789',   // Too short
        '123456789012', // Too long
        'abcdefghijk', // Non-numeric
        ''             // Empty
      ];

      invalidCPFs.forEach(cpf => {
        expect(validarCPF(cpf)).toBe(false);
      });
    });

    it('should handle CPF with formatting', () => {
      expect(validarCPF('111.444.777-35')).toBe(true);
      expect(validarCPF('123.456.789-00')).toBe(false);
    });

    it('should handle null and undefined', () => {
      expect(validarCPF(null)).toBe(false);
      expect(validarCPF(undefined)).toBe(false);
    });
  });

  describe('Email Validation', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com',
        'a@b.co'
      ];

      validEmails.forEach(email => {
        expect(validarEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user@domain',
        'user..name@domain.com',
        'user@domain..com',
        '',
        'user name@domain.com', // Space in local part
        'user@domain .com'      // Space in domain
      ];

      invalidEmails.forEach(email => {
        expect(validarEmail(email)).toBe(false);
      });
    });

    it('should handle null and undefined', () => {
      expect(validarEmail(null)).toBe(false);
      expect(validarEmail(undefined)).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(validarEmail('TEST@EXAMPLE.COM')).toBe(true);
      expect(validarEmail('Test@Example.Com')).toBe(true);
    });
  });

  describe('Phone Number Formatting', () => {
    it('should format 11-digit phone numbers correctly', () => {
      expect(formatarTelefone('11999999999')).toBe('(11) 99999-9999');
      expect(formatarTelefone('21987654321')).toBe('(21) 98765-4321');
    });

    it('should format 10-digit phone numbers correctly', () => {
      expect(formatarTelefone('1133334444')).toBe('(11) 3333-4444');
      expect(formatarTelefone('2155556666')).toBe('(21) 5555-6666');
    });

    it('should handle already formatted numbers', () => {
      expect(formatarTelefone('(11) 99999-9999')).toBe('(11) 99999-9999');
      expect(formatarTelefone('(21) 3333-4444')).toBe('(21) 3333-4444');
    });

    it('should handle numbers with partial formatting', () => {
      expect(formatarTelefone('11 99999-9999')).toBe('(11) 99999-9999');
      expect(formatarTelefone('(11) 999999999')).toBe('(11) 99999-9999');
    });

    it('should return null for invalid phone numbers', () => {
      const invalidPhones = [
        '123',           // Too short
        '123456789012',  // Too long
        'abcdefghijk',   // Non-numeric
        '',              // Empty
        '0000000000'     // Invalid pattern
      ];

      invalidPhones.forEach(phone => {
        expect(formatarTelefone(phone)).toBeNull();
      });
    });

    it('should handle null and undefined', () => {
      expect(formatarTelefone(null)).toBeNull();
      expect(formatarTelefone(undefined)).toBeNull();
    });

    it('should remove extra characters', () => {
      expect(formatarTelefone('(11) 9.9999-9999')).toBe('(11) 99999-9999');
      expect(formatarTelefone('+55 11 99999-9999')).toBe('(11) 99999-9999');
      expect(formatarTelefone('11-99999-9999')).toBe('(11) 99999-9999');
    });
  });

  describe('Integration Tests', () => {
    it('should validate complete cliente data', () => {
      const clienteData = {
        nome: 'João Silva',
        email: 'joao@example.com',
        cpf: '11144477735',
        telefone: '11999999999'
      };

      expect(validarEmail(clienteData.email)).toBe(true);
      expect(validarCPF(clienteData.cpf)).toBe(true);
      expect(formatarTelefone(clienteData.telefone)).toBe('(11) 99999-9999');
    });

    it('should handle cliente data with optional fields', () => {
      const clienteData = {
        nome: 'Maria Santos',
        email: 'maria@example.com',
        cpf: null,
        telefone: null
      };

      expect(validarEmail(clienteData.email)).toBe(true);
      expect(validarCPF(clienteData.cpf)).toBe(false); // null should be false
      expect(formatarTelefone(clienteData.telefone)).toBeNull();
    });

    it('should validate and format in sequence', () => {
      const rawPhone = '11999999999';
      const formattedPhone = formatarTelefone(rawPhone);
      
      expect(formattedPhone).toBe('(11) 99999-9999');
      
      // Verify formatted phone can be processed again
      expect(formatarTelefone(formattedPhone)).toBe('(11) 99999-9999');
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace in inputs', () => {
      expect(validarEmail('  test@example.com  ')).toBe(true);
      expect(validarCPF('  11144477735  ')).toBe(true);
      expect(formatarTelefone('  11999999999  ')).toBe('(11) 99999-9999');
    });

    it('should handle special characters', () => {
      expect(validarCPF('111.444.777-35')).toBe(true);
      expect(formatarTelefone('(11) 99999-9999')).toBe('(11) 99999-9999');
    });

    it('should be consistent with repeated calls', () => {
      const email = 'test@example.com';
      const cpf = '11144477735';
      const phone = '11999999999';

      // Multiple calls should return same result
      expect(validarEmail(email)).toBe(validarEmail(email));
      expect(validarCPF(cpf)).toBe(validarCPF(cpf));
      expect(formatarTelefone(phone)).toBe(formatarTelefone(phone));
    });
  });
});
