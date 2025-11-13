import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import logger from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      logger.warn('Acceso no autorizado: Token no proporcionado', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        url: req.originalUrl
      });
      // Return 401 without JSON to avoid triggering frontend interceptor
      return res.status(401).send('Acceso no autorizado. Token no proporcionado.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string };
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      logger.warn('Usuario no encontrado para token válido', {
        userId: decoded.userId,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      // Return 401 without JSON to avoid triggering frontend interceptor
      return res.status(401).send('Usuario no encontrado.');
    }

    req.user = user;
    logger.info('Usuario autenticado exitosamente', {
      userId: user._id,
      email: user.email,
      ip: req.ip
    });
    next();
  } catch (error) {
    logger.error('Error de autenticación', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    // Return 401 without JSON to avoid triggering frontend interceptor
    return res.status(401).send('Token inválido o expirado.');
  }
};