import { Request, Response, NextFunction } from 'express';
import client from 'prom-client';
import logger from '../utils/logger';

// Crear un registro para las métricas
const register = new client.Registry();

// Configurar métricas por defecto
client.collectDefaultMetrics({ register });

// Crear métricas personalizadas
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duración de las solicitudes HTTP en segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});

const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Número total de solicitudes HTTP',
  labelNames: ['method', 'route', 'status_code']
});

const activeUsers = new client.Gauge({
  name: 'active_users',
  help: 'Número de usuarios activos'
});

const databaseQueryDuration = new client.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duración de las consultas a la base de datos en segundos',
  labelNames: ['operation', 'collection'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2]
});

// Registrar todas las métricas
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeUsers);
register.registerMetric(databaseQueryDuration);

// Middleware para medir el tiempo de las solicitudes
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Incrementar contador de solicitudes
  httpRequestTotal.inc({
    method: req.method,
    route: req.route?.path || req.path,
    status_code: 'unknown'
  });
  
  // Registrar el tiempo de respuesta cuando la solicitud termina
  res.on('finish', () => {
    const duration = (Date.now() - startTime) / 1000; // Convertir a segundos
    const statusCode = res.statusCode;
    
    // Actualizar métricas
    httpRequestDuration.observe({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: statusCode.toString()
    }, duration);
    
    httpRequestTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: statusCode.toString()
    }, 1);
    
    logger.info('Métrica registrada', {
      method: req.method,
      route: req.route?.path || req.path,
      statusCode,
      duration: `${duration.toFixed(3)}s`
    });
  });
  
  next();
};

// Endpoint para exponer las métricas
export const metricsEndpoint = async (req: Request, res: Response) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    logger.error('Error al obtener métricas', error);
    res.status(500).end('Error al obtener métricas');
  }
};

// Función para actualizar el número de usuarios activos
export const updateActiveUsers = (count: number) => {
  activeUsers.set(count);
};

// Función para medir la duración de consultas a la base de datos
export const measureDatabaseQuery = (operation: string, collection: string, duration: number) => {
  databaseQueryDuration.observe({
    operation,
    collection
  }, duration);
};

export default register;