import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageMeta {
  title: string;
  description: string;
}

const usePageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const pageMeta: Record<string, PageMeta> = {
      '/': {
        title: '🏠 Dashboard - Reino dos Brinquedos',
        description: 'Dashboard principal do Reino dos Brinquedos. Visualize estatísticas, vendas e performance da sua loja de brinquedos em tempo real.'
      },
      '/dashboard': {
        title: '🏠 Dashboard - Reino dos Brinquedos',
        description: 'Dashboard principal do Reino dos Brinquedos. Visualize estatísticas, vendas e performance da sua loja de brinquedos em tempo real.'
      },
      '/login': {
        title: '🔐 Login - Reino dos Brinquedos',
        description: 'Acesse o sistema de gestão do Reino dos Brinquedos. Login seguro para gerenciar sua loja de brinquedos com autenticação JWT.'
      },
      '/clientes': {
        title: '👥 Gestão de Clientes - Reino dos Brinquedos',
        description: 'Gerencie seus clientes no Reino dos Brinquedos. Cadastre, edite e acompanhe o histórico de compras dos seus clientes de forma eficiente.'
      },
      '/vendas': {
        title: '💰 Vendas & Pedidos - Reino dos Brinquedos',
        description: 'Controle de vendas e pedidos do Reino dos Brinquedos. Registre vendas, acompanhe faturamento e analise performance de vendas.'
      },
      '/api-docs': {
        title: '📚 Documentação da API - Reino dos Brinquedos',
        description: 'Documentação completa da API do Reino dos Brinquedos. Swagger UI interativo para desenvolvedores com exemplos práticos.'
      },
      '/configuracoes': {
        title: '⚙️ Configurações - Reino dos Brinquedos',
        description: 'Configurações do sistema Reino dos Brinquedos. Personalize sua experiência, preferências e configurações de usuário.'
      },
      '/theme-test': {
        title: '🎨 Teste de Tema - Reino dos Brinquedos',
        description: 'Página de teste para validação do sistema de design e componentes do Reino dos Brinquedos.'
      }
    };

    const currentMeta = pageMeta[location.pathname] || {
      title: '🧸 Reino dos Brinquedos - Sistema de Gestão de Loja de Brinquedos',
      description: 'Sistema completo de gestão para lojas de brinquedos. Gerencie clientes, vendas, estoque e relatórios de forma eficiente com interface moderna.'
    };

    // Update document title
    document.title = currentMeta.title;

    // Update meta description
    const updateMetaTag = (selector: string, attribute: string, content: string) => {
      const element = document.querySelector(selector);
      if (element) {
        element.setAttribute(attribute, content);
      }
    };

    // Update all relevant meta tags
    updateMetaTag('meta[name="description"]', 'content', currentMeta.description);
    updateMetaTag('meta[property="og:title"]', 'content', currentMeta.title);
    updateMetaTag('meta[property="og:description"]', 'content', currentMeta.description);
    updateMetaTag('meta[name="twitter:title"]', 'content', currentMeta.title);
    updateMetaTag('meta[name="twitter:description"]', 'content', currentMeta.description);

    // Update canonical URL
    updateMetaTag('link[rel="canonical"]', 'href', `https://reinodosbrinquedos.com${location.pathname}`);

    // Update Open Graph URL
    updateMetaTag('meta[property="og:url"]', 'content', `https://reinodosbrinquedos.com${location.pathname}`);
    updateMetaTag('meta[name="twitter:url"]', 'content', `https://reinodosbrinquedos.com${location.pathname}`);

    // Add structured data for current page
    const addStructuredData = () => {
      // Remove existing structured data
      const existingScript = document.querySelector('#page-structured-data');
      if (existingScript) {
        existingScript.remove();
      }

      // Add new structured data
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": currentMeta.title,
        "description": currentMeta.description,
        "url": `https://reinodosbrinquedos.com${location.pathname}`,
        "isPartOf": {
          "@type": "WebSite",
          "name": "Reino dos Brinquedos",
          "url": "https://reinodosbrinquedos.com"
        },
        "inLanguage": "pt-BR",
        "potentialAction": {
          "@type": "ReadAction",
          "target": `https://reinodosbrinquedos.com${location.pathname}`
        }
      };

      const script = document.createElement('script');
      script.id = 'page-structured-data';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    };

    addStructuredData();

    // Update breadcrumb structured data
    const addBreadcrumbData = () => {
      const existingBreadcrumb = document.querySelector('#breadcrumb-structured-data');
      if (existingBreadcrumb) {
        existingBreadcrumb.remove();
      }

      const pathSegments = location.pathname.split('/').filter(Boolean);
      const breadcrumbItems = [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Reino dos Brinquedos",
          "item": "https://reinodosbrinquedos.com/"
        }
      ];

      pathSegments.forEach((segment, index) => {
        const segmentNames: Record<string, string> = {
          'dashboard': 'Dashboard',
          'clientes': 'Clientes',
          'vendas': 'Vendas',
          'api-docs': 'API Docs',
          'configuracoes': 'Configurações'
        };

        breadcrumbItems.push({
          "@type": "ListItem",
          "position": index + 2,
          "name": segmentNames[segment] || segment,
          "item": `https://reinodosbrinquedos.com/${pathSegments.slice(0, index + 1).join('/')}`
        });
      });

      if (breadcrumbItems.length > 1) {
        const breadcrumbData = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbItems
        };

        const script = document.createElement('script');
        script.id = 'breadcrumb-structured-data';
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbData);
        document.head.appendChild(script);
      }
    };

    addBreadcrumbData();

  }, [location.pathname]);
};

export default usePageTitle;
