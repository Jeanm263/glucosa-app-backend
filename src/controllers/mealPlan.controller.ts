import { Request, Response } from 'express';
// import { IMealPlan } from '../models/mealPlan.model'; // Comentado porque no se usa directamente
import MealPlan from '../models/mealPlan.model';
import logger from '../utils/logger';

// Obtener todos los planes de comidas
export const getAllMealPlans = async (req: Request, res: Response) => {
  try {
    const query = req.query || {};
    const { limit = 50 } = query;
    
    const mealPlans = await MealPlan.find()
      .sort({ date: -1, mealType: 1 })
      .limit(Number(limit));
    
    res.json({
      success: true,
      count: mealPlans.length,
      data: mealPlans
    });
  } catch (error: any) {
    logger.error('Error al obtener planes de comidas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener planes de comidas',
      error: error.message
    });
  }
};

// Obtener un plan de comidas por ID
export const getMealPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mealPlan = await MealPlan.findById(id);
    
    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Plan de comidas no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: mealPlan
    });
  } catch (error: any) {
    logger.error('Error al obtener plan de comidas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener plan de comidas',
      error: error.message
    });
  }
};

// Obtener todos los planes de comidas del usuario
export const getUserMealPlans = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const query = req.query || {};
    const { date, limit = 50 } = query;
    
    // Construir filtro
    const filter: any = { userId };
    
    if (date) {
      const targetDate = new Date(date as string);
      targetDate.setHours(0, 0, 0, 0);
      
      filter.date = {
        $gte: targetDate,
        $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
      };
    }
    
    const mealPlans = await MealPlan.find(filter)
      .sort({ date: -1, mealType: 1 })
      .limit(Number(limit));
    
    res.json({
      success: true,
      count: mealPlans.length,
      data: mealPlans
    });
  } catch (error: any) {
    logger.error('Error al obtener planes de comidas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener planes de comidas',
      error: error.message
    });
  }
};

// Crear un nuevo plan de comidas
export const createMealPlan = async (req: Request, res: Response) => {
  try {
    const mealPlan = new MealPlan(req.body);
    await mealPlan.save();
    
    res.status(201).json({
      success: true,
      data: mealPlan
    });
  } catch (error: any) {
    logger.error('Error al crear plan de comidas:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear plan de comidas',
      error: error.message
    });
  }
};

// Actualizar un plan de comidas
export const updateMealPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mealPlan = await MealPlan.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Plan de comidas no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: mealPlan
    });
  } catch (error: any) {
    logger.error('Error al actualizar plan de comidas:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar plan de comidas',
      error: error.message
    });
  }
};

// Eliminar un plan de comidas
export const deleteMealPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mealPlan = await MealPlan.findByIdAndDelete(id);
    
    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Plan de comidas no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Plan de comidas eliminado correctamente'
    });
  } catch (error: any) {
    logger.error('Error al eliminar plan de comidas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar plan de comidas',
      error: error.message
    });
  }
};

// Generar lista de compras
export const generateShoppingList = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const query = req.query || {};
    const { startDate, endDate } = query;
    
    // Construir filtro
    const filter: any = { userId };
    
    if (startDate && endDate) {
      filter.startDate = {
        $gte: new Date(startDate as string)
      };
      filter.endDate = {
        $lte: new Date(endDate as string)
      };
    }
    
    // Obtener planes de comidas en el rango de fechas
    const mealPlans = await MealPlan.find(filter);
    
    // Generar lista de compras
    const shoppingList: { [key: string]: number } = {};
    
    mealPlans.forEach((plan: any) => {
      if (plan.meals && Array.isArray(plan.meals)) {
        plan.meals.forEach((day: any) => {
          if (day.meals && Array.isArray(day.meals)) {
            day.meals.forEach((meal: any) => {
              if (meal.foods && Array.isArray(meal.foods)) {
                meal.foods.forEach((foodItem: any) => {
                  const food = foodItem.food;
                  if (food && food.name) {
                    const key = `${food.name}-${food.portion || ''}`;
                    if (shoppingList[key]) {
                      shoppingList[key] += 1;
                    } else {
                      shoppingList[key] = 1;
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
    
    // Convertir el objeto en un array
    const shoppingListArray = Object.keys(shoppingList).map(key => {
      const [name, portion] = key.split('-');
      return {
        name,
        portion: portion || '',
        quantity: shoppingList[key]
      };
    });
    
    res.json({
      success: true,
      data: shoppingListArray
    });
  } catch (error: any) {
    logger.error('Error al generar lista de compras:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar lista de compras',
      error: error.message
    });
  }
};