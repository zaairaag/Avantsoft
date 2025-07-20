// Utilitário para testar conectividade com o backend
import { clienteService } from '../services/api';

export const testBackendConnection = async () => {
  try {
    console.log('🔍 Testando conectividade com o backend...');
    
    // Teste 1: Verificar se consegue listar clientes
    console.log('📋 Teste 1: Listando clientes...');
    const response = await clienteService.listar({ page: 1, limit: 5 });
    console.log('✅ Sucesso ao listar clientes:', response);
    
    return {
      success: true,
      message: 'Conectividade OK',
      data: response
    };
  } catch (error: any) {
    console.error('❌ Erro na conectividade:', error);
    
    if (error.response) {
      // Erro HTTP
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      
      return {
        success: false,
        message: `Erro HTTP ${error.response.status}: ${error.response.data?.error || 'Erro desconhecido'}`,
        error: error.response.data
      };
    } else if (error.request) {
      // Erro de rede
      console.error('Erro de rede:', error.request);
      
      return {
        success: false,
        message: 'Erro de conectividade - Backend não acessível',
        error: 'Network Error'
      };
    } else {
      // Outro erro
      console.error('Erro:', error.message);
      
      return {
        success: false,
        message: error.message,
        error: error.message
      };
    }
  }
};

export const testCreateCliente = async () => {
  try {
    console.log('🆕 Testando criação de cliente...');
    
    const testCliente = {
      nome: 'Teste Cliente',
      email: `teste.${Date.now()}@test.com`,
      nascimento: '1990-01-01',
    };
    
    const novoCliente = await clienteService.criar(testCliente);
    console.log('✅ Cliente criado com sucesso:', novoCliente);
    
    // Limpar o cliente de teste
    try {
      await clienteService.deletar(novoCliente.id);
      console.log('🗑️ Cliente de teste removido');
    } catch (deleteError) {
      console.warn('⚠️ Não foi possível remover cliente de teste:', deleteError);
    }
    
    return {
      success: true,
      message: 'Criação de cliente funcionando',
      data: novoCliente
    };
  } catch (error: any) {
    console.error('❌ Erro ao criar cliente:', error);
    
    return {
      success: false,
      message: `Erro ao criar cliente: ${error.response?.data?.error || error.message}`,
      error: error.response?.data || error.message
    };
  }
};

export const runAllTests = async () => {
  console.log('🚀 Iniciando testes de conectividade...');
  
  const results = {
    connection: await testBackendConnection(),
    create: await testCreateCliente(),
  };
  
  console.log('📊 Resultados dos testes:', results);
  
  return results;
};
