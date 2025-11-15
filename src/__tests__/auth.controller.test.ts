import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { register, login, checkAuth } from '../controllers/auth.controller';
import User from '../models/user.model';

// Mock de User model
jest.mock('../models/user.model');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockCookie: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockCookie = jest.fn().mockReturnThis();

    mockRequest = {};
    mockResponse = {
      json: mockJson,
      status: mockStatus,
      cookie: mockCookie,
      send: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('debería registrar un nuevo usuario correctamente', async () => {
      const mockUser = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        age: 30,
        diabetesType: 'type2',
        save: jest.fn().mockResolvedValue(true)
      };

      mockRequest = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          age: 30,
          diabetesType: 'type2'
        }
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User as unknown as jest.Mock).mockImplementation(() => mockUser);
      (jwt.sign as jest.Mock).mockReturnValue('mock-token');

      await register(mockRequest as Request, mockResponse as Response);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(User).toHaveBeenCalledWith(mockRequest.body);
      expect(mockUser.save).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalled();
      expect(mockCookie).toHaveBeenCalledWith('token', 'mock-token', expect.any(Object));
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Usuario registrado exitosamente. Por favor inicia sesión.',
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com',
          age: 30,
          diabetesType: 'type2'
        }
      });
    });

    it('debería retornar error si el usuario ya existe', async () => {
      const existingUser = { email: 'test@example.com' };
      mockRequest = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        }
      };

      (User.findOne as jest.Mock).mockResolvedValue(existingUser);

      await register(mockRequest as Request, mockResponse as Response);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'El usuario ya existe'
      });
    });
  });

  describe('login', () => {
    it('debería iniciar sesión correctamente', async () => {
      const mockUser = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue('mock-token');

      await login(mockRequest as Request, mockResponse as Response);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
      expect(jwt.sign).toHaveBeenCalled();
      expect(mockCookie).toHaveBeenCalledWith('token', 'mock-token', expect.any(Object));
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com'
        }
      });
    });

    it('debería retornar error si las credenciales son inválidas', async () => {
      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'wrongpassword'
        }
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);

      await login(mockRequest as Request, mockResponse as Response);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Credenciales inválidas'
      });
    });
  });

  describe('checkAuth', () => {
    it('debería verificar la autenticación correctamente', async () => {
      // Creamos un mockUser más simple
      const mockUser: any = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com'
      };

      mockRequest = {
        user: mockUser
      };

      await checkAuth(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com'
        }
      });
    });

    it('debería retornar 401 si el usuario no está autenticado', async () => {
      mockRequest = {
        user: undefined
      };

      await checkAuth(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'No autenticado' });
    });
  });
});

