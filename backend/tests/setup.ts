import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Test database instance - usar o banco de desenvolvimento
export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "file:./test.db"
    }
  }
});

// Test data factories
export const createTestUser = async () => {
  const hashedPassword = await bcrypt.hash('test123', 10);
  return await testPrisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@test.com',
      password: hashedPassword
    }
  });
};

export const createTestCliente = async (overrides: any = {}) => {
  const defaultData = {
    nome: 'Cliente Teste',
    email: `cliente.${Date.now()}@test.com`,
    nascimento: new Date('1990-01-01'),
    telefone: '(11) 99999-9999',
    cpf: null,
    ...overrides
  };

  return await testPrisma.cliente.create({
    data: defaultData
  });
};

export const createTestVenda = async (clienteId: string, overrides: any = {}) => {
  const defaultData = {
    valor: 100.50,
    data: new Date(),
    clienteId,
    ...overrides
  };

  return await testPrisma.venda.create({
    data: defaultData,
    include: {
      cliente: true
    }
  });
};

// Database cleanup utilities
export const cleanupDatabase = async () => {
  await testPrisma.venda.deleteMany();
  await testPrisma.cliente.deleteMany();
  await testPrisma.user.deleteMany();
};

export const resetDatabase = async () => {
  await cleanupDatabase();
  
  // Create default test user
  await createTestUser();
};

// Global test setup
beforeAll(async () => {
  // Ensure test database is clean
  await resetDatabase();
});

afterAll(async () => {
  // Cleanup after all tests
  await cleanupDatabase();
  await testPrisma.$disconnect();
});

// Reset database between test suites
beforeEach(async () => {
  // Clean up data but keep the test user
  await testPrisma.venda.deleteMany();
  await testPrisma.cliente.deleteMany();
});

// Utility functions for tests
export const generateUniqueEmail = () => `test.${Date.now()}.${Math.random()}@test.com`;

export const generateValidCPF = () => {
  // Generate a valid CPF for testing
  const cpf = '12345678901'; // Simple valid CPF for testing
  return cpf;
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
