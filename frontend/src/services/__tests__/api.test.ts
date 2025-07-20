import '@testing-library/jest-dom';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Simple API service implementation for testing
const API_BASE_URL = 'http://localhost:3001/api';

const apiService = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API Error');
    }

    return response.json();
  },

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async register(userData: { name: string; email: string; password: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Cliente endpoints
  async getClientes(params?: { page?: number; limit?: number; search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);

    const query = searchParams.toString();
    return this.request(`/clientes${query ? `?${query}` : ''}`);
  },

  async getCliente(id: string) {
    return this.request(`/clientes/${id}`);
  },

  async createCliente(clienteData: any) {
    return this.request('/clientes', {
      method: 'POST',
      body: JSON.stringify(clienteData),
    });
  },

  async updateCliente(id: string, clienteData: any) {
    return this.request(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clienteData),
    });
  },

  async deleteCliente(id: string) {
    return this.request(`/clientes/${id}`, {
      method: 'DELETE',
    });
  },

  // Venda endpoints
  async getVendas() {
    return this.request('/vendas');
  },

  async createVenda(vendaData: any) {
    return this.request('/vendas', {
      method: 'POST',
      body: JSON.stringify(vendaData),
    });
  },

  async getEstatisticas() {
    return this.request('/vendas/estatisticas');
  },
};

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('Authentication', () => {
    it('should login with valid credentials', async () => {
      const mockResponse = {
        token: 'fake-jwt-token',
        user: { id: '1', name: 'Test User', email: 'test@example.com' }
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiService.login({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          }),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should register new user', async () => {
      const mockResponse = {
        token: 'fake-jwt-token',
        user: { id: '1', name: 'New User', email: 'new@example.com' }
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiService.register({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123'
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'New User',
            email: 'new@example.com',
            password: 'password123'
          }),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle authentication errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      });

      await expect(apiService.login({
        email: 'test@example.com',
        password: 'wrongpassword'
      })).rejects.toThrow('Invalid credentials');
    });
  });

  describe('Cliente Operations', () => {
    beforeEach(() => {
      mockLocalStorage.getItem.mockReturnValue('fake-jwt-token');
    });

    it('should get clientes list', async () => {
      const mockResponse = {
        data: [
          { id: '1', nome: 'João Silva', email: 'joao@example.com' },
          { id: '2', nome: 'Maria Santos', email: 'maria@example.com' }
        ],
        pagination: { page: 1, limit: 10, total: 2 }
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiService.getClientes();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/clientes',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer fake-jwt-token',
          },
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should get clientes with search parameters', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      });

      await apiService.getClientes({
        page: 2,
        limit: 5,
        search: 'João'
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/clientes?page=2&limit=5&search=Jo%C3%A3o',
        expect.any(Object)
      );
    });

    it('should get specific cliente', async () => {
      const mockResponse = {
        id: '1',
        nome: 'João Silva',
        email: 'joao@example.com'
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiService.getCliente('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/clientes/1',
        expect.any(Object)
      );

      expect(result).toEqual(mockResponse);
    });

    it('should create new cliente', async () => {
      const clienteData = {
        nome: 'Novo Cliente',
        email: 'novo@example.com',
        nascimento: '1990-01-01'
      };

      const mockResponse = {
        id: '3',
        ...clienteData
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiService.createCliente(clienteData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/clientes',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer fake-jwt-token',
          },
          body: JSON.stringify(clienteData),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should update cliente', async () => {
      const updateData = {
        nome: 'Nome Atualizado',
        telefone: '(11) 99999-9999'
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: '1', ...updateData }),
      });

      await apiService.updateCliente('1', updateData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/clientes/1',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer fake-jwt-token',
          },
          body: JSON.stringify(updateData),
        }
      );
    });

    it('should delete cliente', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await apiService.deleteCliente('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/clientes/1',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer fake-jwt-token',
          },
        }
      );
    });
  });

  describe('Venda Operations', () => {
    beforeEach(() => {
      mockLocalStorage.getItem.mockReturnValue('fake-jwt-token');
    });

    it('should get vendas list', async () => {
      const mockResponse = [
        {
          id: '1',
          valor: 299.99,
          data: '2024-01-15',
          cliente: { nome: 'João Silva' }
        }
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiService.getVendas();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/vendas',
        expect.any(Object)
      );

      expect(result).toEqual(mockResponse);
    });

    it('should create new venda', async () => {
      const vendaData = {
        valor: 150.00,
        data: '2024-01-15',
        clienteId: '1'
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: '1', ...vendaData }),
      });

      await apiService.createVenda(vendaData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/vendas',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer fake-jwt-token',
          },
          body: JSON.stringify(vendaData),
        }
      );
    });

    it('should get estatisticas', async () => {
      const mockResponse = {
        totalDia: 1500.00,
        totalGeral: 25000.00,
        quantidadeVendas: 150
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiService.getEstatisticas();

      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(apiService.getClientes()).rejects.toThrow('Network error');
    });

    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Server error' }),
      });

      await expect(apiService.getClientes()).rejects.toThrow('Server error');
    });

    it('should include authorization header when token exists', async () => {
      mockLocalStorage.getItem.mockReturnValue('test-token');
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await apiService.getClientes();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );
    });
  });
});
