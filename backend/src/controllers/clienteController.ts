import { Request, Response } from 'express';
import prisma from '../utils/database';
import { ClienteRequest } from '../types';
import { validarCPF, validarTelefone, validarEmail, formatarCPF, formatarTelefone } from '../utils/validators';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

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
      // SQLite is case-insensitive by default for LIKE operations
      where.OR = [
        { nome: { contains: search as string } },
        { email: { contains: search as string } }
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
    const { nome, email, nascimento, telefone, cpf } = req.body;

    const clienteExistente = await prisma.cliente.findUnique({
      where: { id }
    });

    if (!clienteExistente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Validar email se fornecido e diferente do atual
    if (email && email !== clienteExistente.email) {
      if (!validarEmail(email)) {
        return res.status(400).json({ error: 'Email inválido' });
      }

      const emailEmUso = await prisma.cliente.findUnique({
        where: { email, deletedAt: null }
      });

      if (emailEmUso) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
    }

    // Validar CPF se fornecido e diferente do atual
    if (cpf && cpf !== clienteExistente.cpf) {
      if (!validarCPF(cpf)) {
        return res.status(400).json({ error: 'CPF inválido' });
      }

      const cpfEmUso = await prisma.cliente.findUnique({
        where: { cpf: cpf.replace(/\D/g, ''), deletedAt: null }
      });

      if (cpfEmUso) {
        return res.status(400).json({ error: 'CPF já cadastrado' });
      }
    }

    // Validar telefone se fornecido
    if (telefone && !validarTelefone(telefone)) {
      return res.status(400).json({ error: 'Telefone inválido' });
    }

    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        ...(nome && { nome }),
        ...(email && { email }),
        ...(nascimento && { nascimento: new Date(nascimento) }),
        ...(telefone !== undefined && { telefone: telefone ? formatarTelefone(telefone) : null }),
        ...(cpf !== undefined && { cpf: cpf ? cpf.replace(/\D/g, '') : null })
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

interface ClienteCSV {
  nome: string;
  email: string;
  nascimento: string;
  telefone?: string;
  cpf?: string;
}

export const importarClientesCSV = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo CSV é obrigatório' });
    }

    const filePath = req.file.path;
    const clientes: ClienteCSV[] = [];
    const erros: string[] = [];
    const sucessos: any[] = [];

    // Ler arquivo CSV
    const stream = fs.createReadStream(filePath)
      .pipe(csv({
        separator: ',',
        headers: ['nome', 'email', 'nascimento', 'telefone', 'cpf']
      }));

    // Processar cada linha do CSV
    for await (const data of stream) {
      // Pular linhas vazias
      if (!data.nome || data.nome.trim() === '') {
        continue;
      }
      clientes.push(data);
    }

    // Validar e inserir clientes
    for (let i = 0; i < clientes.length; i++) {
      const linha = i + 1;
      const cliente = clientes[i];

      try {
        // Pular linha de cabeçalho se existir
        if (cliente.nome === 'nome' || cliente.nome === 'Nome') {
          continue;
        }

        // Validações obrigatórias
        if (!cliente.nome || !cliente.email || !cliente.nascimento) {
          erros.push(`Linha ${linha}: Nome, email e nascimento são obrigatórios`);
          continue;
        }

        // Validar email
        if (!validarEmail(cliente.email)) {
          erros.push(`Linha ${linha}: Email inválido (${cliente.email})`);
          continue;
        }

        // Validar CPF se fornecido
        if (cliente.cpf && !validarCPF(cliente.cpf)) {
          erros.push(`Linha ${linha}: CPF inválido (${cliente.cpf})`);
          continue;
        }

        // Validar telefone se fornecido
        if (cliente.telefone && !validarTelefone(cliente.telefone)) {
          erros.push(`Linha ${linha}: Telefone inválido (${cliente.telefone})`);
          continue;
        }

        // Verificar se email já existe
        const emailExistente = await prisma.cliente.findUnique({
          where: { email: cliente.email, deletedAt: null }
        });

        if (emailExistente) {
          erros.push(`Linha ${linha}: Email já cadastrado (${cliente.email})`);
          continue;
        }

        // Verificar se CPF já existe
        if (cliente.cpf) {
          const cpfLimpo = cliente.cpf.replace(/\D/g, '');
          const cpfExistente = await prisma.cliente.findUnique({
            where: { cpf: cpfLimpo, deletedAt: null }
          });

          if (cpfExistente) {
            erros.push(`Linha ${linha}: CPF já cadastrado (${cliente.cpf})`);
            continue;
          }
        }

        // Criar cliente
        const novoCliente = await prisma.cliente.create({
          data: {
            nome: cliente.nome.trim(),
            email: cliente.email.trim().toLowerCase(),
            nascimento: new Date(cliente.nascimento),
            telefone: cliente.telefone ? formatarTelefone(cliente.telefone) : null,
            cpf: cliente.cpf ? cliente.cpf.replace(/\D/g, '') : null
          }
        });

        sucessos.push({
          linha,
          cliente: novoCliente
        });

      } catch (error) {
        console.error(`Erro na linha ${linha}:`, error);
        erros.push(`Linha ${linha}: Erro interno - ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }

    // Remover arquivo temporário
    fs.unlinkSync(filePath);

    // Retornar resultado
    res.json({
      totalLinhas: clientes.length,
      sucessos: sucessos.length,
      erros: erros.length,
      detalhes: {
        clientesImportados: sucessos,
        errosEncontrados: erros
      }
    });

  } catch (error) {
    console.error('Erro ao importar clientes:', error);

    // Remover arquivo temporário em caso de erro
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
