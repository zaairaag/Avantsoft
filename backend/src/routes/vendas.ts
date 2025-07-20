import { Router } from 'express';
import {
  criarVenda,
  listarVendas,
  obterEstatisticas,
  obterVendasPorDia
} from '../controllers/vendaController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Vendas
 *   description: Gestão de vendas e relatórios de performance
 */

router.use(authenticateToken);

/**
 * @swagger
 * /vendas:
 *   post:
 *     summary: Registrar nova venda
 *     description: Cria uma nova venda no sistema com validação de cliente e data
 *     tags: [Vendas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendaInput'
 *           examples:
 *             venda_hoje:
 *               summary: Venda de hoje
 *               value:
 *                 valor: 299.99
 *                 data: "2025-07-20T12:00:00.000Z"
 *                 clienteId: "clh7x8y9z0000abc123def456"
 *     responses:
 *       201:
 *         description: Venda registrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Venda'
 *                 - type: object
 *                   properties:
 *                     cliente:
 *                       $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               campos_obrigatorios:
 *                 summary: Campos obrigatórios ausentes
 *                 value:
 *                   error: "Valor, data e clienteId são obrigatórios"
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
router.post('/', criarVenda);

/**
 * @swagger
 * /vendas:
 *   get:
 *     summary: Listar vendas
 *     description: Lista todas as vendas ordenadas por data (mais recentes primeiro)
 *     tags: [Vendas]
 *     responses:
 *       200:
 *         description: Lista de vendas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Venda'
 *                   - type: object
 *                     properties:
 *                       cliente:
 *                         $ref: '#/components/schemas/Cliente'
 *       401:
 *         description: Token de acesso requerido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', listarVendas);

/**
 * @swagger
 * /vendas/estatisticas:
 *   get:
 *     summary: Obter estatísticas de vendas
 *     description: Retorna estatísticas detalhadas incluindo faturamento do dia e top performers
 *     tags: [Vendas]
 *     responses:
 *       200:
 *         description: Estatísticas de vendas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDia:
 *                   type: number
 *                   description: Faturamento total do dia atual
 *                   example: 1250.50
 *                 maiorVolume:
 *                   type: object
 *                   properties:
 *                     cliente:
 *                       type: string
 *                       example: "Maria Silva"
 *                     valor:
 *                       type: number
 *                       example: 2500.00
 *                 maiorMedia:
 *                   type: object
 *                   properties:
 *                     cliente:
 *                       type: string
 *                       example: "João Santos"
 *                     media:
 *                       type: number
 *                       example: 450.75
 *                 maiorFrequencia:
 *                   type: object
 *                   properties:
 *                     cliente:
 *                       type: string
 *                       example: "Ana Beatriz"
 *                     diasUnicos:
 *                       type: integer
 *                       example: 15
 *       401:
 *         description: Token de acesso requerido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/estatisticas', obterEstatisticas);

/**
 * @swagger
 * /vendas/por-dia:
 *   get:
 *     summary: Vendas agrupadas por dia
 *     description: Retorna vendas agrupadas por dia para gráficos e análises temporais
 *     tags: [Vendas]
 *     responses:
 *       200:
 *         description: Vendas por dia
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   data:
 *                     type: string
 *                     format: date
 *                     description: Data no formato YYYY-MM-DD
 *                     example: "2025-07-20"
 *                   valor:
 *                     type: number
 *                     description: Valor total de vendas do dia
 *                     example: 850.75
 *       401:
 *         description: Token de acesso requerido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/por-dia', obterVendasPorDia);

export default router;