# 🏪 Loja de Brinquedos - Sistema de Gestão

Sistema web completo para gestão administrativa de loja de brinquedos, oferecendo controle total sobre clientes, vendas e estatísticas do negócio.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## ✨ Funcionalidades

### 📊 Dashboard Administrativo
- Estatísticas em tempo real de vendas e clientes
- Gráficos interativos com dados mensais
- Indicadores de performance do negócio

### 👥 Gestão de Clientes
- CRUD completo com paginação e filtros
- Soft delete para preservar histórico
- Validação de CPF e dados pessoais
- Histórico de compras por cliente

### 💰 Controle de Vendas
- Registro e acompanhamento de vendas
- Relacionamento com clientes
- Relatórios e análises de performance

### 🔐 Sistema de Autenticação
- Login seguro com JWT
- Proteção de rotas administrativas
- Controle de sessão

## 🚀 Início Rápido (5 minutos)

### Pré-requisitos
```bash
node --version    # >= 18.0.0
docker --version  # >= 20.0.0
```

### Instalação
```bash
# Clone o repositório
git clone https://github.com/zaairaag/Avantsoft.git
cd Avantsoft

# Execute com Docker (recomendado)
docker-compose up -d

# Aguarde os containers subirem e acesse:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### Login Padrão
- **Email:** `admin@loja.com`
- **Senha:** `admin123`

## 🛠️ Tecnologias

### Backend
- **Node.js** + TypeScript
- **Express.js** para APIs REST
- **Prisma ORM** + PostgreSQL
- **JWT** para autenticação
- **Jest** para testes automatizados

### Frontend
- **React 19** + TypeScript
- **Material-UI** para interface moderna
- **Recharts** para gráficos
- **Axios** para comunicação com APIs
- **React Router** para navegação

### DevOps
- **Docker** + Docker Compose
- **GitHub Actions** para CI/CD
- **ESLint** + Prettier para qualidade
- **Nginx** para produção

## 📁 Estrutura do Projeto

```
Avantsoft/
├── backend/              # API Node.js + TypeScript
│   ├── src/
│   │   ├── controllers/  # Controladores das rotas
│   │   ├── routes/       # Definição das rotas
│   │   ├── middleware/   # Middlewares customizados
│   │   ├── utils/        # Utilitários e validadores
│   │   └── __tests__/    # Testes automatizados
│   ├── prisma/           # Schema e migrations
│   └── Dockerfile
├── frontend/             # React + Material-UI
│   ├── src/
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── contexts/     # Contextos React
│   │   └── services/     # Serviços e APIs
│   └── Dockerfile
├── .github/              # CI/CD workflows
├── docker-compose.yml    # Configuração Docker
└── SETUP.md             # Guia detalhado de instalação
```

## 🔧 Desenvolvimento

### Executar localmente
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev

# Terminal 3 - PostgreSQL
docker run --name postgres-loja -e POSTGRES_PASSWORD=loja_pass -p 5432:5432 -d postgres:15
```

### Testes
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm run build
```

### Linting
```bash
# Corrigir código automaticamente
cd backend && npm run lint:fix
cd frontend && npm run lint:fix
```

## 🐳 Docker

### Desenvolvimento
```bash
docker-compose up -d
```

### Produção
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Comandos úteis
```bash
# Ver logs
docker-compose logs backend
docker-compose logs frontend

# Resetar completamente
docker-compose down -v
docker-compose up -d --build
```

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/register` - Registro de usuário

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Criar cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Remover cliente

### Vendas
- `GET /api/vendas` - Listar vendas
- `POST /api/vendas` - Criar venda
- `GET /api/vendas/stats` - Estatísticas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'feat: nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- 📖 Documentação completa: [SETUP.md](SETUP.md)
- 🐛 Reportar bugs: [Issues](https://github.com/zaairaag/Avantsoft/issues)
- 💬 Discussões: [Discussions](https://github.com/zaairaag/Avantsoft/discussions)

---

⭐ **Se este projeto te ajudou, deixe uma estrela!**
