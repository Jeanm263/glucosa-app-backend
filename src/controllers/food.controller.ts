import { Request, Response } from 'express';
import Food, { IFood } from '../models/food.model';

// Datos de alimentos ampliados (simulando una base de datos más grande)
const EXTENDED_FOODS = [
  // Frutas
  { name: 'Manzana', category: 'frutas', glycemicIndex: 38, carbohydrates: 25, fiber: 4, sugars: 19, portion: '1 unidad mediana (182g)', trafficLight: 'green' },
  { name: 'Plátano', category: 'frutas', glycemicIndex: 51, carbohydrates: 27, fiber: 3, sugars: 14, portion: '1 unidad mediana (118g)', trafficLight: 'yellow' },
  { name: 'Naranja', category: 'frutas', glycemicIndex: 44, carbohydrates: 23, fiber: 3, sugars: 12, portion: '1 unidad mediana (131g)', trafficLight: 'green' },
  { name: 'Uvas', category: 'frutas', glycemicIndex: 53, carbohydrates: 18, fiber: 1, sugars: 15, portion: '1 taza (151g)', trafficLight: 'yellow' },
  { name: 'Fresa', category: 'frutas', glycemicIndex: 41, carbohydrates: 12, fiber: 3, sugars: 8, portion: '1 taza (166g)', trafficLight: 'green' },
  { name: 'Piña', category: 'frutas', glycemicIndex: 66, carbohydrates: 22, fiber: 2, sugars: 16, portion: '1 taza troceada (165g)', trafficLight: 'red' },
  { name: 'Mango', category: 'frutas', glycemicIndex: 51, carbohydrates: 25, fiber: 3, sugars: 23, portion: '1 taza troceada (165g)', trafficLight: 'yellow' },
  { name: 'Sandía', category: 'frutas', glycemicIndex: 76, carbohydrates: 12, fiber: 1, sugars: 9, portion: '1 taza troceada (152g)', trafficLight: 'red' },
  
  // Verduras
  { name: 'Brócoli', category: 'verduras', glycemicIndex: 15, carbohydrates: 7, fiber: 3, sugars: 2, portion: '1 taza cocida (91g)', trafficLight: 'green' },
  { name: 'Zanahoria', category: 'verduras', glycemicIndex: 39, carbohydrates: 12, fiber: 4, sugars: 6, portion: '1 taza cruda troceada (128g)', trafficLight: 'green' },
  { name: 'Espinaca', category: 'verduras', glycemicIndex: 15, carbohydrates: 1, fiber: 1, sugars: 0, portion: '1 taza cruda (30g)', trafficLight: 'green' },
  { name: 'Pimiento rojo', category: 'verduras', glycemicIndex: 15, carbohydrates: 9, fiber: 3, sugars: 6, portion: '1 taza troceada (150g)', trafficLight: 'green' },
  { name: 'Calabacín', category: 'verduras', glycemicIndex: 15, carbohydrates: 4, fiber: 1, sugars: 3, portion: '1 taza cruda rallada (113g)', trafficLight: 'green' },
  { name: 'Tomate', category: 'verduras', glycemicIndex: 30, carbohydrates: 5, fiber: 2, sugars: 3, portion: '1 taza crudo troceado (180g)', trafficLight: 'green' },
  
  // Cereales
  { name: 'Arroz blanco cocido', category: 'cereales', glycemicIndex: 73, carbohydrates: 53, fiber: 1, sugars: 0, portion: '1 taza (158g)', trafficLight: 'red' },
  { name: 'Arroz integral cocido', category: 'cereales', glycemicIndex: 50, carbohydrates: 45, fiber: 4, sugars: 1, portion: '1 taza (158g)', trafficLight: 'yellow' },
  { name: 'Pan blanco', category: 'cereales', glycemicIndex: 75, carbohydrates: 15, fiber: 1, sugars: 2, portion: '1 rebanada (30g)', trafficLight: 'red' },
  { name: 'Pan integral', category: 'cereales', glycemicIndex: 55, carbohydrates: 15, fiber: 2, sugars: 2, portion: '1 rebanada (30g)', trafficLight: 'yellow' },
  { name: 'Avena', category: 'cereales', glycemicIndex: 55, carbohydrates: 27, fiber: 4, sugars: 1, portion: '1 taza cocida (158g)', trafficLight: 'yellow' },
  { name: 'Quinoa cocida', category: 'cereales', glycemicIndex: 53, carbohydrates: 39, fiber: 5, sugars: 2, portion: '1 taza (158g)', trafficLight: 'yellow' },
  
  // Proteínas
  { name: 'Pollo pechuga', category: 'proteinas', glycemicIndex: 0, carbohydrates: 0, fiber: 0, sugars: 0, portion: '100g', trafficLight: 'green' },
  { name: 'Salmón', category: 'proteinas', glycemicIndex: 0, carbohydrates: 0, fiber: 0, sugars: 0, portion: '100g', trafficLight: 'green' },
  { name: 'Huevos', category: 'proteinas', glycemicIndex: 0, carbohydrates: 1, fiber: 0, sugars: 1, portion: '1 unidad (50g)', trafficLight: 'green' },
  { name: 'Tofu', category: 'proteinas', glycemicIndex: 15, carbohydrates: 2, fiber: 1, sugars: 1, portion: '100g', trafficLight: 'green' },
  { name: 'Lentejas cocidas', category: 'proteinas', glycemicIndex: 30, carbohydrates: 40, fiber: 16, sugars: 2, portion: '1 taza (198g)', trafficLight: 'green' },
  { name: 'Frijoles negros cocidos', category: 'proteinas', glycemicIndex: 30, carbohydrates: 41, fiber: 15, sugars: 2, portion: '1 taza (172g)', trafficLight: 'green' },
  
  // Lácteos
  { name: 'Leche entera', category: 'lacteos', glycemicIndex: 39, carbohydrates: 12, fiber: 0, sugars: 12, portion: '1 taza (244g)', trafficLight: 'green' },
  { name: 'Leche descremada', category: 'lacteos', glycemicIndex: 32, carbohydrates: 12, fiber: 0, sugars: 12, portion: '1 taza (244g)', trafficLight: 'green' },
  { name: 'Yogur natural', category: 'lacteos', glycemicIndex: 36, carbohydrates: 12, fiber: 0, sugars: 12, portion: '1 taza (245g)', trafficLight: 'green' },
  { name: 'Queso cheddar', category: 'lacteos', glycemicIndex: 0, carbohydrates: 1, fiber: 0, sugars: 1, portion: '1 onza (28g)', trafficLight: 'green' },
  
  // Grasas
  { name: 'Aceite de oliva', category: 'grasas', glycemicIndex: 0, carbohydrates: 0, fiber: 0, sugars: 0, portion: '1 cucharada (14g)', trafficLight: 'green' },
  { name: 'Aguacate', category: 'grasas', glycemicIndex: 15, carbohydrates: 9, fiber: 7, sugars: 1, portion: '1/2 unidad (100g)', trafficLight: 'green' },
  { name: 'Nueces', category: 'grasas', glycemicIndex: 15, carbohydrates: 4, fiber: 3, sugars: 1, portion: '1/4 taza (30g)', trafficLight: 'green' },
  { name: 'Almendras', category: 'grasas', glycemicIndex: 15, carbohydrates: 6, fiber: 4, sugars: 1, portion: '1/4 taza (30g)', trafficLight: 'green' }
];

