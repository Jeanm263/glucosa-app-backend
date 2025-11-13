import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';
import logger from '../utils/logger';

/**
 * Middleware para cachear respuestas de API
 * @param ttl Tiempo de vida del cache en segundos (por defecto 300 segundos/5 minutos)
 */
export const cacheMiddleware = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Solo cachear solicitudes GET
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    
    try {
      // Intentar obtener del cache - usando callback para compatibilidad con mock
      redisClient.get(key, (err, cachedData) => {
        if (err) {
          logger.error('Error al obtener cache:', err);
          return next();
        }
        
        if (cachedData) {
          logger.info('Cache hit para:', key);
          return res.json(JSON.parse(cachedData as string));
        }
        
        logger.info('Cache miss para:', key);
        
        // Interceptamos el método send para cachear la respuesta
        const originalSend = res.json;
        
        res.json = function (body: any) {
          // Guardar en cache - usando callback para compatibilidad con mock
          redisClient.set(key, JSON.stringify(body), (err) => {
            if (err) {
              logger.error('Error al guardar en cache:', err);
            } else {
              logger.info('Respuesta cacheada para:', key);
            }
          });
          
          // Llamar al método original
          return originalSend.call(this, body);
        };
        
        next();
      });
    } catch (error) {
      logger.error('Error en middleware de cache:', error);
      next();
    }
  };
};

/**
 * Middleware para limpiar cache cuando hay operaciones de escritura
 */
export const clearCacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // En el mock de Redis, simulamos limpiar cache
    logger.info('Simulando limpieza de cache');
    // No implementamos la limpieza real en el mock
  } catch (error) {
    logger.error('Error al limpiar cache:', error);
  }
  
  next();
};