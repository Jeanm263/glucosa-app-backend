import { Request, Response } from 'express';
// import { IFood } from '../models/food.model'; // Comentado porque no se usa directamente
import Food from '../models/food.model';
import logger from '../utils/logger';

// Obtener todos los alimentos con filtros opcionales
export const getAllFoods = async (req: Request, res: Response) => {
  try {
    const query = req.query || {};
    const { category, search } = query;
    
    // Construir filtro
    const filter: any = {};
    
    if (category && category !== 'todos') {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
        { tags: { $regex: search as string, $options: 'i' } }
      ];
    }
    
    const foods = await Food.find(filter).sort({ name: 1 });
    
    res.json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (error: any) {
    logger.error('Error al obtener alimentos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener alimentos',
      error: error.message
    });
  }
};

// Buscar alimentos por nombre o categoría
export const searchFoods = async (req: Request, res: Response) => {
  try {
    const query = req.query || {};
    const { query: searchQuery, category } = query;
    
    // Construir filtro
    const filter: any = {};
    
    if (searchQuery) {
      filter.name = { $regex: searchQuery as string, $options: 'i' };
    }
    
    if (category) {
      filter.category = category;
    }
    
    const foods = await Food.find(filter).sort({ name: 1 });
    
    res.json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (error: any) {
    logger.error('Error al buscar alimentos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar alimentos',
      error: error.message
    });
  }
};

// Obtener un alimento por ID
export const getFoodById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);
    
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Alimento no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: food
    });
  } catch (error: any) {
    logger.error('Error al obtener alimento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener alimento',
      error: error.message
    });
  }
};

// Crear un nuevo alimento (solo para administradores)
export const createFood = async (req: Request, res: Response) => {
  try {
    const food = new Food(req.body);
    await food.save();
    
    res.status(201).json({
      success: true,
      data: food
    });
  } catch (error: any) {
    logger.error('Error al crear alimento:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear alimento',
      error: error.message
    });
  }
};

// Actualizar un alimento (solo para administradores)
export const updateFood = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const food = await Food.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Alimento no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: food
    });
  } catch (error: any) {
    logger.error('Error al actualizar alimento:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar alimento',
      error: error.message
    });
  }
};

// Eliminar un alimento (solo para administradores)
export const deleteFood = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const food = await Food.findByIdAndDelete(id);
    
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Alimento no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Alimento eliminado correctamente'
    });
  } catch (error: any) {
    logger.error('Error al eliminar alimento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar alimento',
      error: error.message
    });
  }
};