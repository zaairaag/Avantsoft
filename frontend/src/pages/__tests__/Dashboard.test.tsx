import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import '@testing-library/jest-dom';
import Dashboard from '../Dashboard';

// Mock the API service
const mockGetVendas = jest.fn();
const mockGetClientes = jest.fn();
const mockGetEstatisticas = jest.fn();

jest.mock('../../services/api', () => ({
  getVendas: (...args: any[]) => mockGetVendas(...args),
  getClientes: (...args: any[]) => mockGetClientes(...args),
  getEstatisticas: (...args: any[]) => mockGetEstatisticas(...args),
}));

// Mock recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
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

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API responses
    mockGetEstatisticas.mockResolvedValue({
      data: {
        totalDia: 1500.00,
        totalGeral: 25000.00,
        quantidadeVendas: 150,
        maiorVolume: {
          cliente: 'João Silva',
          valor: 5000.00
        }
      }
    });

    mockGetVendas.mockResolvedValue({
      data: [
        {
          id: '1',
          valor: 299.99,
          data: '2024-01-15',
          cliente: { nome: 'Maria Santos' }
        },
        {
          id: '2',
          valor: 150.00,
          data: '2024-01-14',
          cliente: { nome: 'João Silva' }
        }
      ]
    });

    mockGetClientes.mockResolvedValue({
      data: {
        data: [
          {
            id: '1',
            nome: 'Maria Santos',
            email: 'maria@example.com',
            vendas: [{ valor: 299.99 }]
          },
          {
            id: '2',
            nome: 'João Silva',
            email: 'joao@example.com',
            vendas: [{ valor: 150.00 }]
          }
        ]
      }
    });
  });

  it('should render dashboard with main sections', async () => {
    renderWithProviders(<Dashboard />);

    // Check for main dashboard elements
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/vendas hoje/i)).toBeInTheDocument();
    });
  });

  it('should display statistics cards', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      // Check for statistics cards
      expect(screen.getByText(/vendas hoje/i)).toBeInTheDocument();
      expect(screen.getByText(/total geral/i)).toBeInTheDocument();
      expect(screen.getByText(/quantidade de vendas/i)).toBeInTheDocument();
    });
  });

  it('should display correct statistics values', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('R$ 1.500,00')).toBeInTheDocument();
      expect(screen.getByText('R$ 25.000,00')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
    });
  });

  it('should render charts section', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
  });

  it('should display recent sales table', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/vendas recentes/i)).toBeInTheDocument();
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });
  });

  it('should handle loading state', () => {
    // Mock pending promises
    mockGetEstatisticas.mockReturnValue(new Promise(() => {}));
    mockGetVendas.mockReturnValue(new Promise(() => {}));
    mockGetClientes.mockReturnValue(new Promise(() => {}));

    renderWithProviders(<Dashboard />);

    // Should show loading indicators
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    mockGetEstatisticas.mockRejectedValue(new Error('API Error'));
    mockGetVendas.mockRejectedValue(new Error('API Error'));
    mockGetClientes.mockRejectedValue(new Error('API Error'));

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      // Should show error message or fallback content
      expect(screen.getByText(/erro ao carregar dados/i)).toBeInTheDocument();
    });
  });

  it('should refresh data when refresh button is clicked', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(mockGetEstatisticas).toHaveBeenCalledTimes(1);
    });

    // Find and click refresh button
    const refreshButton = screen.getByLabelText(/atualizar/i);
    refreshButton.click();

    await waitFor(() => {
      expect(mockGetEstatisticas).toHaveBeenCalledTimes(2);
    });
  });

  it('should display top customer information', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/maior volume/i)).toBeInTheDocument();
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('R$ 5.000,00')).toBeInTheDocument();
    });
  });

  it('should format currency values correctly', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      // Check Brazilian currency formatting
      expect(screen.getByText('R$ 1.500,00')).toBeInTheDocument();
      expect(screen.getByText('R$ 25.000,00')).toBeInTheDocument();
    });
  });

  it('should be responsive', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });

    renderWithProviders(<Dashboard />);

    // Should render without errors on mobile
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      // Check for proper headings
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();

      // Check for proper table structure
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });
  });

  it('should navigate to detailed views when cards are clicked', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      const vendasCard = screen.getByText(/vendas hoje/i).closest('div');
      expect(vendasCard).toBeInTheDocument();
      
      // Should be clickable
      expect(vendasCard).toHaveStyle('cursor: pointer');
    });
  });
});
