import { Router } from 'express';
import {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood
} from '../controllers/food.controller';

const router = Router();

// Rutas públicas
router.get('/', getAllFoods);
router.get('/:id', getFoodById);

// Rutas protegidas (requieren autenticación)
// router.post('/', authenticateToken, createFood);
// router.put('/:id', authenticateToken, updateFood);
// router.delete('/:id', authenticateToken, deleteFood);

export default router;