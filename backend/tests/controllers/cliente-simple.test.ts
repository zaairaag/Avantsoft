import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { validarEmail, formatarTelefone, validarCPF } from '../../src/utils/validation';

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

// Auth middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Cliente routes for testing
app.post('/clientes', authenticateToken, async (req, res) => {
  try {
    const { nome, email, nascimento, telefone, cpf } = req.body;

    // Validations
    if (!nome || !email || !nascimento) {
      return res.status(400).json({ error: 'Nome, email e nascimento são obrigatórios' });
    }

    if (!validarEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (cpf && !validarCPF(cpf)) {
      return res.status(400).json({ error: 'CPF inválido' });
    }

    // Check if email already exists
    const existingCliente = await prisma.cliente.findUnique({
      where: { email }
    });

    if (existingCliente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Format phone if provided
    const formattedTelefone = telefone ? formatarTelefone(telefone) : null;

    // Create cliente
    const cliente = await prisma.cliente.create({
      data: {
        nome,
        email,
        nascimento: new Date(nascimento),
        telefone: formattedTelefone,
        cpf: cpf || null
      }
    });

    res.status(201).json(cliente);
  } catch (error) {
    console.error('Create cliente error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/clientes', authenticateToken, async (req, res) => {
  try {
    const { search, page = 1, limit = 10, sortBy = 'nome', sortOrder = 'asc' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    let where: any = {
      deletedAt: null
    };

    if (search) {
      where.OR = [
        { nome: { contains: search as string } },
        { email: { contains: search as string } }
      ];
    }

    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy as string]: sortOrder
        }
      }),
      prisma.cliente.count({ where })
    ]);

    res.json({
      data: clientes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('List clientes error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/clientes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await prisma.cliente.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    console.error('Get cliente error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/clientes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, nascimento, telefone, cpf } = req.body;

    // Check if cliente exists
    const existingCliente = await prisma.cliente.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });

    if (!existingCliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Validations
    if (email && !validarEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (cpf && !validarCPF(cpf)) {
      return res.status(400).json({ error: 'CPF inválido' });
    }

    // Check if email is already used by another cliente
    if (email && email !== existingCliente.email) {
      const emailExists = await prisma.cliente.findUnique({
        where: { email }
      });

      if (emailExists) {
        return res.status(400).json({ error: 'Email já cadastrado por outro cliente' });
      }
    }

    // Format phone if provided
    const formattedTelefone = telefone ? formatarTelefone(telefone) : undefined;

    // Update cliente
    const updatedCliente = await prisma.cliente.update({
      where: { id },
      data: {
        ...(nome && { nome }),
        ...(email && { email }),
        ...(nascimento && { nascimento: new Date(nascimento) }),
        ...(formattedTelefone !== undefined && { telefone: formattedTelefone }),
        ...(cpf !== undefined && { cpf: cpf || null })
      }
    });

    res.json(updatedCliente);
  } catch (error) {
    console.error('Update cliente error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/clientes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if cliente exists
    const existingCliente = await prisma.cliente.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });

    if (!existingCliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Soft delete
    await prisma.cliente.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete cliente error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

describe('Cliente Controller Simple Tests', () => {
  let authToken: string;
  let testUser: any;

  beforeAll(async () => {
    // Create test user and get auth token
    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = await prisma.user.create({
      data: {
        name: 'Test User Cliente',
        email: 'cliente-controller-test@example.com',
        password: hashedPassword
      }
    });

    authToken = jwt.sign(
      { userId: testUser.id, email: testUser.email },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
      { expiresIn: '24h' }
    );
  });

  beforeEach(async () => {
    // Clean up test clientes
    await prisma.cliente.deleteMany({
      where: {
        email: {
          contains: 'cliente-test'
        }
      }
    });
  });

  afterAll(async () => {
    // Final cleanup
    await prisma.cliente.deleteMany({
      where: {
        email: {
          contains: 'cliente-test'
        }
      }
    });
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    await prisma.$disconnect();
  });

  describe('POST /clientes', () => {
    it('should create a new cliente with valid data', async () => {
      const clienteData = {
        nome: 'João Silva',
        email: 'cliente-test-create@example.com',
        nascimento: '1990-01-01',
        telefone: '11999999999',
        cpf: '11144477735'
      };

      const response = await request(app)
        .post('/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(clienteData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe(clienteData.nome);
      expect(response.body.email).toBe(clienteData.email);
      expect(response.body.telefone).toBe('(11) 99999-9999'); // Should be formatted
    });

    it('should create cliente without optional fields', async () => {
      const clienteData = {
        nome: 'Maria Santos',
        email: 'cliente-test-minimal@example.com',
        nascimento: '1985-05-15'
      };

      const response = await request(app)
        .post('/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(clienteData);

      expect(response.status).toBe(201);
      expect(response.body.nome).toBe(clienteData.nome);
      expect(response.body.telefone).toBeNull();
      expect(response.body.cpf).toBeNull();
    });

    it('should reject duplicate email', async () => {
      const email = 'cliente-test-duplicate@example.com';
      
      // Create first cliente
      await request(app)
        .post('/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'First Cliente',
          email,
          nascimento: '1990-01-01'
        });

      // Try to create second cliente with same email
      const response = await request(app)
        .post('/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Second Cliente',
          email,
          nascimento: '1990-01-01'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email já cadastrado');
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Invalid Email',
          email: 'invalid-email-format',
          nascimento: '1990-01-01'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email inválido');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/clientes')
        .send({
          nome: 'No Auth',
          email: 'cliente-test-no-auth@example.com',
          nascimento: '1990-01-01'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /clientes', () => {
    beforeEach(async () => {
      // Create test clientes
      const clientes = [
        { nome: 'Ana Silva', email: 'cliente-test-ana@example.com' },
        { nome: 'Bruno Santos', email: 'cliente-test-bruno@example.com' },
        { nome: 'Carlos Oliveira', email: 'cliente-test-carlos@example.com' }
      ];

      for (const cliente of clientes) {
        await request(app)
          .post('/clientes')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            ...cliente,
            nascimento: '1990-01-01'
          });
      }
    });

    it('should list all clientes with pagination', async () => {
      const response = await request(app)
        .get('/clientes')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.data).toHaveLength(3);
      expect(response.body.pagination.total).toBe(3);
    });

    it('should search clientes by name', async () => {
      const response = await request(app)
        .get('/clientes?search=Ana')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].nome).toContain('Ana');
    });

    it('should handle pagination correctly', async () => {
      const response = await request(app)
        .get('/clientes?page=1&limit=2')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.pagination.totalPages).toBe(2);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/clientes');

      expect(response.status).toBe(401);
    });
  });
});
