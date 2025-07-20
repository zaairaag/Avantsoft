import request from 'supertest';
import { app } from '../app';
import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';

describe('Clientes Controller', () => {
  let validToken: string;
  let clienteId: string;
  let userId: string;

  beforeAll(async () => {
    // Limpar dados existentes
    await prisma.cliente.deleteMany({ where: { email: 'cliente-test@test.com' } });
    await prisma.user.deleteMany({ where: { email: 'test-clientes@test.com' } });

    // Criar usuário de teste
    const user = await prisma.user.create({
      data: {
        email: 'test-clientes@test.com',
        name: 'Test User Clientes',
        password: 'hashedpassword'
      }
    });
    userId = user.id;

    // Gerar token válido
    validToken = jwt.sign(
      { id: userId, email: 'test-clientes@test.com' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Limpar dados de teste
    if (clienteId) {
      await prisma.venda.deleteMany({ where: { clienteId } });
      await prisma.cliente.delete({ where: { id: clienteId } });
    }
    if (userId) {
      await prisma.user.delete({ where: { id: userId } });
    }
    await prisma.$disconnect();
  });

  describe('POST /clientes', () => {
    it('deve criar um novo cliente', async () => {
      const clienteData = {
        nome: 'Cliente Teste',
        email: 'cliente-test@test.com',
        nascimento: '1990-01-01',
        telefone: '11999999999'
      };

      const response = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${validToken}`)
        .send(clienteData);

      expect(response.status).toBe(201);
      expect(response.body.nome).toBe(clienteData.nome);
      expect(response.body.email).toBe(clienteData.email);
      
      clienteId = response.body.id;
    });

    it('deve retornar erro 401 sem token', async () => {
      const clienteData = {
        nome: 'Cliente Sem Auth',
        email: 'sem-auth@test.com',
        nascimento: '1990-01-01'
      };

      const response = await request(app)
        .post('/api/clientes')
        .send(clienteData);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /clientes', () => {
    it('deve listar clientes com autenticação', async () => {
      const response = await request(app)
        .get('/api/clientes')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /clientes/:id', () => {
    it('deve obter cliente por ID', async () => {
      const response = await request(app)
        .get(`/api/clientes/${clienteId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(clienteId);
    });
  });
});