import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

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
      // Return 401 without JSON to avoid triggering frontend interceptor
      return res.status(401).send('Acceso no autorizado. Token no proporcionado.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string };
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      // Return 401 without JSON to avoid triggering frontend interceptor
      return res.status(401).send('Usuario no encontrado.');
    }

    req.user = user;
    next();
  } catch (error) {
    // Return 401 without JSON to avoid triggering frontend interceptor
    return res.status(401).send('Token inválido o expirado.');
  }
};