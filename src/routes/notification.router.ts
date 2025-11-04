import { Router } from 'express';
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAsUnread,
  getUnreadNotifications,
  markAllAsRead
} from '../controllers/notification.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Rutas protegidas (requieren autenticación)
router.get('/', authenticateToken, getAllNotifications);
router.get('/unread', authenticateToken, getUnreadNotifications);
router.get('/:id', authenticateToken, getNotificationById);
router.post('/', authenticateToken, createNotification);
router.put('/:id', authenticateToken, updateNotification);
router.delete('/:id', authenticateToken, deleteNotification);
router.patch('/:id/read', authenticateToken, markAsRead);
router.patch('/:id/unread', authenticateToken, markAsUnread);
router.patch('/read-all', authenticateToken, markAllAsRead);

export default router;