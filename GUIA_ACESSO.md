# 🚀 Guia de Acesso - Reino dos Brinquedos

## 📱 **Acesso Rápido**

### 🌐 **URLs da Aplicação**
- **Frontend (Interface):** http://localhost:5174
- **Backend (API):** http://localhost:3001
- **Health Check:** http://localhost:3001/health

### 🔐 **Credenciais de Login**
```
Email: admin@loja.com
Senha: admin123
```

## 🎯 **Como Acessar**

### **1. Verificar se os Serviços Estão Rodando**
```bash
# Backend deve estar rodando na porta 3001
# Frontend deve estar rodando na porta 5180
```

### **2. Acessar a Aplicação**
1. Abra o navegador
2. Acesse: **http://localhost:5174**
3. Faça login com as credenciais acima
4. Navegue pelo sistema!

## 🧭 **Navegação no Sistema**

### **📋 Menu Principal**
- **🏠 Dashboard** - Visão geral e estatísticas
- **👨‍👩‍👧‍👦 Famílias & Crianças** - Gestão de clientes
- **💰 Vendas & Pedidos** - Controle de vendas
- **⚙️ Configurações** - Preferências do sistema

### **🔧 Funcionalidades Principais**

#### **Gestão de Clientes:**
- ✅ **Adicionar Cliente** - Botão "✨ Novo Cliente"
- ✅ **Editar Cliente** - Ícone de lápis na tabela
- ✅ **Deletar Cliente** - Ícone de lixeira na tabela
- ✅ **Buscar Cliente** - Campo de busca automática
- ✅ **Testar Sistema** - Botão "🔧 Testar Sistema"

#### **Campos do Cliente:**
- **Nome** (obrigatório)
- **Email** (obrigatório, único)
- **Data de Nascimento** (obrigatório)
- **Telefone** (opcional, formatado)
- **CPF** (opcional, validado)

## 🎨 **Interface da Aplicação**

### **🎭 Tema e Cores**
- **Tema Principal:** Rosa e roxo (tema de brinquedos)
- **Modo Escuro/Claro:** Disponível nas configurações
- **Responsivo:** Funciona em desktop e mobile

### **🔔 Recursos Avançados**
- **Central de Notificações** - Sino no header
- **Busca Global** - Pressione `Ctrl+K`
- **Central de Suporte** - Menu do usuário
- **Configurações Personalizadas** - Menu do usuário

## 🧪 **Testando o Sistema**

### **1. Teste de Conectividade**
- Clique em "🔧 Testar Sistema" na página de clientes
- Aguarde os resultados dos testes
- Deve mostrar "✅ Todos os testes passaram!"

### **2. Teste Manual - Adicionar Cliente**
1. Vá para "Famílias & Crianças"
2. Clique em "✨ Novo Cliente"
3. Preencha os dados:
   ```
   Nome: João Silva
   Email: joao.silva@email.com
   Nascimento: 01/01/1990
   Telefone: (11) 99999-9999
   CPF: 111.444.777-35
   ```
4. Clique em "Salvar"
5. Verifique se aparece na lista

### **3. Teste de Busca**
1. Digite "João" no campo de busca
2. Aguarde 500ms (busca automática)
3. Deve filtrar os resultados

## 🔍 **Resolução de Problemas**

### **❌ Não Consegue Acessar o Frontend**
```bash
# Verificar se está rodando
curl http://localhost:5180

# Se não estiver, iniciar:
cd frontend
npm run dev
```

### **❌ Erro de Login**
```bash
# Verificar se backend está rodando
curl http://localhost:3001/health

# Se não estiver, iniciar:
cd backend
npm run dev
```

### **❌ Erro ao Criar Cliente**
- Verifique se todos os campos obrigatórios estão preenchidos
- Use um email único (não cadastrado)
- Use um CPF válido se preenchido
- Clique em "🔧 Testar Sistema" para diagnóstico

### **❌ Banco de Dados**
```bash
# Verificar se existe o arquivo
ls backend/dev.db

# Se não existir, executar:
cd backend
npm run db:migrate
npm run db:seed
```

## 📊 **Dados de Teste Disponíveis**

### **👥 Clientes Pré-cadastrados:**
- Ana Beatriz (ana.b@example.com)
- Carlos Eduardo (cadu@example.com)
- Maria Silva (maria.silva@email.com)
- João Santos (joao.santos@email.com)
- Lucia Oliveira (lucia.oliveira@email.com)

### **💰 Vendas:**
- 54 vendas distribuídas nos últimos 30 dias
- Valores entre R$ 50 e R$ 550
- Relacionadas aos clientes cadastrados

## 🎯 **Próximos Passos**

1. **Explore o Dashboard** - Veja estatísticas e gráficos
2. **Teste todas as operações CRUD** - Criar, editar, deletar clientes
3. **Configure suas preferências** - Menu do usuário → Configurações
4. **Use a busca global** - Pressione Ctrl+K
5. **Explore as notificações** - Clique no sino

## 🆘 **Suporte**

Se encontrar problemas:
1. Use o botão "🔧 Testar Sistema"
2. Verifique os logs do backend no terminal
3. Acesse a Central de Suporte no menu do usuário
4. Verifique se todos os serviços estão rodando

---

**🎉 Divirta-se explorando o Reino dos Brinquedos!** 🧸✨
