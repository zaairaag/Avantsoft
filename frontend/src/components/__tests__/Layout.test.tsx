import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import Layout from '../Layout';

// Mock the child components
jest.mock('../AccountMenu', () => {
  return function MockAccountMenu() {
    return <div data-testid="account-menu">Account Menu</div>;
  };
});

jest.mock('../GlobalSearch', () => {
  return function MockGlobalSearch() {
    return <div data-testid="global-search">Global Search</div>;
  };
});

jest.mock('../NotificationCenter', () => {
  return function MockNotificationCenter() {
    return <div data-testid="notification-center">Notification Center</div>;
  };
});

jest.mock('../SupportCenter', () => {
  return function MockSupportCenter() {
    return <div data-testid="support-center">Support Center</div>;
  };
});

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/dashboard' }),
}));

const theme = createTheme();

const renderWithProviders = (children: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Layout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render layout with all main elements', () => {
    renderWithProviders(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>
    );

    // Check if main layout elements are present
    expect(screen.getByRole('banner')).toBeInTheDocument(); // AppBar
    expect(screen.getByRole('navigation')).toBeInTheDocument(); // Drawer
    expect(screen.getByRole('main')).toBeInTheDocument(); // Main content area
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should render navigation menu items', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    // Check for navigation items
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Clientes')).toBeInTheDocument();
    expect(screen.getByText('Vendas')).toBeInTheDocument();
    expect(screen.getByText('Documentação')).toBeInTheDocument();
  });

  it('should toggle drawer when menu button is clicked', async () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    const menuButton = screen.getByLabelText(/open drawer/i);
    expect(menuButton).toBeInTheDocument();

    // Click to open drawer
    fireEvent.click(menuButton);

    // Wait for drawer to open (check for close button)
    await waitFor(() => {
      expect(screen.getByLabelText(/close drawer/i)).toBeInTheDocument();
    });

    // Click to close drawer
    const closeButton = screen.getByLabelText(/close drawer/i);
    fireEvent.click(closeButton);

    // Wait for drawer to close
    await waitFor(() => {
      expect(screen.getByLabelText(/open drawer/i)).toBeInTheDocument();
    });
  });

  it('should navigate when menu items are clicked', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    // Click on Dashboard
    const dashboardItem = screen.getByText('Dashboard');
    fireEvent.click(dashboardItem);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');

    // Click on Clientes
    const clientesItem = screen.getByText('Clientes');
    fireEvent.click(clientesItem);
    expect(mockNavigate).toHaveBeenCalledWith('/clientes');

    // Click on Vendas
    const vendasItem = screen.getByText('Vendas');
    fireEvent.click(vendasItem);
    expect(mockNavigate).toHaveBeenCalledWith('/vendas');
  });

  it('should render header components', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    // Check if header components are rendered
    expect(screen.getByTestId('global-search')).toBeInTheDocument();
    expect(screen.getByTestId('notification-center')).toBeInTheDocument();
    expect(screen.getByTestId('support-center')).toBeInTheDocument();
    expect(screen.getByTestId('account-menu')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    // Check for proper ARIA labels
    expect(screen.getByLabelText(/open drawer/i)).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should render children content properly', () => {
    const testContent = (
      <div>
        <h1>Test Page</h1>
        <p>This is test content</p>
        <button>Test Button</button>
      </div>
    );

    renderWithProviders(
      <Layout>
        {testContent}
      </Layout>
    );

    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(screen.getByText('This is test content')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('should handle responsive behavior', () => {
    // Mock window.innerWidth for mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });

    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    // On mobile, drawer should be temporary
    const menuButton = screen.getByLabelText(/open drawer/i);
    expect(menuButton).toBeInTheDocument();
  });

  it('should display app title', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    // Check for app title
    expect(screen.getByText(/Reino dos Brinquedos/i)).toBeInTheDocument();
  });

  it('should handle keyboard navigation', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    const dashboardItem = screen.getByText('Dashboard');
    
    // Test keyboard navigation
    fireEvent.keyDown(dashboardItem, { key: 'Enter', code: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');

    fireEvent.keyDown(dashboardItem, { key: ' ', code: 'Space' });
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
