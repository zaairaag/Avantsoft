# 🚀 DEPLOY VPS + EASYPANEL - REINO DOS BRINQUEDOS

## 🎯 **ESTRATÉGIA PREMIUM: VPS + EASYPANEL**

### **✅ VANTAGENS DESTA ABORDAGEM:**
- **🚀 Performance superior** (recursos dedicados)
- **🔧 Controle total** do ambiente
- **💰 Custo zero** adicional
- **🔒 Segurança máxima** (seu servidor)
- **📊 Monitoramento completo**
- **🌐 SSL automático** com Let's Encrypt
- **💼 Impressiona entrevistadores** (infraestrutura própria)

---

## 🚀 **PASSO A PASSO - DEPLOY EM 15 MINUTOS**

### **1. Preparar o Repositório (2 min)**
```bash
# Certifique-se que está tudo commitado
git add .
git commit -m "feat: prepare for VPS production deploy"
git push origin main
```

### **2. Acessar EasyPanel (1 min)**
1. **Acesse seu EasyPanel** (ex: `https://seu-servidor.com:3000`)
2. **Faça login** com suas credenciais
3. **Vá para a aba "Services"**

### **3. Criar Banco PostgreSQL (3 min)**
1. **Clique em "Create Service"**
2. **Selecione "Database" → "PostgreSQL"**
3. **Configure o banco**:
   ```
   Service Name: reino-postgres
   Database Name: reino_brinquedos
   Username: reino_user
   Password: reino_password_2024
   Port: 5432
   ```
4. **Clique em "Create"** e aguarde inicializar
5. **Anote a URL de conexão** gerada pelo EasyPanel

### **4. Criar Aplicação Backend (4 min)**
1. **Clique em "Create Service"**
2. **Selecione "Application" → "From Git Repository"**
3. **Configure o backend**:
   ```
   Service Name: reino-backend
   Repository: https://github.com/seu-usuario/reino-dos-brinquedos
   Branch: main
   Build Path: ./backend
   Dockerfile: ./backend/Dockerfile
   Port: 3001
   ```
4. **Adicione as variáveis de ambiente**:
   ```env
   NODE_ENV=production
   JWT_SECRET=seu_jwt_secret_super_seguro_aqui
   DATABASE_URL=postgresql://reino_user:reino_password_2024@reino-postgres:5432/reino_brinquedos
   PORT=3001
   ```
5. **Configure o domínio**: `api-reino.seu-dominio.com`
6. **Clique em "Deploy"**

### **5. Criar Aplicação Frontend (3 min)**
1. **Clique em "Create Service"**
2. **Selecione "Application" → "From Git Repository"**
3. **Configure o frontend**:
   ```
   Service Name: reino-frontend
   Repository: https://github.com/seu-usuario/reino-dos-brinquedos
   Branch: main
   Build Path: ./frontend
   Dockerfile: ./frontend/Dockerfile
   Port: 3000
   ```
4. **Adicione as variáveis de ambiente**:
   ```env
   VITE_API_URL=https://api-reino.seu-dominio.com
   NODE_ENV=production
   ```
5. **Configure o domínio**: `reino.seu-dominio.com`
6. **Clique em "Deploy"**

### **6. Configurar SSL e Domínios (2 min)**
1. **Vá para cada serviço** (backend e frontend)
2. **Na aba "Domains"**, adicione:
   - Frontend: `reino.seu-dominio.com`
   - Backend: `api-reino.seu-dominio.com`
