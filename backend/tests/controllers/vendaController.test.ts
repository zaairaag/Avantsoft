import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import vendaRoutes from '../../src/routes/vendas';
import { testPrisma, cleanupDatabase, createTestUser, createTestCliente, createTestVenda } from '../setup';

const app = express();
app.use(express.json());
app.use('/api/vendas', vendaRoutes);

describe('Venda Controller', () => {
  let authToken: string;
  let testUser: any;
  let testCliente: any;

  beforeEach(async () => {
    await cleanupDatabase();
    testUser = await createTestUser();
    testCliente = await createTestCliente();
    authToken = jwt.sign(
      { userId: testUser.id, email: testUser.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
  });

  describe('POST /api/vendas', () => {
    it('should create a new venda with valid data', async () => {
      const vendaData = {
        valor: 299.99,
        data: new Date().toISOString(),
        clienteId: testCliente.id
      };

      const response = await request(app)
        .post('/api/vendas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(vendaData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.valor).toBe(vendaData.valor);
      expect(response.body.clienteId).toBe(vendaData.clienteId);
      expect(response.body).toHaveProperty('cliente');
      expect(response.body.cliente.id).toBe(testCliente.id);
    });

    it('should reject venda with invalid cliente', async () => {
      const vendaData = {
        valor: 100.00,
        data: new Date().toISOString(),
        clienteId: 'non-existent-id'
      };

      const response = await request(app)
        .post('/api/vendas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(vendaData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Cliente não encontrado');
    });

    it('should reject venda with negative value', async () => {
      const vendaData = {
        valor: -50.00,
        data: new Date().toISOString(),
        clienteId: testCliente.id
      };

      const response = await request(app)
        .post('/api/vendas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(vendaData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject venda with missing required fields', async () => {
      const response = await request(app)
        .post('/api/vendas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('obrigatórios');
    });

    it('should handle timezone correctly', async () => {
      const specificDate = '2025-07-20T12:00:00.000Z';
      const vendaData = {
        valor: 150.00,
        data: specificDate,
        clienteId: testCliente.id
      };

      const response = await request(app)
        .post('/api/vendas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(vendaData);

      expect(response.status).toBe(201);
      expect(new Date(response.body.data).toISOString()).toBe(specificDate);
    });

    it('should require authentication', async () => {
      const vendaData = {
        valor: 100.00,
        data: new Date().toISOString(),
        clienteId: testCliente.id
      };

      const response = await request(app)
        .post('/api/vendas')
        .send(vendaData);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/vendas', () => {
    beforeEach(async () => {
      // Create test vendas
      await createTestVenda(testCliente.id, { valor: 100.00 });
      await createTestVenda(testCliente.id, { valor: 200.00 });
      await createTestVenda(testCliente.id, { valor: 300.00 });
    });

    it('should list all vendas', async () => {
      const response = await request(app)
        .get('/api/vendas')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(3);
      
      // Should include cliente data
      expect(response.body[0]).toHaveProperty('cliente');
      expect(response.body[0].cliente.id).toBe(testCliente.id);
    });

    it('should order vendas by date (newest first)', async () => {
      const response = await request(app)
        .get('/api/vendas')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      
      // Verify ordering (newest first)
      for (let i = 0; i < response.body.length - 1; i++) {
        const currentDate = new Date(response.body[i].data);
        const nextDate = new Date(response.body[i + 1].data);
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
      }
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/vendas');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/vendas/estatisticas', () => {
    beforeEach(async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Create vendas for today
      await createTestVenda(testCliente.id, { valor: 100.00, data: today });
      await createTestVenda(testCliente.id, { valor: 200.00, data: today });
      
      // Create venda for yesterday
      await createTestVenda(testCliente.id, { valor: 150.00, data: yesterday });
    });

    it('should return daily statistics', async () => {
      const response = await request(app)
        .get('/api/vendas/estatisticas')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalDia');
      expect(response.body.totalDia).toBe(300.00); // Sum of today's sales
    });

    it('should return top performers', async () => {
      // Create multiple clientes and vendas
      const cliente2 = await createTestCliente({ nome: 'Cliente 2', email: 'cliente2@test.com' });
      
      await createTestVenda(testCliente.id, { valor: 500.00 });
      await createTestVenda(cliente2.id, { valor: 300.00 });
      await createTestVenda(cliente2.id, { valor: 400.00 });

      const response = await request(app)
        .get('/api/vendas/estatisticas')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('maiorVolume');
      expect(response.body).toHaveProperty('maiorMedia');
      expect(response.body).toHaveProperty('maiorFrequencia');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/vendas/estatisticas');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/vendas/por-dia', () => {
    beforeEach(async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      await createTestVenda(testCliente.id, { valor: 100.00, data: today });
      await createTestVenda(testCliente.id, { valor: 200.00, data: today });
      await createTestVenda(testCliente.id, { valor: 150.00, data: yesterday });
    });

    it('should return vendas grouped by day', async () => {
      const response = await request(app)
        .get('/api/vendas/por-dia')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Each item should have data and valor
      response.body.forEach((item: any) => {
        expect(item).toHaveProperty('data');
        expect(item).toHaveProperty('valor');
        expect(typeof item.valor).toBe('number');
      });
    });

    it('should aggregate values correctly by day', async () => {
      const response = await request(app)
        .get('/api/vendas/por-dia')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      
      // Find today's entry
      const today = new Date().toISOString().split('T')[0];
      const todayEntry = response.body.find((item: any) => item.data === today);
      
      if (todayEntry) {
        expect(todayEntry.valor).toBe(300.00); // 100 + 200
      }
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/vendas/por-dia');

      expect(response.status).toBe(401);
    });
  });
});
