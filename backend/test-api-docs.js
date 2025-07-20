const axios = require('axios');

async function testApiDocumentation() {
  console.log('📚 Testando Documentação da API...\n');

  try {
    // Teste 1: Verificar se Swagger UI está acessível
    console.log('🌐 Testando Swagger UI...');
    const swaggerResponse = await axios.get('http://localhost:3001/api-docs');
    if (swaggerResponse.status === 200) {
      console.log('✅ Swagger UI acessível em: http://localhost:3001/api-docs');
    }

    // Teste 2: Verificar especificação OpenAPI JSON
    console.log('\n📄 Testando especificação OpenAPI...');
    const openApiResponse = await axios.get('http://localhost:3001/api-docs.json');
    if (openApiResponse.status === 200) {
      console.log('✅ Especificação OpenAPI disponível em: http://localhost:3001/api-docs.json');
      
      const spec = openApiResponse.data;
      console.log(`📊 Informações da API:`);
      console.log(`   Título: ${spec.info.title}`);
      console.log(`   Versão: ${spec.info.version}`);
      console.log(`   Descrição: ${spec.info.description.split('\n')[0]}`);
      
      // Contar endpoints
      const paths = Object.keys(spec.paths);
      const totalEndpoints = paths.reduce((total, path) => {
        return total + Object.keys(spec.paths[path]).length;
      }, 0);
      
      console.log(`   Total de endpoints: ${totalEndpoints}`);
      console.log(`   Paths documentados: ${paths.length}`);
    }

    // Teste 3: Verificar se todos os endpoints estão documentados
    console.log('\n🔍 Verificando cobertura da documentação...');
    const spec = openApiResponse.data;
    const documentedPaths = Object.keys(spec.paths);
    
    const expectedPaths = [
      '/auth/login',
      '/clientes',
      '/clientes/{id}',
      '/vendas',
      '/vendas/estatisticas',
      '/vendas/por-dia'
    ];
    
    console.log('📋 Endpoints documentados:');
    expectedPaths.forEach(path => {
      const isDocumented = documentedPaths.includes(path);
      const status = isDocumented ? '✅' : '❌';
      console.log(`   ${status} ${path}`);
    });

    // Teste 4: Verificar schemas
    console.log('\n📝 Verificando schemas documentados...');
    const schemas = Object.keys(spec.components.schemas);
    console.log('🏗️ Schemas disponíveis:');
    schemas.forEach(schema => {
      console.log(`   ✅ ${schema}`);
    });

    // Teste 5: Verificar exemplos
    console.log('\n🧪 Verificando exemplos...');
    let exampleCount = 0;
    
    Object.values(spec.paths).forEach(pathMethods => {
      Object.values(pathMethods).forEach(method => {
        if (method.requestBody?.content?.['application/json']?.examples) {
          exampleCount += Object.keys(method.requestBody.content['application/json'].examples).length;
        }
        if (method.responses) {
          Object.values(method.responses).forEach(response => {
            if (response.content?.['application/json']?.examples) {
              exampleCount += Object.keys(response.content['application/json'].examples).length;
            }
          });
        }
      });
    });
    
    console.log(`📚 Total de exemplos documentados: ${exampleCount}`);

    // Teste 6: Verificar autenticação
    console.log('\n🔐 Verificando configuração de segurança...');
    if (spec.components.securitySchemes) {
      const authSchemes = Object.keys(spec.components.securitySchemes);
      console.log('🛡️ Esquemas de autenticação:');
      authSchemes.forEach(scheme => {
        const schemeData = spec.components.securitySchemes[scheme];
        console.log(`   ✅ ${scheme}: ${schemeData.type} (${schemeData.scheme || 'N/A'})`);
      });
    }

    console.log('\n🎉 Documentação da API está funcionando perfeitamente!');
    console.log('\n💡 Próximos passos:');
    console.log('   1. Acesse: http://localhost:3001/api-docs');
    console.log('   2. Teste os endpoints interativamente');
    console.log('   3. Faça login para obter o token JWT');
    console.log('   4. Use o botão "Authorize" no Swagger UI');
    console.log('   5. Teste todas as operações CRUD');

  } catch (error) {
    console.error('❌ Erro ao testar documentação:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solução:');
      console.log('   1. Verifique se o backend está rodando: npm run dev');
      console.log('   2. Confirme a porta 3001: http://localhost:3001/health');
    }
  }
}

async function demonstrateApiUsage() {
  console.log('\n🚀 Demonstração de Uso da API...\n');

  try {
    // Login
    console.log('🔐 1. Fazendo login...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@loja.com',
      password: 'admin123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso!');
    console.log(`🎫 Token: ${token.substring(0, 20)}...`);

    const headers = { Authorization: `Bearer ${token}` };

    // Listar clientes
    console.log('\n👥 2. Listando clientes...');
    const clientesResponse = await axios.get('http://localhost:3001/api/clientes', { headers });
    console.log(`✅ ${clientesResponse.data.data.length} clientes encontrados`);

    // Estatísticas
    console.log('\n📊 3. Obtendo estatísticas...');
    const statsResponse = await axios.get('http://localhost:3001/api/vendas/estatisticas', { headers });
    console.log(`✅ Faturamento do dia: R$ ${statsResponse.data.totalDia.toFixed(2)}`);

    console.log('\n🎯 API funcionando perfeitamente!');
    console.log('📚 Documentação completa: http://localhost:3001/api-docs');

  } catch (error) {
    console.error('❌ Erro na demonstração:', error.response?.data || error.message);
  }
}

async function runTests() {
  await testApiDocumentation();
  await demonstrateApiUsage();
}

runTests();