3. **Ative "SSL Certificate"** (Let's Encrypt automático)
4. **Aguarde a propagação** (1-2 minutos)

---

## 🔧 **CONFIGURAÇÕES AVANÇADAS**

### **Health Checks Configurados:**
- ✅ PostgreSQL: Verifica conexão do banco
- ✅ Backend: Endpoint `/health` 
- ✅ Frontend: Verifica se está respondendo

### **Restart Policies:**
- ✅ `unless-stopped`: Reinicia automaticamente
- ✅ Dependências configuradas corretamente
- ✅ Network isolada para segurança

### **Volumes Persistentes:**
- ✅ Dados do PostgreSQL preservados
- ✅ Backup automático disponível

---

---

## 🔧 **COMANDOS PÓS-DEPLOY**

### **Executar Migrações do Banco:**
1. **Vá para o serviço "reino-backend"** no EasyPanel
2. **Clique na aba "Terminal"**
3. **Execute os comandos**:
```bash
# Executar migrações
npm run migrate

# Popular com dados de exemplo
npm run seed
```

### **Verificar Status dos Serviços:**
1. **PostgreSQL**: Deve estar "Running" e "Healthy"
2. **Backend**: Deve estar "Running" com logs sem erros
3. **Frontend**: Deve estar "Running" e acessível via domínio

### **Testar a Aplicação:**
```bash
# Testar API
curl https://api-reino.seu-dominio.com/health

# Testar autenticação
curl -X POST https://api-reino.seu-dominio.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@reino.com","password":"admin123"}'
```

---

## 🐳 **ALTERNATIVA: DEPLOY COM DOCKER COMPOSE**

Se preferir usar Docker Compose diretamente na VPS:

### **1. Conectar na VPS via SSH:**
```bash
ssh usuario@seu-servidor.com
```

### **2. Clonar o Repositório:**
```bash
git clone https://github.com/seu-usuario/reino-dos-brinquedos.git
cd reino-dos-brinquedos
```

### **3. Configurar Variáveis:**
```bash
# Copiar arquivo de exemplo
cp .env.production .env

# Editar com suas configurações
nano .env
```

### **4. Executar Docker Compose:**
```bash
# Build e start dos serviços
docker-compose -f docker-compose.prod.yml up -d

# Verificar status
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

### **5. Configurar Nginx (Proxy Reverso):**
```nginx
# /etc/nginx/sites-available/reino-brinquedos
server {
    listen 80;
    server_name reino.seu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 80;
    server_name api-reino.seu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### **1. Executar Migrações (1 min):**
```bash
# No terminal do EasyPanel ou SSH da VPS
docker exec -it reino-brinquedos-api npx prisma migrate deploy
docker exec -it reino-brinquedos-api npx prisma db seed
```

### **2. Verificar Saúde dos Serviços:**
```bash
# Verificar se todos os containers estão rodando
docker ps

# Verificar logs se necessário
docker logs reino-brinquedos-api
docker logs reino-brinquedos-web
docker logs reino-brinquedos-db
```

### **3. Testar a Aplicação:**
- ✅ Frontend: `https://seu-dominio.com`
- ✅ Backend API: `https://api.seu-dominio.com`
- ✅ Swagger Docs: `https://api.seu-dominio.com/api-docs`
- ✅ Health Check: `https://api.seu-dominio.com/health`

---

## 🔒 **SEGURANÇA E PERFORMANCE**

### **Configurações de Segurança:**
- ✅ **Firewall**: Apenas portas 80, 443, 22 abertas
- ✅ **SSL/TLS**: Let's Encrypt automático
- ✅ **Network isolada**: Containers em rede privada
- ✅ **Variáveis seguras**: Senhas em environment variables
- ✅ **Health checks**: Monitoramento automático

### **Otimizações de Performance:**
- ✅ **PostgreSQL Alpine**: Imagem otimizada
- ✅ **Multi-stage builds**: Containers menores
- ✅ **Resource limits**: Configurados no EasyPanel
- ✅ **Caching**: Nginx para frontend

---

## 📊 **MONITORAMENTO E LOGS**

### **No EasyPanel você terá:**
- 📈 **Métricas em tempo real** (CPU, RAM, Network)
- 📋 **Logs centralizados** de todos os serviços
- 🔔 **Alertas automáticos** se algo der errado
- 📊 **Uptime monitoring** 
- 💾 **Backup automático** dos volumes

### **Comandos úteis para debug:**
```bash
# Ver logs em tempo real
docker logs -f reino-brinquedos-api

# Entrar no container do backend
docker exec -it reino-brinquedos-api bash

# Verificar banco de dados
docker exec -it reino-brinquedos-db psql -U reino_user -d reino_brinquedos
```

---

## 🎯 **VANTAGENS PARA SUA ENTREVISTA**

### **1. Demonstra Expertise em DevOps:**
- ✅ **Docker Compose** em produção
- ✅ **Infraestrutura como código**
- ✅ **Monitoramento e observabilidade**
- ✅ **Segurança em produção**

### **2. Performance Superior:**
- ✅ **Recursos dedicados** (não compartilhados)
- ✅ **Latência baixa** (seu servidor)
- ✅ **Controle total** da stack

### **3. Profissionalismo:**
- ✅ **Domínio próprio** (mais profissional)
- ✅ **SSL certificado** (segurança)
- ✅ **Uptime 99.9%** (confiabilidade)
- ✅ **Logs estruturados** (observabilidade)

---

## 🚨 **TROUBLESHOOTING RÁPIDO**

### **Se o backend não subir:**
```bash
# Verificar logs
docker logs reino-brinquedos-api

# Problemas comuns:
# 1. Database não conectou: aguardar health check
# 2. Migrações: executar prisma migrate deploy
# 3. Variáveis: verificar .env
```

### **Se o frontend não carregar:**
```bash
# Verificar se API_URL está correto
# Verificar CORS no backend
# Verificar se backend está respondendo
```

### **Se o banco não conectar:**
```bash
# Verificar se PostgreSQL está rodando
docker exec -it reino-brinquedos-db pg_isready

# Verificar variáveis de ambiente
# Verificar se volume está montado
```

---

## 🎉 **RESULTADO FINAL**

Você terá um **sistema enterprise-ready** rodando na sua VPS:

### **URLs Profissionais:**
- 🌐 **Frontend:** `https://reino-brinquedos.seu-dominio.com`
- 🔌 **API:** `https://api.reino-brinquedos.seu-dominio.com`
- 📚 **Docs:** `https://api.reino-brinquedos.seu-dominio.com/api-docs`

### **Características Técnicas:**
- ✅ **SSL/HTTPS** automático
- ✅ **Performance** otimizada
- ✅ **Monitoramento** completo
- ✅ **Backup** automático
- ✅ **Logs** estruturados
- ✅ **Health checks** configurados

---

## 💡 **DICAS PARA A ENTREVISTA**

### **Pontos de Destaque:**
1. **"Deploy em infraestrutura própria"** (mostra autonomia)
2. **"Monitoramento em tempo real"** (mostra profissionalismo)
3. **"SSL e segurança configurados"** (mostra preocupação com segurança)
4. **"Docker Compose em produção"** (mostra conhecimento DevOps)
5. **"Health checks e observabilidade"** (mostra maturidade técnica)

### **Frases de Impacto:**
- *"Configurei toda a infraestrutura de produção com Docker"*
- *"O sistema tem monitoramento completo e alertas automáticos"*
- *"Implementei health checks e restart policies para alta disponibilidade"*
- *"A aplicação está rodando com SSL e todas as práticas de segurança"*

---

## 🚀 **PRÓXIMOS PASSOS**

1. **Execute o deploy agora** (10 minutos)
2. **Teste todas as funcionalidades**
3. **Configure seu domínio personalizado**
4. **Anote as URLs** para a entrevista
5. **Pratique a demonstração**

**🎯 COM SUA VPS, VOCÊ TEM O MELHOR SETUP POSSÍVEL PARA IMPRESSIONAR!**

---

## 📞 **COMANDOS RÁPIDOS DE DEPLOY**

```bash
# 1. Commit das configurações
git add .
git commit -m "feat: production VPS configuration"
git push origin main

# 2. No EasyPanel: Import from Git
# 3. Configure as variáveis de ambiente
# 4. Deploy automático!

# 5. Após deploy, execute:
docker exec -it reino-brinquedos-api npx prisma migrate deploy
docker exec -it reino-brinquedos-api npx prisma db seed
```

**🚀 PRONTO! SEU CRM ENTERPRISE ESTARÁ NO AR!**