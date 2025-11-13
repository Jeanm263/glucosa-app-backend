import { Request, Response } from 'express';
import Notification from '../models/notification.model';
import logger from '../utils/logger';

// Almacenamiento en memoria para suscripciones (en producción usar base de datos)
let subscriptions: any[] = [];

// Obtener todas las notificaciones
export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, unreadOnly = false } = req.query;
    
    // Construir filtro
    const filter: any = { userId: (req as any).user._id };
    if (unreadOnly === 'true') {
      filter.isRead = false;
    }
    
    // Obtener notificaciones con paginación
    const notifications = await Notification.find(filter)
      .sort({ scheduledAt: -1 })
      .limit(parseInt(limit as string))
      .skip((parseInt(page as string) - 1) * parseInt(limit as string));
    
    // Contar total
    const total = await Notification.countDocuments(filter);
    
    res.json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    logger.error('Error al obtener notificaciones', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener notificaciones'
    });
  }
};

// Obtener una notificación por ID
export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({
      _id: id,
      userId: (req as any).user._id
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    logger.error('Error al obtener notificación', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener notificación'
    });
  }
};

// Crear una nueva notificación
export const createNotification = async (req: Request, res: Response) => {
  try {
    const notificationData = {
      ...req.body,
      userId: (req as any).user._id
    };
    
    const notification = new Notification(notificationData);
    await notification.save();
    
    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    logger.error('Error al crear notificación', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear notificación'
    });
  }
};

// Actualizar una notificación
export const updateNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: (req as any).user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: notification
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    logger.error('Error al actualizar notificación', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar notificación'
    });
  }
};

// Eliminar una notificación
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId: (req as any).user._id
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Notificación eliminada correctamente'
    });
  } catch (error) {
    logger.error('Error al eliminar notificación', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar notificación'
    });
  }
};

// Marcar notificación como leída
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: (req as any).user._id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    logger.error('Error al marcar notificación como leída', error);
    res.status(500).json({
      success: false,
      message: 'Error al marcar notificación como leída'
    });
  }
};

// Marcar todas las notificaciones como leídas
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const result = await Notification.updateMany(
      { userId: (req as any).user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    
    res.json({
      success: true,
      message: `Se marcaron ${result.modifiedCount} notificaciones como leídas`
    });
  } catch (error) {
    logger.error('Error al marcar todas las notificaciones como leídas', error);
    res.status(500).json({
      success: false,
      message: 'Error al marcar todas las notificaciones como leídas'
    });
  }
};

// Suscribir a notificaciones push
export const subscribeToPush = async (req: Request, res: Response) => {
  try {
    const subscription = req.body;
    
    // Verificar que la suscripción no exista ya
    const exists = subscriptions.some(sub => 
      sub.endpoint === subscription.endpoint
    );
    
    if (!exists) {
      subscriptions.push(subscription);
      logger.info('Nueva suscripción a notificaciones push', { 
        endpoint: subscription.endpoint 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Suscripción registrada correctamente' 
    });
  } catch (error) {
    logger.error('Error al suscribir a notificaciones push', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al suscribir a notificaciones push' 
    });
  }
};

// Enviar notificación a todos (simulado)
export const sendNotificationToAll = async (req: Request, res: Response) => {
  try {
    const { title, message, userId } = req.body;
    
    // Crear payload de notificación
    const payload = JSON.stringify({
      title,
      message,
      timestamp: new Date().toISOString()
    });
    
    // Simular envío de notificaciones (webpush deshabilitado)
    logger.info('Notificaciones simuladas (webpush deshabilitado)', { 
      count: subscriptions.length,
      title,
      message
    });
    
    res.json({ 
      success: true, 
      message: 'Notificaciones simuladas correctamente (webpush deshabilitado)' 
    });
  } catch (error) {
    logger.error('Error al enviar notificaciones', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al enviar notificaciones' 
    });
  }
};

// Enviar notificación personalizada (simulado)
export const sendPersonalizedNotification = async (userId: string, title: string, message: string) => {
  try {
    // En un entorno real, filtraríamos por userId
    const payload = JSON.stringify({
      title,
      message,
      userId,
      timestamp: new Date().toISOString()
    });
    
    // Simular envío de notificaciones (webpush deshabilitado)
    logger.info('Notificaciones personalizadas simuladas (webpush deshabilitado)', { 
      userId,
      title,
      message
    });
  } catch (error) {
    logger.error('Error al enviar notificaciones personalizadas', error);
  }
};

// Obtener estadísticas de notificaciones
export const getNotificationStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    
    const total = await Notification.countDocuments({ userId });
    const unread = await Notification.countDocuments({ userId, isRead: false });
    const read = total - unread;
    
    res.json({
      success: true,
      data: {
        total,
        unread,
        read,
        unreadPercentage: total > 0 ? Math.round((unread / total) * 100) : 0
      }
    });
  } catch (error) {
    logger.error('Error al obtener estadísticas de notificaciones', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de notificaciones'
    });
  }
};

// Función para enviar recordatorios automáticos (simulado)
export const sendReminderNotifications = async () => {
  try {
    const now = new Date();
    const hour = now.getHours();
    
    // Recordatorios según la hora del día
    let title = '';
    let message = '';
    
    if (hour === 8) {
      title = '⏰ Recordatorio de Desayuno';
      message = 'No olvides registrar tu desayuno y nivel de glucosa';
    } else if (hour === 13) {
      title = '⏰ Recordatorio de Almuerzo';
      message = 'Es hora de registrar tu almuerzo y nivel de glucosa';
    } else if (hour === 19) {
      title = '⏰ Recordatorio de Cena';
      message = 'No olvides registrar tu cena y nivel de glucosa';
    } else if (hour === 21) {
      title = '💊 Recordatorio de Medicación';
      message = '¿Tomaste tu medicación hoy? Registra tu nivel de glucosa';
    }
    
    if (title && message) {
      await sendPersonalizedNotification('all', title, message);
    }
  } catch (error) {
    logger.error('Error al enviar recordatorios automáticos', error);
  }
};