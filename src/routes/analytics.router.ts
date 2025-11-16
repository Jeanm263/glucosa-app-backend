import { Router } from 'express';
import {
  getGlucoseTrends,
  getFoodPatterns,
  getUserProgress
} from '../controllers/analytics.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Rutas para análisis y estadísticas
router.get('/glucose-trends', getGlucoseTrends);
router.get('/food-patterns', getFoodPatterns);
router.get('/progress', getUserProgress);

export default router;