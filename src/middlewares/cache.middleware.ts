import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';
import logger from '../utils/logger';

// Middleware para cachear respuestas
export const cacheMiddleware = (_ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = `cache:${req.originalUrl}`;
      
      // Intentar obtener datos de la caché
      redisClient.get(key, (err, cachedData) => {
        if (err) {
          logger.error('Error al obtener datos de la caché:', err);
          return next();
        }
        
        if (cachedData) {
          logger.info('Respuesta obtenida de la caché', { key });
          return res.json(JSON.parse(cachedData));
        }
        
        // Si no hay datos en caché, continuar con la solicitud
        next();
      });
    } catch (error) {
      logger.error('Error en middleware de caché:', error);
      next();
    }
  };
};

// Middleware para guardar respuestas en caché
export const cacheResponse = (_ttl: number = 300) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    const key = `cache:${req.originalUrl}`;
    
    res.send = function(body: any) {
      try {
        // Guardar la respuesta en caché
        redisClient.set(key, body, (err) => {
          if (err) {
            logger.error('Error al guardar en caché:', err);
          } else {
            logger.info('Respuesta guardada en caché', { key, ttl: _ttl });
          }
        });
      } catch (error) {
        logger.error('Error al procesar respuesta para caché:', error);
      }
      
      // Restaurar el método original y enviar la respuesta
      res.send = originalSend;
      return originalSend.call(this, body);
    };
    
    next();
  };
};

// Middleware para limpiar la caché
export const clearCacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // En el mock de Redis, simulamos limpiar cache
    logger.info('Simulando limpieza de cache');
    // No implementamos la limpieza real en el mock
    next();
  } catch (error) {
    logger.error('Error al limpiar cache:', error);
    next();
  }
};