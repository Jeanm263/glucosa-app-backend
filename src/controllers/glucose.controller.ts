import { Request, Response } from 'express';
import Glucose from '../models/glucose.model';
import { IGlucose } from '../models/glucose.model';
import logger from '../utils/logger';

export const createGlucoseReading = async (req: Request, res: Response) => {
  try {
    const { date, time, level, mealContext, notes, relatedFoods } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      logger.warn('Intento de crear registro de glucosa sin autenticación', {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const glucoseReading = new Glucose({
      userId,
      date,
      time,
      level,
      mealContext,
      notes,
      relatedFoods
    });

    await glucoseReading.save();

    logger.info('Registro de glucosa creado exitosamente', {
      userId,
      glucoseId: glucoseReading._id,
      level,
      mealContext,
      ip: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Nivel de glucosa registrado exitosamente',
      data: glucoseReading
    });
  } catch (error) {
    logger.error('Error al crear registro de glucosa', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId: req.user?._id,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Error al registrar el nivel de glucosa',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getGlucoseReadings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { startDate, endDate, limit = 30 } = req.query;

    if (!userId) {
      logger.warn('Intento de obtener registros de glucosa sin autenticación', {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // Construir filtro de búsqueda
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

    const glucoseReadings = await Glucose.find(filter)
      .sort({ date: -1, time: -1 })
      .limit(Number(limit));

    logger.info('Registros de glucosa obtenidos exitosamente', {
      userId,
      count: glucoseReadings.length,
      limit,
      ip: req.ip
    });

    res.json({
      success: true,
      count: glucoseReadings.length,
      data: glucoseReadings
    });
  } catch (error) {
    logger.error('Error al obtener registros de glucosa', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId: req.user?._id,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Error al obtener los registros de glucosa',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getGlucoseReadingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      logger.warn('Intento de obtener registro de glucosa por ID sin autenticación', {
        id,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const glucoseReading = await Glucose.findOne({ _id: id, userId });

    if (!glucoseReading) {
      logger.warn('Registro de glucosa no encontrado', {
        id,
        userId,
        ip: req.ip
      });
      return res.status(404).json({
        success: false,
        message: 'Registro de glucosa no encontrado'
      });
    }

    logger.info('Registro de glucosa obtenido exitosamente', {
      userId,
      glucoseId: id,
      ip: req.ip
    });

    res.json({
      success: true,
      data: glucoseReading
    });
  } catch (error) {
    logger.error('Error al obtener registro de glucosa por ID', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId: req.user?._id,
      glucoseId: req.params.id,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Error al obtener el registro de glucosa',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const updateGlucoseReading = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, time, level, mealContext, notes, relatedFoods } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      logger.warn('Intento de actualizar registro de glucosa sin autenticación', {
        id,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const glucoseReading = await Glucose.findOneAndUpdate(
      { _id: id, userId },
      { date, time, level, mealContext, notes, relatedFoods },
      { new: true, runValidators: true }
    );

    if (!glucoseReading) {
      logger.warn('Registro de glucosa no encontrado para actualización', {
        id,
        userId,
        ip: req.ip
      });
      return res.status(404).json({
        success: false,
        message: 'Registro de glucosa no encontrado'
      });
    }

    logger.info('Registro de glucosa actualizado exitosamente', {
      userId,
      glucoseId: id,
      level,
      mealContext,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Registro de glucosa actualizado exitosamente',
      data: glucoseReading
    });
  } catch (error) {
    logger.error('Error al actualizar registro de glucosa', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId: req.user?._id,
      glucoseId: req.params.id,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el registro de glucosa',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const deleteGlucoseReading = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      logger.warn('Intento de eliminar registro de glucosa sin autenticación', {
        id,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const glucoseReading = await Glucose.findOneAndDelete({ _id: id, userId });

    if (!glucoseReading) {
      logger.warn('Registro de glucosa no encontrado para eliminación', {
        id,
        userId,
        ip: req.ip
      });
      return res.status(404).json({
        success: false,
        message: 'Registro de glucosa no encontrado'
      });
    }

    logger.info('Registro de glucosa eliminado exitosamente', {
      userId,
      glucoseId: id,
      level: glucoseReading.level,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Registro de glucosa eliminado exitosamente'
    });
  } catch (error) {
    logger.error('Error al eliminar registro de glucosa', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId: req.user?._id,
      glucoseId: req.params.id,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el registro de glucosa',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getGlucoseStatistics = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { days = 30 } = req.query;

    if (!userId) {
      logger.warn('Intento de obtener estadísticas de glucosa sin autenticación', {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const glucoseReadings = await Glucose.find({
      userId,
      date: { $gte: startDate }
    }).sort({ date: 1, time: 1 });

    if (glucoseReadings.length === 0) {
      logger.info('No hay registros de glucosa para calcular estadísticas', {
        userId,
        days,
        ip: req.ip
      });
      return res.json({
        success: true,
        message: 'No hay registros de glucosa en el período especificado',
        data: {
          average: 0,
          min: 0,
          max: 0,
          totalCount: 0,
          readingsByContext: {},
          trend: 'stable'
        }
      });
    }

    // Calcular estadísticas
    const levels = glucoseReadings.map(reading => reading.level);
    const average = levels.reduce((sum, level) => sum + level, 0) / levels.length;
    const min = Math.min(...levels);
    const max = Math.max(...levels);

    // Agrupar por contexto de comida
    const readingsByContext: Record<string, number[]> = {};
    glucoseReadings.forEach(reading => {
      if (!readingsByContext[reading.mealContext]) {
        readingsByContext[reading.mealContext] = [];
      }
      readingsByContext[reading.mealContext].push(reading.level);
    });

    // Calcular promedios por contexto
    const contextAverages: Record<string, number> = {};
    Object.keys(readingsByContext).forEach(context => {
      const contextLevels = readingsByContext[context];
      contextAverages[context] = contextLevels.reduce((sum, level) => sum + level, 0) / contextLevels.length;
    });

    // Calcular tendencia (simple - comparar primer y último tercio)
    let trend: 'improving' | 'worsening' | 'stable' = 'stable';
    if (glucoseReadings.length >= 6) {
      const firstThird = glucoseReadings.slice(0, Math.floor(glucoseReadings.length / 3));
      const lastThird = glucoseReadings.slice(-Math.floor(glucoseReadings.length / 3));
      
      const firstAvg = firstThird.reduce((sum, reading) => sum + reading.level, 0) / firstThird.length;
      const lastAvg = lastThird.reduce((sum, reading) => sum + reading.level, 0) / lastThird.length;
      
      if (lastAvg < firstAvg * 0.95) {
        trend = 'improving';
      } else if (lastAvg > firstAvg * 1.05) {
        trend = 'worsening';
      }
    }

    logger.info('Estadísticas de glucosa calculadas exitosamente', {
      userId,
      days,
      count: glucoseReadings.length,
      average: Math.round(average * 100) / 100,
      min,
      max,
      trend,
      ip: req.ip
    });

    res.json({
      success: true,
      data: {
        average: Math.round(average * 100) / 100,
        min,
        max,
        totalCount: glucoseReadings.length,
        contextAverages,
        trend,
        dateRange: {
          start: startDate,
          end: new Date()
        }
      }
    });
  } catch (error) {
    logger.error('Error al obtener estadísticas de glucosa', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId: req.user?._id,
      ip: req.ip
    });
    res.status(500).json({
      success: false,
      message: 'Error al obtener las estadísticas de glucosa',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};