export const getAllFoods = async (req: Request, res: Response) => {
  try {
    // Obtener alimentos de la base de datos
    const dbFoods = await Food.find();
    
    // Combinar alimentos de la base de datos con los ampliados
    const allFoods = [...dbFoods, ...EXTENDED_FOODS.map(food => new Food(food))];
    
    res.json({
      success: true,
      count: allFoods.length,
      data: allFoods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los alimentos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const searchFoods = async (req: Request, res: Response) => {
  try {
    const { query, category } = req.query;
    
    // Construir filtro de búsqueda
    let filter: any = {};
    
    if (query) {
      // Búsqueda por nombre (insensible a mayúsculas/minúsculas)
      filter.name = { $regex: query, $options: 'i' };
    }
    
    if (category) {
      filter.category = category;
    }
    
    // Buscar en la base de datos
    let dbFoods = await Food.find(filter);
    
    // Si no hay resultados en la base de datos o es una búsqueda general, buscar en alimentos extendidos
    if (dbFoods.length === 0 || !query) {
      let extendedFoods = EXTENDED_FOODS;
      
      // Aplicar filtros a alimentos extendidos si es necesario
      if (query) {
        const searchTerm = (query as string).toLowerCase();
        extendedFoods = extendedFoods.filter(food => 
          food.name.toLowerCase().includes(searchTerm) ||
          food.category.toLowerCase().includes(searchTerm)
        );
      }
      
      if (category) {
        extendedFoods = extendedFoods.filter(food => food.category === category);
      }
      
      // Convertir alimentos extendidos a objetos Mongoose
      const extendedFoodObjects = extendedFoods.map(food => new Food(food));
      dbFoods = [...dbFoods, ...extendedFoodObjects];
    }
    
    res.json({
      success: true,
      count: dbFoods.length,
      data: dbFoods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar alimentos',
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

// Nueva función para obtener categorías únicas
export const getFoodCategories = async (req: Request, res: Response) => {
  try {
    // Obtener categorías de la base de datos
    const dbCategories = await Food.distinct('category');
    
    // Obtener categorías de alimentos extendidos
    const extendedCategories = [...new Set(EXTENDED_FOODS.map(food => food.category))];
    
    // Combinar y eliminar duplicados
    const allCategories = [...new Set([...dbCategories, ...extendedCategories])];
    
    res.json({
      success: true,
      data: allCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las categorías',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};