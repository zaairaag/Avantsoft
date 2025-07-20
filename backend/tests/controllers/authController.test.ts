import request from 'supertest';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authRoutes from '../../src/routes/auth';
import { testPrisma, cleanupDatabase, createTestUser } from '../setup';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Authentication Controller', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // Create test user
      const hashedPassword = await bcrypt.hash('test123', 10);
      await testPrisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@test.com',
          password: hashedPassword
        }
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'test123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@test.com');
      expect(response.body.user.name).toBe('Test User');
      
      // Verify JWT token
      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET || 'fallback-secret');
      expect(decoded).toHaveProperty('userId');
    });

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'test123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Credenciais inválidas');
    });

    it('should reject invalid password', async () => {
      // Create test user
      const hashedPassword = await bcrypt.hash('test123', 10);
      await testPrisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@test.com',
          password: hashedPassword
        }
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Credenciais inválidas');
    });

    it('should reject missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email e senha são obrigatórios');
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'test123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle database errors gracefully', async () => {
      // Disconnect database to simulate error
      await testPrisma.$disconnect();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'test123'
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('JWT Token Validation', () => {
    it('should generate valid JWT tokens', async () => {
      const hashedPassword = await bcrypt.hash('test123', 10);
      const user = await testPrisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@test.com',
          password: hashedPassword
        }
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'test123'
        });

      const token = response.body.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

      expect(decoded.userId).toBe(user.id);
      expect(decoded.email).toBe(user.email);
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
    });

    it('should set appropriate token expiration', async () => {
      const hashedPassword = await bcrypt.hash('test123', 10);
      await testPrisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@test.com',
          password: hashedPassword
        }
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'test123'
        });

      const token = response.body.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

      // Token should expire in 24 hours (86400 seconds)
      const expectedExpiration = decoded.iat + 86400;
      expect(decoded.exp).toBe(expectedExpiration);
    });
  });
});
