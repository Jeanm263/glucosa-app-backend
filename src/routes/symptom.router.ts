import { Router } from 'express';
import {
  getAllSymptoms,
  getSymptomById,
  createSymptom,
  updateSymptom,
  deleteSymptom,
  getSymptomStats
} from '../controllers/symptom.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Rutas protegidas (requieren autenticación)
router.get('/', authenticateToken, getAllSymptoms);
router.get('/stats', authenticateToken, getSymptomStats);
router.get('/:id', authenticateToken, getSymptomById);
router.post('/', authenticateToken, createSymptom);
router.put('/:id', authenticateToken, updateSymptom);
router.delete('/:id', authenticateToken, deleteSymptom);

export default router;