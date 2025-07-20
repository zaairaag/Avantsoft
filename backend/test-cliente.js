const axios = require('axios');

async function testCreateCliente() {
  try {
    console.log('🧪 Testando criação de cliente...');
    
    const clienteData = {
      nome: 'Teste Cliente',
      email: `teste.${Date.now()}@test.com`,
      nascimento: '1990-01-01',
      telefone: '(11) 99999-9999',
      cpf: '123.456.789-00'
    };
    
    console.log('📤 Enviando dados:', clienteData);
    
    const response = await axios.post('http://localhost:3001/api/clientes', clienteData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Cliente criado com sucesso!');
    console.log('📋 Resposta:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar cliente:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

async function testListClientes() {
  try {
    console.log('📋 Testando listagem de clientes...');
    
    const response = await axios.get('http://localhost:3001/api/clientes');
    
    console.log('✅ Clientes listados com sucesso!');
    console.log('📊 Total de clientes:', response.data.pagination?.total || response.data.length);
    
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao listar clientes:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

async function runTests() {
  console.log('🚀 Iniciando testes do backend...\n');
  
  try {
    // Teste 1: Listar clientes
    await testListClientes();
    console.log('\n');
    
    // Teste 2: Criar cliente
    const novoCliente = await testCreateCliente();
    console.log('\n');
    
    // Teste 3: Listar novamente para verificar se foi criado
    await testListClientes();
    
    console.log('\n🎉 Todos os testes passaram!');
  } catch (error) {
    console.log('\n💥 Falha nos testes!');
    process.exit(1);
  }
}

runTests();
