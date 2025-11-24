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
    it('debería obtener todos los alimentos correctamente con paginación', async () => {
      const mockFoods = [
        { name: 'Manzana', category: 'frutas' },
        { name: 'Arroz', category: 'cereales' }
      ];
      const mockTotalCount = 2;

      // Create a mock chain object that simulates the MongoDB query chain
      const mockQueryChain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockFoods)
      };

      // Mock find to return the chain
      (Food.find as jest.Mock).mockReturnValue(mockQueryChain);
      
      // Mock countDocuments
      (Food.countDocuments as jest.Mock).mockResolvedValue(mockTotalCount);

      await getAllFoods(mockRequest as Request, mockResponse as Response);

      expect(Food.find).toHaveBeenCalled();
      expect(mockQueryChain.sort).toHaveBeenCalledWith({ name: 1 });
      expect(mockQueryChain.skip).toHaveBeenCalledWith(0);
      expect(mockQueryChain.limit).toHaveBeenCalledWith(70);
      expect(Food.countDocuments).toHaveBeenCalled();
      
      // Verificar la respuesta con paginación
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        count: mockFoods.length,
        total: mockTotalCount,
        page: 1,
        pages: 1,
        data: expect.arrayContaining([
          expect.objectContaining({ name: 'Manzana', category: 'frutas' }),
          expect.objectContaining({ name: 'Arroz', category: 'cereales' })
        ])
      });
    });

    it('debería manejar errores al obtener alimentos', async () => {
      const errorMessage = 'Error de base de datos';
      
      // Create a mock chain object that throws an error
      const mockQueryChain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockImplementation(() => {
          throw new Error(errorMessage);
        })
      };

      // Mock find to return the chain
      (Food.find as jest.Mock).mockReturnValue(mockQueryChain);

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
    it('debería buscar alimentos por nombre con paginación', async () => {
      const mockFoods = [{ name: 'Manzana', category: 'frutas', commonNames: ['apple'] }];
      const mockTotalCount = 1;
      mockRequest = {
        query: { query: 'manzana' }
      };

      // Create a mock chain object that simulates the MongoDB query chain
      const mockQueryChain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockFoods)
      };

      // Mock find to return the chain
      (Food.find as jest.Mock).mockReturnValue(mockQueryChain);
      
      // Mock countDocuments
      (Food.countDocuments as jest.Mock).mockResolvedValue(mockTotalCount);

      await searchFoods(mockRequest as Request, mockResponse as Response);

      expect(Food.find).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: 'manzana', $options: 'i' } },
          { commonNames: { $regex: 'manzana', $options: 'i' } }
        ]
      });
      expect(mockQueryChain.sort).toHaveBeenCalledWith({ name: 1 });
      expect(mockQueryChain.skip).toHaveBeenCalledWith(0);
      expect(mockQueryChain.limit).toHaveBeenCalledWith(70);
      expect(Food.countDocuments).toHaveBeenCalled();
      
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        count: mockFoods.length,
        total: mockTotalCount,
        page: 1,
        pages: 1,
        data: expect.arrayContaining([
          expect.objectContaining({ name: 'Manzana', category: 'frutas' })
        ])
      });
    });

    it('debería buscar alimentos por categoría con paginación', async () => {
      const mockFoods = [{ name: 'Manzana', category: 'frutas', commonNames: ['apple'] }];
      const mockTotalCount = 1;
      mockRequest = {
        query: { category: 'frutas' }
      };

      // Create a mock chain object that simulates the MongoDB query chain
      const mockQueryChain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockFoods)
      };

      // Mock find to return the chain
      (Food.find as jest.Mock).mockReturnValue(mockQueryChain);
      
      // Mock countDocuments
      (Food.countDocuments as jest.Mock).mockResolvedValue(mockTotalCount);

      await searchFoods(mockRequest as Request, mockResponse as Response);

      expect(Food.find).toHaveBeenCalledWith({
        category: 'frutas'
      });
      expect(mockQueryChain.sort).toHaveBeenCalledWith({ name: 1 });
      expect(mockQueryChain.skip).toHaveBeenCalledWith(0);
      expect(mockQueryChain.limit).toHaveBeenCalledWith(70);
      expect(Food.countDocuments).toHaveBeenCalled();
      
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        count: mockFoods.length,
        total: mockTotalCount,
        page: 1,
        pages: 1,
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