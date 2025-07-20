import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Reino dos Brinquedos API',
      version: '1.0.0',
      description: `
# 🧸 API do Sistema de Gestão - Reino dos Brinquedos

Uma API RESTful moderna para gestão completa de loja de brinquedos, desenvolvida com Node.js, TypeScript e Prisma.

## 🚀 Características Principais

- **Autenticação JWT** - Sistema seguro de autenticação e autorização
- **CRUD Completo** - Operações completas para clientes e vendas
- **Validação Robusta** - Validação de CPF, email, telefone e dados pessoais
- **Soft Delete** - Preservação de histórico com exclusão lógica
- **Performance Otimizada** - Queries otimizadas e paginação eficiente
- **TypeScript** - Type safety e melhor experiência de desenvolvimento

## 🔐 Autenticação

Todas as rotas (exceto login) requerem autenticação via Bearer Token:

\`\`\`
Authorization: Bearer <seu-jwt-token>
\`\`\`

## 📊 Códigos de Status

- **200** - Sucesso
- **201** - Criado com sucesso  
- **400** - Erro de validação
- **401** - Não autorizado
- **403** - Token inválido
- **404** - Recurso não encontrado
- **500** - Erro interno do servidor

## 🧪 Ambiente de Teste

- **Base URL:** \`http://localhost:3001/api\`
- **Usuário de teste:** admin@loja.com
- **Senha de teste:** admin123
      `,
      contact: {
        name: 'Reino dos Brinquedos - Suporte Técnico',
        email: 'suporte@reinodosbrinquedos.com',
        url: 'https://github.com/zaairaag/Avantsoft'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api.reinodosbrinquedos.com/api',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido através do endpoint de login'
        }
      },
      schemas: {
        Cliente: {
          type: 'object',
          required: ['nome', 'email', 'nascimento'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único do cliente (CUID)',
              example: 'clh7x8y9z0000abc123def456'
            },
            nome: {
              type: 'string',
              description: 'Nome completo do cliente',
              example: 'Maria Silva Santos',
              minLength: 2,
              maxLength: 100
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único do cliente',
              example: 'maria.silva@email.com'
            },
            nascimento: {
              type: 'string',
              format: 'date',
              description: 'Data de nascimento do cliente',
              example: '1990-05-15'
            },
            telefone: {
              type: 'string',
              description: 'Telefone formatado do cliente (opcional)',
              example: '(11) 99999-9999',
              pattern: '^\\([0-9]{2}\\) [0-9]{4,5}-[0-9]{4}$'
            },
            cpf: {
              type: 'string',
              description: 'CPF do cliente sem formatação (opcional)',
              example: '12345678901',
              pattern: '^[0-9]{11}$'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização'
            },
            deletedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Data de exclusão lógica (null se ativo)'
            }
          }
        },
        ClienteInput: {
          type: 'object',
          required: ['nome', 'email', 'nascimento'],
          properties: {
            nome: {
              type: 'string',
              description: 'Nome completo do cliente',
              example: 'João Silva',
              minLength: 2,
              maxLength: 100
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único do cliente',
              example: 'joao.silva@email.com'
            },
            nascimento: {
              type: 'string',
              format: 'date',
              description: 'Data de nascimento (YYYY-MM-DD)',
              example: '1985-03-20'
            },
            telefone: {
              type: 'string',
              description: 'Telefone do cliente (será formatado automaticamente)',
              example: '11999999999'
            },
            cpf: {
              type: 'string',
              description: 'CPF do cliente (com ou sem formatação)',
              example: '123.456.789-01'
            }
          }
        },
        Venda: {
          type: 'object',
          required: ['valor', 'data', 'clienteId'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único da venda',
              example: 'clh7x8y9z0000xyz789abc123'
            },
            valor: {
              type: 'number',
              format: 'float',
              description: 'Valor da venda em reais',
              example: 299.99,
              minimum: 0.01
            },
            data: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora da venda',
              example: '2025-07-20T15:30:00.000Z'
            },
            clienteId: {
              type: 'string',
              description: 'ID do cliente que realizou a compra',
              example: 'clh7x8y9z0000abc123def456'
            },
            cliente: {
              $ref: '#/components/schemas/Cliente'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização'
            }
          }
        },
        VendaInput: {
          type: 'object',
          required: ['valor', 'data', 'clienteId'],
          properties: {
            valor: {
              type: 'number',
              format: 'float',
              description: 'Valor da venda em reais',
              example: 150.50,
              minimum: 0.01
            },
            data: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora da venda (ISO 8601)',
              example: '2025-07-20T12:00:00.000Z'
            },
            clienteId: {
              type: 'string',
              description: 'ID do cliente que realizou a compra',
              example: 'clh7x8y9z0000abc123def456'
            }
          }
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'admin@loja.com'
            },
            password: {
              type: 'string',
              description: 'Senha do usuário',
              example: 'admin123',
              minLength: 6
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Token JWT para autenticação',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: 'clh7x8y9z0000user123456'
                },
                name: {
                  type: 'string',
                  example: 'Administrador'
                },
                email: {
                  type: 'string',
                  example: 'admin@loja.com'
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro',
              example: 'Email já cadastrado'
            }
          }
        },
        PaginatedClientes: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Cliente'
              }
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1
                },
                limit: {
                  type: 'integer',
                  example: 10
                },
                total: {
                  type: 'integer',
                  example: 25
                },
                totalPages: {
                  type: 'integer',
                  example: 3
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Caminhos para os arquivos com anotações
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #FF6B9D; }
      .swagger-ui .scheme-container { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    `,
    customSiteTitle: "Reino dos Brinquedos API",
    customfavIcon: "/favicon.ico"
  }));

  // JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log('📚 Swagger UI disponível em: http://localhost:3001/api-docs');
};
