import { Request, Response } from 'express';
import { getAllFoods, searchFoods, getFoodById } from '../controllers/food.controller';
import Food from '../models/food.model';

// Mock de Food model
jest.mock('../models/food.model');

describe('Food Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();

    mockRequest = {};
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllFoods', () => {
    it('debería obtener todos los alimentos correctamente', async () => {
      const mockFoods = [
        { name: 'Manzana', category: 'frutas' },
        { name: 'Arroz', category: 'cereales' }
      ];

      // Mock para que find() devuelva un objeto con sort()
      const mockFindResult = {
        sort: jest.fn().mockResolvedValue(mockFoods)
      };
      (Food.find as jest.Mock).mockReturnValue(mockFindResult);

      await getAllFoods(mockRequest as Request, mockResponse as Response);

      expect(Food.find).toHaveBeenCalled();
      expect(mockFindResult.sort).toHaveBeenCalledWith({ name: 1 });
      // No esperamos que se llame a status(200) explícitamente
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        count: expect.any(Number),
        data: expect.arrayContaining([
          expect.objectContaining({ name: 'Manzana', category: 'frutas' }),
          expect.objectContaining({ name: 'Arroz', category: 'cereales' })
        ])
      });
    });

    it('debería manejar errores al obtener alimentos', async () => {
      const errorMessage = 'Error de base de datos';
      // Simular un error sin crear una nueva instancia de Error
      const mockFindResult = {
        sort: jest.fn().mockImplementation(() => {
          throw new Error(errorMessage);
        })
      };
      (Food.find as jest.Mock).mockReturnValue(mockFindResult);

      await getAllFoods(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener alimentos',
        error: errorMessage
      });
    });
  });

  describe('searchFoods', () => {
    it('debería buscar alimentos por nombre', async () => {
      const mockFoods = [{ name: 'Manzana', category: 'frutas' }];
      mockRequest = {
        query: { query: 'manzana' }
      };

      // Mock para que find() devuelva un objeto con sort()
      const mockFindResult = {
        sort: jest.fn().mockResolvedValue(mockFoods)
      };
      (Food.find as jest.Mock).mockReturnValue(mockFindResult);

      await searchFoods(mockRequest as Request, mockResponse as Response);

      expect(Food.find).toHaveBeenCalledWith({
        name: { $regex: 'manzana', $options: 'i' }
      });
      expect(mockFindResult.sort).toHaveBeenCalledWith({ name: 1 });
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        count: expect.any(Number),
        data: expect.arrayContaining([
          expect.objectContaining({ name: 'Manzana', category: 'frutas' })
        ])
      });
    });

    it('debería buscar alimentos por categoría', async () => {
      const mockFoods = [{ name: 'Manzana', category: 'frutas' }];
      mockRequest = {
        query: { category: 'frutas' }
      };

      // Mock para que find() devuelva un objeto con sort()
      const mockFindResult = {
        sort: jest.fn().mockResolvedValue(mockFoods)
      };
      (Food.find as jest.Mock).mockReturnValue(mockFindResult);

      await searchFoods(mockRequest as Request, mockResponse as Response);

      expect(Food.find).toHaveBeenCalledWith({
        category: 'frutas'
      });
      expect(mockFindResult.sort).toHaveBeenCalledWith({ name: 1 });
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        count: expect.any(Number),
        data: expect.arrayContaining([
          expect.objectContaining({ name: 'Manzana', category: 'frutas' })
        ])
      });
    });
  });

  describe('getFoodById', () => {
    it('debería obtener un alimento por ID', async () => {
      const mockFood = { name: 'Manzana', category: 'frutas' };
      mockRequest = {
        params: { id: '123' }
      };

      (Food.findById as jest.Mock).mockResolvedValue(mockFood);

      await getFoodById(mockRequest as Request, mockResponse as Response);

      expect(Food.findById).toHaveBeenCalledWith('123');
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockFood
      });
    });

    it('debería retornar 404 si el alimento no existe', async () => {
      mockRequest = {
        params: { id: '123' }
      };

      (Food.findById as jest.Mock).mockResolvedValue(null);

      await getFoodById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Alimento no encontrado'
      });
    });
  });
});