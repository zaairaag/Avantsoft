const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testSEOOptimizations() {
  console.log('🔍 Testando Otimizações SEO do Reino dos Brinquedos...\n');

  const baseUrl = 'http://localhost:5174';
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: []
  };

  const addResult = (test, status, message, details = '') => {
    results.details.push({ test, status, message, details });
    if (status === 'PASS') results.passed++;
    else if (status === 'FAIL') results.failed++;
    else results.warnings++;
  };

  try {
    // Teste 1: Verificar se o frontend está rodando
    console.log('🌐 Testando conectividade...');
    try {
      const response = await axios.get(baseUrl, { timeout: 5000 });
      addResult('Conectividade', 'PASS', 'Frontend acessível', `Status: ${response.status}`);
    } catch (error) {
      addResult('Conectividade', 'FAIL', 'Frontend não acessível', error.message);
      console.log('❌ Frontend não está rodando. Execute: npm run dev');
      return;
    }

    // Teste 2: Verificar arquivos estáticos SEO
    console.log('\n📄 Verificando arquivos SEO...');
    
    const seoFiles = [
      { file: 'robots.txt', description: 'Arquivo robots.txt' },
      { file: 'sitemap.xml', description: 'Sitemap XML' },
      { file: 'site.webmanifest', description: 'Web App Manifest' },
      { file: 'favicon.svg', description: 'Favicon SVG' },
      { file: 'favicon.ico', description: 'Favicon ICO' },
      { file: 'browserconfig.xml', description: 'Configuração do Microsoft Edge' }
    ];

    for (const seoFile of seoFiles) {
      try {
        const response = await axios.get(`${baseUrl}/${seoFile.file}`);
        addResult('Arquivos SEO', 'PASS', `${seoFile.description} encontrado`, `Status: ${response.status}`);
      } catch (error) {
        addResult('Arquivos SEO', 'FAIL', `${seoFile.description} não encontrado`, error.response?.status || 'Erro de rede');
      }
    }

    // Teste 3: Verificar HTML e meta tags
    console.log('\n🏷️ Verificando meta tags...');
    
    try {
      const response = await axios.get(baseUrl);
      const html = response.data;

      // Verificar meta tags essenciais
      const metaChecks = [
        { regex: /<title>.*Reino dos Brinquedos.*<\/title>/, name: 'Title tag' },
        { regex: /<meta name="description" content=".*"/, name: 'Meta description' },
        { regex: /<meta name="keywords" content=".*"/, name: 'Meta keywords' },
        { regex: /<meta name="viewport" content=".*"/, name: 'Viewport meta' },
        { regex: /<meta name="theme-color" content="#FF6B9D"/, name: 'Theme color' },
        { regex: /<meta property="og:title" content=".*"/, name: 'Open Graph title' },
        { regex: /<meta property="og:description" content=".*"/, name: 'Open Graph description' },
        { regex: /<meta property="og:image" content=".*"/, name: 'Open Graph image' },
        { regex: /<meta name="twitter:card" content=".*"/, name: 'Twitter Card' },
        { regex: /<link rel="canonical" href=".*"/, name: 'Canonical URL' },
        { regex: /<script type="application\/ld\+json">/, name: 'Structured Data' }
      ];

      metaChecks.forEach(check => {
        if (check.regex.test(html)) {
          addResult('Meta Tags', 'PASS', `${check.name} presente`);
        } else {
          addResult('Meta Tags', 'FAIL', `${check.name} ausente`);
        }
      });

      // Verificar se o HTML está em português
      if (html.includes('lang="pt-BR"')) {
        addResult('Idioma', 'PASS', 'HTML configurado para português brasileiro');
      } else {
        addResult('Idioma', 'FAIL', 'HTML não configurado para português');
      }

      // Verificar charset UTF-8
      if (html.includes('charset="UTF-8"')) {
        addResult('Encoding', 'PASS', 'Charset UTF-8 configurado');
      } else {
        addResult('Encoding', 'FAIL', 'Charset UTF-8 não encontrado');
      }

    } catch (error) {
      addResult('HTML Analysis', 'FAIL', 'Erro ao analisar HTML', error.message);
    }

    // Teste 4: Verificar performance básica
    console.log('\n⚡ Testando performance...');
    
    const startTime = Date.now();
    try {
      await axios.get(baseUrl);
      const loadTime = Date.now() - startTime;
      
      if (loadTime < 1000) {
        addResult('Performance', 'PASS', `Carregamento rápido: ${loadTime}ms`);
      } else if (loadTime < 3000) {
        addResult('Performance', 'WARN', `Carregamento aceitável: ${loadTime}ms`);
      } else {
        addResult('Performance', 'FAIL', `Carregamento lento: ${loadTime}ms`);
      }
    } catch (error) {
      addResult('Performance', 'FAIL', 'Erro ao medir performance', error.message);
    }

    // Teste 5: Verificar manifest.json
    console.log('\n📱 Verificando PWA Manifest...');
    
    try {
      const manifestResponse = await axios.get(`${baseUrl}/site.webmanifest`);
      const manifest = manifestResponse.data;
      
      const manifestChecks = [
        { key: 'name', description: 'Nome da aplicação' },
        { key: 'short_name', description: 'Nome curto' },
        { key: 'description', description: 'Descrição' },
        { key: 'start_url', description: 'URL inicial' },
        { key: 'display', description: 'Modo de exibição' },
        { key: 'theme_color', description: 'Cor do tema' },
        { key: 'background_color', description: 'Cor de fundo' },
        { key: 'icons', description: 'Ícones' }
      ];

      manifestChecks.forEach(check => {
        if (manifest[check.key]) {
          addResult('PWA Manifest', 'PASS', `${check.description} configurado`);
        } else {
          addResult('PWA Manifest', 'FAIL', `${check.description} ausente`);
        }
      });

    } catch (error) {
      addResult('PWA Manifest', 'FAIL', 'Manifest não acessível', error.message);
    }

    // Teste 6: Verificar arquivos locais
    console.log('\n📁 Verificando arquivos locais...');
    
    const publicDir = path.join(__dirname, 'public');
    const localFiles = [
      'favicon.svg',
      'favicon.ico',
      'site.webmanifest',
      'robots.txt',
      'sitemap.xml',
      'browserconfig.xml'
    ];

    localFiles.forEach(file => {
      const filePath = path.join(publicDir, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        addResult('Arquivos Locais', 'PASS', `${file} existe`, `Tamanho: ${stats.size} bytes`);
      } else {
        addResult('Arquivos Locais', 'FAIL', `${file} não encontrado`);
      }
    });

  } catch (error) {
    console.error('❌ Erro geral nos testes:', error.message);
  }

  // Relatório final
  console.log('\n' + '='.repeat(60));
  console.log('📊 RELATÓRIO DE OTIMIZAÇÃO SEO');
  console.log('='.repeat(60));
  
  console.log(`\n✅ Testes Aprovados: ${results.passed}`);
  console.log(`❌ Testes Falharam: ${results.failed}`);
  console.log(`⚠️  Avisos: ${results.warnings}`);
  
  const total = results.passed + results.failed + results.warnings;
  const successRate = ((results.passed / total) * 100).toFixed(1);
  console.log(`📈 Taxa de Sucesso: ${successRate}%`);

  console.log('\n📋 Detalhes dos Testes:');
  console.log('-'.repeat(60));
  
  results.details.forEach(result => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} [${result.test}] ${result.message}`);
    if (result.details) {
      console.log(`   └─ ${result.details}`);
    }
  });

  console.log('\n💡 Recomendações:');
  console.log('-'.repeat(60));
  
  if (results.failed === 0) {
    console.log('🎉 Parabéns! Todas as otimizações SEO estão funcionando perfeitamente!');
    console.log('🚀 Seu site está otimizado para motores de busca e redes sociais.');
  } else {
    console.log('🔧 Corrija os itens marcados como FAIL para melhorar o SEO.');
    console.log('📚 Consulte a documentação para implementar as correções necessárias.');
  }

  console.log('\n🌐 URLs importantes:');
  console.log(`   • Frontend: ${baseUrl}`);
  console.log(`   • Robots.txt: ${baseUrl}/robots.txt`);
  console.log(`   • Sitemap: ${baseUrl}/sitemap.xml`);
  console.log(`   • Manifest: ${baseUrl}/site.webmanifest`);
  
  console.log('\n🎯 Próximos passos:');
  console.log('   1. Teste em diferentes navegadores');
  console.log('   2. Valide com Google Search Console');
  console.log('   3. Teste compartilhamento em redes sociais');
  console.log('   4. Monitore performance com Lighthouse');
}

// Executar testes
testSEOOptimizations().catch(console.error);
