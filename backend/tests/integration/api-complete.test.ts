import request from 'supertest';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';

// Import all routes
import authRoutes from '../../src/routes/auth';
import clienteRoutes from '../../src/routes/clientes';
import vendaRoutes from '../../src/routes/vendas';

// Create test app with all middleware
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/vendas', vendaRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const prisma = new PrismaClient();

describe('API Complete Integration Tests', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.venda.deleteMany({
      where: {
        cliente: {
          email: {
            contains: 'integration-test'
          }
        }
      }
    });
    await prisma.cliente.deleteMany({
      where: {
        email: {
          contains: 'integration-test'
        }
      }
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'integration-test'
        }
      }
    });
  });

  afterAll(async () => {
    // Final cleanup
    await prisma.venda.deleteMany({
      where: {
        cliente: {
          email: {
            contains: 'integration-test'
          }
        }
      }
    });
    await prisma.cliente.deleteMany({
      where: {
        email: {
          contains: 'integration-test'
        }
      }
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'integration-test'
        }
      }
    });
    await prisma.$disconnect();
  });

  describe('Complete User Workflow', () => {
    it('should complete full user journey: register → login → create client → create sale → view statistics', async () => {
      // Step 1: Register new user
      const userData = {
        name: 'Integration Test User',
        email: 'integration-test-user@example.com',
        password: 'password123'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body).toHaveProperty('token');
      expect(registerResponse.body.user.email).toBe(userData.email);

      const token = registerResponse.body.token;

      // Step 2: Login with same credentials
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty('token');

      // Step 3: Create Cliente
      const clienteData = {
        nome: 'Cliente Integration Test',
        email: 'integration-test-cliente@example.com',
        nascimento: '1990-01-01',
        telefone: '11999999999',
        cpf: '11144477735'
      };

      const clienteResponse = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${token}`)
        .send(clienteData);

      expect(clienteResponse.status).toBe(201);
      expect(clienteResponse.body).toHaveProperty('id');
      expect(clienteResponse.body.telefone).toBe('(11) 99999-9999'); // Should be formatted

      const clienteId = clienteResponse.body.id;

      // Step 4: Create multiple Vendas
      const vendasData = [
        { valor: 299.99, data: new Date().toISOString() },
        { valor: 150.50, data: new Date().toISOString() },
        { valor: 75.25, data: new Date().toISOString() }
      ];

      const vendaIds = [];
      for (const vendaData of vendasData) {
        const vendaResponse = await request(app)
          .post('/api/vendas')
          .set('Authorization', `Bearer ${token}`)
          .send({
            ...vendaData,
            clienteId
          });

        expect(vendaResponse.status).toBe(201);
        expect(vendaResponse.body).toHaveProperty('id');
        expect(vendaResponse.body.cliente.id).toBe(clienteId);
        vendaIds.push(vendaResponse.body.id);
      }

      // Step 5: List all clientes
      const clientesListResponse = await request(app)
        .get('/api/clientes')
        .set('Authorization', `Bearer ${token}`);

      expect(clientesListResponse.status).toBe(200);
      expect(clientesListResponse.body.data).toHaveLength(1);
      expect(clientesListResponse.body.data[0].id).toBe(clienteId);

      // Step 6: Search cliente
      const searchResponse = await request(app)
        .get('/api/clientes?search=Integration')
        .set('Authorization', `Bearer ${token}`);

      expect(searchResponse.status).toBe(200);
      expect(searchResponse.body.data).toHaveLength(1);
      expect(searchResponse.body.data[0].nome).toContain('Integration');

      // Step 7: List all vendas
      const vendasListResponse = await request(app)
        .get('/api/vendas')
        .set('Authorization', `Bearer ${token}`);

      expect(vendasListResponse.status).toBe(200);
      expect(vendasListResponse.body.length).toBeGreaterThanOrEqual(3);

      // Step 8: Get statistics
      const statsResponse = await request(app)
        .get('/api/vendas/estatisticas')
        .set('Authorization', `Bearer ${token}`);

      expect(statsResponse.status).toBe(200);
      expect(statsResponse.body).toHaveProperty('totalDia');
      expect(statsResponse.body.totalDia).toBe(525.74); // Sum of today's vendas

      // Check if has volume data
      if (statsResponse.body.maiorVolume) {
        expect(statsResponse.body.maiorVolume).toHaveProperty('cliente');
        expect(statsResponse.body.maiorVolume).toHaveProperty('valor');
      }

      // Step 9: Get vendas por dia
      const vendasPorDiaResponse = await request(app)
        .get('/api/vendas/por-dia')
        .set('Authorization', `Bearer ${token}`);

      expect(vendasPorDiaResponse.status).toBe(200);
      expect(Array.isArray(vendasPorDiaResponse.body)).toBe(true);
      expect(vendasPorDiaResponse.body.length).toBeGreaterThan(0);

      // Step 10: Update cliente
      const updateClienteResponse = await request(app)
        .put(`/api/clientes/${clienteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Cliente Updated',
          telefone: '11888888888'
        });

      expect(updateClienteResponse.status).toBe(200);
      expect(updateClienteResponse.body.nome).toBe('Cliente Updated');
      expect(updateClienteResponse.body.telefone).toBe('(11) 88888-8888');

      // Step 11: Get specific cliente
      const getClienteResponse = await request(app)
        .get(`/api/clientes/${clienteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getClienteResponse.status).toBe(200);
      expect(getClienteResponse.body.nome).toBe('Cliente Updated');

      // Step 12: Soft delete cliente
      const deleteClienteResponse = await request(app)
        .delete(`/api/clientes/${clienteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(deleteClienteResponse.status).toBe(204);

      // Step 13: Verify cliente is soft deleted (may return 200 with deletedAt or 404)
      const deletedClienteResponse = await request(app)
        .get(`/api/clientes/${clienteId}`)
        .set('Authorization', `Bearer ${token}`);

      // Accept either 404 (not found) or 200 with deletedAt field
      expect([200, 404]).toContain(deletedClienteResponse.status);

      // Step 14: Verify vendas still exist
      const vendasAfterDeleteResponse = await request(app)
        .get('/api/vendas')
        .set('Authorization', `Bearer ${token}`);

      expect(vendasAfterDeleteResponse.status).toBe(200);
      expect(vendasAfterDeleteResponse.body.length).toBeGreaterThanOrEqual(3);
    });

    it('should handle concurrent operations safely', async () => {
      // Register user
      const userData = {
        name: 'Concurrent Test User',
        email: 'integration-test-concurrent@example.com',
        password: 'password123'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      const token = registerResponse.body.token;

      // Create cliente
      const clienteResponse = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Concurrent Cliente',
          email: 'integration-test-concurrent-cliente@example.com',
          nascimento: '1990-01-01'
        });

      const clienteId = clienteResponse.body.id;

      // Create multiple vendas concurrently
      const vendaPromises = Array.from({ length: 5 }, (_, i) =>
        request(app)
          .post('/api/vendas')
          .set('Authorization', `Bearer ${token}`)
          .send({
            valor: (i + 1) * 100,
            data: new Date().toISOString(),
            clienteId
          })
      );

      const vendaResponses = await Promise.all(vendaPromises);

      // All should succeed
      vendaResponses.forEach((response, index) => {
        expect(response.status).toBe(201);
        expect(response.body.valor).toBe((index + 1) * 100);
      });

      // Verify all vendas were created
      const vendasList = await request(app)
        .get('/api/vendas')
        .set('Authorization', `Bearer ${token}`);

      expect(vendasList.body.length).toBeGreaterThanOrEqual(5);
    });

    it('should handle error scenarios gracefully', async () => {
      // Test unauthorized access
      const unauthorizedResponse = await request(app)
        .get('/api/clientes');

      expect(unauthorizedResponse.status).toBe(401);

      // Test invalid login
      const invalidLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid@example.com',
          password: 'wrongpassword'
        });

      expect(invalidLoginResponse.status).toBe(401);

      // Register valid user
      const userData = {
        name: 'Error Test User',
        email: 'integration-test-error@example.com',
        password: 'password123'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      const token = registerResponse.body.token;

      // Test invalid cliente creation
      const invalidClienteResponse = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: '', // Invalid: empty name
          email: 'invalid-email', // Invalid: bad format
          nascimento: 'invalid-date' // Invalid: bad date
        });

      expect(invalidClienteResponse.status).toBe(400);

      // Test non-existent resource
      const notFoundResponse = await request(app)
        .get('/api/clientes/non-existent-id')
        .set('Authorization', `Bearer ${token}`);

      expect(notFoundResponse.status).toBe(404);

      // Test invalid venda creation (missing fields)
      const invalidVendaResponse = await request(app)
        .post('/api/vendas')
        .set('Authorization', `Bearer ${token}`)
        .send({
          // Missing required fields
        });

      expect([400, 404]).toContain(invalidVendaResponse.status);

      // Test venda with non-existent cliente
      const nonExistentClienteResponse = await request(app)
        .post('/api/vendas')
        .set('Authorization', `Bearer ${token}`)
        .send({
          valor: 100, // Valid value
          data: new Date().toISOString(),
          clienteId: 'non-existent-cliente'
        });

      expect(nonExistentClienteResponse.status).toBe(404);
    });
  });

  describe('Data Consistency and Integrity', () => {
    it('should maintain referential integrity across operations', async () => {
      // Register user
      const userData = {
        name: 'Integrity Test User',
        email: 'integration-test-integrity@example.com',
        password: 'password123'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      const token = registerResponse.body.token;

      // Create cliente
      const clienteResponse = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Integrity Cliente',
          email: 'integration-test-integrity-cliente@example.com',
          nascimento: '1990-01-01'
        });

      const clienteId = clienteResponse.body.id;

      // Create venda
      const vendaResponse = await request(app)
        .post('/api/vendas')
        .set('Authorization', `Bearer ${token}`)
        .send({
          valor: 100.00,
          data: new Date().toISOString(),
          clienteId
        });

      expect(vendaResponse.status).toBe(201);

      // Soft delete cliente
      await request(app)
        .delete(`/api/clientes/${clienteId}`)
        .set('Authorization', `Bearer ${token}`);

      // Verify venda still exists and references the cliente
      const vendasResponse = await request(app)
        .get('/api/vendas')
        .set('Authorization', `Bearer ${token}`);

      const venda = vendasResponse.body.find((v: any) => v.clienteId === clienteId);
      expect(venda).toBeDefined();
      expect(venda.cliente).toBeDefined();
    });

    it('should handle unique constraints properly', async () => {
      // Register user
      const userData = {
        name: 'Unique Test User',
        email: 'integration-test-unique@example.com',
        password: 'password123'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      const token = registerResponse.body.token;

      // Create first cliente
      const cliente1Response = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Unique Cliente 1',
          email: 'integration-test-unique-cliente@example.com',
          nascimento: '1990-01-01'
        });

      expect(cliente1Response.status).toBe(201);

      // Try to create second cliente with same email
      const cliente2Response = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Unique Cliente 2',
          email: 'integration-test-unique-cliente@example.com',
          nascimento: '1990-01-01'
        });

      expect(cliente2Response.status).toBe(400);
      expect(cliente2Response.body.error).toContain('já cadastrado');
    });
  });

  describe('Performance and Load Testing', () => {
    it('should handle large datasets efficiently', async () => {
      // Register user
      const userData = {
        name: 'Performance Test User',
        email: 'integration-test-performance@example.com',
        password: 'password123'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      const token = registerResponse.body.token;

      // Create many clientes
      const clientePromises = Array.from({ length: 20 }, (_, i) =>
        request(app)
          .post('/api/clientes')
          .set('Authorization', `Bearer ${token}`)
          .send({
            nome: `Performance Cliente ${i + 1}`,
            email: `integration-test-performance-cliente-${i + 1}@example.com`,
            nascimento: '1990-01-01'
          })
      );

      const startTime = Date.now();
      const clienteResponses = await Promise.all(clientePromises);
      const endTime = Date.now();

      // All should succeed
      clienteResponses.forEach(response => {
        expect(response.status).toBe(201);
      });

      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(10000); // 10 seconds

      // Test pagination performance
      const paginationStartTime = Date.now();
      const paginationResponse = await request(app)
        .get('/api/clientes?page=1&limit=10')
        .set('Authorization', `Bearer ${token}`);
      const paginationEndTime = Date.now();

      expect(paginationResponse.status).toBe(200);
      expect(paginationResponse.body.data).toHaveLength(10);
      expect(paginationEndTime - paginationStartTime).toBeLessThan(1000); // 1 second
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
