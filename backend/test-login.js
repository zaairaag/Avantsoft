const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔐 Testando login...');
    
    const loginData = {
      email: 'admin@loja.com',
      password: 'admin123'
    };
    
    console.log('📤 Enviando credenciais:', { email: loginData.email, password: '***' });
    
    const response = await axios.post('http://localhost:3001/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login realizado com sucesso!');
    console.log('🎫 Token obtido:', response.data.token.substring(0, 20) + '...');
    console.log('👤 Usuário:', response.data.user);
    
    return response.data.token;
  } catch (error) {
    console.error('❌ Erro no login:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

async function testCreateClienteWithAuth() {
  try {
    // Primeiro fazer login
    const token = await testLogin();
    console.log('\n🧪 Testando criação de cliente com autenticação...');
    
    const clienteData = {
      nome: 'Cliente Teste Autenticado',
      email: `teste.auth.${Date.now()}@test.com`,
      nascimento: '1990-01-01',
      telefone: '(11) 99999-9999'
      // CPF removido para evitar conflitos de validação
    };
    
    console.log('📤 Enviando dados:', clienteData);
    
    const response = await axios.post('http://localhost:3001/api/clientes', clienteData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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

async function testListClientesWithAuth() {
  try {
    // Primeiro fazer login
    const token = await testLogin();
    console.log('\n📋 Testando listagem de clientes com autenticação...');
    
    const response = await axios.get('http://localhost:3001/api/clientes', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
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

async function runAuthTests() {
  console.log('🚀 Iniciando testes com autenticação...\n');
  
  try {
    // Teste 1: Login
    await testLogin();
    console.log('\n');
    
    // Teste 2: Listar clientes
    await testListClientesWithAuth();
    console.log('\n');
    
    // Teste 3: Criar cliente
    await testCreateClienteWithAuth();
    
    console.log('\n🎉 Todos os testes com autenticação passaram!');
    console.log('\n💡 Agora você pode usar as credenciais no frontend:');
    console.log('   Email: admin@loja.com');
    console.log('   Senha: admin123');
  } catch (error) {
    console.log('\n💥 Falha nos testes!');
    process.exit(1);
  }
}

runAuthTests();
