import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { IUser } from '../models/user.model';
import logger from '../utils/logger';

// Extender la interfaz de Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, age, diabetesType, initialGlucoseLevel } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      logger.warn('Intento de registro con email existente', {
        email,
        ip: req.ip,
        userAgent: req.get ? req.get('User-Agent') : 'Unknown'
      });
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const user = new User({ name, email, password, age, diabetesType, initialGlucoseLevel });
    await user.save();

    // Generar token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Enviar token en cookie HTTP-only
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    logger.info('Usuario registrado exitosamente', {
      userId: user._id,
      email: user.email,
      ip: req.ip
    });

    // Enviar respuesta sin token en cookie para que el frontend maneje la redirección
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente. Por favor inicia sesión.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        diabetesType: user.diabetesType,
        initialGlucoseLevel: user.initialGlucoseLevel
      }
    });
  } catch (error) {
    logger.error('Error al registrar usuario', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      email: req.body.email,
      ip: req.ip
    });
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    logger.info('Cerrando sesión de usuario', {
      userId: req.user?._id,
      ip: req.ip
    });
    
    // Eliminar la cookie de token
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    logger.info('Sesión cerrada exitosamente', {
      userId: req.user?._id,
      ip: req.ip
    });
    
    res.json({ success: true, message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    logger.error('Error al cerrar sesión', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId: req.user?._id,
      ip: req.ip
    });
    res.status(500).json({ message: 'Error al cerrar sesión' });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      logger.info('Verificación de autenticación exitosa', {
        userId: req.user._id,
        email: req.user.email,
        ip: req.ip
      });
      return res.json({
        success: true,
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          age: req.user.age,
          diabetesType: req.user.diabetesType,
          initialGlucoseLevel: req.user.initialGlucoseLevel
        }
      });
    }
    
    logger.warn('Verificación de autenticación fallida: Usuario no autenticado', {
      ip: req.ip,
      userAgent: req.get ? req.get('User-Agent') : 'Unknown'
    });
    // Return 401 with JSON for better frontend handling
    return res.status(401).json({ message: 'No autenticado' });
  } catch (error) {
    logger.error('Error al verificar autenticación', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      ip: req.ip
    });
    // Return 500 with JSON for better frontend handling
    return res.status(500).json({ message: 'Error al verificar autenticación' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn('Intento de inicio de sesión con email no existente', {
        email,
        ip: req.ip,
        userAgent: req.get ? req.get('User-Agent') : 'Unknown'
      });
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn('Intento de inicio de sesión con contraseña incorrecta', {
        email,
        ip: req.ip,
        userAgent: req.get ? req.get('User-Agent') : 'Unknown'
      });
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Enviar token en cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    logger.info('Inicio de sesión exitoso', {
      userId: user._id,
      email: user.email,
      ip: req.ip
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        diabetesType: user.diabetesType,
        initialGlucoseLevel: user.initialGlucoseLevel
      }
    });
  } catch (error) {
    logger.error('Error al iniciar sesión', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      email: req.body.email,
      ip: req.ip
    });
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};