import { Request, Response } from 'express';
import logger from '../utils/logger';

// Interfaz para los recordatorios
interface Reminder {
  id: string;
  userId: string;
  title: string;
  description: string;
  time: string; // HH:MM format
  days: number[]; // 0-6 (Domingo-Sábado)
  enabled: boolean;
  type: 'glucose' | 'medication' | 'meal' | 'exercise' | 'other';
  createdAt: string;
  updatedAt: string;
}

// Datos mock para recordatorios
const mockReminders: Reminder[] = [
  {
    id: '1',
    userId: 'user123',
    title: 'Medir glucosa',
    description: 'Medir nivel de glucosa antes del desayuno',
    time: '08:00',
    days: [0, 1, 2, 3, 4, 5, 6], // Todos los días
    enabled: true,
    type: 'glucose',
    createdAt: '2025-11-01T10:00:00Z',
    updatedAt: '2025-11-01T10:00:00Z'
  },
  {
    id: '2',
    userId: 'user123',
    title: 'Tomar medicación',
    description: 'Tomar metformina después de la cena',
    time: '19:30',
    days: [0, 1, 2, 3, 4, 5, 6], // Todos los días
    enabled: true,
    type: 'medication',
    createdAt: '2025-11-01T10:00:00Z',
    updatedAt: '2025-11-01T10:00:00Z'
  }
];

// Controlador para crear un recordatorio
export const createReminder = async (req: Request, res: Response) => {
  try {
    const { title, description, time, days, type } = req.body;
    const userId = (req as any).user?.id;

    // Validación básica
    if (!title || !time || !days || !type) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: title, time, days, type'
      });
    }

    const newReminder: Reminder = {
      id: Date.now().toString(),
      userId,
      title,
      description: description || '',
      time,
      days,
      enabled: true,
      type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockReminders.push(newReminder);

    logger.info('🔔 Recordatorio creado para usuario: %s', userId);
    res.status(201).json({
      success: true,
      data: newReminder,
      message: 'Recordatorio creado exitosamente'
    });
  } catch (error) {
    logger.error('Error creando recordatorio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear recordatorio'
    });
  }
};

// Controlador para obtener recordatorios
export const getReminders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const userReminders = mockReminders.filter(reminder => reminder.userId === userId);

    logger.info('📋 Recordatorios obtenidos para usuario: %s', userId);
    res.json({
      success: true,
      data: userReminders,
      message: 'Recordatorios obtenidos exitosamente'
    });
  } catch (error) {
    logger.error('Error obteniendo recordatorios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener recordatorios'
    });
  }
};

// Controlador para actualizar un recordatorio
export const updateReminder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const updateData = req.body;

    const reminderIndex = mockReminders.findIndex(
      reminder => reminder.id === id && reminder.userId === userId
    );

    if (reminderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Recordatorio no encontrado'
      });
    }

    // Actualizar solo los campos proporcionados
    const updatedReminder = {
      ...mockReminders[reminderIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    mockReminders[reminderIndex] = updatedReminder;

    logger.info('✏️ Recordatorio actualizado para usuario: %s', userId);
    res.json({
      success: true,
      data: updatedReminder,
      message: 'Recordatorio actualizado exitosamente'
    });
  } catch (error) {
    logger.error('Error actualizando recordatorio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar recordatorio'
    });
  }
};

// Controlador para eliminar un recordatorio
export const deleteReminder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const reminderIndex = mockReminders.findIndex(
      reminder => reminder.id === id && reminder.userId === userId
    );

    if (reminderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Recordatorio no encontrado'
      });
    }

    mockReminders.splice(reminderIndex, 1);

    logger.info('🗑️ Recordatorio eliminado para usuario: %s', userId);
    res.json({
      success: true,
      message: 'Recordatorio eliminado exitosamente'
    });
  } catch (error) {
    logger.error('Error eliminando recordatorio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar recordatorio'
    });
  }
};