import { Router } from 'express';
import { auditLogger } from '../utils/auditLogger';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

// Listar logs de auditoria
router.get('/logs', (req, res) => {
  const { limit = '50', userId, resource } = req.query;
  
  let logs;
  if (userId) {
    logs = auditLogger.getLogsByUser(userId as string, parseInt(limit as string));
  } else if (resource) {
    logs = auditLogger.getLogsByResource(resource as string, parseInt(limit as string));
  } else {
    logs = auditLogger.getLogs(parseInt(limit as string));
  }
  
  res.json(logs);
});

export default router;