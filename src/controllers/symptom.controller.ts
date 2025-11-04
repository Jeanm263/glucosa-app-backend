import { Request, Response } from 'express';
import Symptom, { ISymptom } from '../models/symptom.model';
import FoodLog from '../models/foodLog.model';

export const getAllSymptoms = async (req: Request, res: Response) => {
  try {
    const { userId, startDate, endDate } = req.query;
    
    // Construir filtro
    const filter: any = {};
    
    if (userId) {
      filter.userId = userId;
    }
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate as string);
      }
    }
    
    const symptoms = await Symptom.find(filter)
      .populate('userId', 'name email')
      .populate('relatedFoods')
      .sort({ date: -1 });
    
    res.json({
      success: true,
      count: symptoms.length,
      data: symptoms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los registros de síntomas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getSymptomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const symptom = await Symptom.findById(id)
      .populate('userId', 'name email')
      .populate('relatedFoods');
    
    if (!symptom) {
      return res.status(404).json({
        success: false,
        message: 'Registro de síntomas no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: symptom
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el registro de síntomas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const createSymptom = async (req: Request, res: Response) => {
  try {
    // Si no se proporcionan alimentos relacionados, buscar los consumidos ese día
    if (!req.body.relatedFoods && req.body.userId && req.body.date) {
      const startOfDay = new Date(req.body.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(req.body.date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const foodLogs = await FoodLog.find({
        userId: req.body.userId,
        consumedAt: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      });
      
      req.body.relatedFoods = foodLogs.map(log => log.foodId);
    }
    
    const symptom = new Symptom(req.body);
    await symptom.save();
    
    // Poblar las referencias antes de enviar la respuesta
    const populatedSymptom = await Symptom.findById(symptom._id)
      .populate('userId', 'name email')
      .populate('relatedFoods');
    
    res.status(201).json({
      success: true,
      data: populatedSymptom
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
      message: 'Error al crear el registro de síntomas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const updateSymptom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Si no se proporcionan alimentos relacionados, buscar los consumidos ese día
    if (!req.body.relatedFoods && req.body.userId && req.body.date) {
      const startOfDay = new Date(req.body.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(req.body.date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const foodLogs = await FoodLog.find({
        userId: req.body.userId,
        consumedAt: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      });
      
      req.body.relatedFoods = foodLogs.map(log => log.foodId);
    }
    
    const symptom = await Symptom.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('userId', 'name email')
      .populate('relatedFoods');
    
    if (!symptom) {
      return res.status(404).json({
        success: false,
        message: 'Registro de síntomas no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: symptom
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
      message: 'Error al actualizar el registro de síntomas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const deleteSymptom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const symptom = await Symptom.findByIdAndDelete(id);
    
    if (!symptom) {
      return res.status(404).json({
        success: false,
        message: 'Registro de síntomas no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Registro de síntomas eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el registro de síntomas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener estadísticas de síntomas
export const getSymptomStats = async (req: Request, res: Response) => {
  try {
    const { userId, startDate, endDate } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere userId'
      });
    }
    
    // Construir filtro
    const filter: any = { userId };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate as string);
      }
    }
    
    const symptoms = await Symptom.find(filter);
    
    // Calcular estadísticas
    const stats = {
      totalRecords: symptoms.length,
      energy: {
        low: 0, // 1-3
        medium: 0, // 4-7
        high: 0 // 8-10
      },
      mood: {
        low: 0, // 1-3
        medium: 0, // 4-7
        high: 0 // 8-10
      },
      physical: {
        low: 0, // 1-3
        medium: 0, // 4-7
        high: 0 // 8-10
      }
    };
    
    symptoms.forEach(symptom => {
      symptom.symptoms.forEach(s => {
        let category = '';
        switch (s.severity) {
          case 1:
          case 2:
          case 3:
            category = 'low';
            break;
          case 4:
          case 5:
          case 6:
          case 7:
            category = 'medium';
            break;
          case 8:
          case 9:
          case 10:
            category = 'high';
            break;
        }
        
        switch (s.type) {
          case 'energy':
            stats.energy[category as keyof typeof stats.energy]++;
            break;
          case 'mood':
            stats.mood[category as keyof typeof stats.mood]++;
            break;
          case 'physical':
            stats.physical[category as keyof typeof stats.physical]++;
            break;
        }
      });
    });
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las estadísticas de síntomas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};