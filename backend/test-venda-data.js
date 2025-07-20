const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@loja.com',
      password: 'admin123'
    });
    return response.data.token;
  } catch (error) {
    console.error('Erro no login:', error.response?.data || error.message);
    throw error;
  }
}

async function testVendaData() {
  try {
    console.log('🧪 Testando problema de data nas vendas...\n');
    
    // Fazer login
    const token = await testLogin();
    console.log('✅ Login realizado com sucesso\n');
    
    // Buscar um cliente para usar no teste
    const clientesResponse = await axios.get('http://localhost:3001/api/clientes', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (clientesResponse.data.data.length === 0) {
      console.error('❌ Nenhum cliente encontrado para teste');
      return;
    }
    
    const cliente = clientesResponse.data.data[0];
    console.log(`👤 Usando cliente: ${cliente.nome}`);
    
    // Testar com data de hoje
    const hoje = new Date();
    const dataHoje = hoje.toISOString().split('T')[0]; // YYYY-MM-DD
    
    console.log(`📅 Data selecionada: ${dataHoje}`);
    console.log(`📅 Data atual (local): ${hoje.toLocaleDateString('pt-BR')}`);
    
    // Simular o que o frontend faz
    const dataLocal = new Date(dataHoje + 'T12:00:00');
    console.log(`📅 Data que será enviada: ${dataLocal.toISOString()}`);
    
    const vendaData = {
      valor: 150.50,
      data: dataLocal.toISOString(),
      clienteId: cliente.id
    };
    
    console.log('\n📤 Criando venda...');
    const vendaResponse = await axios.post('http://localhost:3001/api/vendas', vendaData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const vendaCriada = vendaResponse.data;
    console.log('✅ Venda criada com sucesso!');
    
    // Verificar a data retornada
    const dataRetornada = new Date(vendaCriada.data);
    const dataRetornadaLocal = dataRetornada.toLocaleDateString('pt-BR');
    
    console.log('\n📊 Resultado:');
    console.log(`   Data selecionada: ${dataHoje} (${hoje.toLocaleDateString('pt-BR')})`);
    console.log(`   Data salva no banco: ${vendaCriada.data}`);
    console.log(`   Data exibida (local): ${dataRetornadaLocal}`);
    
    // Verificar se as datas coincidem
    const dataEsperada = hoje.toLocaleDateString('pt-BR');
    if (dataRetornadaLocal === dataEsperada) {
      console.log('\n🎉 ✅ SUCESSO! A data está correta!');
    } else {
      console.log('\n❌ PROBLEMA! A data não coincide:');
      console.log(`   Esperado: ${dataEsperada}`);
      console.log(`   Obtido: ${dataRetornadaLocal}`);
    }
    
    return vendaCriada;
    
  } catch (error) {
    console.error('\n❌ Erro no teste:', error.response?.data || error.message);
    throw error;
  }
}

async function testListarVendas() {
  try {
    const token = await testLogin();
    
    console.log('\n📋 Listando vendas para verificar...');
    const response = await axios.get('http://localhost:3001/api/vendas', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const vendas = response.data;
    console.log(`📊 Total de vendas: ${vendas.length}`);
    
    if (vendas.length > 0) {
      console.log('\n🔍 Últimas 3 vendas:');
      vendas.slice(0, 3).forEach((venda, index) => {
        const dataLocal = new Date(venda.data).toLocaleDateString('pt-BR');
        const horaLocal = new Date(venda.data).toLocaleTimeString('pt-BR');
        console.log(`   ${index + 1}. ${dataLocal} ${horaLocal} - R$ ${venda.valor.toFixed(2)} - ${venda.cliente.nome}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao listar vendas:', error.response?.data || error.message);
  }
}

async function runTests() {
  console.log('🚀 Iniciando testes de data de vendas...\n');
  
  try {
    await testVendaData();
    await testListarVendas();
    
    console.log('\n🎯 Teste concluído!');
    console.log('\n💡 Agora teste no frontend:');
    console.log('   1. Acesse http://localhost:5174');
    console.log('   2. Vá para "Vendas & Pedidos"');
    console.log('   3. Clique em "Nova Venda"');
    console.log('   4. Selecione a data de hoje');
    console.log('   5. Verifique se a data aparece correta na lista');
    
  } catch (error) {
    console.log('\n💥 Falha nos testes!');
    process.exit(1);
  }
}

runTests();
