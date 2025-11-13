import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import redisClient from './config/redis';

// Importar modelo de alimentos para inicializar datos
import Food from './models/food.model';
import { INITIAL_FOODS } from './constants/foodsData';

// Importar modelo de educación para inicializar datos
import Education from './models/education.model';
import { INITIAL_EDUCATION } from './constants/educationData';

dotenv.config();

const PORT = process.env.PORT || 4000;

// Función para inicializar datos de alimentos
const initializeFoodData = async () => {
  try {
    const count = await Food.countDocuments();
    if (count === 0) {
      console.log('🌱 Inicializando datos de alimentos...');
      await Food.insertMany(INITIAL_FOODS);
      console.log('✅ Datos de alimentos inicializados correctamente');
    }
  } catch (error) {
    console.error('❌ Error al inicializar datos de alimentos:', error);
  }
};

// Función para inicializar datos educativos
const initializeEducationData = async () => {
  try {
    const count = await Education.countDocuments();
    if (count === 0) {
      console.log('📚 Inicializando datos educativos...');
      await Education.insertMany(INITIAL_EDUCATION);
      console.log('✅ Datos educativos inicializados correctamente');
    }
  } catch (error) {
    console.error('❌ Error al inicializar datos educativos:', error);
  }
};

// Conexión a la base de datos y Redis, y arranque del servidor
connectDB().then(async () => {
  // Conectar a Redis
  // redisClient.connect(); // Comentado para usar mock de Redis
  
  // Inicializar datos
  await initializeFoodData();
  await initializeEducationData();
  
  app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 SERVIDOR INICIADO CORRECTAMENTE`);
    console.log(`📍 Puerto: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`✅ Health: http://localhost:${PORT}/api/health`);
    console.log('='.repeat(50));
  });
});