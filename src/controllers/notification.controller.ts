import { Request, Response } from 'express';
import Notification, { INotification } from '../models/notification.model';

export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const { userId, isRead, type, limit = 20, skip = 0 } = req.query;
    
    // Construir filtro
    const filter: any = {};
    
    if (userId) {
      filter.userId = userId;
    }
    
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }
    
    if (type) {
      filter.type = type;
    }
    
    const notifications = await Notification.find(filter)
      .populate('userId', 'name email')
      .sort({ scheduledAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));
    
    const total = await Notification.countDocuments(filter);
    
    res.json({
      success: true,
      count: notifications.length,
      total,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las notificaciones',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id)
      .populate('userId', 'name email');
    
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
    res.status(500).json({
      success: false,
      message: 'Error al obtener la notificación',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    
    // Poblar las referencias antes de enviar la respuesta
    const populatedNotification = await Notification.findById(notification._id)
      .populate('userId', 'name email');
    
    res.status(201).json({
      success: true,
      data: populatedNotification
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
      message: 'Error al crear la notificación',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const updateNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('userId', 'name email');
    
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
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la notificación',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);
    
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
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la notificación',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Marcar notificación como leída
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { 
        isRead: true,
        readAt: new Date()
      },
      { new: true }
    ).populate('userId', 'name email');
    
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
    res.status(500).json({
      success: false,
      message: 'Error al marcar la notificación como leída',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Marcar notificación como no leída
export const markAsUnread = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { 
        isRead: false,
        readAt: null
      },
      { new: true }
    ).populate('userId', 'name email');
    
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
    res.status(500).json({
      success: false,
      message: 'Error al marcar la notificación como no leída',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener notificaciones no leídas
export const getUnreadNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere userId'
      });
    }
    
    const notifications = await Notification.find({
      userId,
      isRead: false
    })
      .populate('userId', 'name email')
      .sort({ scheduledAt: -1 });
    
    res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las notificaciones no leídas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Marcar todas las notificaciones como leídas
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere userId'
      });
    }
    
    const result = await Notification.updateMany(
      { 
        userId,
        isRead: false
      },
      { 
        isRead: true,
        readAt: new Date()
      }
    );
    
    res.json({
      success: true,
      message: `Se marcaron ${result.modifiedCount} notificaciones como leídas`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al marcar todas las notificaciones como leídas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};