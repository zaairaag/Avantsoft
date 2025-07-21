# 🚀 GUIA DE DEPLOY - AVANTSOFT CRM

## 🎯 DEPLOY RÁPIDO NA VERCEL (RECOMENDADO)

### **Passo 1: Preparar o Repositório**
```bash
git add .
git commit -m "feat: prepare for production deployment"
git push origin main
```

### **Passo 2: Deploy na Vercel**

1. **Acesse:** https://vercel.com
2. **Faça login** com sua conta GitHub
3. **Clique em:** "New Project"
4. **Selecione:** repositório `Avantsoft`
5. **Configure as variáveis de ambiente:**

```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=sua-chave-secreta-super-segura-aqui
NODE_ENV=production
```

6. **Clique em:** "Deploy"

### **Passo 3: Configurar Banco de Dados**

**Opção A - Vercel Postgres (Recomendado):**
1. No dashboard da Vercel, vá em "Storage"
2. Crie um "Postgres Database"
3. Copie a `DATABASE_URL` gerada
4. Cole nas variáveis de ambiente do projeto

**Opção B - Supabase (Gratuito):**
1. Acesse: https://supabase.com
2. Crie um novo projeto
3. Vá em Settings > Database
4. Copie a Connection String
5. Use como `DATABASE_URL`

### **Passo 4: Executar Migrações**

Após o deploy, execute as migrações:
```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## 🌐 OUTRAS OPÇÕES DE DEPLOY

### **🚂 Railway**
1. Acesse: https://railway.app
2. "Deploy from GitHub"
3. Selecione o repositório
4. Railway configura automaticamente

### **🎨 Render**
1. Acesse: https://render.com
2. "New Web Service"
3. Conecte o GitHub
4. Configure build commands:
   - Build: `npm run build`
   - Start: `npm start`

### **☁️ Heroku**
1. Instale Heroku CLI
2. `heroku create avantsoft-crm`
3. `git push heroku main`
4. Configure add-ons para PostgreSQL

---

## 🔧 CONFIGURAÇÕES IMPORTANTES

### **Variáveis de Ambiente Necessárias:**
```env
DATABASE_URL=sua-url-do-banco
JWT_SECRET=sua-chave-jwt-secreta
NODE_ENV=production
PORT=3000
```

### **Domínio Personalizado:**
- Na Vercel: Settings > Domains
- Adicione seu domínio
- Configure DNS conforme instruções

---

## 📊 MONITORAMENTO

### **Logs e Métricas:**
- **Vercel:** Dashboard > Functions > Logs
- **Railway:** Dashboard > Deployments > Logs
- **Render:** Dashboard > Logs

### **Performance:**
- **Vercel Analytics:** Automático
- **Google Analytics:** Adicione o código no frontend

---

## 🔒 SEGURANÇA

### **SSL/HTTPS:**
- ✅ Automático na Vercel, Railway e Render
- ✅ Certificados renovados automaticamente

### **Variáveis Sensíveis:**
- ✅ Nunca commite senhas no código
- ✅ Use variáveis de ambiente
- ✅ Gere JWT_SECRET forte: `openssl rand -base64 32`

---

## 🎉 RESULTADO FINAL

Após o deploy, você terá:
- ✅ **Frontend React** funcionando
- ✅ **Backend Node.js** com API
- ✅ **Banco PostgreSQL** configurado
- ✅ **SSL/HTTPS** automático
- ✅ **Domínio personalizado** (opcional)
- ✅ **CI/CD** automático via GitHub

**🔗 Seu CRM estará online e acessível 24/7!**
