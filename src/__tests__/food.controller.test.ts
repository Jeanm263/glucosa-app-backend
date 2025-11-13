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

      (Food.find as jest.Mock).mockResolvedValue(mockFoods);

      await getAllFoods(mockRequest as Request, mockResponse as Response);

      expect(Food.find).toHaveBeenCalled();
      expect(mockStatus).not.toHaveBeenCalled(); // No se llama explícitamente a status(200)
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
      (Food.find as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await getAllFoods(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener los alimentos',
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

      (Food.find as jest.Mock).mockResolvedValue(mockFoods);

      await searchFoods(mockRequest as Request, mockResponse as Response);

      expect(Food.find).toHaveBeenCalledWith({
        name: { $regex: 'manzana', $options: 'i' }
      });
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

      (Food.find as jest.Mock).mockResolvedValue(mockFoods);

      await searchFoods(mockRequest as Request, mockResponse as Response);

      expect(Food.find).toHaveBeenCalledWith({
        category: 'frutas'
      });
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