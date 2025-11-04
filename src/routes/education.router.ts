import { Router } from 'express';
import {
  getAllEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation
} from '../controllers/education.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Rutas públicas
router.get('/', getAllEducation);
router.get('/:id', getEducationById);

// Rutas protegidas (requieren autenticación)
router.post('/', authenticateToken, createEducation);
router.put('/:id', authenticateToken, updateEducation);
router.delete('/:id', authenticateToken, deleteEducation);

export default router;