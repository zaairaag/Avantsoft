# 🌐 Documentação da API - Reino dos Brinquedos

[![API](https://img.shields.io/badge/API-REST-blue?style=for-the-badge)](.)
[![Tests](https://img.shields.io/badge/Tests-68%20Passing-brightgreen?style=for-the-badge)](.)
[![Coverage](https://img.shields.io/badge/Coverage-72.67%25-yellow?style=for-the-badge)](.)

Documentação completa da API REST do Reino dos Brinquedos, incluindo todos os endpoints, exemplos de uso e códigos de resposta.

## 🔗 **Base URL**

```
http://localhost:3001/api
```

## 🔐 **Autenticação**

A API usa autenticação JWT (JSON Web Tokens). Inclua o token no header `Authorization`:

```http
Authorization: Bearer <seu-jwt-token>
```

### **Obter Token**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@loja.com",
  "password": "admin123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "name": "Administrador",
    "email": "admin@loja.com"
  }
}
```

## 📋 **Endpoints**

### **🔐 Autenticação**

#### **Registro de Usuário**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### **Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

### **👥 Clientes**

#### **Listar Clientes**
```http
GET /api/clientes?page=1&limit=10&search=João
Authorization: Bearer <token>
```

**Parâmetros de Query:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)
- `search` (opcional): Busca por nome ou email

**Resposta (200):**
```json
{
  "data": [
    {
      "id": "cliente-uuid",
      "nome": "João Silva",
      "email": "joao@example.com",
      "nascimento": "1990-01-01T00:00:00.000Z",
      "telefone": "(11) 99999-9999",
      "cpf": "111.444.777-35",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "deletedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### **Buscar Cliente por ID**
```http
GET /api/clientes/:id
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "id": "cliente-uuid",
  "nome": "João Silva",
  "email": "joao@example.com",
  "nascimento": "1990-01-01T00:00:00.000Z",
  "telefone": "(11) 99999-9999",
  "cpf": "111.444.777-35",
  "vendas": [
    {
      "id": "venda-uuid",
      "valor": 299.99,
      "data": "2024-01-15T00:00:00.000Z"
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### **Criar Cliente**
```http
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
```

**Resposta (201):**
```json
{
  "id": "cliente-uuid",
  "nome": "Maria Santos",
  "email": "maria@example.com",
  "nascimento": "1985-05-15T00:00:00.000Z",
  "telefone": "(11) 99999-9999",
  "cpf": "111.444.777-35",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "deletedAt": null
}
```

#### **Atualizar Cliente**
```http
PUT /api/clientes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Maria Santos Silva",
  "telefone": "11888888888"
}
```

**Resposta (200):**
```json
{
  "id": "cliente-uuid",
  "nome": "Maria Santos Silva",
  "email": "maria@example.com",
  "nascimento": "1985-05-15T00:00:00.000Z",
  "telefone": "(11) 88888-8888",
  "cpf": "111.444.777-35",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z",
  "deletedAt": null
}
```

#### **Excluir Cliente (Soft Delete)**
```http
DELETE /api/clientes/:id
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "message": "Cliente excluído com sucesso",
  "id": "cliente-uuid"
}
```

### **💰 Vendas**

#### **Listar Vendas**
```http
GET /api/vendas
Authorization: Bearer <token>
```

**Resposta (200):**
```json
[
  {
    "id": "venda-uuid",
    "valor": 299.99,
    "data": "2024-01-15T00:00:00.000Z",
    "cliente": {
      "id": "cliente-uuid",
      "nome": "João Silva",
      "email": "joao@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### **Criar Venda**
```http
POST /api/vendas
Authorization: Bearer <token>
Content-Type: application/json

{
  "valor": 150.00,
  "data": "2024-01-15",
  "clienteId": "cliente-uuid"
}
```

**Resposta (201):**
```json
{
  "id": "venda-uuid",
  "valor": 150.00,
  "data": "2024-01-15T00:00:00.000Z",
  "clienteId": "cliente-uuid",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### **Estatísticas de Vendas**
```http
GET /api/vendas/estatisticas
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "totalDia": 1500.00,
  "totalGeral": 25000.00,
  "quantidadeVendas": 150,
  "maiorVolume": {
    "cliente": "João Silva",
    "valor": 5000.00
  },
  "mediaVendas": 166.67,
  "crescimento": {
    "percentual": 15.5,
    "periodo": "último mês"
  }
}
```

#### **Vendas por Dia**
```http
GET /api/vendas/por-dia
Authorization: Bearer <token>
```

**Resposta (200):**
```json
[
  {
    "data": "2024-01-15",
    "total": 1500.00,
    "quantidade": 10
  },
  {
    "data": "2024-01-14",
    "total": 800.00,
    "quantidade": 5
  }
]
```

## ❌ **Códigos de Erro**

### **400 - Bad Request**
```json
{
  "error": "Dados inválidos",
  "details": [
    {
      "field": "email",
      "message": "Email deve ter um formato válido"
    },
    {
      "field": "cpf",
      "message": "CPF inválido"
    }
  ]
}
```

### **401 - Unauthorized**
```json
{
  "error": "Token inválido ou expirado"
}
```

### **403 - Forbidden**
```json
{
  "error": "Acesso negado"
}
```

### **404 - Not Found**
```json
{
  "error": "Cliente não encontrado"
}
```

### **409 - Conflict**
```json
{
  "error": "Email já cadastrado"
}
```

### **500 - Internal Server Error**
```json
{
  "error": "Erro interno do servidor"
}
```

## 🔍 **Validações**

### **CPF**
- Deve ser um CPF válido brasileiro
- Formatação automática: `111.444.777-35`
- Rejeita CPFs com dígitos repetidos

### **Email**
- Deve ter formato válido (RFC compliant)
- Deve ser único no sistema

### **Telefone**
- Suporte para 10 ou 11 dígitos
- Formatação automática: `(11) 99999-9999`

### **Valores**
- Devem ser números positivos
- Máximo 2 casas decimais

## 📊 **Rate Limiting**

- **Limite:** 100 requisições por minuto por IP
- **Headers de resposta:**
  - `X-RateLimit-Limit`: Limite total
  - `X-RateLimit-Remaining`: Requisições restantes
  - `X-RateLimit-Reset`: Timestamp do reset

## 🧪 **Testando a API**

### **cURL**
```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@loja.com","password":"admin123"}'

# Listar clientes
curl -X GET http://localhost:3001/api/clientes \
  -H "Authorization: Bearer <token>"
```

### **Postman**
1. Importe a collection: `docs/postman-collection.json`
2. Configure a variável `baseUrl`: `http://localhost:3001/api`
3. Execute o login para obter o token
4. Use o token nas demais requisições

---

<div align="center">

**🌐 API REST completa e documentada**

*Pronta para integração e desenvolvimento*

</div>
