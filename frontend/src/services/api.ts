import axios from 'axios';
import type { AuthResponse, LoginCredentials, Cliente, Venda, Estatisticas, VendaPorDia } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

export interface ClientesParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ClientesResponse {
  data: Cliente[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const clienteService = {
  listar: async (params?: ClientesParams): Promise<ClientesResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await api.get(`/clientes?${queryParams.toString()}`);
    return response.data;
  },

  obter: async (id: string): Promise<Cliente> => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  criar: async (cliente: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cliente> => {
    const response = await api.post('/clientes', cliente);
    return response.data;
  },

  atualizar: async (id: string, cliente: Partial<Cliente>): Promise<Cliente> => {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
  },

  deletar: async (id: string): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  },
};

export const vendaService = {
  listar: async (): Promise<Venda[]> => {
    const response = await api.get('/vendas');
    return response.data;
  },

  criar: async (venda: Omit<Venda, 'id' | 'createdAt' | 'updatedAt'>): Promise<Venda> => {
    const response = await api.post('/vendas', venda);
    return response.data;
  },

  obterEstatisticas: async (): Promise<Estatisticas> => {
    const response = await api.get('/vendas/estatisticas');
    return response.data;
  },

  obterVendasPorDia: async (): Promise<VendaPorDia[]> => {
    const response = await api.get('/vendas/por-dia');
    return response.data;
  },
};

export default api;
