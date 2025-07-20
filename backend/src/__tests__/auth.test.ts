import request from 'supertest';
import { app } from '../app';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

describe('Auth Controller', () => {
  const testEmail = 'auth-test@test.com';
  let userId: string;

  beforeAll(async () => {
    // Limpar dados existentes
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  afterAll(async () => {
    // Limpar dados de teste
    if (userId) {
      await prisma.user.delete({ where: { id: userId } });
    }
    await prisma.$disconnect();
  });

  describe('POST /auth/register', () => {
    it('deve registrar um novo usuário', async () => {
      const userData = {
        name: 'Test User Auth',
        email: testEmail,
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(testEmail);
      
      userId = response.body.user.id;
    });

    it('deve retornar erro para email duplicado', async () => {
      const userData = {
        name: 'Test User Duplicate',
        email: testEmail,
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const loginData = {
        email: testEmail,
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(testEmail);
    });

    it('deve retornar erro para credenciais inválidas', async () => {
      const loginData = {
        email: testEmail,
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
    });
  });
});