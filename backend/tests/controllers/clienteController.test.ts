import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import clienteRoutes from '../../src/routes/clientes';
import { testPrisma, cleanupDatabase, createTestUser, createTestCliente, generateUniqueEmail } from '../setup';

const app = express();
app.use(express.json());
app.use('/api/clientes', clienteRoutes);

describe('Cliente Controller', () => {
  let authToken: string;
  let testUser: any;

  beforeEach(async () => {
    await cleanupDatabase();
    testUser = await createTestUser();
    authToken = jwt.sign(
      { userId: testUser.id, email: testUser.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
  });

  describe('POST /api/clientes', () => {
    it('should create a new cliente with valid data', async () => {
      const clienteData = {
        nome: 'João Silva',
        email: generateUniqueEmail(),
        nascimento: '1990-01-01',
        telefone: '(11) 99999-9999',
        cpf: '11144477735'
      };

      const response = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(clienteData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe(clienteData.nome);
      expect(response.body.email).toBe(clienteData.email);
      expect(response.body.telefone).toBe(clienteData.telefone);
      expect(response.body.cpf).toBe(clienteData.cpf);
    });

    it('should create cliente without optional fields', async () => {
      const clienteData = {
        nome: 'Maria Santos',
        email: generateUniqueEmail(),
        nascimento: '1985-05-15'
      };

      const response = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(clienteData);

      expect(response.status).toBe(201);
      expect(response.body.nome).toBe(clienteData.nome);
      expect(response.body.telefone).toBeNull();
      expect(response.body.cpf).toBeNull();
    });

    it('should reject duplicate email', async () => {
      const email = generateUniqueEmail();
      
      // Create first cliente
      await createTestCliente({ email });

      // Try to create second cliente with same email
      const response = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Duplicate Email',
          email,
          nascimento: '1990-01-01'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Email já cadastrado');
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Invalid Email',
          email: 'invalid-email-format',
          nascimento: '1990-01-01'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject invalid CPF', async () => {
      const response = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Invalid CPF',
          email: generateUniqueEmail(),
          nascimento: '1990-01-01',
          cpf: '12345678900' // Invalid CPF
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('CPF inválido');
    });

    it('should format phone number correctly', async () => {
      const response = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Phone Format Test',
          email: generateUniqueEmail(),
          nascimento: '1990-01-01',
          telefone: '11999999999' // Unformatted phone
        });

      expect(response.status).toBe(201);
      expect(response.body.telefone).toBe('(11) 99999-9999');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/clientes')
        .send({
          nome: 'No Auth',
          email: generateUniqueEmail(),
          nascimento: '1990-01-01'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/clientes', () => {
    beforeEach(async () => {
      // Create test clientes
      await createTestCliente({ nome: 'Ana Silva', email: 'ana@test.com' });
      await createTestCliente({ nome: 'Bruno Santos', email: 'bruno@test.com' });
      await createTestCliente({ nome: 'Carlos Oliveira', email: 'carlos@test.com' });
    });

    it('should list all clientes with pagination', async () => {
      const response = await request(app)
        .get('/api/clientes')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.data).toHaveLength(3);
      expect(response.body.pagination.total).toBe(3);
    });

    it('should search clientes by name', async () => {
      const response = await request(app)
        .get('/api/clientes?search=Ana')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].nome).toContain('Ana');
    });

    it('should search clientes by email', async () => {
      const response = await request(app)
        .get('/api/clientes?search=bruno@test.com')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].email).toBe('bruno@test.com');
    });

    it('should handle pagination correctly', async () => {
      const response = await request(app)
        .get('/api/clientes?page=1&limit=2')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.pagination.totalPages).toBe(2);
    });

    it('should sort clientes correctly', async () => {
      const response = await request(app)
        .get('/api/clientes?sortBy=nome&sortOrder=asc')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data[0].nome).toBe('Ana Silva');
      expect(response.body.data[1].nome).toBe('Bruno Santos');
      expect(response.body.data[2].nome).toBe('Carlos Oliveira');
    });
  });

  describe('GET /api/clientes/:id', () => {
    it('should get cliente by id', async () => {
      const cliente = await createTestCliente();

      const response = await request(app)
        .get(`/api/clientes/${cliente.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(cliente.id);
      expect(response.body.nome).toBe(cliente.nome);
    });

    it('should return 404 for non-existent cliente', async () => {
      const response = await request(app)
        .get('/api/clientes/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/clientes/:id', () => {
    it('should update cliente successfully', async () => {
      const cliente = await createTestCliente();

      const updateData = {
        nome: 'Nome Atualizado',
        telefone: '(11) 88888-8888'
      };

      const response = await request(app)
        .put(`/api/clientes/${cliente.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe(updateData.nome);
      expect(response.body.telefone).toBe(updateData.telefone);
    });

    it('should reject duplicate email on update', async () => {
      const cliente1 = await createTestCliente({ email: 'cliente1@test.com' });
      const cliente2 = await createTestCliente({ email: 'cliente2@test.com' });

      const response = await request(app)
        .put(`/api/clientes/${cliente2.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: 'cliente1@test.com' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Email já cadastrado');
    });
  });

  describe('DELETE /api/clientes/:id', () => {
    it('should soft delete cliente', async () => {
      const cliente = await createTestCliente();

      const response = await request(app)
        .delete(`/api/clientes/${cliente.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Verify cliente is soft deleted
      const deletedCliente = await testPrisma.cliente.findUnique({
        where: { id: cliente.id }
      });

      expect(deletedCliente?.deletedAt).not.toBeNull();
    });

    it('should return 404 for non-existent cliente', async () => {
      const response = await request(app)
        .delete('/api/clientes/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});
