import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Chip,
  useTheme,
  alpha,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  keyframes,
} from '@mui/material';
import {
  Code,
  Api,
  ContentCopy,
  CheckCircle,
  Security,
  Speed,
  IntegrationInstructions,
  DataObject,
  Webhook,
  Schema,
  AutoAwesome,
  Explore,
} from '@mui/icons-material';
import Layout from '../components/Layout';

// Animações
const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`api-tabpanel-${index}`}
      aria-labelledby={`api-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ApiDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const theme = useTheme();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const copyToClipboard = async (text: string, endpoint: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEndpoint(endpoint);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const quickStartSteps = [
    {
      step: '1',
      title: 'Autenticação',
      description: 'Faça login para obter o token JWT',
      endpoint: 'POST /api/auth/login',
      color: theme.palette.primary.main,
    },
    {
      step: '2', 
      title: 'Headers',
      description: 'Inclua o token no cabeçalho Authorization',
      endpoint: 'Bearer {seu-token}',
      color: '#22c55e',
    },
    {
      step: '3',
      title: 'Requisições',
      description: 'Use os endpoints disponíveis',
      endpoint: 'GET /api/clientes',
      color: '#f59e0b',
    },
  ];

  const endpoints = [
    {
      category: 'Autenticação',
      color: theme.palette.primary.main,
      routes: [
        { method: 'POST', path: '/api/auth/login', description: 'Login do usuário' },
        { method: 'POST', path: '/api/auth/register', description: 'Registro de usuário' },
      ]
    },
    {
      category: 'Clientes',
      color: '#22c55e',
      routes: [
        { method: 'GET', path: '/api/clientes', description: 'Listar clientes' },
        { method: 'POST', path: '/api/clientes', description: 'Criar cliente' },
        { method: 'PUT', path: '/api/clientes/:id', description: 'Atualizar cliente' },
        { method: 'DELETE', path: '/api/clientes/:id', description: 'Deletar cliente' },
      ]
    },
    {
      category: 'Vendas',
      color: '#f59e0b',
      routes: [
        { method: 'GET', path: '/api/vendas', description: 'Listar vendas' },
        { method: 'POST', path: '/api/vendas', description: 'Criar venda' },
        { method: 'PUT', path: '/api/vendas/:id', description: 'Atualizar venda' },
        { method: 'DELETE', path: '/api/vendas/:id', description: 'Deletar venda' },
      ]
    }
  ];

  const features = [
    {
      icon: Security,
      title: 'Autenticação JWT',
      description: 'Sistema seguro com tokens JWT para autenticação',
      color: theme.palette.primary.main,
    },
    {
      icon: Speed,
      title: 'Alto Performance',
      description: 'API otimizada com cache e paginação inteligente',
      color: '#22c55e',
    },
    {
      icon: Schema,
      title: 'Documentação OpenAPI',
      description: 'Especificação completa seguindo padrões OpenAPI 3.0',
      color: '#f59e0b',
    },
    {
      icon: Webhook,
      title: 'Webhooks',
      description: 'Notificações em tempo real para eventos importantes',
      color: '#8b5cf6',
    },
  ];

  return (
    <Layout>
      {/* Header Épico */}
      <Fade in={true} timeout={800}>
        <Box 
          sx={{ 
            mb: 4,
            p: 4,
            background: `linear-gradient(135deg, 
              ${alpha(theme.palette.primary.main, 0.1)} 0%, 
              ${alpha('#4FACFE', 0.08)} 30%, 
              ${alpha('#43E97B', 0.1)} 60%, 
              ${alpha('#FA709A', 0.08)} 100%)`,
            borderRadius: 4,
            border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg, transparent, ${alpha('#ffffff', 0.3)}, transparent)`,
              animation: `${shimmer} 3s infinite`,
            },
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={3}>
            <Box 
              sx={{ 
                animation: `${float} 4s ease-in-out infinite`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #4FACFE 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.3)}`,
                  border: `3px solid ${alpha('#ffffff', 0.2)}`,
                }}
              >
                <Api sx={{ fontSize: '2.5rem', color: 'white' }} />
              </Box>
            </Box>
            
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #4FACFE 50%, #43E97B 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  lineHeight: 1.1,
                  mb: 1,
                  letterSpacing: '-1px',
                }}
              >
                🚀 API Documentation
              </Typography>
              
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                📚 Documentação completa da API Avantsoft
              </Typography>

              <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }} flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<Explore />}
                  onClick={() => window.open('http://localhost:3001/api-docs', '_blank')}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #4FACFE 100%)`,
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': {
                      background: `linear-gradient(135deg, #4FACFE 0%, ${theme.palette.primary.main} 100%)`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
                    },
                  }}
                >
                  Swagger UI Interativo
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<DataObject />}
                  onClick={() => window.open('http://localhost:3001/api-docs.json', '_blank')}
                  sx={{
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                    color: theme.palette.primary.main,
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  OpenAPI Spec
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Fade>

      {/* Tabs Navigation */}
      <Paper
        sx={{
          mb: 3,
          borderRadius: 3,
          overflow: 'hidden',
          background: `linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%, 
            rgba(255, 255, 255, 0.9) 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              py: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            },
            '& .Mui-selected': {
              color: theme.palette.primary.main,
              fontWeight: 700,
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, #4FACFE)`,
            },
          }}
        >
          <Tab
            label="🚀 Quick Start"
            icon={<IntegrationInstructions />}
            iconPosition="start"
          />
          <Tab
            label="📋 Endpoints"
            icon={<Api />}
            iconPosition="start"
          />
          <Tab
            label="🔧 Features"
            icon={<AutoAwesome />}
            iconPosition="start"
          />
          <Tab
            label="💻 Examples"
            icon={<Code />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <TabPanel value={activeTab} index={0}>
        <Stack spacing={3}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 2 }}>
            🚀 Começando em 3 passos simples
          </Typography>
          
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            {quickStartSteps.map((step, index) => (
              <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '1 1 33.333%' } }}>
                <Zoom in={true} timeout={500 + (index * 200)}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      border: `2px solid ${alpha(step.color, 0.2)}`,
                      background: `linear-gradient(135deg, 
                        ${alpha(step.color, 0.08)} 0%, 
                        ${alpha(step.color, 0.05)} 100%)`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 12px 30px ${alpha(step.color, 0.2)}`,
                        borderColor: alpha(step.color, 0.4),
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${step.color}, ${alpha(step.color, 0.8)})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          color: 'white',
                          fontWeight: 900,
                          fontSize: '1.2rem',
                        }}
                      >
                        {step.step}
                      </Box>
                      
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: step.color }}>
                        {step.title}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                        {step.description}
                      </Typography>
                      
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          background: alpha(step.color, 0.1),
                          border: `1px solid ${alpha(step.color, 0.2)}`,
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: step.color,
                          position: 'relative',
                        }}
                      >
                        {step.endpoint}
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(step.endpoint, step.endpoint)}
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            color: step.color,
                          }}
                        >
                          {copiedEndpoint === step.endpoint ? <CheckCircle /> : <ContentCopy />}
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Box>
            ))}
          </Stack>
        </Stack>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Stack spacing={4}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
            📋 Endpoints Disponíveis
          </Typography>
          
          {endpoints.map((category, categoryIndex) => (
            <Fade in={true} timeout={300 + (categoryIndex * 200)} key={categoryIndex}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: `2px solid ${alpha(category.color, 0.2)}`,
                  background: `linear-gradient(135deg, 
                    ${alpha(category.color, 0.05)} 0%, 
                    rgba(255, 255, 255, 0.95) 100%)`,
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    color: category.color, 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: category.color,
                    }}
                  />
                  {category.category}
                </Typography>
                
                <Stack spacing={1}>
                  {category.routes.map((route, routeIndex) => (
                    <Box
                      key={routeIndex}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 2,
                        background: alpha('#ffffff', 0.7),
                        border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: alpha(category.color, 0.08),
                          borderColor: alpha(category.color, 0.3),
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Chip
                          label={route.method}
                          size="small"
                          sx={{
                            backgroundColor: category.color,
                            color: 'white',
                            fontWeight: 700,
                            minWidth: 60,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {route.path}
                        </Typography>
                      </Box>
                      
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.secondary, mr: 2 }}
                      >
                        {route.description}
                      </Typography>
                      
                      <Tooltip title="Copiar endpoint">
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(route.path, route.path)}
                          sx={{ color: category.color }}
                        >
                          {copiedEndpoint === route.path ? <CheckCircle /> : <ContentCopy />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Fade>
          ))}
        </Stack>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Stack spacing={3}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 2 }}>
            🔧 Recursos da API
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} flexWrap="wrap">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 48%' } }}>
                  <Zoom in={true} timeout={400 + (index * 150)}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        border: `2px solid ${alpha(feature.color, 0.2)}`,
                        background: `linear-gradient(135deg, 
                          ${alpha(feature.color, 0.08)} 0%, 
                          rgba(255, 255, 255, 0.95) 100%)`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: `0 10px 25px ${alpha(feature.color, 0.2)}`,
                          borderColor: alpha(feature.color, 0.4),
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: 2,
                              background: `linear-gradient(135deg, ${feature.color}, ${alpha(feature.color, 0.8)})`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2,
                            }}
                          >
                            <IconComponent sx={{ fontSize: '1.5rem', color: 'white' }} />
                          </Box>
                          
                          <Typography variant="h6" sx={{ fontWeight: 700, color: feature.color }}>
                            {feature.title}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                                      </Card>
                </Zoom>
              </Box>
              );
            })}
          </Stack>
        </Stack>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Stack spacing={3}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 2 }}>
            💻 Exemplos de Código
          </Typography>
          
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: '#1e1e1e',
              border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Typography variant="h6" sx={{ color: '#4FC3F7', mb: 2, fontWeight: 600 }}>
              🔐 Exemplo de Autenticação
            </Typography>
            
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: '#2d2d2d',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                color: '#ffffff',
                overflow: 'auto',
                position: 'relative',
              }}
            >
              <IconButton
                size="small"
                onClick={() => copyToClipboard(`fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@loja.com',
    password: 'admin123'
  })
})
.then(response => response.json())
.then(data => {
  localStorage.setItem('token', data.token);
  console.log('Login realizado com sucesso!');
});`, 'auth-example')}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: '#ffffff',
                  backgroundColor: alpha('#ffffff', 0.1),
                }}
              >
                {copiedEndpoint === 'auth-example' ? <CheckCircle /> : <ContentCopy />}
              </IconButton>
              
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@loja.com',
    password: 'admin123'
  })
})
.then(response => response.json())
.then(data => {
  localStorage.setItem('token', data.token);
  console.log('Login realizado com sucesso!');
});`}
              </pre>
            </Box>
          </Paper>

          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: '#1e1e1e',
              border: `2px solid ${alpha('#22c55e', 0.2)}`,
            }}
          >
            <Typography variant="h6" sx={{ color: '#66BB6A', mb: 2, fontWeight: 600 }}>
              👥 Exemplo de Listagem de Clientes
            </Typography>
            
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: '#2d2d2d',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                color: '#ffffff',
                overflow: 'auto',
                position: 'relative',
              }}
            >
              <IconButton
                size="small"
                onClick={() => copyToClipboard(`fetch('http://localhost:3001/api/clientes', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
  }
})
.then(response => response.json())
.then(data => {
  console.log('Clientes:', data.data);
  console.log('Total:', data.pagination.total);
});`, 'clientes-example')}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: '#ffffff',
                  backgroundColor: alpha('#ffffff', 0.1),
                }}
              >
                {copiedEndpoint === 'clientes-example' ? <CheckCircle /> : <ContentCopy />}
              </IconButton>
              
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`fetch('http://localhost:3001/api/clientes', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
  }
})
.then(response => response.json())
.then(data => {
  console.log('Clientes:', data.data);
  console.log('Total:', data.pagination.total);
});`}
              </pre>
            </Box>
          </Paper>
        </Stack>
      </TabPanel>
    </Layout>
  );
};

export default ApiDocs; 