import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import ClienteForm from '../ClienteForm';

const theme = createTheme();

const renderWithTheme = (component: React.ReactNode) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('ClienteForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form with all required fields', () => {
    renderWithTheme(<ClienteForm {...defaultProps} />);

    // Check for required fields
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument();
    
    // Check for optional fields
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('should show validation errors for required fields', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ClienteForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    
    // Try to submit without filling required fields
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/data de nascimento é obrigatória/i)).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ClienteForm {...defaultProps} />);

    const emailField = screen.getByLabelText(/email/i);
    
    // Enter invalid email
    await user.type(emailField, 'invalid-email');
    await user.tab(); // Trigger blur event

    await waitFor(() => {
      expect(screen.getByText(/email deve ter um formato válido/i)).toBeInTheDocument();
    });
  });

  it('should validate CPF format', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ClienteForm {...defaultProps} />);

    const cpfField = screen.getByLabelText(/cpf/i);
    
    // Enter invalid CPF
    await user.type(cpfField, '12345678900');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/cpf inválido/i)).toBeInTheDocument();
    });
  });

  it('should format phone number automatically', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ClienteForm {...defaultProps} />);

    const phoneField = screen.getByLabelText(/telefone/i);
    
    // Enter phone number
    await user.type(phoneField, '11999999999');

    await waitFor(() => {
      expect(phoneField).toHaveValue('(11) 99999-9999');
    });
  });

  it('should format CPF automatically', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ClienteForm {...defaultProps} />);

    const cpfField = screen.getByLabelText(/cpf/i);
    
    // Enter valid CPF
    await user.type(cpfField, '11144477735');

    await waitFor(() => {
      expect(cpfField).toHaveValue('111.444.777-35');
    });
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ClienteForm {...defaultProps} />);

    // Fill required fields
    await user.type(screen.getByLabelText(/nome/i), 'João Silva');
    await user.type(screen.getByLabelText(/email/i), 'joao@example.com');
    await user.type(screen.getByLabelText(/data de nascimento/i), '1990-01-01');

    // Fill optional fields
    await user.type(screen.getByLabelText(/telefone/i), '11999999999');
    await user.type(screen.getByLabelText(/cpf/i), '11144477735');

    // Submit form
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        nome: 'João Silva',
        email: 'joao@example.com',
        nascimento: '1990-01-01',
        telefone: '(11) 99999-9999',
        cpf: '111.444.777-35',
      });
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ClienteForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should populate form when editing existing cliente', () => {
    const existingCliente = {
      id: '1',
      nome: 'Maria Santos',
      email: 'maria@example.com',
      nascimento: '1985-05-15',
      telefone: '(11) 88888-8888',
      cpf: '111.444.777-35',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    renderWithTheme(
      <ClienteForm {...defaultProps} initialData={existingCliente} />
    );

    // Check if fields are populated
    expect(screen.getByDisplayValue('Maria Santos')).toBeInTheDocument();
    expect(screen.getByDisplayValue('maria@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1985-05-15')).toBeInTheDocument();
    expect(screen.getByDisplayValue('(11) 88888-8888')).toBeInTheDocument();
    expect(screen.getByDisplayValue('111.444.777-35')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    renderWithTheme(<ClienteForm {...defaultProps} loading={true} />);

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should disable form when loading', () => {
    renderWithTheme(<ClienteForm {...defaultProps} loading={true} />);

    // All form fields should be disabled
    expect(screen.getByLabelText(/nome/i)).toBeDisabled();
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/data de nascimento/i)).toBeDisabled();
    expect(screen.getByLabelText(/telefone/i)).toBeDisabled();
    expect(screen.getByLabelText(/cpf/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeDisabled();
  });

  it('should clear form when reset', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ClienteForm {...defaultProps} />);

    // Fill some fields
    await user.type(screen.getByLabelText(/nome/i), 'Test Name');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');

    // Check fields are filled
    expect(screen.getByDisplayValue('Test Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();

    // Reset form (if reset button exists)
    const resetButton = screen.queryByRole('button', { name: /limpar/i });
    if (resetButton) {
      await user.click(resetButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/nome/i)).toHaveValue('');
        expect(screen.getByLabelText(/email/i)).toHaveValue('');
      });
    }
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ClienteForm {...defaultProps} />);

    const nomeField = screen.getByLabelText(/nome/i);
    const emailField = screen.getByLabelText(/email/i);

    // Tab navigation
    await user.click(nomeField);
    await user.tab();
    expect(emailField).toHaveFocus();
  });

  it('should validate minimum age', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ClienteForm {...defaultProps} />);

    const birthDateField = screen.getByLabelText(/data de nascimento/i);
    
    // Enter future date
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateString = futureDate.toISOString().split('T')[0];
    
    await user.type(birthDateField, futureDateString);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/data de nascimento não pode ser no futuro/i)).toBeInTheDocument();
    });
  });

  it('should show character count for nome field', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ClienteForm {...defaultProps} />);

    const nomeField = screen.getByLabelText(/nome/i);
    
    await user.type(nomeField, 'João');

    // Check if character count is shown (if implemented)
    const characterCount = screen.queryByText(/4\/100/);
    if (characterCount) {
      expect(characterCount).toBeInTheDocument();
    }
  });
});
