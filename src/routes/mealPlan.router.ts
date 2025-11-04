import { Router } from 'express';
import {
  getAllMealPlans,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
  generateShoppingList
} from '../controllers/mealPlan.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Rutas protegidas (requieren autenticación)
router.get('/', authenticateToken, getAllMealPlans);
router.get('/:id', authenticateToken, getMealPlanById);
router.post('/', authenticateToken, createMealPlan);
router.put('/:id', authenticateToken, updateMealPlan);
router.delete('/:id', authenticateToken, deleteMealPlan);
router.get('/:id/shopping-list', authenticateToken, generateShoppingList);

export default router;