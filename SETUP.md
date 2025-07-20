# 🛠️ Guia de Setup - Loja de Brinquedos

## Configuração Rápida (5 minutos)

### 1. Pré-requisitos
```bash
# Verificar versões necessárias
node --version    # >= 18.0.0
docker --version  # >= 20.0.0
git --version     # >= 2.0.0
```

### 2. Clone e Setup
```bash
git clone <url-do-repositorio>
cd loja-brinquedos

# Opção A: Docker (Recomendado)
docker-compose up -d
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed

# Opção B: Local
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm install && npm run dev

# Terminal 3 - PostgreSQL
docker run --name postgres-loja -e POSTGRES_PASSWORD=loja_pass -p 5432:5432 -d postgres:15
```

### 3. Verificar funcionamento
- Frontend: http://localhost:3000
- Backend: http://localhost:3001/health
- Login: admin@loja.com / admin123

## Resolução de Problemas

### Docker
```bash
# Resetar completamente
docker-compose down -v
docker-compose up -d --build

# Ver logs
docker-compose logs backend
docker-compose logs frontend
```

### Banco de dados
```bash
# Resetar migrations
cd backend
rm -rf prisma/migrations
npm run db:migrate
npm run db:seed
```

### Frontend não conecta ao backend
```bash
# Verificar variável de ambiente
cat frontend/.env
# Deve conter: VITE_API_URL=http://localhost:3001/api

# Verificar se backend está rodando
curl http://localhost:3001/health
```

## Comandos Úteis

### Desenvolvimento
```bash
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