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

router.use(authenticateToken);

router.post('/', criarCliente);
router.get('/', listarClientes);
router.get('/:id', obterCliente);
router.put('/:id', atualizarCliente);
router.delete('/:id', deletarCliente);

export default router;