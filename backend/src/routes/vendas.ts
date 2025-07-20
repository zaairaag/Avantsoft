import { Router } from 'express';
import { 
  criarVenda, 
  listarVendas, 
  obterEstatisticas, 
  obterVendasPorDia 
} from '../controllers/vendaController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/', criarVenda);
router.get('/', listarVendas);
router.get('/estatisticas', obterEstatisticas);
router.get('/por-dia', obterVendasPorDia);

export default router;