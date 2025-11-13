import { Request, Response } from 'express';
// import { IGlucose } from '../models/glucose.model'; // Comentado porque no se usa directamente
import Glucose from '../models/glucose.model';
import logger from '../utils/logger';

// Obtener todas las lecturas de glucosa del usuario
export const getUserGlucoseReadings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, limit = 50 } = req.query;
    
    // Construir filtro
    const filter: any = { userId };
    
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) {
        filter.timestamp.$gte = new Date(startDate as string);
      }
      if (endDate) {
        filter.timestamp.$lte = new Date(endDate as string);
      }
    }
    
    const readings = await Glucose.find(filter)
      .sort({ timestamp: -1 })
      .limit(Number(limit));
    
    res.json({
      success: true,
      count: readings.length,
      data: readings
    });
  } catch (error: any) {
    logger.error('Error al obtener lecturas de glucosa:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener lecturas de glucosa',
      error: error.message
    });
  }
};

// Crear una nueva lectura de glucosa
export const createGlucoseReading = async (req: Request, res: Response) => {
  try {
    const glucoseReading = new Glucose(req.body);
    await glucoseReading.save();
    
    res.status(201).json({
      success: true,
      data: glucoseReading
    });
  } catch (error: any) {
    logger.error('Error al crear lectura de glucosa:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear lectura de glucosa',
      error: error.message
    });
  }
};

// Actualizar una lectura de glucosa
export const updateGlucoseReading = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const glucoseReading = await Glucose.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!glucoseReading) {
      return res.status(404).json({
        success: false,
        message: 'Lectura de glucosa no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: glucoseReading
    });
  } catch (error: any) {
    logger.error('Error al actualizar lectura de glucosa:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar lectura de glucosa',
      error: error.message
    });
  }
};

// Eliminar una lectura de glucosa
export const deleteGlucoseReading = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const glucoseReading = await Glucose.findByIdAndDelete(id);
    
    if (!glucoseReading) {
      return res.status(404).json({
        success: false,
        message: 'Lectura de glucosa no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Lectura de glucosa eliminada correctamente'
    });
  } catch (error: any) {
    logger.error('Error al eliminar lectura de glucosa:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar lectura de glucosa',
      error: error.message
    });
  }
};