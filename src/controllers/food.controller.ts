import { Request, Response } from 'express';
import Food, { IFood } from '../models/food.model';

export const getAllFoods = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    
    // Construir filtro
    const filter: any = {};
    
    if (category && category !== 'todas') {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { commonNames: { $regex: search, $options: 'i' } }
      ];
    }
    
    const foods = await Food.find(filter).sort({ name: 1 });
    
    res.json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los alimentos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el alimento',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const createFood = async (req: Request, res: Response) => {
  try {
    const food = new Food(req.body);
    await food.save();
    
    res.status(201).json({
      success: true,
      data: food
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear el alimento',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

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
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el alimento',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el alimento',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};