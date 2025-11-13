import { Router } from 'express';
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsRead,
  subscribeToPush,
  sendNotificationToAll
} from '../controllers/notification.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Rutas protegidas (requieren autenticación)
router.get('/', authenticateToken, getAllNotifications);
router.get('/:id', authenticateToken, getNotificationById);
router.post('/', authenticateToken, createNotification);
router.put('/:id', authenticateToken, updateNotification);
router.delete('/:id', authenticateToken, deleteNotification);
router.patch('/:id/read', authenticateToken, markAsRead);
router.patch('/read-all', authenticateToken, markAllAsRead);

// Rutas para notificaciones push
router.post('/subscribe', authenticateToken, subscribeToPush);
router.post('/send', authenticateToken, sendNotificationToAll);

export default router;