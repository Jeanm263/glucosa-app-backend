import { Request, Response } from 'express';
import MealPlan, { IMealPlan } from '../models/mealPlan.model';
import Food from '../models/food.model';

export const getAllMealPlans = async (req: Request, res: Response) => {
  try {
    const { userId, active } = req.query;
    
    // Construir filtro
    const filter: any = {};
    
    if (userId) {
      filter.userId = userId;
    }
    
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }
    
    const mealPlans = await MealPlan.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: mealPlans.length,
      data: mealPlans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los planes de comidas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getMealPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mealPlan = await MealPlan.findById(id)
      .populate('userId', 'name email');
    
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el plan de comidas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const createMealPlan = async (req: Request, res: Response) => {
  try {
    // Procesar los alimentos en el plan para asegurar que tengan datos completos
    if (req.body.meals) {
      for (const day of req.body.meals) {
        for (const meal of day.meals) {
          for (const foodItem of meal.foods) {
            if (foodItem.foodId) {
              const food = await Food.findById(foodItem.foodId);
              if (food) {
                foodItem.food = {
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
          }
        }
      }
    }
    
    const mealPlan = new MealPlan(req.body);
    await mealPlan.save();
    
    // Poblar las referencias antes de enviar la respuesta
    const populatedMealPlan = await MealPlan.findById(mealPlan._id)
      .populate('userId', 'name email');
    
    res.status(201).json({
      success: true,
      data: populatedMealPlan
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
      message: 'Error al crear el plan de comidas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const updateMealPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Procesar los alimentos en el plan para asegurar que tengan datos completos
    if (req.body.meals) {
      for (const day of req.body.meals) {
        for (const meal of day.meals) {
          for (const foodItem of meal.foods) {
            if (foodItem.foodId) {
              const food = await Food.findById(foodItem.foodId);
              if (food) {
                foodItem.food = {
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
          }
        }
      }
    }
    
    const mealPlan = await MealPlan.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('userId', 'name email');
    
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
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el plan de comidas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el plan de comidas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Generar lista de compras basada en el plan de comidas
export const generateShoppingList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mealPlan = await MealPlan.findById(id);
    
    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Plan de comidas no encontrado'
      });
    }
    
    // Recolectar todos los alimentos del plan
    const shoppingItems: { [key: string]: { food: any; portions: string[] } } = {};
    
    mealPlan.meals.forEach(day => {
      day.meals.forEach(meal => {
        meal.foods.forEach(foodItem => {
          const foodName = foodItem.food.name;
          if (shoppingItems[foodName]) {
            shoppingItems[foodName].portions.push(foodItem.portion);
          } else {
            shoppingItems[foodName] = {
              food: foodItem.food,
              portions: [foodItem.portion]
            };
          }
        });
      });
    });
    
    // Convertir a array
    const shoppingList = Object.values(shoppingItems).map(item => ({
      food: item.food,
      portions: item.portions,
      totalPortions: item.portions.length
    }));
    
    res.json({
      success: true,
      data: {
        mealPlan: mealPlan.name,
        shoppingList
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al generar la lista de compras',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};