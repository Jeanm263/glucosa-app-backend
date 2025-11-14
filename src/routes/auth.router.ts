import { Router } from 'express';
import { register, login, checkAuth, logout } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, checkAuth);
router.post('/logout', authenticateToken, logout); // Nueva ruta de logout

export default router;