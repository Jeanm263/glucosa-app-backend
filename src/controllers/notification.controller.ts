import { Request, Response } from 'express';
import webpush from 'web-push';
import logger from '../utils/logger';

// Almacenamiento en memoria para suscripciones (en producción usar base de datos)
 
let subscriptions: any[] = [];

// Configurar VAPID keys
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    'mailto:admin@glucoguide.com',
    vapidPublicKey,
    vapidPrivateKey
  );
}

// Suscribir a notificaciones
export const subscribeToNotifications = async (req: Request, res: Response) => {
  try {
    const subscription = req.body;
    
    // Verificar si la suscripción ya existe
    const exists = subscriptions.some((sub: any) => 
      sub.endpoint === subscription.endpoint
    );
    
    if (!exists) {
      subscriptions.push(subscription);
      logger.info('Nueva suscripción añadida', { endpoint: subscription.endpoint });
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Suscripción añadida correctamente' 
    });
  } catch (error: any) {
    logger.error('Error al suscribir a notificaciones:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al suscribir a notificaciones',
      error: error.message
    });
  }
};

// Cancelar suscripción a notificaciones
export const unsubscribeFromNotifications = async (req: Request, res: Response) => {
  try {
    const { endpoint } = req.body;
    
    subscriptions = subscriptions.filter((sub: any) => 
      sub.endpoint !== endpoint
    );
    
    logger.info('Suscripción eliminada', { endpoint });
    
    res.json({ 
      success: true, 
      message: 'Suscripción eliminada correctamente' 
    });
  } catch (error: any) {
    logger.error('Error al cancelar suscripción:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al cancelar suscripción',
      error: error.message
    });
  }
};

// Enviar notificación a todos los suscriptores
export const sendNotificationToAll = async (req: Request, res: Response) => {
  try {
    const { title, body, icon, badge } = req.body;
    const payload = JSON.stringify({
      title,
      body,
      icon: icon || '/icon-192x192.png',
      badge: badge || '/badge-72x72.png',
      timestamp: Date.now()
    });

    // Enviar notificación a todas las suscripciones
    const sendPromises = subscriptions.map((subscription: any) => {
      return webpush.sendNotification(subscription, payload)
        .catch((error: any) => {
          logger.error('Error enviando notificación:', error);
          
          // Si la suscripción ya no es válida, eliminarla
          if (error.statusCode === 410) {
            subscriptions = subscriptions.filter((sub: any) => 
              sub.endpoint !== subscription.endpoint
            );
            logger.info('Suscripción eliminada por ser inválida', { 
              endpoint: subscription.endpoint 
            });
          }
        });
    });

    await Promise.all(sendPromises);
    
    res.json({ 
      success: true, 
      message: 'Notificaciones enviadas correctamente' 
    });
  } catch (error: any) {
    logger.error('Error al enviar notificaciones:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al enviar notificaciones',
      error: error.message
    });
  }
};

// Enviar notificación a un usuario específico
export const sendNotificationToUser = async (req: Request, res: Response) => {
  try {
    const { userId, title, body, icon, badge } = req.body;
    
    // En este ejemplo, enviamos a todas las suscripciones
    // En una implementación real, filtraríamos por userId
    const payload = JSON.stringify({
      title,
      body,
      icon: icon || '/icon-192x192.png',
      badge: badge || '/badge-72x72.png',
      timestamp: Date.now(),
      userId
    });

    const sendPromises = subscriptions.map((subscription: any) => {
      return webpush.sendNotification(subscription, payload)
        .catch((error: any) => {
          logger.error('Error enviando notificación a usuario:', error);
          
          if (error.statusCode === 410) {
            subscriptions = subscriptions.filter((sub: any) => 
              sub.endpoint !== subscription.endpoint
            );
            logger.info('Suscripción eliminada por ser inválida', { 
              endpoint: subscription.endpoint 
            });
          }
        });
    });

    await Promise.all(sendPromises);
    
    res.json({ 
      success: true, 
      message: 'Notificaciones enviadas al usuario correctamente' 
    });
  } catch (error: any) {
    logger.error('Error al enviar notificación al usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al enviar notificación al usuario',
      error: error.message
    });
  }
};

// Obtener estadísticas de notificaciones
export const getNotificationStats = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        totalSubscriptions: subscriptions.length,
        // En una implementación real, aquí se incluirían más estadísticas
      }
    });
  } catch (error: any) {
    logger.error('Error al obtener estadísticas de notificaciones:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener estadísticas de notificaciones',
      error: error.message
    });
  }
};