import { Router } from 'express';
import {
  getUserAchievements,
  unlockAchievement,
  getAvailableRewards,
  claimReward
} from '../controllers/achievements.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Rutas para logros y recompensas
router.get('/', getUserAchievements);
router.post('/unlock', unlockAchievement);
router.get('/rewards', getAvailableRewards);
router.post('/rewards/claim', claimReward);

export default router;