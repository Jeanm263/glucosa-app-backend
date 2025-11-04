import { Request, Response } from 'express';
import FoodLog, { IFoodLog } from '../models/foodLog.model';
import Food from '../models/food.model';

export const getAllFoodLogs = async (req: Request, res: Response) => {
  try {
    const { userId, date } = req.query;
    
    // Construir filtro
    const filter: any = {};
    
    if (userId) {
      filter.userId = userId;
    }
    
    if (date) {
      const startOfDay = new Date(date as string);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date as string);
      endOfDay.setHours(23, 59, 59, 999);
      
      filter.consumedAt = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }
    
    const foodLogs = await FoodLog.find(filter)
      .populate('userId', 'name email')
      .populate('foodId')
      .sort({ consumedAt: -1 });
    
    res.json({
      success: true,
      count: foodLogs.length,
      data: foodLogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los registros de alimentos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getFoodLogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foodLog = await FoodLog.findById(id)
      .populate('userId', 'name email')
      .populate('foodId');
    
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el registro de alimento',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const createFoodLog = async (req: Request, res: Response) => {
  try {
    // Si se proporciona foodId, obtener los datos del alimento
    if (req.body.foodId) {
      const food = await Food.findById(req.body.foodId);
      if (food) {
        req.body.food = {
          name: food.name,
          category: food.category,
          glycemicIndex: food.glycemicIndex,
          carbohydrates: food.carbohydrates,
          fiber: food.fiber,
          sugars: food.sugars,
          portion: food.portion,
          trafficLight: food.trafficLight
        };
      }
    }
    
    const foodLog = new FoodLog(req.body);
    await foodLog.save();
    
    // Poblar las referencias antes de enviar la respuesta
    const populatedFoodLog = await FoodLog.findById(foodLog._id)
      .populate('userId', 'name email')
      .populate('foodId');
    
    res.status(201).json({
      success: true,
      data: populatedFoodLog
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
      message: 'Error al crear el registro de alimento',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const updateFoodLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Si se proporciona foodId, obtener los datos del alimento
    if (req.body.foodId) {
      const food = await Food.findById(req.body.foodId);
      if (food) {
        req.body.food = {
          name: food.name,
          category: food.category,
          glycemicIndex: food.glycemicIndex,
          carbohydrates: food.carbohydrates,
          fiber: food.fiber,
          sugars: food.sugars,
          portion: food.portion,
          trafficLight: food.trafficLight
        };
      }
    }
    
    const foodLog = await FoodLog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('userId', 'name email')
      .populate('foodId');
    
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
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el registro de alimento',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el registro de alimento',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener resumen nutricional por día
export const getDailyNutritionSummary = async (req: Request, res: Response) => {
  try {
    const { userId, date } = req.query;
    
    if (!userId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren userId y date'
      });
    }
    
    const startOfDay = new Date(date as string);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date as string);
    endOfDay.setHours(23, 59, 59, 999);
    
    const foodLogs = await FoodLog.find({
      userId,
      consumedAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
    
    // Calcular totales nutricionales
    let totalCarbohydrates = 0;
    let totalFiber = 0;
    let totalSugars = 0;
    let greenCount = 0;
    let yellowCount = 0;
    let redCount = 0;
    
    foodLogs.forEach(log => {
      if (log.food) {
        totalCarbohydrates += log.food.carbohydrates || 0;
        totalFiber += log.food.fiber || 0;
        totalSugars += log.food.sugars || 0;
        
        switch (log.food.trafficLight) {
          case 'green': greenCount++; break;
          case 'yellow': yellowCount++; break;
          case 'red': redCount++; break;
        }
      }
    });
    
    res.json({
      success: true,
      data: {
        date: date,
        totalLogs: foodLogs.length,
        nutrition: {
          carbohydrates: totalCarbohydrates,
          fiber: totalFiber,
          sugars: totalSugars
        },
        trafficLight: {
          green: greenCount,
          yellow: yellowCount,
          red: redCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el resumen nutricional',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};