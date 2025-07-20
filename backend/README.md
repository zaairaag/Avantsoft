# 🔧 Backend - Reino dos Brinquedos

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)](https://jestjs.io/)
[![Tests](https://img.shields.io/badge/Tests-68%20Passing-brightgreen?style=for-the-badge)](.)
[![Coverage](https://img.shields.io/badge/Coverage-72.67%25-yellow?style=for-the-badge)](.)

API REST robusta para o sistema Reino dos Brinquedos, desenvolvida com Node.js, Express, TypeScript e Prisma ORM. Inclui **68 testes automatizados** com 72.67% de cobertura.

## 🎯 **Características Principais**

- 🔐 **Autenticação JWT** com bcrypt para segurança
- 🇧🇷 **Validações Brasileiras** (CPF, telefone, email)
- 📊 **API RESTful** com padrões profissionais
- 🗄️ **Prisma ORM** com SQLite para desenvolvimento
- 🧪 **68 Testes Automatizados** (72.67% cobertura)
- 📝 **TypeScript** para tipagem forte
- 🔄 **Soft Delete** para preservar histórico
- 📈 **Estatísticas e Relatórios** em tempo real

## 🏗️ **Arquitetura**

```
backend/
├── src/
│   ├── controllers/          # Controladores das rotas
│   │   ├── authController.ts
│   │   ├── clienteController.ts
│   │   └── vendaController.ts
│   ├── routes/              # Definição das rotas
│   │   ├── auth.ts
│   │   ├── clientes.ts
│   │   └── vendas.ts
│   ├── middleware/          # Middlewares customizados
│   │   ├── auth.ts
│   │   ├── cors.ts
│   │   └── errorHandler.ts
│   ├── utils/              # Utilitários e validações
│   │   └── validation.ts
│   ├── types/              # Tipos TypeScript
│   └── server.ts           # Servidor principal
├── tests/                  # 68 testes organizados
│   ├── auth/              # Testes de autenticação
│   ├── controllers/       # Testes de controladores
│   ├── database/          # Testes de banco de dados
│   ├── integration/       # Testes de integração
│   ├── validation/        # Testes de validação
│   └── setup.ts           # Configuração de testes
├── prisma/                # Schema e migrações
│   ├── schema.prisma
│   ├── dev.db            # Banco de desenvolvimento
│   └── test.db           # Banco de testes
├── jest.config.js         # Configuração Jest
└── package.json
```

## 🚀 **Início Rápido**

### **Pré-requisitos**
- Node.js 18+
- npm 8+

### **Instalação**
```bash
# Clone e navegue para o backend
cd backend

# Instale as dependências
npm install

# Configure o banco de dados
npm run db:generate
npm run db:migrate

# Popule com dados de exemplo (RECOMENDADO)
npm run db:seed

# Inicie o servidor de desenvolvimento
npm run dev
```

### **Servidor rodando em:**
- **API:** http://localhost:3001
- **Documentação:** http://localhost:3001/api-docs

### **🌱 Dados de Exemplo (Seed)**
O sistema inclui um seed completo com dados realistas:

```bash
npm run db:seed
```

**Dados criados:**
- **👤 2 Usuários:** admin@loja.com e gerente@loja.com (senha: admin123)
- **👥 10 Clientes** com CPF válido, telefone formatado
- **💰 135 Vendas** dos últimos 30 dias
- **🧸 Produtos:** Bonecas, carrinhos, Lego, pelúcias, jogos
- **💵 Total:** R$ 12.709,24 em vendas

## 🧪 **Sistema de Testes**

### **Estatísticas**
- **✅ 68 Testes Passando** (100% sucesso)
- **📊 72.67% Cobertura** de código
- **⚡ Execução Rápida** (~15 segundos)

### **Categorias de Testes**
| Categoria | Testes | Descrição |
|-----------|--------|-----------|
| **Validação** | 21 | CPF, email, telefone, formatação |
| **Autenticação** | 12 | JWT, bcrypt, login, registro |
| **Controladores** | 15 | CRUD clientes, vendas, estatísticas |
| **Banco de Dados** | 8 | Schema, relacionamentos, constraints |
| **Integração** | 12 | Fluxos completos end-to-end |

### **Executar Testes**
```bash
# Todos os testes
npm test

# Com cobertura detalhada
npm run test:coverage

# Testes específicos
npm test -- tests/auth/           # Autenticação
npm test -- tests/controllers/    # Controladores
npm test -- tests/validation/     # Validações
npm test -- tests/integration/    # Integração

# Modo watch para desenvolvimento
npm test -- --watch
```

## 📋 **API Endpoints**

### **🔐 Autenticação**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

### **👥 Clientes**
```http
# Listar clientes (paginado)
GET /api/clientes?page=1&limit=10&search=João
Authorization: Bearer <token>

# Buscar cliente específico
GET /api/clientes/:id
Authorization: Bearer <token>

# Criar cliente
POST /api/clientes
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Maria Santos",
  "email": "maria@example.com",
  "nascimento": "1985-05-15",
  "telefone": "11999999999",
  "cpf": "11144477735"
}

# Atualizar cliente
PUT /api/clientes/:id
Authorization: Bearer <token>
Content-Type: application/json

# Excluir cliente (soft delete)
DELETE /api/clientes/:id
Authorization: Bearer <token>
```

### **💰 Vendas**
```http
# Listar vendas
GET /api/vendas
Authorization: Bearer <token>

# Criar venda
POST /api/vendas
Authorization: Bearer <token>
Content-Type: application/json

{
  "valor": 299.99,
  "data": "2024-01-15",
  "clienteId": "cliente-uuid"
}

# Estatísticas gerais
GET /api/vendas/estatisticas
Authorization: Bearer <token>

# Vendas por dia
GET /api/vendas/por-dia
Authorization: Bearer <token>
```

## 🔍 **Validações Implementadas**

### **CPF Brasileiro**
```typescript
// Algoritmo completo com dígitos verificadores
validateCPF("111.444.777-35") // ✅ true
validateCPF("111.111.111-11") // ❌ false (dígitos repetidos)
validateCPF("123.456.789-00") // ❌ false (dígitos inválidos)

// Formatação automática
formatCPF("11144477735") // "111.444.777-35"
```

### **Telefone Brasileiro**
```typescript
// Suporte para 10 e 11 dígitos
formatPhone("11999999999") // "(11) 99999-9999"
formatPhone("1133334444")  // "(11) 3333-4444"
```

### **Email RFC-Compliant**
```typescript
validateEmail("user@domain.com")     // ✅ true
validateEmail("user+tag@domain.co.uk") // ✅ true
validateEmail("invalid-email")       // ❌ false
```

## 🗄️ **Banco de Dados**

### **Schema Prisma**
```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Cliente {
  id         String    @id @default(cuid())
  nome       String
  email      String    @unique
  nascimento DateTime
  telefone   String?
  cpf        String?
  vendas     Venda[]
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  deletedAt  DateTime?
}

model Venda {
  id        String   @id @default(cuid())
  valor     Float
  data      DateTime
  cliente   Cliente  @relation(fields: [clienteId], references: [id])
  clienteId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### **Comandos do Banco**
```bash
# Gerar cliente Prisma
npm run db:generate

# Executar migrações
npm run db:migrate

# Reset do banco
npm run db:reset

# Interface visual (Prisma Studio)
npm run db:studio
```

## 🔧 **Scripts Disponíveis**

```bash
# Desenvolvimento
npm run dev          # Servidor com hot reload
npm run build        # Build para produção
npm run start        # Servidor de produção

# Banco de dados
npm run db:generate  # Gera cliente Prisma
npm run db:migrate   # Executa migrações
npm run db:studio    # Interface visual
npm run db:reset     # Reset completo

# Testes
npm test            # Todos os testes
npm run test:coverage # Com cobertura
npm run test:watch   # Modo watch

# Qualidade de código
npm run lint         # Verificar código
npm run lint:fix     # Corrigir automaticamente
npm run type-check   # Verificar tipos TypeScript
```

## 🔒 **Segurança**

### **Autenticação JWT**
- Tokens com expiração de 24 horas
- Algoritmo HS256 para assinatura
- Middleware de validação em rotas protegidas

### **Hash de Senhas**
- bcryptjs com salt rounds = 10
- Senhas nunca armazenadas em texto plano

### **Validação de Entrada**
- Sanitização de dados de entrada
- Validação de tipos e formatos
- Prevenção de SQL injection (Prisma ORM)

## 📊 **Monitoramento**

### **Logs**
- Logs estruturados para desenvolvimento
- Rastreamento de erros e performance
- Logs de autenticação e acesso

### **Métricas**
- Tempo de resposta das APIs
- Taxa de sucesso/erro
- Uso de recursos

## 🚀 **Deploy**

### **Variáveis de Ambiente**
```env
# .env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
NODE_ENV=production
```

### **Build para Produção**
```bash
npm run build
npm start
```

## 🤝 **Contribuição**

1. Siga os padrões de commit convencionais
2. Inclua testes para novas funcionalidades
3. Mantenha a cobertura de testes acima de 70%
4. Use TypeScript com tipagem forte
5. Execute `npm run lint:fix` antes do commit

---

<div align="center">

**🔧 Backend robusto e testado para o Reino dos Brinquedos**

[![Tests](https://img.shields.io/badge/Tests-68%20Passing-brightgreen)](.)
[![Coverage](https://img.shields.io/badge/Coverage-72.67%25-yellow)](.)

</div>
