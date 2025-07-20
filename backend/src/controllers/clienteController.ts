import { Request, Response } from 'express';
import prisma from '../utils/database';
import { ClienteRequest } from '../types';
import { validarCPF, validarTelefone, validarEmail, formatarCPF, formatarTelefone } from '../utils/validators';
import { auditLogger } from '../utils/auditLogger';

export const criarCliente = async (req: Request<{}, {}, ClienteRequest>, res: Response) => {
  try {
    const { nome, email, nascimento, telefone, cpf } = req.body;

    // Validações obrigatórias
    if (!nome || !email || !nascimento) {
      return res.status(400).json({ error: 'Nome, email e nascimento são obrigatórios' });
    }

    // Validar email
    if (!validarEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Validar CPF se fornecido
    if (cpf && !validarCPF(cpf)) {
      return res.status(400).json({ error: 'CPF inválido' });
    }

    // Validar telefone se fornecido
    if (telefone && !validarTelefone(telefone)) {
      return res.status(400).json({ error: 'Telefone inválido' });
    }

    // Verificar se email já existe
    const emailExistente = await prisma.cliente.findUnique({
      where: { email, deletedAt: null }
    });

    if (emailExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Verificar se CPF já existe
    if (cpf) {
      const cpfExistente = await prisma.cliente.findUnique({
        where: { cpf: cpf.replace(/\D/g, ''), deletedAt: null }
      });

      if (cpfExistente) {
        return res.status(400).json({ error: 'CPF já cadastrado' });
      }
    }

    const cliente = await prisma.cliente.create({
      data: {
        nome,
        email,
        nascimento: new Date(nascimento),
        telefone: telefone ? formatarTelefone(telefone) : null,
        cpf: cpf ? cpf.replace(/\D/g, '') : null
      }
    });

    // Log de auditoria
    auditLogger.log(req as any, 'CREATE', 'cliente', cliente.id, { nome, email });

    res.status(201).json(cliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const listarClientes = async (req: Request, res: Response) => {
  try {
    const { 
      search, 
      page = '1', 
      limit = '10',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Construir filtros de busca
    const where: any = {
      deletedAt: null // Só clientes não deletados
    };
    
    if (search) {
      where.OR = [
        { nome: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Buscar clientes com paginação
    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        include: {
          vendas: true
        },
        orderBy: {
          [sortBy as string]: sortOrder as 'asc' | 'desc'
        },
        skip,
        take: limitNum
      }),
      prisma.cliente.count({ where })
    ]);

    res.json({
      data: clientes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const obterCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        vendas: {
          orderBy: {
            data: 'desc'
          }
        }
      }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    console.error('Erro ao obter cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const atualizarCliente = async (req: Request<{ id: string }, {}, ClienteRequest>, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, email, nascimento } = req.body;

    const clienteExistente = await prisma.cliente.findUnique({
      where: { id }
    });

    if (!clienteExistente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    if (email && email !== clienteExistente.email) {
      const emailEmUso = await prisma.cliente.findUnique({
        where: { email }
      });

      if (emailEmUso) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
    }

    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        ...(nome && { nome }),
        ...(email && { email }),
        ...(nascimento && { nascimento: new Date(nascimento) })
      }
    });

    res.json(cliente);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const deletarCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const cliente = await prisma.cliente.findUnique({
      where: { id, deletedAt: null }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Soft delete - apenas marca como deletado
    await prisma.cliente.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};