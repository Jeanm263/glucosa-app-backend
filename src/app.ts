// src/app.ts
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Importar rutas
import usuarioRoutes from './routes/usuario.router';
import foodRoutes from './routes/food.router';
import authRoutes from './routes/auth.router';
import educationRoutes from './routes/education.router';
import foodLogRoutes from './routes/foodLog.router';
import mealPlanRoutes from './routes/mealPlan.router';
import notificationRoutes from './routes/notification.router';
import symptomRoutes from './routes/symptom.router';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de CORS para permitir solicitudes del frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};

// Middleware
console.log('Configurando middlewares...');
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
console.log('Middlewares configurados');

// Rutas
console.log('Registrando rutas...');
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/food-logs', foodLogRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/symptoms', symptomRoutes);
console.log('Rutas registradas correctamente');

// Ruta de salud
app.get('/api/health', (req, res) => {
  console.log('✅ Health check recibido');
  res.json({ 
    status: 'OK', 
    message: 'Backend funcionando!',
    timestamp: new Date().toISOString()
  });
});

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
      symptoms: '/api/symptoms'
    }
  });
});

// Exportar la aplicación para que pueda ser usada por index.ts
export default app;

console.log('🔄 app.ts cargado - servidor listo para iniciar');