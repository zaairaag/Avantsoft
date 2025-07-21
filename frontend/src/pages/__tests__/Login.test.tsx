import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import Login from '../Login';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock API service
const mockLogin = jest.fn();
const mockRegister = jest.fn();
jest.mock('../../services/api', () => ({
  login: (...args: any[]) => mockLogin(...args),
  register: (...args: any[]) => mockRegister(...args),
}));

const theme = createTheme();

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should render login form by default', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText(/entrar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('should switch to register form when link is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const registerLink = screen.getByText(/criar conta/i);
    await user.click(registerLink);

    expect(screen.getByText(/criar conta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
  });

  it('should validate required fields on login', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const emailField = screen.getByLabelText(/email/i);
    await user.type(emailField, 'invalid-email');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/email deve ter um formato válido/i)).toBeInTheDocument();
    });
  });

  it('should validate password length', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const passwordField = screen.getByLabelText(/senha/i);
    await user.type(passwordField, '123');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/senha deve ter pelo menos 6 caracteres/i)).toBeInTheDocument();
    });
  });

  it('should submit login form with valid data', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({
      data: {
        token: 'fake-token',
        user: { id: '1', name: 'Test User', email: 'test@example.com' }
      }
    });

    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/senha/i), 'password123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should handle login error', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue({
      response: { data: { error: 'Credenciais inválidas' } }
    });

    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/senha/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });

  it('should validate register form fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    // Switch to register
    await user.click(screen.getByText(/criar conta/i));

    const submitButton = screen.getByRole('button', { name: /criar conta/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
    });
  });

  it('should validate password confirmation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    // Switch to register
    await user.click(screen.getByText(/criar conta/i));

    await user.type(screen.getByLabelText(/^senha$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'different');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/senhas não coincidem/i)).toBeInTheDocument();
    });
  });

  it('should submit register form with valid data', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue({
      data: {
        token: 'fake-token',
        user: { id: '1', name: 'New User', email: 'new@example.com' }
      }
    });

    renderWithProviders(<Login />);

    // Switch to register
    await user.click(screen.getByText(/criar conta/i));

    await user.type(screen.getByLabelText(/nome/i), 'New User');
    await user.type(screen.getByLabelText(/email/i), 'new@example.com');
    await user.type(screen.getByLabelText(/^senha$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'password123');
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123'
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should handle register error', async () => {
    const user = userEvent.setup();
    mockRegister.mockRejectedValue({
      response: { data: { error: 'Email já cadastrado' } }
    });

    renderWithProviders(<Login />);

    // Switch to register
    await user.click(screen.getByText(/criar conta/i));

    await user.type(screen.getByLabelText(/nome/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await user.type(screen.getByLabelText(/^senha$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'password123');
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(screen.getByText(/email já cadastrado/i)).toBeInTheDocument();
    });
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/senha/i), 'password123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeDisabled();
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const passwordField = screen.getByLabelText(/senha/i);
    const toggleButton = screen.getByLabelText(/mostrar senha/i);

    expect(passwordField).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(passwordField).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(passwordField).toHaveAttribute('type', 'password');
  });

  it('should store token in localStorage on successful login', async () => {
    const user = userEvent.setup();
    const mockToken = 'fake-jwt-token';
    mockLogin.mockResolvedValue({
      data: {
        token: mockToken,
        user: { id: '1', name: 'Test User', email: 'test@example.com' }
      }
    });

    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/senha/i), 'password123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe(mockToken);
    });
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const emailField = screen.getByLabelText(/email/i);
    const passwordField = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await user.click(emailField);
    await user.tab();
    expect(passwordField).toHaveFocus();

    await user.tab();
    expect(submitButton).toHaveFocus();
  });

  it('should submit form on Enter key press', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({
      data: {
        token: 'fake-token',
        user: { id: '1', name: 'Test User', email: 'test@example.com' }
      }
    });

    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/senha/i), 'password123');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  it('should have proper accessibility attributes', () => {
    renderWithProviders(<Login />);

    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();

    const emailField = screen.getByLabelText(/email/i);
    expect(emailField).toHaveAttribute('type', 'email');
    expect(emailField).toHaveAttribute('autocomplete', 'email');

    const passwordField = screen.getByLabelText(/senha/i);
    expect(passwordField).toHaveAttribute('type', 'password');
    expect(passwordField).toHaveAttribute('autocomplete', 'current-password');
  });
});
