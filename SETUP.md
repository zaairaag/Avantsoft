# 🚀 Guia Completo de Instalação - Reino dos Brinquedos

Este guia fornece instruções detalhadas para configurar o ambiente de desenvolvimento do Reino dos Brinquedos em diferentes sistemas operacionais.

## 📋 **Pré-requisitos**

### **Software Necessário**
- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm 8+** ou **yarn 1.22+** - Incluído com Node.js
- **Git** - [Download](https://git-scm.com/)
- **Editor de Código** - Recomendado: [VS Code](https://code.visualstudio.com/)

### **Verificar Instalações**
```bash
node --version    # Deve ser >= 18.0.0
npm --version     # Deve ser >= 8.0.0
git --version     # Qualquer versão recente
```

## 🔧 **Instalação Passo a Passo**

### **1. Clone o Repositório**
```bash
# HTTPS
git clone https://github.com/zaairaag/Avantsoft.git

# SSH (se configurado)
git clone git@github.com:zaairaag/Avantsoft.git

# Navegue para o diretório
cd Avantsoft
```

### **2. Configuração do Backend**
```bash
# Navegue para o backend
cd backend

# Instale as dependências
npm install

# Configure o banco de dados
npm run db:generate    # Gera o cliente Prisma
npm run db:migrate     # Executa migrações

# Inicie o servidor de desenvolvimento
npm run dev
```

**✅ Backend rodando em:** http://localhost:3001

### **3. Configuração do Frontend**
```bash
# Abra um novo terminal e navegue para o frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

**✅ Frontend rodando em:** http://localhost:5173

### **4. Verificação da Instalação**
```bash
# Terminal 1 - Backend (68 testes)
cd backend && npm test

# Terminal 2 - Frontend (21 testes)
cd frontend && npm test
```

## 🗄️ **Configuração do Banco de Dados**

### **SQLite (Padrão - Desenvolvimento)**
```bash
cd backend

# Gerar cliente Prisma
npm run db:generate

# Executar migrações
npm run db:migrate

# Visualizar dados (opcional)
npm run db:studio
```

### **PostgreSQL (Produção)**
```bash
# 1. Instalar PostgreSQL
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS (Homebrew)
brew install postgresql

# Windows - Download do site oficial

# 2. Criar banco de dados
createdb reino_brinquedos

# 3. Atualizar .env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/reino_brinquedos"

# 4. Executar migrações
npm run db:migrate
```

## 🔐 **Configuração de Ambiente**

### **Backend (.env)**
```env
# Banco de dados
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Servidor
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:5173"
```

### **Frontend (.env)**
```env
# API
VITE_API_URL=http://localhost:3001/api

# Aplicação
VITE_APP_NAME="Reino dos Brinquedos"
VITE_APP_VERSION="1.0.0"

# Ambiente
VITE_NODE_ENV=development
```

## 🧪 **Executar Testes**

### **Backend**
```bash
cd backend

# Todos os testes (68 testes)
npm test

# Com cobertura detalhada
npm run test:coverage

# Testes específicos
npm test -- tests/auth/           # Autenticação
npm test -- tests/controllers/    # Controladores
npm test -- tests/validation/     # Validações

# Modo watch para desenvolvimento
npm test -- --watch
```

### **Frontend**
```bash
cd frontend

# Todos os testes (21 testes)
npm test

# Com cobertura
npm run test:coverage

# Modo watch (desenvolvimento)
npm run test:watch

# Testes específicos
npm test -- src/components/    # Componentes
npm test -- src/services/      # Serviços
```

## 🔧 **Comandos de Desenvolvimento**

### **Backend**
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

# Qualidade
npm run lint         # Verificar código
npm run lint:fix     # Corrigir automaticamente
npm run type-check   # Verificar tipos
```

### **Frontend**
```bash
# Desenvolvimento
npm run dev          # Servidor com hot reload
npm run build        # Build para produção
npm run preview      # Preview da build

# Qualidade
npm run lint         # Verificar código
npm run lint:fix     # Corrigir automaticamente
npm run type-check   # Verificar tipos
npm run format       # Formatar com Prettier
```

## 🐛 **Solução de Problemas**

### **Erro: "Port 3001 already in use"**
```bash
# Encontrar processo usando a porta
lsof -i :3001

# Matar processo (substitua PID)
kill -9 <PID>

# Ou usar porta diferente
PORT=3002 npm run dev
```

### **Erro: "Module not found"**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Ou usar npm ci para instalação limpa
npm ci
```

### **Erro: "Database connection failed"**
```bash
# Verificar se o banco existe
npm run db:migrate

# Regenerar cliente Prisma
npm run db:generate

# Reset completo do banco
npm run db:reset
```

### **Erro: "Permission denied"**
```bash
# Linux/macOS - Corrigir permissões
sudo chown -R $USER:$USER .

# Windows - Executar como administrador
# Clique direito no terminal > "Executar como administrador"
```

## 🔄 **Atualizações**

### **Atualizar Dependências**
```bash
# Backend
cd backend
npm update

# Frontend
cd frontend
npm update

# Verificar dependências desatualizadas
npm outdated
```

### **Atualizar Banco de Dados**
```bash
cd backend

# Após mudanças no schema.prisma
npm run db:generate
npm run db:migrate
```

## 🚀 **Deploy**

### **Build para Produção**
```bash
# Backend
cd backend
npm run build
npm run start

# Frontend
cd frontend
npm run build
npm run preview
```

### **Variáveis de Produção**
```env
# Backend
NODE_ENV=production
DATABASE_URL="postgresql://..."
JWT_SECRET="production-secret-key"

# Frontend
VITE_API_URL=https://api.seudominio.com
VITE_NODE_ENV=production
```

## 📚 **Recursos Adicionais**

### **Extensões VS Code Recomendadas**
- **TypeScript** - Suporte nativo
- **Prisma** - Syntax highlighting para schema
- **ES7+ React/Redux/React-Native snippets** - Snippets React
- **Auto Rename Tag** - Renomear tags automaticamente
- **Bracket Pair Colorizer** - Colorir brackets
- **GitLens** - Melhor integração Git

### **Configuração VS Code**
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### **Scripts Úteis**
```json
// package.json (raiz)
{
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\"",
    "test": "concurrently \"cd backend && npm test\" \"cd frontend && npm test\"",
    "build": "cd backend && npm run build && cd ../frontend && npm run build",
    "install:all": "cd backend && npm install && cd ../frontend && npm install"
  }
}
```

## 🆘 **Suporte**

### **Problemas Comuns**
- **Porta ocupada:** Mude a porta ou mate o processo
- **Dependências:** Limpe node_modules e reinstale
- **Banco de dados:** Execute migrations e regenere cliente
- **Permissões:** Verifique permissões de arquivo

### **Onde Buscar Ajuda**
- **Issues:** [GitHub Issues](https://github.com/zaairaag/Avantsoft/issues)
- **Discussões:** [GitHub Discussions](https://github.com/zaairaag/Avantsoft/discussions)
- **Documentação:** README.md de cada módulo

---

<div align="center">

**🚀 Ambiente configurado com sucesso!**

*Agora você está pronto para desenvolver no Reino dos Brinquedos*

[![Tests](https://img.shields.io/badge/Tests-89%20Passing-brightgreen)](https://github.com/zaairaag/Avantsoft)
[![Coverage](https://img.shields.io/badge/Coverage-72.67%25-yellow)](https://github.com/zaairaag/Avantsoft)

</div>
# Testes
cd backend && npm test
cd frontend && npm run build

# Linting
cd backend && npm run lint:fix
cd frontend && npm run lint:fix

# Banco
cd backend && npm run db:studio  # Prisma Studio
```

### Produção
```bash
# Build completo
docker-compose -f docker-compose.prod.yml up -d

# Verificar saúde dos containers
docker-compose ps
```