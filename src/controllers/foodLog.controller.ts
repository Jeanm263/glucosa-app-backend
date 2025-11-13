import { Request, Response } from 'express';
// import { IFoodLog } from '../models/foodLog.model'; // Comentado porque no se usa directamente
import FoodLog from '../models/foodLog.model';
import logger from '../utils/logger';

// Obtener todos los registros de alimentos del usuario
export const getUserFoodLogs = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { date, limit = 50 } = req.query;
    
    // Construir filtro
    const filter: any = { userId };
    
    if (date) {
      const startOfDay = new Date(date as string);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);
      
      filter.createdAt = {
        $gte: startOfDay,
        $lt: endOfDay
      };
    }
    
    const foodLogs = await FoodLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    
    res.json({
      success: true,
      count: foodLogs.length,
      data: foodLogs
    });
  } catch (error: any) {
    logger.error('Error al obtener registros de alimentos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener registros de alimentos',
      error: error.message
    });
  }
};

// Crear un nuevo registro de alimento
export const createFoodLog = async (req: Request, res: Response) => {
  try {
    const foodLog = new FoodLog(req.body);
    await foodLog.save();
    
    res.status(201).json({
      success: true,
      data: foodLog
    });
  } catch (error: any) {
    logger.error('Error al crear registro de alimento:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear registro de alimento',
      error: error.message
    });
  }
};

// Actualizar un registro de alimento
export const updateFoodLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foodLog = await FoodLog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!foodLog) {
      return res.status(404).json({
        success: false,
        message: 'Registro de alimento no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: foodLog
    });
  } catch (error: any) {
    logger.error('Error al actualizar registro de alimento:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar registro de alimento',
      error: error.message
    });
  }
};

// Eliminar un registro de alimento
export const deleteFoodLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foodLog = await FoodLog.findByIdAndDelete(id);
    
    if (!foodLog) {
      return res.status(404).json({
        success: false,
        message: 'Registro de alimento no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Registro de alimento eliminado correctamente'
    });
  } catch (error: any) {
    logger.error('Error al eliminar registro de alimento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar registro de alimento',
      error: error.message
    });
  }
};