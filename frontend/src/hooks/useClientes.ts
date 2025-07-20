import { useState, useCallback, useMemo } from 'react';
import { Cliente } from '../types';
import { clienteService, ClientesParams } from '../services/api';

interface UseClientesReturn {
  clientes: Cliente[];
  loading: boolean;
  error: string;
  rowCount: number;
  loadClientes: (params?: ClientesParams) => Promise<void>;
  addCliente: (cliente: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Cliente>;
  updateCliente: (id: string, cliente: Partial<Cliente>) => Promise<Cliente>;
  deleteCliente: (id: string) => Promise<void>;
  clearError: () => void;
  topPerformers: {
    maiorVolume: Cliente | null;
    maiorMedia: Cliente | null;
    maiorFrequencia: Cliente | null;
  };
}

export const useClientes = (): UseClientesReturn => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rowCount, setRowCount] = useState(0);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  const loadClientes = useCallback(async (params?: ClientesParams) => {
    try {
      setLoading(true);
      setError('');
      const response = await clienteService.listar(params);
      setClientes(response.data);
      setRowCount(response.pagination.total);
    } catch (err) {
      setError('Erro ao carregar clientes');
      console.error('Erro ao carregar clientes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCliente = useCallback(async (clienteData: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError('');
      const novoCliente = await clienteService.criar(clienteData);
      
      // Atualização otimista - adiciona o cliente na lista sem recarregar tudo
      setClientes(prev => [novoCliente, ...prev]);
      setRowCount(prev => prev + 1);
      
      return novoCliente;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao criar cliente';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const updateCliente = useCallback(async (id: string, clienteData: Partial<Cliente>) => {
    try {
      setError('');
      const clienteAtualizado = await clienteService.atualizar(id, clienteData);
      
      // Atualização otimista - atualiza o cliente na lista sem recarregar tudo
      setClientes(prev => 
        prev.map(cliente => 
          cliente.id === id ? { ...cliente, ...clienteAtualizado } : cliente
        )
      );
      
      return clienteAtualizado;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao atualizar cliente';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const deleteCliente = useCallback(async (id: string) => {
    try {
      setError('');
      await clienteService.deletar(id);
      
      // Atualização otimista - remove o cliente da lista sem recarregar tudo
      setClientes(prev => prev.filter(cliente => cliente.id !== id));
      setRowCount(prev => prev - 1);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao deletar cliente';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Calcular top performers de forma memoizada
  const topPerformers = useMemo(() => {
    if (!clientes.length) return { maiorVolume: null, maiorMedia: null, maiorFrequencia: null };

    let maiorVolume = clientes[0];
    let maiorMedia = clientes[0];
    let maiorFrequencia = clientes[0];
    let maxVolume = 0;
    let maxMedia = 0;
    let maxFreq = 0;

    clientes.forEach(cliente => {
      const vendas = cliente.vendas || [];
      const volumeTotal = vendas.reduce((sum, venda) => sum + venda.valor, 0);
      const mediaVenda = vendas.length > 0 ? volumeTotal / vendas.length : 0;
      const diasUnicos = new Set(vendas.map(venda => 
        new Date(venda.data).toDateString()
      )).size;

      if (volumeTotal > maxVolume) {
        maxVolume = volumeTotal;
        maiorVolume = cliente;
      }

      if (mediaVenda > maxMedia) {
        maxMedia = mediaVenda;
        maiorMedia = cliente;
      }

      if (diasUnicos > maxFreq) {
        maxFreq = diasUnicos;
        maiorFrequencia = cliente;
      }
    });

    return { maiorVolume, maiorMedia, maiorFrequencia };
  }, [clientes]);

  return {
    clientes,
    loading,
    error,
    rowCount,
    loadClientes,
    addCliente,
    updateCliente,
    deleteCliente,
    clearError,
    topPerformers,
  };
};
