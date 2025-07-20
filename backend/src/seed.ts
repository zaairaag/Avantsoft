import bcrypt from 'bcryptjs';
import prisma from './utils/database';

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@loja.com' },
    update: {},
    create: {
      email: 'admin@loja.com',
      password: hashedPassword,
      name: 'Administrador'
    }
  });

  console.log('Usuário admin criado:', admin.email);

  // Criar clientes
  const clientes = [
    {
      nome: 'Ana Beatriz',
      email: 'ana.b@example.com',
      nascimento: new Date('1992-05-01')
    },
    {
      nome: 'Carlos Eduardo',
      email: 'cadu@example.com',
      nascimento: new Date('1987-08-15')
    },
    {
      nome: 'Maria Silva',
      email: 'maria.silva@email.com',
      nascimento: new Date('1995-03-20')
    },
    {
      nome: 'João Santos',
      email: 'joao.santos@email.com',
      nascimento: new Date('1990-12-10')
    },
    {
      nome: 'Lucia Oliveira',
      email: 'lucia.oliveira@email.com',
      nascimento: new Date('1988-07-25')
    }
  ];

  for (const clienteData of clientes) {
    const cliente = await prisma.cliente.upsert({
      where: { email: clienteData.email },
      update: {},
      create: clienteData
    });
    console.log('Cliente criado:', cliente.nome);
  }

  // Obter todos os clientes para criar vendas
  const clientesCriados = await prisma.cliente.findMany();

  // Criar vendas distribuídas nos últimos 30 dias
  const vendas = [];
  const hoje = new Date();
  
  for (let i = 0; i < 30; i++) {
    const data = new Date(hoje);
    data.setDate(data.getDate() - i);
    
    // 1-3 vendas por dia
    const vendasDoDia = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < vendasDoDia; j++) {
      const clienteAleatorio = clientesCriados[Math.floor(Math.random() * clientesCriados.length)];
      const valorAleatorio = Math.floor(Math.random() * 500) + 50; // R$ 50 a R$ 550
      
      vendas.push({
        valor: valorAleatorio,
        data: data,
        clienteId: clienteAleatorio.id
      });
    }
  }

  for (const vendaData of vendas) {
    await prisma.venda.create({
      data: vendaData
    });
  }

  console.log(`${vendas.length} vendas criadas`);
  console.log('Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });