// src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import mongoose from 'mongoose'; // Comentado porque no se usa directamente
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import { metricsMiddleware, metricsEndpoint } from './middlewares/metrics.middleware';
import logger from './utils/logger';

// Importar rutas
import usuarioRoutes from './routes/usuario.router';
import foodRoutes from './routes/food.router';
import authRoutes from './routes/auth.router';
import educationRoutes from './routes/education.router';
import foodLogRoutes from './routes/foodLog.router';
import mealPlanRoutes from './routes/mealPlan.router';
import notificationRoutes from './routes/notification.router';
import symptomRoutes from './routes/symptom.router';
import glucoseRoutes from './routes/glucose.router';
import analyticsRoutes from './routes/analytics.router';
import remindersRoutes from './routes/reminders.router';
import achievementsRoutes from './routes/achievements.router';

dotenv.config();

const app = express();
// const PORT = process.env.PORT || 4000; // Comentado porque no se usa directamente

// Configuración de seguridad
app.use(helmet());

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes por ventana
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta nuevamente más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Configuración de CORS para permitir solicitudes del frontend
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://glucosa-app-frontend.onrender.com', // URL del frontend en Render
      'https://glucosa-app-backend.onrender.com', // URL de tu backend en Render
      'capacitor://localhost', // Para aplicaciones Capacitor
      'http://localhost', // Para aplicaciones móviles
      'http://localhost:8080', // Para Capacitor en algunos casos
      'capacitor://localhost:8080' // Para Capacitor en algunos casos
    ];
    
    // Permitir solicitudes sin origen (como mobile apps o curl)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    // Permitir si el origen está en la lista de permitidos
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Para aplicaciones móviles, siempre permitir (necesario para Capacitor)
      // Verificar si es una aplicación móvil por el esquema
      if (origin.startsWith('capacitor://') || origin.startsWith('http://localhost')) {
        logger.debug('Permitiendo origen móvil: %s', origin);
        callback(null, true);
      } else {
        // En producción, ser más estricto con los orígenes
        if (process.env.NODE_ENV === 'production') {
          logger.debug('Origen no permitido en producción: %s', origin);
          callback(new Error('Origen no permitido por CORS'));
        } else {
          // En desarrollo, permitir para facilitar el desarrollo
          logger.debug('Origen no en lista permitida, pero permitiendo en desarrollo: %s', origin);
          callback(null, true);
        }
      }
    }
  },
  credentials: true,
};

// Middleware
logger.debug('Configurando middlewares...');
app.use(compression());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(metricsMiddleware);
logger.debug('Middlewares configurados');

// Rutas
logger.debug('Registrando rutas...');
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/food-logs', foodLogRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/glucose', glucoseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/achievements', achievementsRoutes);
logger.debug('Rutas registradas correctamente');

// Ruta de salud
app.get('/api/health', (req, res) => {
  logger.info('✅ Health check recibido');
  res.json({ 
    status: 'OK', 
    message: 'Backend funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Endpoint de métricas
app.get('/api/metrics', metricsEndpoint);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenido a Glucosa-App Backend',
    endpoints: {
      health: '/api/health',
      auth: '/api/usuarios',
      foods: '/api/foods',
      education: '/api/education',
      foodLogs: '/api/food-logs',
      mealPlans: '/api/meal-plans',
      notifications: '/api/notifications',
      symptoms: '/api/symptoms',
      glucose: '/api/glucose',
      analytics: '/api/analytics',
      reminders: '/api/reminders',
      achievements: '/api/achievements'
    }
  });
});

// Exportar la aplicación para que pueda ser usada por index.ts
export default app;

logger.debug('🔄 app.ts cargado - servidor listo para iniciar');