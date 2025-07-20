import { Router } from 'express';
import {
  criarCliente,
  listarClientes,
  obterCliente,
  atualizarCliente,
  deletarCliente
} from '../controllers/clienteController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Gestão completa de clientes da loja
 */

router.use(authenticateToken);

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Criar novo cliente
 *     description: Cria um novo cliente no sistema com validação completa de dados
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *           examples:
 *             cliente_completo:
 *               summary: Cliente com todos os dados
 *               value:
 *                 nome: "Maria Silva Santos"
 *                 email: "maria.silva@email.com"
 *                 nascimento: "1990-05-15"
 *                 telefone: "11999999999"
 *                 cpf: "12345678901"
 *             cliente_basico:
 *               summary: Cliente apenas com dados obrigatórios
 *               value:
 *                 nome: "João Silva"
 *                 email: "joao.silva@email.com"
 *                 nascimento: "1985-03-20"
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Dados inválidos ou email/CPF já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               email_duplicado:
 *                 summary: Email já existe
 *                 value:
 *                   error: "Email já cadastrado"
 *               cpf_invalido:
 *                 summary: CPF inválido
 *                 value:
 *                   error: "CPF inválido"
 *       401:
 *         description: Token de acesso requerido
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', criarCliente);

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Listar clientes
 *     description: Lista clientes com paginação, busca e ordenação
 *     tags: [Clientes]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nome ou email
 *         example: "Maria"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [nome, email, createdAt, updatedAt]
 *           default: createdAt
 *         description: Campo para ordenação
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Direção da ordenação
 *     responses:
 *       200:
 *         description: Lista de clientes com paginação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedClientes'
 *       401:
 *         description: Token de acesso requerido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', listarClientes);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obter cliente por ID
 *     description: Retorna um cliente específico com seu histórico de vendas
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do cliente
 *         example: "clh7x8y9z0000abc123def456"
 *     responses:
 *       200:
 *         description: Dados do cliente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Cliente'
 *                 - type: object
 *                   properties:
 *                     vendas:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Venda'
 *       404:
 *         description: Cliente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token de acesso requerido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', obterCliente);

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Atualizar cliente
 *     description: Atualiza os dados de um cliente existente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cliente não encontrado
 *       401:
 *         description: Token de acesso requerido
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', atualizarCliente);

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Deletar cliente
 *     description: Remove um cliente do sistema (soft delete - preserva histórico)
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do cliente
 *     responses:
 *       204:
 *         description: Cliente deletado com sucesso
 *       404:
 *         description: Cliente não encontrado
 *       401:
 *         description: Token de acesso requerido
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', deletarCliente);

export default router;