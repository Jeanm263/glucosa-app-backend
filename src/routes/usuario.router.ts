import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router();

// Rutas de autenticación
router.post('/register', register);
router.post('/login', login);

// Ruta de prueba
router.get('/', (_req, res) => {
  res.json({ message: 'Ruta usuarios funcionando' });
});

export default router;
