import { Request, Response } from 'express';
// import { ISymptom } from '../models/symptom.model'; // Comentado porque no se usa directamente
import Symptom from '../models/symptom.model';
import logger from '../utils/logger';

// Obtener todos los registros de síntomas del usuario
export const getUserSymptoms = async (req: Request, res: Response) => {
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
      
      filter.timestamp = {
        $gte: startOfDay,
        $lt: endOfDay
      };
    }
    
    const symptoms = await Symptom.find(filter)
      .sort({ timestamp: -1 })
      .limit(Number(limit));
    
    res.json({
      success: true,
      count: symptoms.length,
      data: symptoms
    });
  } catch (error: any) {
    logger.error('Error al obtener registros de síntomas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener registros de síntomas',
      error: error.message
    });
  }
};

// Crear un nuevo registro de síntoma
export const createSymptom = async (req: Request, res: Response) => {
  try {
    const symptom = new Symptom(req.body);
    await symptom.save();
    
    res.status(201).json({
      success: true,
      data: symptom
    });
  } catch (error: any) {
    logger.error('Error al crear registro de síntoma:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear registro de síntoma',
      error: error.message
    });
  }
};

// Actualizar un registro de síntoma
export const updateSymptom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const symptom = await Symptom.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!symptom) {
      return res.status(404).json({
        success: false,
        message: 'Registro de síntoma no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: symptom
    });
  } catch (error: any) {
    logger.error('Error al actualizar registro de síntoma:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar registro de síntoma',
      error: error.message
    });
  }
};

// Eliminar un registro de síntoma
export const deleteSymptom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const symptom = await Symptom.findByIdAndDelete(id);
    
    if (!symptom) {
      return res.status(404).json({
        success: false,
        message: 'Registro de síntoma no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Registro de síntoma eliminado correctamente'
    });
  } catch (error: any) {
    logger.error('Error al eliminar registro de síntoma:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar registro de síntoma',
      error: error.message
    });
  }
};