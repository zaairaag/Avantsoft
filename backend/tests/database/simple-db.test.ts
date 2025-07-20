import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Database Simple Tests', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should connect to database', async () => {
    // Test database connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    expect(result).toBeDefined();
  });

  it('should create and find a user', async () => {
    // Clean up any existing test user
    await prisma.user.deleteMany({
      where: { email: 'test-db@example.com' }
    });

    // Create test user
    const user = await prisma.user.create({
      data: {
        name: 'Test User DB',
        email: 'test-db@example.com',
        password: 'hashedpassword123'
      }
    });

    expect(user).toBeDefined();
    expect(user.email).toBe('test-db@example.com');
    expect(user.name).toBe('Test User DB');

    // Find the user
    const foundUser = await prisma.user.findUnique({
      where: { email: 'test-db@example.com' }
    });

    expect(foundUser).toBeDefined();
    expect(foundUser?.id).toBe(user.id);

    // Clean up
    await prisma.user.delete({
      where: { id: user.id }
    });
  });

  it('should create and find a cliente', async () => {
    // Clean up any existing test cliente
    await prisma.cliente.deleteMany({
      where: { email: 'cliente-db@example.com' }
    });

    // Create test cliente
    const cliente = await prisma.cliente.create({
      data: {
        nome: 'Cliente Test DB',
        email: 'cliente-db@example.com',
        nascimento: new Date('1990-01-01'),
        telefone: '(11) 99999-9999'
      }
    });

    expect(cliente).toBeDefined();
    expect(cliente.email).toBe('cliente-db@example.com');
    expect(cliente.nome).toBe('Cliente Test DB');

    // Find the cliente
    const foundCliente = await prisma.cliente.findUnique({
      where: { email: 'cliente-db@example.com' }
    });

    expect(foundCliente).toBeDefined();
    expect(foundCliente?.id).toBe(cliente.id);

    // Clean up
    await prisma.cliente.delete({
      where: { id: cliente.id }
    });
  });

  it('should create venda with cliente relationship', async () => {
    // Clean up
    await prisma.venda.deleteMany({
      where: { cliente: { email: 'venda-test@example.com' } }
    });
    await prisma.cliente.deleteMany({
      where: { email: 'venda-test@example.com' }
    });

    // Create cliente first
    const cliente = await prisma.cliente.create({
      data: {
        nome: 'Cliente Venda Test',
        email: 'venda-test@example.com',
        nascimento: new Date('1990-01-01')
      }
    });

    // Create venda
    const venda = await prisma.venda.create({
      data: {
        valor: 299.99,
        data: new Date(),
        clienteId: cliente.id
      },
      include: {
        cliente: true
      }
    });

    expect(venda).toBeDefined();
    expect(venda.valor).toBe(299.99);
    expect(venda.cliente.id).toBe(cliente.id);
    expect(venda.cliente.email).toBe('venda-test@example.com');

    // Clean up
    await prisma.venda.delete({
      where: { id: venda.id }
    });
    await prisma.cliente.delete({
      where: { id: cliente.id }
    });
  });

  it('should handle unique constraints', async () => {
    // Clean up
    await prisma.cliente.deleteMany({
      where: { email: 'unique-test@example.com' }
    });

    // Create first cliente
    const cliente1 = await prisma.cliente.create({
      data: {
        nome: 'Cliente Unique 1',
        email: 'unique-test@example.com',
        nascimento: new Date('1990-01-01')
      }
    });

    // Try to create second cliente with same email
    await expect(
      prisma.cliente.create({
        data: {
          nome: 'Cliente Unique 2',
          email: 'unique-test@example.com',
          nascimento: new Date('1990-01-01')
        }
      })
    ).rejects.toThrow();

    // Clean up
    await prisma.cliente.delete({
      where: { id: cliente1.id }
    });
  });

  it('should handle soft delete', async () => {
    // Clean up
    await prisma.cliente.deleteMany({
      where: { email: 'soft-delete@example.com' }
    });

    // Create cliente
    const cliente = await prisma.cliente.create({
      data: {
        nome: 'Cliente Soft Delete',
        email: 'soft-delete@example.com',
        nascimento: new Date('1990-01-01')
      }
    });

    // Soft delete (set deletedAt)
    const softDeletedCliente = await prisma.cliente.update({
      where: { id: cliente.id },
      data: { deletedAt: new Date() }
    });

    expect(softDeletedCliente.deletedAt).not.toBeNull();

    // Cliente should still exist in database
    const foundCliente = await prisma.cliente.findUnique({
      where: { id: cliente.id }
    });

    expect(foundCliente).toBeDefined();
    expect(foundCliente?.deletedAt).not.toBeNull();

    // Clean up
    await prisma.cliente.delete({
      where: { id: cliente.id }
    });
  });
});
