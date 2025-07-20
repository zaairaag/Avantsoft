import { Request } from 'express';

export interface AuditLog {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ip: string;
  userAgent: string;
  timestamp: Date;
}

class AuditLogger {
  private logs: AuditLog[] = [];

  log(req: Request & { user?: any }, action: string, resource: string, resourceId?: string, details?: any) {
    const auditLog: AuditLog = {
      userId: req.user?.id || 'anonymous',
      action,
      resource,
      resourceId,
      details,
      ip: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      timestamp: new Date(),
    };

    this.logs.push(auditLog);
    
    // Log no console (em produção, enviar para sistema de logs)
    console.log(`[AUDIT] ${auditLog.timestamp.toISOString()} - User ${auditLog.userId} performed ${auditLog.action} on ${auditLog.resource}${auditLog.resourceId ? ` (ID: ${auditLog.resourceId})` : ''}`);
    
    // Manter apenas os últimos 1000 logs em memória
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
  }

  getLogs(limit = 50): AuditLog[] {
    return this.logs.slice(-limit).reverse();
  }

  getLogsByUser(userId: string, limit = 20): AuditLog[] {
    return this.logs
      .filter(log => log.userId === userId)
      .slice(-limit)
      .reverse();
  }

  getLogsByResource(resource: string, limit = 20): AuditLog[] {
    return this.logs
      .filter(log => log.resource === resource)
      .slice(-limit)
      .reverse();
  }
}

export const auditLogger = new AuditLogger();