const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do Reino dos Brinquedos...');

  // Limpar dados existentes
  console.log('🧹 Limpando dados existentes...');
  await prisma.venda.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  console.log('👤 Criando usuários...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@loja.com',
      password: hashedPassword,
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      name: 'Gerente da Loja',
      email: 'gerente@loja.com',
      password: hashedPassword,
    },
  });

  console.log(`✅ Usuários criados: ${adminUser.name}, ${managerUser.name}`);

  // Criar clientes
  console.log('👥 Criando clientes...');
  const clientes = await Promise.all([
    prisma.cliente.create({
      data: {
        nome: 'Maria Silva Santos',
        email: 'maria.santos@email.com',
        nascimento: new Date('1985-03-15'),
        telefone: '(11) 99999-1234',
        cpf: '111.444.777-35',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'João Pedro Oliveira',
        email: 'joao.pedro@email.com',
        nascimento: new Date('1990-07-22'),
        telefone: '(11) 98888-5678',
        cpf: '222.555.888-46',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Ana Carolina Lima',
        email: 'ana.lima@email.com',
        nascimento: new Date('1988-11-08'),
        telefone: '(11) 97777-9012',
        cpf: '333.666.999-57',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Carlos Eduardo Costa',
        email: 'carlos.costa@email.com',
        nascimento: new Date('1982-05-30'),
        telefone: '(11) 96666-3456',
        cpf: '444.777.111-68',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Fernanda Rodrigues',
        email: 'fernanda.rodrigues@email.com',
        nascimento: new Date('1992-09-12'),
        telefone: '(11) 95555-7890',
        cpf: '555.888.222-79',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Roberto Almeida',
        email: 'roberto.almeida@email.com',
        nascimento: new Date('1987-01-25'),
        telefone: '(11) 94444-2345',
        cpf: '666.999.333-80',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Juliana Ferreira',
        email: 'juliana.ferreira@email.com',
        nascimento: new Date('1995-04-18'),
        telefone: '(11) 93333-6789',
        cpf: '777.111.444-91',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Pedro Henrique Souza',
        email: 'pedro.souza@email.com',
        nascimento: new Date('1983-12-03'),
        telefone: '(11) 92222-0123',
        cpf: '888.222.555-02',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Camila Barbosa',
        email: 'camila.barbosa@email.com',
        nascimento: new Date('1991-08-27'),
        telefone: '(11) 91111-4567',
        cpf: '999.333.666-13',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Lucas Martins',
        email: 'lucas.martins@email.com',
        nascimento: new Date('1989-06-14'),
        telefone: '(11) 90000-8901',
        cpf: '111.555.999-24',
      },
    }),
  ]);

  console.log(`✅ ${clientes.length} clientes criados`);

  // Criar vendas dos últimos 30 dias
  console.log('💰 Criando vendas...');
  const hoje = new Date();
  const vendas = [];

  // Produtos de exemplo para as vendas
  const produtos = [
    { nome: 'Boneca Barbie', preco: 89.90 },
    { nome: 'Carrinho Hot Wheels', preco: 15.50 },
    { nome: 'Lego Classic', preco: 199.90 },
    { nome: 'Pelúcia Urso', preco: 45.00 },
    { nome: 'Quebra-cabeça 1000 peças', preco: 35.90 },
    { nome: 'Jogo de Tabuleiro', preco: 67.50 },
    { nome: 'Bicicleta Infantil', preco: 299.90 },
    { nome: 'Patinete', preco: 159.90 },
    { nome: 'Kit de Pintura', preco: 28.90 },
    { nome: 'Boneco Super-Herói', preco: 55.90 },
    { nome: 'Conjunto de Blocos', preco: 78.50 },
    { nome: 'Guitarra de Brinquedo', preco: 125.90 },
  ];

  // Gerar vendas para os últimos 30 dias
  for (let i = 0; i < 30; i++) {
    const dataVenda = new Date(hoje);
    dataVenda.setDate(hoje.getDate() - i);
    
    // Número aleatório de vendas por dia (1-8)
    const vendasDoDia = Math.floor(Math.random() * 8) + 1;
    
    for (let j = 0; j < vendasDoDia; j++) {
      const clienteAleatorio = clientes[Math.floor(Math.random() * clientes.length)];
      const produtoAleatorio = produtos[Math.floor(Math.random() * produtos.length)];
      
      // Adicionar variação no preço (±20%)
      const variacao = (Math.random() - 0.5) * 0.4; // -20% a +20%
      const valorFinal = produtoAleatorio.preco * (1 + variacao);
      
      const venda = await prisma.venda.create({
        data: {
          valor: Math.round(valorFinal * 100) / 100, // Arredondar para 2 casas decimais
          data: dataVenda,
          clienteId: clienteAleatorio.id,
        },
      });
      
      vendas.push(venda);
    }
  }

  console.log(`✅ ${vendas.length} vendas criadas`);

  // Estatísticas finais
  const totalClientes = await prisma.cliente.count();
  const totalVendas = await prisma.venda.count();
  const valorTotal = await prisma.venda.aggregate({
    _sum: {
      valor: true,
    },
  });

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('📊 Estatísticas:');
  console.log(`   👤 Usuários: 2`);
  console.log(`   👥 Clientes: ${totalClientes}`);
  console.log(`   💰 Vendas: ${totalVendas}`);
  console.log(`   💵 Valor Total: R$ ${valorTotal._sum.valor?.toFixed(2) || '0.00'}`);
  console.log('\n🔑 Login padrão:');
  console.log('   Email: admin@loja.com');
  console.log('   Senha: admin123');
  console.log('\n🌐 Acesse: http://localhost:5173');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
