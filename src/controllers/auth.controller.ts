import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { IUser } from '../models/user.model';

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
    const { name, email, password, age, diabetesType } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const user = new User({ name, email, password, age, diabetesType });
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
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
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
        diabetesType: user.diabetesType
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      return res.json({
        success: true,
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          age: req.user.age,
          diabetesType: req.user.diabetesType
        }
      });
    }
    
    // Return 401 without JSON to avoid triggering interceptor
    return res.status(401).send('No autenticado');
  } catch (error) {
    // Return 500 without JSON to avoid triggering interceptor
    return res.status(500).send('Error al verificar autenticación');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        diabetesType: user.diabetesType
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};