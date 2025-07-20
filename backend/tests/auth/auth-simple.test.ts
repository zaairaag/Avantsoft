import request from 'supertest';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

// Create test app
const app = express();
app.use(express.json());

const prisma = new PrismaClient();

// Simple auth routes for testing
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

describe('Authentication Simple Tests', () => {
  beforeEach(async () => {
    // Clean up test users
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'auth-test'
        }
      }
    });
  });

  afterAll(async () => {
    // Final cleanup
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'auth-test'
        }
      }
    });
    await prisma.$disconnect();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User Auth',
        email: 'auth-test-register@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user).not.toHaveProperty('password');

      // Verify JWT token
      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production') as any;
      expect(decoded.email).toBe(userData.email);
    });

    it('should reject registration with missing fields', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'incomplete@example.com'
          // Missing name and password
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Nome, email e senha são obrigatórios');
    });

    it('should reject duplicate email registration', async () => {
      const userData = {
        name: 'Test User',
        email: 'auth-test-duplicate@example.com',
        password: 'password123'
      };

      // First registration
      await request(app)
        .post('/auth/register')
        .send(userData);

      // Second registration with same email
      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email já cadastrado');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create test user for login tests
      const hashedPassword = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          name: 'Test User Login',
          email: 'auth-test-login@example.com',
          password: hashedPassword
        }
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'auth-test-login@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('auth-test-login@example.com');

      // Verify JWT token
      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production') as any;
      expect(decoded.email).toBe('auth-test-login@example.com');
    });

    it('should reject login with invalid email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Credenciais inválidas');
    });

    it('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'auth-test-login@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Credenciais inválidas');
    });

    it('should reject login with missing credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email e senha são obrigatórios');
    });
  });

  describe('JWT Token Validation', () => {
    it('should generate valid JWT tokens with correct payload', async () => {
      const userData = {
        name: 'JWT Test User',
        email: 'auth-test-jwt@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      const token = response.body.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production') as any;

      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('email');
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
      expect(decoded.email).toBe(userData.email);

      // Check token expiration (24 hours)
      const expectedExpiration = decoded.iat + (24 * 60 * 60);
      expect(decoded.exp).toBe(expectedExpiration);
    });
  });
});
