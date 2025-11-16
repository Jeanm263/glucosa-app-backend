import { Router } from 'express';
import {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder
} from '../controllers/reminders.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Rutas para recordatorios
router.post('/', createReminder);
router.get('/', getReminders);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

export default router;