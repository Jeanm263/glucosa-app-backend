import { Router } from 'express';
import { 
  createGlucoseReading,
  getGlucoseReadings,
  getGlucoseReadingById,
  updateGlucoseReading,
  deleteGlucoseReading,
  getGlucoseStatistics
} from '../controllers/glucose.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Rutas para registros de glucosa
router.post('/', createGlucoseReading);
router.get('/', getGlucoseReadings);
router.get('/statistics', getGlucoseStatistics);
router.get('/:id', getGlucoseReadingById);
router.put('/:id', updateGlucoseReading);
router.delete('/:id', deleteGlucoseReading);

export default router;