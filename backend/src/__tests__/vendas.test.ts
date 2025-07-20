import request from 'supertest';
import { app } from '../app';
import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';

describe('Vendas Controller', () => {
  let validToken: string;
  let clienteId: string;
  let userId: string;

  beforeAll(async () => {
    // Limpar dados existentes primeiro
    await prisma.venda.deleteMany({});
    await prisma.cliente.deleteMany({});
    await prisma.user.deleteMany({ where: { email: 'test-vendas@test.com' } });

    // Criar usuário de teste com email único
    const user = await prisma.user.create({
      data: {
        email: 'test-vendas@test.com',
        name: 'Test User Vendas',
        password: 'hashedpassword'
      }
    });
    userId = user.id;

    // Criar cliente de teste com email único
    const cliente = await prisma.cliente.create({
      data: {
        nome: 'Cliente Teste Vendas',
        email: 'cliente-vendas@test.com',
        nascimento: new Date('1990-01-01T00:00:00.000Z')
      }
    });
    clienteId = cliente.id;

    // Gerar token válido
    validToken = jwt.sign(
      { id: userId, email: 'test-vendas@test.com' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Limpar dados de teste na ordem correta
    if (clienteId) {
      await prisma.venda.deleteMany({ where: { clienteId } });
      await prisma.cliente.delete({ where: { id: clienteId } });
    }
    if (userId) {
      await prisma.user.delete({ where: { id: userId } });
    }
    await prisma.$disconnect();
  });

  describe('GET /vendas/estatisticas', () => {
    it('deve retornar estatísticas com autenticação', async () => {
      const response = await request(app)
        .get('/api/vendas/estatisticas')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalDia');
      expect(response.body).toHaveProperty('maiorVolume');
      expect(response.body).toHaveProperty('maiorMedia');
      expect(response.body).toHaveProperty('maiorFrequencia');
    });

    it('deve retornar erro 401 sem token', async () => {
      const response = await request(app)
        .get('/api/vendas/estatisticas');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /vendas/por-dia', () => {
    it('deve retornar vendas agrupadas por dia', async () => {
      const response = await request(app)
        .get('/api/vendas/por-dia')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});


