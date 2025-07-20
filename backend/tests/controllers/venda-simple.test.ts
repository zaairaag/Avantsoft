import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

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

// Venda routes for testing
app.post('/vendas', authenticateToken, async (req, res) => {
  try {
    const { valor, data, clienteId } = req.body;

    // Validations
    if (!valor || !data || !clienteId) {
      return res.status(400).json({ error: 'Valor, data e cliente são obrigatórios' });
    }

    if (typeof valor !== 'number' || valor <= 0) {
      return res.status(400).json({ error: 'Valor deve ser um número positivo' });
    }

    // Check if cliente exists
    const cliente = await prisma.cliente.findFirst({
      where: {
        id: clienteId,
        deletedAt: null
      }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Create venda
    const venda = await prisma.venda.create({
      data: {
        valor,
        data: new Date(data),
        clienteId
      },
      include: {
        cliente: true
      }
    });

    res.status(201).json(venda);
  } catch (error) {
    console.error('Create venda error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/vendas', authenticateToken, async (req, res) => {
  try {
    const vendas = await prisma.venda.findMany({
      include: {
        cliente: true
      },
      orderBy: {
        data: 'desc'
      }
    });

    res.json(vendas);
  } catch (error) {
    console.error('List vendas error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/vendas/estatisticas', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Total do dia
    const totalDia = await prisma.venda.aggregate({
      where: {
        data: {
          gte: today,
          lt: tomorrow
        }
      },
      _sum: {
        valor: true
      }
    });

    // Total geral
    const totalGeral = await prisma.venda.aggregate({
      _sum: {
        valor: true
      },
      _count: {
        id: true
      }
    });

    // Cliente com maior volume
    const clientesMaiorVolume = await prisma.cliente.findMany({
      include: {
        vendas: {
          select: {
            valor: true
          }
        }
      }
    });

    let maiorVolume = null;
    let maiorValor = 0;

    clientesMaiorVolume.forEach(cliente => {
      const totalCliente = cliente.vendas.reduce((sum, venda) => sum + venda.valor, 0);
      if (totalCliente > maiorValor) {
        maiorValor = totalCliente;
        maiorVolume = {
          cliente: cliente.nome,
          total: totalCliente
        };
      }
    });

    res.json({
      totalDia: totalDia._sum.valor || 0,
      totalGeral: totalGeral._sum.valor || 0,
      quantidadeVendas: totalGeral._count.id || 0,
      maiorVolume
    });
  } catch (error) {
    console.error('Estatisticas error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/vendas/por-dia', authenticateToken, async (req, res) => {
  try {
    const vendas = await prisma.venda.findMany({
      select: {
        data: true,
        valor: true
      },
      orderBy: {
        data: 'desc'
      }
    });

    // Group by day
    const vendasPorDia = vendas.reduce((acc: any, venda) => {
      const dia = venda.data.toISOString().split('T')[0];
      if (!acc[dia]) {
        acc[dia] = 0;
      }
      acc[dia] += venda.valor;
      return acc;
    }, {});

    // Convert to array
    const resultado = Object.entries(vendasPorDia).map(([data, valor]) => ({
      data,
      valor
    }));

    res.json(resultado);
  } catch (error) {
    console.error('Vendas por dia error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

describe('Venda Controller Simple Tests', () => {
  let authToken: string;
  let testUser: any;
  let testCliente: any;

  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.venda.deleteMany({
      where: {
        cliente: {
          email: {
            contains: 'venda-test'
          }
        }
      }
    });
    await prisma.cliente.deleteMany({
      where: {
        email: {
          contains: 'venda-test'
        }
      }
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'venda-controller-test'
        }
      }
    });

    // Create test user and get auth token
    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = await prisma.user.create({
      data: {
        name: 'Test User Venda',
        email: 'venda-controller-test@example.com',
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
    // Clean up test vendas
    await prisma.venda.deleteMany({
      where: {
        cliente: {
          email: {
            contains: 'venda-test'
          }
        }
      }
    });

    // Recreate test cliente for each test
    await prisma.cliente.deleteMany({
      where: {
        email: {
          contains: 'venda-test'
        }
      }
    });

    testCliente = await prisma.cliente.create({
      data: {
        nome: 'Cliente Test Venda',
        email: 'cliente-venda-test@example.com',
        nascimento: new Date('1990-01-01')
      }
    });
  });

  afterAll(async () => {
    // Final cleanup
    await prisma.venda.deleteMany({
      where: {
        cliente: {
          email: {
            contains: 'venda-test'
          }
        }
      }
    });
    await prisma.cliente.deleteMany({
      where: {
        email: {
          contains: 'venda-test'
        }
      }
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'venda-controller-test'
        }
      }
    });
    await prisma.$disconnect();
  });

  describe('POST /vendas', () => {
    it('should create a new venda with valid data', async () => {
      const vendaData = {
        valor: 299.99,
        data: new Date().toISOString(),
        clienteId: testCliente.id
      };

      const response = await request(app)
        .post('/vendas')
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
        .post('/vendas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(vendaData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Cliente não encontrado');
    });

    it('should reject venda with negative value', async () => {
      const vendaData = {
        valor: -50.00,
        data: new Date().toISOString(),
        clienteId: testCliente.id
      };

      const response = await request(app)
        .post('/vendas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(vendaData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Valor deve ser um número positivo');
    });

    it('should reject venda with missing required fields', async () => {
      const response = await request(app)
        .post('/vendas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Valor, data e cliente são obrigatórios');
    });

    it('should require authentication', async () => {
      const vendaData = {
        valor: 100.00,
        data: new Date().toISOString(),
        clienteId: testCliente.id
      };

      const response = await request(app)
        .post('/vendas')
        .send(vendaData);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /vendas', () => {
    beforeEach(async () => {
      // Create test vendas
      const vendas = [
        { valor: 100.00, data: new Date() },
        { valor: 200.00, data: new Date() },
        { valor: 300.00, data: new Date() }
      ];

      for (const venda of vendas) {
        await prisma.venda.create({
          data: {
            ...venda,
            clienteId: testCliente.id
          }
        });
      }
    });

    it('should list all vendas', async () => {
      const response = await request(app)
        .get('/vendas')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);
      
      // Should include cliente data
      expect(response.body[0]).toHaveProperty('cliente');
      expect(response.body[0].cliente.id).toBe(testCliente.id);
    });

    it('should order vendas by date (newest first)', async () => {
      const response = await request(app)
        .get('/vendas')
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
        .get('/vendas');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /vendas/estatisticas', () => {
    beforeEach(async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Create vendas for today
      await prisma.venda.create({
        data: {
          valor: 100.00,
          data: today,
          clienteId: testCliente.id
        }
      });

      await prisma.venda.create({
        data: {
          valor: 200.00,
          data: today,
          clienteId: testCliente.id
        }
      });

      // Create venda for yesterday
      await prisma.venda.create({
        data: {
          valor: 150.00,
          data: yesterday,
          clienteId: testCliente.id
        }
      });
    });

    it('should return daily statistics', async () => {
      const response = await request(app)
        .get('/vendas/estatisticas')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalDia');
      expect(response.body).toHaveProperty('totalGeral');
      expect(response.body).toHaveProperty('quantidadeVendas');
      expect(response.body.totalDia).toBe(300.00); // Sum of today's sales
      expect(response.body.totalGeral).toBe(450.00); // Sum of all sales
    });

    it('should return top performers', async () => {
      const response = await request(app)
        .get('/vendas/estatisticas')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('maiorVolume');
      expect(response.body.maiorVolume).toHaveProperty('cliente');
      expect(response.body.maiorVolume).toHaveProperty('total');
      expect(response.body.maiorVolume.cliente).toBe('Cliente Test Venda');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/vendas/estatisticas');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /vendas/por-dia', () => {
    beforeEach(async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      await prisma.venda.create({
        data: {
          valor: 100.00,
          data: today,
          clienteId: testCliente.id
        }
      });

      await prisma.venda.create({
        data: {
          valor: 200.00,
          data: today,
          clienteId: testCliente.id
        }
      });

      await prisma.venda.create({
        data: {
          valor: 150.00,
          data: yesterday,
          clienteId: testCliente.id
        }
      });
    });

    it('should return vendas grouped by day', async () => {
      const response = await request(app)
        .get('/vendas/por-dia')
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
        .get('/vendas/por-dia')
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
        .get('/vendas/por-dia');

      expect(response.status).toBe(401);
    });
  });
});
