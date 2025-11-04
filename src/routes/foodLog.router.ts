import { Router } from 'express';
import {
  getAllFoodLogs,
  getFoodLogById,
  createFoodLog,
  updateFoodLog,
  deleteFoodLog,
  getDailyNutritionSummary
} from '../controllers/foodLog.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Rutas protegidas (requieren autenticación)
router.get('/', authenticateToken, getAllFoodLogs);
router.get('/summary', authenticateToken, getDailyNutritionSummary);
router.get('/:id', authenticateToken, getFoodLogById);
router.post('/', authenticateToken, createFoodLog);
router.put('/:id', authenticateToken, updateFoodLog);
router.delete('/:id', authenticateToken, deleteFoodLog);

export default router;