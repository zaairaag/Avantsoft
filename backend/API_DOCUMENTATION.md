# 🧸 Reino dos Brinquedos - Documentação da API

## 📚 **Acesso à Documentação Interativa**

### 🌐 **Swagger UI (Recomendado)**
```
URL: http://localhost:3001/api-docs
```

**Características:**
- ✅ **Interface interativa** - Teste endpoints diretamente no navegador
- ✅ **Exemplos práticos** - Requests e responses de exemplo
- ✅ **Autenticação integrada** - Sistema de Bearer Token
- ✅ **Validação em tempo real** - Schemas e tipos documentados
- ✅ **Exportação** - Download da especificação OpenAPI

### 📄 **Especificação OpenAPI JSON**
```
URL: http://localhost:3001/api-docs.json
```

## 🚀 **Início Rápido**

### **1. Autenticação**
```bash
# Login para obter token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@loja.com",
    "password": "admin123"
  }'
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clh7x8y9z0000user123456",
    "name": "Administrador",
    "email": "admin@loja.com"
  }
}
```

### **2. Usar Token nas Requisições**
```bash
# Todas as outras rotas requerem o token
curl -X GET http://localhost:3001/api/clientes \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 📋 **Endpoints Principais**

### **🔐 Autenticação**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/auth/login` | Login no sistema |

### **👥 Clientes**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/clientes` | Listar clientes (com paginação) |
| `POST` | `/api/clientes` | Criar novo cliente |
| `GET` | `/api/clientes/{id}` | Obter cliente específico |
| `PUT` | `/api/clientes/{id}` | Atualizar cliente |
| `DELETE` | `/api/clientes/{id}` | Deletar cliente (soft delete) |

### **💰 Vendas**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/vendas` | Listar todas as vendas |
| `POST` | `/api/vendas` | Registrar nova venda |
| `GET` | `/api/vendas/estatisticas` | Estatísticas de performance |
| `GET` | `/api/vendas/por-dia` | Vendas agrupadas por dia |

## 🧪 **Exemplos Práticos**

### **Criar Cliente**
```bash
curl -X POST http://localhost:3001/api/clientes \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva Santos",
    "email": "maria.silva@email.com",
    "nascimento": "1990-05-15",
    "telefone": "11999999999",
    "cpf": "12345678901"
  }'
```

### **Buscar Clientes**
```bash
# Com busca e paginação
curl "http://localhost:3001/api/clientes?search=Maria&page=1&limit=10" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### **Registrar Venda**
```bash
curl -X POST http://localhost:3001/api/vendas \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "valor": 299.99,
    "data": "2025-07-20T12:00:00.000Z",
    "clienteId": "clh7x8y9z0000abc123def456"
  }'
```

## 📊 **Códigos de Status**

| Código | Significado | Quando Ocorre |
|--------|-------------|---------------|
| `200` | ✅ Sucesso | Operação realizada com sucesso |
| `201` | ✅ Criado | Recurso criado com sucesso |
| `204` | ✅ Sem Conteúdo | Deletado com sucesso |
| `400` | ❌ Dados Inválidos | Validação falhou |
| `401` | ❌ Não Autorizado | Token ausente ou inválido |
| `403` | ❌ Proibido | Token expirado |
| `404` | ❌ Não Encontrado | Recurso não existe |
| `500` | ❌ Erro Servidor | Erro interno |

## 🔧 **Validações e Regras**

### **Cliente**
- **Nome:** Obrigatório, 2-100 caracteres
- **Email:** Obrigatório, formato válido, único
- **Nascimento:** Obrigatório, formato YYYY-MM-DD
- **Telefone:** Opcional, formatado automaticamente
- **CPF:** Opcional, validação de dígitos verificadores

### **Venda**
- **Valor:** Obrigatório, maior que 0
- **Data:** Obrigatório, formato ISO 8601
- **ClienteId:** Obrigatório, cliente deve existir

## 🛠️ **Ferramentas de Desenvolvimento**

### **Postman Collection**
```bash
# Importar no Postman
URL: http://localhost:3001/api-docs.json
```

### **Insomnia**
```bash
# Importar especificação OpenAPI
URL: http://localhost:3001/api-docs.json
```

### **cURL Scripts**
```bash
# Testar conectividade
curl http://localhost:3001/health

# Testar autenticação
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@loja.com","password":"admin123"}'
```

## 🚨 **Troubleshooting**

### **Erro 401 - Não Autorizado**
```bash
# Verificar se o token está sendo enviado
curl -X GET http://localhost:3001/api/clientes \
  -H "Authorization: Bearer SEU_TOKEN_COMPLETO"
```

### **Erro 400 - Dados Inválidos**
- Verificar se todos os campos obrigatórios estão preenchidos
- Validar formato de email, CPF e telefone
- Conferir se o email não está duplicado

### **Erro 404 - Não Encontrado**
- Verificar se o ID do cliente/venda existe
- Confirmar se o recurso não foi deletado (soft delete)

## 📈 **Performance e Limites**

- **Rate Limiting:** Não implementado (desenvolvimento)
- **Paginação:** Máximo 100 itens por página
- **Timeout:** 30 segundos por requisição
- **Tamanho Máximo:** 10MB por request

## 🔒 **Segurança**

- **Autenticação:** JWT com expiração de 24h
- **HTTPS:** Recomendado para produção
- **Validação:** Sanitização de inputs
- **CORS:** Configurado para desenvolvimento

---

## 💡 **Dicas Profissionais**

1. **Use o Swagger UI** para explorar e testar a API interativamente
2. **Salve o token** após login para usar em outras requisições
3. **Verifique os exemplos** na documentação Swagger
4. **Use paginação** para listas grandes de clientes
5. **Implemente retry logic** para requisições que podem falhar

**🎯 A documentação completa e interativa está disponível em: http://localhost:3001/api-docs**
