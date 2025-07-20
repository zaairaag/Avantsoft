# 🎨 Frontend - Reino dos Brinquedos

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)](https://mui.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)](https://jestjs.io/)
[![Tests](https://img.shields.io/badge/Tests-21%20Passing-brightgreen?style=for-the-badge)](.)

Interface moderna e responsiva para o sistema Reino dos Brinquedos, desenvolvida com React 18, TypeScript e Material-UI. Inclui **21 testes automatizados** e configuração profissional.

## 🎯 **Características Principais**

- ⚛️ **React 18** com hooks modernos
- 🎨 **Material-UI** para design consistente
- 📱 **Responsivo** (mobile-first)
- 🔐 **Autenticação JWT** integrada
- 📊 **Dashboard** com gráficos interativos
- 🧪 **21 Testes** com React Testing Library
- 🚀 **Vite** para desenvolvimento rápido
- 🇧🇷 **Validações Brasileiras** (CPF, telefone)

## 🏗️ **Arquitetura**

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Layout/         # Layout principal
│   │   ├── ClienteForm/    # Formulário de clientes
│   │   ├── VendaForm/      # Formulário de vendas
│   │   └── __tests__/      # Testes de componentes
│   ├── pages/              # Páginas da aplicação
│   │   ├── Dashboard/      # Dashboard principal
│   │   ├── Login/          # Autenticação
│   │   ├── Clientes/       # Gestão de clientes
│   │   ├── Vendas/         # Gestão de vendas
│   │   └── __tests__/      # Testes de páginas
│   ├── services/           # Integração com API
│   │   ├── api.ts          # Cliente HTTP
│   │   └── __tests__/      # Testes de serviços
│   ├── hooks/              # Hooks customizados
│   │   ├── useAuth.ts      # Hook de autenticação
│   │   └── __tests__/      # Testes de hooks
│   ├── utils/              # Utilitários
│   │   ├── validation.ts   # Validações
│   │   ├── formatting.ts   # Formatação
│   │   └── __tests__/      # Testes de utilitários
│   ├── contexts/           # Contextos React
│   ├── types/              # Tipos TypeScript
│   └── App.tsx             # Componente principal
├── public/                 # Arquivos estáticos
├── jest.config.js          # Configuração Jest
├── vite.config.ts          # Configuração Vite
└── package.json
```

## 🚀 **Início Rápido**

### **Pré-requisitos**
- Node.js 18+
- npm 8+
- Backend rodando em http://localhost:3001

### **Instalação**
```bash
# Clone e navegue para o frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### **Aplicação rodando em:**
- **Frontend:** http://localhost:5173
- **Hot Reload:** Ativado automaticamente

## 🧪 **Sistema de Testes**

### **Estatísticas**
- **✅ 21 Testes Passando** (100% sucesso)
- **⚡ Execução Rápida** (~5 segundos)
- **🔧 Configuração Profissional** com Jest + RTL

### **Categorias de Testes**
| Categoria | Testes | Descrição |
|-----------|--------|-----------|
| **Componentes** | 6 | Renderização, props, interações |
| **Páginas** | 4 | Login, Dashboard, navegação |
| **Serviços** | 15 | API calls, autenticação, CRUD |
| **Hooks** | 8 | useAuth, estados, efeitos |
| **Utilitários** | 26 | Validações, formatação |

### **Executar Testes**
```bash
# Todos os testes
npm test

# Com cobertura
npm run test:coverage

# Modo watch (desenvolvimento)
npm run test:watch

# Testes específicos
npm test -- src/components/    # Componentes
npm test -- src/pages/         # Páginas
npm test -- src/services/      # Serviços
npm test -- src/hooks/         # Hooks
```

## 📱 **Páginas e Funcionalidades**

### **🔐 Login/Registro**
- Formulário de autenticação
- Validação em tempo real
- Feedback visual de erros
- Alternância login/registro
- Integração com JWT

### **📊 Dashboard**
- Cards de estatísticas
- Gráficos interativos (Recharts)
- Métricas em tempo real
- Vendas por período
- Top performers

### **👥 Gestão de Clientes**
- Lista paginada de clientes
- Busca e filtros
- Formulário de cadastro/edição
- Validação de CPF brasileiro
- Formatação automática de telefone
- Soft delete

### **💰 Gestão de Vendas**
- Registro de vendas
- Relacionamento com clientes
- Validação de valores
- Histórico de vendas
- Relatórios

## 🎨 **Componentes Principais**

### **Layout**
```tsx
// Layout responsivo com navegação
<Layout>
  <AppBar />
  <Drawer />
  <Main>{children}</Main>
</Layout>
```

### **ClienteForm**
```tsx
// Formulário com validações brasileiras
<ClienteForm
  onSave={handleSave}
  onCancel={handleCancel}
  initialData={cliente}
  loading={loading}
/>
```

### **Dashboard Cards**
```tsx
// Cards de estatísticas
<StatCard
  title="Vendas Hoje"
  value="R$ 1.500,00"
  icon={<TrendingUpIcon />}
  color="primary"
/>
```

## 🔧 **Hooks Customizados**

### **useAuth**
```tsx
const { user, login, logout, loading, error } = useAuth();

// Login
await login({ email, password });

// Logout
logout();

// Estado de autenticação
if (loading) return <Loading />;
if (error) return <Error message={error} />;
```

### **useApi**
```tsx
const { data, loading, error, refetch } = useApi('/api/clientes');

// Recarregar dados
refetch();
```

## 🌐 **Integração com API**

### **Cliente HTTP**
```typescript
// Configuração automática de headers
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});
```

### **Serviços**
```typescript
// Clientes
export const clienteService = {
  getAll: (params) => api.get('/clientes', { params }),
  getById: (id) => api.get(`/clientes/${id}`),
  create: (data) => api.post('/clientes', data),
  update: (id, data) => api.put(`/clientes/${id}`, data),
  delete: (id) => api.delete(`/clientes/${id}`)
};

// Vendas
export const vendaService = {
  getAll: () => api.get('/vendas'),
  create: (data) => api.post('/vendas', data),
  getStats: () => api.get('/vendas/estatisticas')
};
```

## 🎯 **Validações Frontend**

### **CPF Brasileiro**
```typescript
// Validação completa com dígitos verificadores
const isValidCPF = validateCPF('111.444.777-35'); // true

// Formatação automática
const formatted = formatCPF('11144477735'); // '111.444.777-35'
```

### **Telefone**
```typescript
// Formatação automática
const phone = formatPhone('11999999999'); // '(11) 99999-9999'
```

### **Email**
```typescript
// Validação RFC-compliant
const isValid = validateEmail('user@domain.com'); // true
```

## 📊 **Gráficos e Visualizações**

### **Recharts Integration**
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={vendasPorDia}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="data" />
    <YAxis />
    <Tooltip formatter={(value) => formatCurrency(value)} />
    <Line type="monotone" dataKey="valor" stroke="#8884d8" />
  </LineChart>
</ResponsiveContainer>
```

## 🎨 **Tema e Estilização**

### **Material-UI Theme**
```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});
```

### **Responsividade**
```tsx
// Breakpoints Material-UI
const isMobile = useMediaQuery(theme.breakpoints.down('md'));

return (
  <Grid container spacing={isMobile ? 1 : 3}>
    {/* Conteúdo responsivo */}
  </Grid>
);
```

## 🔧 **Scripts Disponíveis**

```bash
# Desenvolvimento
npm run dev          # Servidor com hot reload
npm run build        # Build para produção
npm run preview      # Preview da build

# Testes
npm test            # Todos os testes
npm run test:watch   # Modo watch
npm run test:coverage # Com cobertura

# Qualidade de código
npm run lint         # Verificar código
npm run lint:fix     # Corrigir automaticamente
npm run type-check   # Verificar tipos TypeScript
npm run format       # Formatar com Prettier
```

## 🚀 **Build e Deploy**

### **Build para Produção**
```bash
npm run build
```

### **Variáveis de Ambiente**
```env
# .env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME="Reino dos Brinquedos"
VITE_APP_VERSION="1.0.0"
```

### **Preview da Build**
```bash
npm run preview
```

## 📱 **Responsividade**

### **Breakpoints**
- **xs:** 0px - 599px (Mobile)
- **sm:** 600px - 959px (Tablet)
- **md:** 960px - 1279px (Desktop pequeno)
- **lg:** 1280px - 1919px (Desktop)
- **xl:** 1920px+ (Desktop grande)

### **Design Mobile-First**
```tsx
// Componentes adaptáveis
<Box
  sx={{
    display: { xs: 'block', md: 'flex' },
    flexDirection: { xs: 'column', md: 'row' },
    gap: { xs: 1, md: 3 }
  }}
>
```

## ♿ **Acessibilidade**

### **ARIA Labels**
```tsx
<Button
  aria-label="Salvar cliente"
  aria-describedby="save-help-text"
>
  Salvar
</Button>
```

### **Navegação por Teclado**
- Tab order lógico
- Focus indicators visíveis
- Atalhos de teclado

## 🤝 **Contribuição**

1. Siga os padrões de componentes Material-UI
2. Inclua testes para novos componentes
3. Use TypeScript com tipagem forte
4. Mantenha acessibilidade (ARIA)
5. Execute `npm run lint:fix` antes do commit

---

<div align="center">

**🎨 Interface moderna e responsiva para o Reino dos Brinquedos**

[![Tests](https://img.shields.io/badge/Tests-21%20Passing-brightgreen)](.)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](.)

</div>
