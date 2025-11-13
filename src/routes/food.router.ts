import { Router } from 'express';
import {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  searchFoods,
  getFoodCategories
} from '../controllers/food.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { cacheMiddleware, clearCacheMiddleware } from '../middlewares/cache.middleware';

const router = Router();

// Rutas protegidas (requieren autenticación)
router.get('/', authenticateToken, cacheMiddleware(300), getAllFoods);
router.get('/search', authenticateToken, cacheMiddleware(300), searchFoods);
router.get('/categories', authenticateToken, cacheMiddleware(600), getFoodCategories);
router.get('/:id', authenticateToken, cacheMiddleware(300), getFoodById);
router.post('/', authenticateToken, clearCacheMiddleware, createFood);
router.put('/:id', authenticateToken, clearCacheMiddleware, updateFood);
router.delete('/:id', authenticateToken, clearCacheMiddleware, deleteFood);

export default router;