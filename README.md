# 🧸 Reino dos Brinquedos - Sistema de Gestão

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)](https://jestjs.io/)
[![Tests](https://img.shields.io/badge/Tests-89%20Passing-brightgreen?style=for-the-badge)](https://github.com/zaairaag/Avantsoft)
[![Coverage](https://img.shields.io/badge/Coverage-72.67%25-yellow?style=for-the-badge)](https://github.com/zaairaag/Avantsoft)

Sistema completo de gestão para loja de brinquedos desenvolvido como **teste técnico para a Avantsoft**, incluindo arquitetura robusta, **89 testes automatizados** e padrões brasileiros de validação.

> **🎯 TESTE TÉCNICO COMPLETO** - [Ver documentação detalhada](TESTE_TECNICO.md)
> **📋 Requisitos originais** - [Ver requisitos do teste](REQUISITOS_TESTE.md)

## 🎯 **Visão Geral**

O **Reino dos Brinquedos** é uma solução completa para gestão de lojas de brinquedos, oferecendo:

- 🔐 **Autenticação Segura** com JWT e bcrypt
- 👥 **Gestão Completa de Clientes** com validação brasileira (CPF, telefone)
- 💰 **Sistema de Vendas** com estatísticas e relatórios
- 📊 **Dashboard Inteligente** com métricas em tempo real
- 📱 **Interface Responsiva** com Material-UI
- 🧪 **89 Testes Automatizados** garantindo qualidade (68 backend + 21 frontend)
- 🇧🇷 **Padrões Brasileiros** (CPF, telefone, moeda Real)
- 📈 **72.67% de Cobertura** de testes no backend

## 🏗️ **Arquitetura do Sistema**

```
reino-dos-brinquedos/
├── 🎨 frontend/              # React + TypeScript + Material-UI
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Integração com API
│   │   ├── hooks/           # Hooks customizados
│   │   ├── utils/           # Utilitários e validações
│   │   └── __tests__/       # 21 testes do frontend
│   ├── jest.config.js       # Configuração de testes
│   └── package.json
├── 🔧 backend/               # Node.js + Express + Prisma
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── routes/          # Rotas da aplicação
│   │   ├── middleware/      # Middlewares (auth, cors, etc)
│   │   ├── utils/           # Utilitários e validações
│   │   └── types/           # Tipos TypeScript
│   ├── tests/               # 68 testes do backend
│   │   ├── auth/           # Testes de autenticação
│   │   ├── controllers/    # Testes de controladores
│   │   ├── database/       # Testes de banco de dados
│   │   ├── integration/    # Testes de integração
│   │   └── validation/     # Testes de validação
│   ├── prisma/             # Schema e migrações
│   ├── jest.config.js      # Configuração de testes
│   └── package.json
├── 📚 docs/                 # Documentação adicional
└── README.md               # Este arquivo
```

## ✨ **Funcionalidades Implementadas**

### 🔐 **Autenticação e Segurança**
- [x] Registro de usuários com validação
- [x] Login seguro com JWT (24h de expiração)
- [x] Hash de senhas com bcrypt
- [x] Middleware de autenticação
- [x] Proteção de rotas sensíveis
- [x] Logout e gerenciamento de sessão

### 👥 **Gestão de Clientes**
- [x] Cadastro completo de clientes
- [x] Validação de CPF com algoritmo brasileiro
- [x] Formatação automática de telefone (10/11 dígitos)
- [x] Validação de email RFC-compliant
- [x] Busca e filtros avançados
- [x] Paginação de resultados
- [x] Edição e exclusão (soft delete)

### 💰 **Sistema de Vendas**
- [x] Registro de vendas com relacionamento cliente
- [x] Validação de valores e datas
- [x] Estatísticas diárias e gerais
- [x] Relatórios por período
- [x] Identificação de top performers
- [x] Agregação temporal de dados

### 📊 **Dashboard e Relatórios**
- [x] Métricas em tempo real
- [x] Gráficos interativos (Recharts)
- [x] Cards de estatísticas
- [x] Vendas por período
- [x] Performance de clientes
- [x] Indicadores de crescimento

### 🎨 **Interface e UX**
- [x] Design responsivo (mobile-first)
- [x] Tema Material Design
- [x] Navegação intuitiva
- [x] Feedback visual de ações
- [x] Loading states
- [x] Tratamento de erros
- [x] Acessibilidade (ARIA)

## 🚀 **Início Rápido**

### **Pré-requisitos**
- Node.js 18+
- npm 8+ ou yarn 1.22+
- Git

### **Instalação Completa**

```bash
# 1. Clone o repositório
git clone https://github.com/zaairaag/Avantsoft.git
cd Avantsoft

# 2. Configure o Backend
cd backend
npm install
npm run db:generate    # Gera o cliente Prisma
npm run db:migrate     # Executa migrações
npm run db:seed        # Popula com dados de exemplo (RECOMENDADO)
npm run dev           # Inicia em modo desenvolvimento

# 3. Configure o Frontend (novo terminal)
cd ../frontend
npm install
npm run dev          # Inicia em modo desenvolvimento
```

### **Acesso à Aplicação**
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Documentação API:** http://localhost:3001/api-docs

### **🐳 Alternativa com Docker**

```bash
# Windows
docker-start.bat dev

# Linux/Mac
chmod +x docker-start.sh
./docker-start.sh dev
```

**URLs com Docker:**
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **Adminer:** http://localhost:8080

### **Dados de Exemplo Incluídos**
O sistema vem com dados de exemplo pré-configurados:
- **👤 2 Usuários:** admin@loja.com e gerente@loja.com (senha: admin123)
- **👥 10 Clientes** com dados brasileiros válidos (CPF, telefone)
- **💰 135 Vendas** distribuídas nos últimos 30 dias
- **💵 R$ 12.709,24** em vendas totais
- **🧸 Produtos variados:** Bonecas, carrinhos, Lego, pelúcias, etc.

### **Login Padrão**
- **Email:** `admin@loja.com`
- **Senha:** `admin123`

## 🧪 **Sistema de Testes**

### **Estatísticas de Testes**
- **✅ 89 Testes Passando** (100% de sucesso)
- **🔧 Backend:** 68 testes com 72.67% de cobertura
- **🎨 Frontend:** 21 testes com configuração profissional

### **Executar Testes**

```bash
# Backend - Todos os testes
cd backend
npm test

# Backend - Com cobertura
npm run test:coverage

# Backend - Testes específicos
npm test -- tests/auth/           # Testes de autenticação
npm test -- tests/controllers/    # Testes de controladores
npm test -- tests/integration/    # Testes de integração

# Frontend - Todos os testes
cd frontend
npm test

# Frontend - Com cobertura
npm run test:coverage

# Frontend - Modo watch
npm run test:watch
```

## 🛠️ **Tecnologias e Ferramentas**

### **Frontend Stack**
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | 18.x | Framework UI |
| TypeScript | 5.x | Tipagem estática |
| Material-UI | 5.x | Componentes UI |
| React Router | 6.x | Roteamento |
| Axios | 1.x | Cliente HTTP |
| Vite | 4.x | Build tool |
| Jest | 29.x | Framework de testes |
| React Testing Library | 13.x | Testes de componentes |

### **Backend Stack**
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| Node.js | 18.x | Runtime JavaScript |
| Express | 4.x | Framework web |
| TypeScript | 5.x | Tipagem estática |
| Prisma | 5.x | ORM e migrations |
| SQLite | 3.x | Banco de dados |
| JWT | 9.x | Autenticação |
| bcryptjs | 2.x | Hash de senhas |
| Jest | 29.x | Framework de testes |
| Supertest | 6.x | Testes de API |

## 🔧 **Scripts Disponíveis**

### **Backend**
```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build para produção
npm run start        # Inicia versão de produção
npm test            # Executa todos os testes
npm run test:coverage # Testes com cobertura
npm run db:generate  # Gera cliente Prisma
npm run db:migrate   # Executa migrações
npm run db:studio    # Interface visual do banco
npm run lint         # Verifica código
npm run lint:fix     # Corrige problemas de lint
```

### **Frontend**
```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build para produção
npm run preview      # Preview da build
npm test            # Executa todos os testes
npm run test:watch   # Testes em modo watch
npm run test:coverage # Testes com cobertura
npm run lint         # Verifica código
npm run lint:fix     # Corrige problemas de lint
npm run format       # Formata código com Prettier
```

## 🌐 **API Endpoints**

### **Autenticação**
```http
POST /api/auth/register  # Registro de usuário
POST /api/auth/login     # Login de usuário
```

### **Clientes**
```http
GET    /api/clientes           # Listar clientes (paginado)
GET    /api/clientes/:id       # Buscar cliente específico
POST   /api/clientes           # Criar novo cliente
PUT    /api/clientes/:id       # Atualizar cliente
DELETE /api/clientes/:id       # Excluir cliente (soft delete)
```

### **Vendas**
```http
GET  /api/vendas               # Listar vendas
POST /api/vendas               # Criar nova venda
GET  /api/vendas/estatisticas  # Estatísticas gerais
GET  /api/vendas/por-dia       # Vendas agrupadas por dia
```

## 🔍 **Validações Brasileiras**

### **CPF**
- Algoritmo completo com dígitos verificadores
- Rejeição de CPFs com dígitos repetidos
- Formatação automática: `111.444.777-35`

### **Telefone**
- Suporte para 10 e 11 dígitos
- Formatação automática: `(11) 99999-9999`
- Validação de códigos de área brasileiros

### **Email**
- Validação RFC-compliant
- Suporte para domínios brasileiros
- Normalização automática

## 📈 **Qualidade e Testes**

### **Cobertura de Testes Backend**
- **Statements:** 72.67%
- **Branches:** 55.86%
- **Functions:** 69.23%
- **Lines:** 72.53%

### **Tipos de Testes Implementados**
- **Unit Tests:** Funções isoladas e validações
- **Integration Tests:** Fluxos completos de API
- **Component Tests:** Componentes React
- **E2E Tests:** Jornadas completas de usuário
- **Database Tests:** Operações CRUD e constraints
- **Authentication Tests:** Segurança e JWT

## 🚀 **Deploy e Produção**

### **Variáveis de Ambiente**

**Backend (.env)**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3001
NODE_ENV=production
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME="Reino dos Brinquedos"
```

### **Build para Produção**
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## 🤝 **Contribuição**

### **Padrões de Desenvolvimento**
1. **Commits Convencionais:** `feat:`, `fix:`, `test:`, `docs:`
2. **Branches:** `feature/nome-da-feature`, `bugfix/nome-do-bug`
3. **Testes:** Sempre incluir testes para novas funcionalidades
4. **TypeScript:** Tipagem forte obrigatória
5. **ESLint + Prettier:** Código formatado e padronizado

### **Processo de Contribuição**
1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📞 **Suporte e Contato**

- **Documentação:** [docs/](./docs/)
- **Issues:** [GitHub Issues](https://github.com/zaairaag/Avantsoft/issues)
- **Discussões:** [GitHub Discussions](https://github.com/zaairaag/Avantsoft/discussions)

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
