import { Request, Response } from 'express';
import logger from '../utils/logger';

// Interfaz para logros
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  criteria: string;
}

// Interfaz para recompensas
interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  claimed: boolean;
  claimedAt?: string;
}

// Datos mock para logros
const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'Primer Registro',
    description: 'Registra tu primer nivel de glucosa',
    icon: '🎯',
    points: 10,
    unlocked: true,
    unlockedAt: '2025-10-15T10:00:00Z',
    criteria: 'first_glucose_reading'
  },
  {
    id: '2',
    name: 'Semana Perfecta',
    description: 'Registra glucosa 7 días consecutivos',
    icon: '🏆',
    points: 50,
    unlocked: true,
    unlockedAt: '2025-10-22T10:00:00Z',
    criteria: '7_consecutive_days'
  },
  {
    id: '3',
    name: 'Experto en Glucosa',
    description: 'Mantén niveles estables por 30 días',
    icon: '👑',
    points: 100,
    unlocked: false,
    criteria: '30_days_stable_glucose'
  },
  {
    id: '4',
    name: 'Nutricionista',
    description: 'Registra alimentos 100 veces',
    icon: '🍎',
    points: 75,
    unlocked: false,
    criteria: '100_food_entries'
  }
];

// Datos mock para recompensas
const mockRewards: Reward[] = [
  {
    id: '1',
    name: 'Fondo de pantalla exclusivo',
    description: 'Fondo de pantalla personalizado para tu móvil',
    icon: '📱',
    cost: 25,
    claimed: false
  },
  {
    id: '2',
    name: 'Guía de recetas',
    description: 'Libro de recetas diabéticas saludables',
    icon: '📚',
    cost: 50,
    claimed: false
  },
  {
    id: '3',
    name: 'Consulta gratuita',
    description: 'Consulta gratuita con nutricionista',
    icon: '👩‍⚕️',
    cost: 100,
    claimed: false
  }
];

// Puntos del usuario (mock)
let userPoints = 60;

// Controlador para obtener logros del usuario
export const getUserAchievements = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    
    logger.info('🏅 Logros obtenidos para usuario: %s', userId);
    res.json({
      success: true,
      data: {
        achievements: mockAchievements,
        points: userPoints
      },
      message: 'Logros obtenidos exitosamente'
    });
  } catch (error) {
    logger.error('Error obteniendo logros:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener logros'
    });
  }
};

// Controlador para desbloquear un logro
export const unlockAchievement = async (req: Request, res: Response) => {
  try {
    const { achievementId } = req.body;
    const userId = (req as any).user?.id;

    const achievement = mockAchievements.find(a => a.id === achievementId);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Logro no encontrado'
      });
    }

    if (achievement.unlocked) {
      return res.status(400).json({
        success: false,
        message: 'Logro ya desbloqueado'
      });
    }

    // Desbloquear el logro
    achievement.unlocked = true;
    achievement.unlockedAt = new Date().toISOString();
    userPoints += achievement.points;

    logger.info('🎊 Logro desbloqueado para usuario: %s - %s', userId, achievement.name);
    res.json({
      success: true,
      data: {
        achievement,
        points: userPoints
      },
      message: `¡Felicidades! Has desbloqueado: ${achievement.name}`
    });
  } catch (error) {
    logger.error('Error desbloqueando logro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al desbloquear logro'
    });
  }
};

// Controlador para obtener recompensas disponibles
export const getAvailableRewards = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    
    logger.info('🎁 Recompensas obtenidas para usuario: %s', userId);
    res.json({
      success: true,
      data: {
        rewards: mockRewards,
        points: userPoints
      },
      message: 'Recompensas obtenidas exitosamente'
    });
  } catch (error) {
    logger.error('Error obteniendo recompensas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener recompensas'
    });
  }
};

// Controlador para reclamar una recompensa
export const claimReward = async (req: Request, res: Response) => {
  try {
    const { rewardId } = req.body;
    const userId = (req as any).user?.id;

    const reward = mockRewards.find(r => r.id === rewardId);
    
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Recompensa no encontrada'
      });
    }

    if (reward.claimed) {
      return res.status(400).json({
        success: false,
        message: 'Recompensa ya reclamada'
      });
    }

    if (userPoints < reward.cost) {
      return res.status(400).json({
        success: false,
        message: `No tienes suficientes puntos. Necesitas ${reward.cost} puntos.`
      });
    }

    // Reclamar la recompensa
    reward.claimed = true;
    reward.claimedAt = new Date().toISOString();
    userPoints -= reward.cost;

    logger.info('🎉 Recompensa reclamada para usuario: %s - %s', userId, reward.name);
    res.json({
      success: true,
      data: {
        reward,
        points: userPoints
      },
      message: `¡Felicidades! Has reclamado: ${reward.name}`
    });
  } catch (error) {
    logger.error('Error reclamando recompensa:', error);
    res.status(500).json({
      success: false,
      message: 'Error al reclamar recompensa'
    });
  }
};