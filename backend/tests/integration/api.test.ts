import request from 'supertest';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from '../../src/routes/auth';
import clienteRoutes from '../../src/routes/clientes';
import vendaRoutes from '../../src/routes/vendas';
import { testPrisma, cleanupDatabase, createTestUser } from '../setup';

// Create test app
const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/vendas', vendaRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

describe('API Integration Tests', () => {
  beforeEach(async () => {
    await cleanupDatabase();
    await createTestUser();
  });

  describe('Complete User Workflow', () => {
    it('should complete full user journey: login → create client → create sale', async () => {
      // Step 1: Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'test123'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty('token');

      const token = loginResponse.body.token;

      // Step 2: Create Cliente
      const clienteData = {
        nome: 'Integration Test Cliente',
        email: `integration.${Date.now()}@test.com`,
        nascimento: '1990-01-01',
        telefone: '11999999999',
        cpf: '12345678901'
      };

      const clienteResponse = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${token}`)
        .send(clienteData);

      expect(clienteResponse.status).toBe(201);
      expect(clienteResponse.body).toHaveProperty('id');
      expect(clienteResponse.body.telefone).toBe('(11) 99999-9999'); // Should be formatted

      const clienteId = clienteResponse.body.id;

      // Step 3: Create Venda
      const vendaData = {
        valor: 299.99,
        data: new Date().toISOString(),
        clienteId
      };

      const vendaResponse = await request(app)
        .post('/api/vendas')
        .set('Authorization', `Bearer ${token}`)
        .send(vendaData);

      expect(vendaResponse.status).toBe(201);
      expect(vendaResponse.body).toHaveProperty('id');
      expect(vendaResponse.body.valor).toBe(vendaData.valor);
      expect(vendaResponse.body.cliente.id).toBe(clienteId);

      // Step 4: Verify data integrity
      const clientesListResponse = await request(app)
        .get('/api/clientes')
        .set('Authorization', `Bearer ${token}`);

      expect(clientesListResponse.status).toBe(200);
      expect(clientesListResponse.body.data).toHaveLength(1);

      const vendasListResponse = await request(app)
        .get('/api/vendas')
        .set('Authorization', `Bearer ${token}`);

      expect(vendasListResponse.status).toBe(200);
      expect(vendasListResponse.body).toHaveLength(1);
      expect(vendasListResponse.body[0].cliente.id).toBe(clienteId);
    });

    it('should handle search and pagination workflow', async () => {
      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'test123'
        });

      const token = loginResponse.body.token;

      // Create multiple clientes
      const clientes = [
        { nome: 'Ana Silva', email: 'ana@test.com' },
        { nome: 'Bruno Santos', email: 'bruno@test.com' },
        { nome: 'Carlos Oliveira', email: 'carlos@test.com' },
        { nome: 'Diana Costa', email: 'diana@test.com' },
        { nome: 'Eduardo Lima', email: 'eduardo@test.com' }
      ];

      for (const cliente of clientes) {
        await request(app)
          .post('/api/clientes')
          .set('Authorization', `Bearer ${token}`)
          .send({
            ...cliente,
            nascimento: '1990-01-01'
          });
      }

      // Test search
      const searchResponse = await request(app)
        .get('/api/clientes?search=Ana')
        .set('Authorization', `Bearer ${token}`);

      expect(searchResponse.status).toBe(200);
      expect(searchResponse.body.data).toHaveLength(1);
      expect(searchResponse.body.data[0].nome).toBe('Ana Silva');

      // Test pagination
      const paginationResponse = await request(app)
        .get('/api/clientes?page=1&limit=3')
        .set('Authorization', `Bearer ${token}`);

      expect(paginationResponse.status).toBe(200);
      expect(paginationResponse.body.data).toHaveLength(3);
      expect(paginationResponse.body.pagination.total).toBe(5);
      expect(paginationResponse.body.pagination.totalPages).toBe(2);

      // Test sorting
      const sortResponse = await request(app)
        .get('/api/clientes?sortBy=nome&sortOrder=asc')
        .set('Authorization', `Bearer ${token}`);

      expect(sortResponse.status).toBe(200);
      expect(sortResponse.body.data[0].nome).toBe('Ana Silva');
      expect(sortResponse.body.data[1].nome).toBe('Bruno Santos');
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
          email: 'invalid@test.com',
          password: 'wrongpassword'
        });

      expect(invalidLoginResponse.status).toBe(401);

      // Login with valid credentials
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'test123'
        });

      const token = loginResponse.body.token;

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
    });
  });

  describe('Data Consistency Tests', () => {
    it('should maintain referential integrity', async () => {
      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'test123'
        });

      const token = loginResponse.body.token;

      // Create cliente
      const clienteResponse = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Test Cliente',
          email: 'referential@test.com',
          nascimento: '1990-01-01'
        });

      const clienteId = clienteResponse.body.id;

      // Create venda
      await request(app)
        .post('/api/vendas')
        .set('Authorization', `Bearer ${token}`)
        .send({
          valor: 100.00,
          data: new Date().toISOString(),
          clienteId
        });

      // Try to delete cliente (should soft delete)
      const deleteResponse = await request(app)
        .delete(`/api/clientes/${clienteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(deleteResponse.status).toBe(204);

      // Verify cliente is soft deleted
      const clienteAfterDelete = await testPrisma.cliente.findUnique({
        where: { id: clienteId }
      });

      expect(clienteAfterDelete?.deletedAt).not.toBeNull();

      // Verify venda still exists
      const vendas = await testPrisma.venda.findMany({
        where: { clienteId }
      });

      expect(vendas).toHaveLength(1);
    });

    it('should handle concurrent requests safely', async () => {
      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'test123'
        });

      const token = loginResponse.body.token;

      // Create cliente
      const clienteResponse = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Concurrent Test',
          email: 'concurrent@test.com',
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
      vendaResponses.forEach(response => {
        expect(response.status).toBe(201);
      });

      // Verify all vendas were created
      const vendasList = await request(app)
        .get('/api/vendas')
        .set('Authorization', `Bearer ${token}`);

      expect(vendasList.body).toHaveLength(5);
    });
  });

  describe('Performance Tests', () => {
    it('should handle large datasets efficiently', async () => {
      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'test123'
        });

      const token = loginResponse.body.token;

      // Create many clientes
      const clientePromises = Array.from({ length: 50 }, (_, i) =>
        request(app)
          .post('/api/clientes')
          .set('Authorization', `Bearer ${token}`)
          .send({
            nome: `Cliente ${i + 1}`,
            email: `cliente${i + 1}@test.com`,
            nascimento: '1990-01-01'
          })
      );

      const startTime = Date.now();
      await Promise.all(clientePromises);
      const endTime = Date.now();

      // Should complete within reasonable time (adjust as needed)
      expect(endTime - startTime).toBeLessThan(10000); // 10 seconds

      // Test pagination performance
      const paginationStartTime = Date.now();
      const paginationResponse = await request(app)
        .get('/api/clientes?page=1&limit=20')
        .set('Authorization', `Bearer ${token}`);
      const paginationEndTime = Date.now();

      expect(paginationResponse.status).toBe(200);
      expect(paginationResponse.body.data).toHaveLength(20);
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
