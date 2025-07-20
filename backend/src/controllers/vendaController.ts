import { Request, Response } from 'express';
import prisma from '../utils/database';
import { VendaRequest } from '../types';

export const criarVenda = async (req: Request<{}, {}, VendaRequest>, res: Response) => {
  try {
    const { valor, data, clienteId } = req.body;

    if (!valor || !data || !clienteId) {
      return res.status(400).json({ error: 'Valor, data e clienteId são obrigatórios' });
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Garantir que a data seja tratada corretamente
    const dataVenda = new Date(data);

    const venda = await prisma.venda.create({
      data: {
        valor,
        data: dataVenda,
        clienteId
      },
      include: {
        cliente: true
      }
    });

    res.status(201).json(venda);
  } catch (error) {
    console.error('Erro ao criar venda:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const listarVendas = async (req: Request, res: Response) => {
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
    console.error('Erro ao listar vendas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const obterEstatisticas = async (req: Request, res: Response) => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    // Total do dia
    const vendasHoje = await prisma.venda.findMany({
      where: {
        data: {
          gte: hoje,
          lt: amanha
        }
      }
    });

    const totalDia = vendasHoje.reduce((total, venda) => total + venda.valor, 0);

    // Buscar todos os clientes com suas vendas
    const clientesComVendas = await prisma.cliente.findMany({
      where: {
        deletedAt: null // Apenas clientes ativos
      },
      include: {
        vendas: {
          orderBy: {
            data: 'asc'
          }
        }
      }
    });

    const estatisticasClientes = clientesComVendas
      .filter(cliente => cliente.vendas.length > 0)
      .map(cliente => {
        const totalVendas = cliente.vendas.reduce((total, venda) => total + venda.valor, 0);
        const mediaVendas = totalVendas / cliente.vendas.length;
        
        // Calcular dias únicos com vendas
        const diasUnicos = new Set(
          cliente.vendas.map(venda => venda.data.toISOString().split('T')[0])
        ).size;
        
        return {
          id: cliente.id,
          nome: cliente.nome,
          totalVendas,
          mediaVendas,
          quantidadeVendas: cliente.vendas.length,
          diasUnicosComVendas: diasUnicos
        };
      });

    // Se não há clientes com vendas, retornar valores zerados
    if (estatisticasClientes.length === 0) {
      return res.json({
        totalDia,
        maiorVolume: {
          cliente: 'Nenhum',
          valor: 0
        },
        maiorMedia: {
          cliente: 'Nenhum',
          media: 0
        },
        maiorFrequencia: {
          cliente: 'Nenhum',
          diasUnicos: 0
        }
      });
    }

    // Maior volume de vendas
    const maiorVolume = estatisticasClientes.reduce((maior, atual) => 
      atual.totalVendas > maior.totalVendas ? atual : maior
    );

    // Maior média de valor por venda
    const maiorMedia = estatisticasClientes.reduce((maior, atual) => 
      atual.mediaVendas > maior.mediaVendas ? atual : maior
    );

    // Maior frequência (dias únicos com vendas)
    const maiorFrequencia = estatisticasClientes.reduce((maior, atual) => 
      atual.diasUnicosComVendas > maior.diasUnicosComVendas ? atual : maior
    );

    res.json({
      totalDia,
      maiorVolume: {
        cliente: maiorVolume.nome,
        valor: maiorVolume.totalVendas
      },
      maiorMedia: {
        cliente: maiorMedia.nome,
        media: Number(maiorMedia.mediaVendas.toFixed(2))
      },
      maiorFrequencia: {
        cliente: maiorFrequencia.nome,
        diasUnicos: maiorFrequencia.diasUnicosComVendas
      }
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const obterVendasPorDia = async (req: Request, res: Response) => {
  try {
    const vendas = await prisma.venda.findMany({
      orderBy: {
        data: 'desc'
      }
    });

    // Agrupar vendas por dia
    const vendasPorDia = vendas.reduce((acc, venda) => {
      const data = venda.data.toISOString().split('T')[0];
      
      if (!acc[data]) {
        acc[data] = 0;
      }
      
      acc[data] += venda.valor;
      
      return acc;
    }, {} as Record<string, number>);

    // Converter para array ordenado
    const resultado = Object.entries(vendasPorDia)
      .map(([data, valor]) => ({ data, valor }))
      .sort((a, b) => a.data.localeCompare(b.data));

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao obter vendas por dia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
