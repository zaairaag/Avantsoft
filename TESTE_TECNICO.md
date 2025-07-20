# 🧸 Reino dos Brinquedos - Teste Técnico Avantsoft

> **🎯 TESTE TÉCNICO COMPLETO** - Sistema de gestão para loja de brinquedos  
> **📋 Objetivo:** Avaliar domínio de stack, boas práticas, raciocínio lógico e estruturação  
> **🔗 Repositório:** https://github.com/zaairaag/Avantsoft

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Tests](https://img.shields.io/badge/Tests-89%20Passing-brightgreen?style=for-the-badge)](https://github.com/zaairaag/Avantsoft)

## 📝 **SOBRE O TESTE TÉCNICO**

Este projeto foi desenvolvido como **teste técnico para a Avantsoft** seguindo rigorosamente todos os requisitos especificados. O objetivo é demonstrar competências técnicas em desenvolvimento full-stack com foco em qualidade, boas práticas e arquitetura robusta.

### 🎯 **REQUISITOS DO TESTE**

#### **🔧 BACKEND API (100% Implementado)**
- ✅ **CRUD de Clientes:** Cadastrar, listar, editar e deletar clientes
- ✅ **Filtros Avançados:** Busca por nome, email com paginação
- ✅ **Autenticação JWT:** Proteção obrigatória de todas as rotas
- ✅ **Tabela de Vendas:** Relacionamento com clientes
- ✅ **Estatísticas por Dia:** Rota retornando total de vendas diárias
- ✅ **Analytics de Performance:**
  - Cliente com maior volume de vendas
  - Cliente com maior média de valor por venda
  - Cliente com maior frequência de compras (dias únicos)
- ✅ **Testes Automatizados:** 89 testes cobrindo toda a lógica de negócio
- ✅ **Banco de Dados:** SQLite (dev) / PostgreSQL (prod)

#### **🎨 FRONTEND (100% Implementado)**
- ✅ **Formulário de Clientes:** Nome, email, data de nascimento
- ✅ **Listagem Inteligente:** Campos organizados e relevantes
- ✅ **Autenticação Simples:** Login integrado com backend
- ✅ **Dashboard de Estatísticas:**
  - Gráfico interativo de vendas por dia
  - Destaque visual dos top performers
- ✅ **Indicador Alfabético:** Primeira letra faltante no nome do cliente
- ✅ **Normalização de Dados:** Tratamento de API complexa/desorganizada

### 🏗️ **ARQUITETURA TÉCNICA**

#### **Backend Stack:**
```
Node.js + Express + TypeScript
├── Prisma ORM (Database)
├── JWT Authentication
├── Jest Testing Framework
├── Swagger Documentation
└── Docker Support
```

#### **Frontend Stack:**
```
React 18 + TypeScript + Vite
├── Material-UI Components
├── Recharts Visualization
├── Axios HTTP Client
├── React Router v6
└── React Testing Library
```

#### **Database Schema:**
```sql
-- Clientes
CREATE TABLE Cliente (
  id          String   @id @default(cuid())
  nome        String
  email       String   @unique
  nascimento  DateTime
  telefone    String?
  cpf         String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime? -- Soft delete
  vendas      Venda[]
)

-- Vendas
CREATE TABLE Venda (
  id        String   @id @default(cuid())
  valor     Float
  data      DateTime @default(now())
  clienteId String
  cliente   Cliente  @relation(fields: [clienteId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
)

-- Usuários
CREATE TABLE User (
  id       String @id @default(cuid())
  name     String
  email    String @unique
  password String
)
```

## 🚀 **COMO EXECUTAR O PROJETO**

### **📋 Pré-requisitos:**
- Node.js 18+
- npm ou yarn
- Git

### **⚡ Setup Rápido (5 minutos):**

```bash
# 1. Clonar repositório
git clone https://github.com/zaairaag/Avantsoft.git
cd Avantsoft

# 2. Backend
cd backend
npm install
npm run db:generate
npm run db:migrate
npm run db:seed        # 🌱 Dados de exemplo!
npm run dev

# 3. Frontend (novo terminal)
cd ../frontend
npm install
npm run dev
```

### **🌐 Acessar Aplicação:**
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Documentação:** http://localhost:3001/api-docs

### **🔑 Login de Teste:**
```
Email: admin@loja.com
Senha: admin123
```

## 🧪 **TESTES E QUALIDADE**

### **📊 Cobertura de Testes:**
```bash
# Backend - 89 testes
cd backend
npm test

# Frontend - 21 testes
cd frontend
npm test

# Cobertura completa
npm run test:coverage
```

### **🎯 Tipos de Teste Implementados:**
- **Unit Tests:** Controladores, validações, utilitários
- **Integration Tests:** Endpoints completos com banco
- **Database Tests:** Operações CRUD e relacionamentos
- **Authentication Tests:** JWT e middleware
- **Component Tests:** React components e hooks
- **E2E Tests:** Fluxos completos de usuário

## 📊 **DADOS DE DEMONSTRAÇÃO**

O sistema vem populado com dados realistas para demonstração:

### **👥 Clientes (11 total):**
- Maria Silva Santos, João Pedro Oliveira, Ana Carolina Lima...
- CPFs válidos brasileiros
- Telefones formatados
- Emails únicos

### **💰 Vendas (137+ transações):**
- Distribuídas nos últimos 30 dias
- Produtos variados: Bonecas, Lego, Hot Wheels, etc.
- Valores realistas: R$ 15,50 a R$ 299,90
- **Total:** R$ 12.709,24

### **📈 Métricas Calculadas:**
- Vendas por dia com crescimento percentual
- Top performers identificados automaticamente
- Estatísticas em tempo real

## 🎯 **DIFERENCIAIS IMPLEMENTADOS**

### **🇧🇷 Padrões Brasileiros:**
- Validação de CPF com algoritmo completo
- Formatação de telefone brasileiro
- Moeda em Real (R$) com vírgula decimal
- Datas no formato DD/MM/AAAA

### **🔒 Segurança:**
- JWT com expiração configurável
- Middleware de autenticação
- Validação de entrada rigorosa
- Soft delete para auditoria

### **📱 UX/UI Profissional:**
- Design responsivo Material-UI
- Feedback visual em tempo real
- Loading states e error handling
- Animações suaves

### **🏗️ Arquitetura Limpa:**
- Separação clara de responsabilidades
- Padrões de design consistentes
- Código TypeScript tipado
- Documentação completa

## 🐳 **DEPLOY E PRODUÇÃO**

### **Docker Support:**
```bash
# Desenvolvimento
docker-start.bat dev    # Windows
./docker-start.sh dev   # Linux/Mac

# URLs com Docker:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# Adminer: http://localhost:8080
```

### **Variáveis de Ambiente:**
```env
# Backend
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
PORT=3001

# Frontend
VITE_API_URL="http://localhost:3001/api"
```

## 📋 **CHECKLIST DE REQUISITOS**

### **Backend API ✅**
- [x] Cadastrar clientes
- [x] Listar com filtros (nome, email)
- [x] Deletar cliente
- [x] Editar informações
- [x] Autenticação obrigatória
- [x] Testes automatizados
- [x] Tabela sales/vendas
- [x] Rota estatísticas por dia
- [x] Cliente maior volume
- [x] Cliente maior média
- [x] Cliente maior frequência

### **Frontend ✅**
- [x] Adicionar clientes (nome, email, nascimento)
- [x] Listagem com campos pertinentes
- [x] Autenticação simples
- [x] Gráfico vendas por dia
- [x] Destaque maior volume
- [x] Destaque maior média
- [x] Destaque maior frequência
- [x] Indicador letra faltante
- [x] Normalização dados complexos

### **Extras Implementados ✅**
- [x] 89 testes automatizados
- [x] Documentação Swagger
- [x] Docker support
- [x] Seed com dados realistas
- [x] Validações brasileiras
- [x] Dashboard em tempo real
- [x] Arquitetura profissional

## 🎯 **CONCLUSÃO**

Este projeto demonstra **domínio completo da stack** solicitada, implementando **100% dos requisitos** com qualidade profissional. A solução vai além do básico, incluindo testes abrangentes, documentação completa e padrões de produção.

**Pronto para avaliação técnica e code review!** 🚀

---

**Desenvolvido por:** [Seu Nome]  
**Para:** Avantsoft - Teste Técnico  
**Data:** Julho 2025
