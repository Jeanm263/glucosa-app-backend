import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
// import redisClient from './config/redis'; // Comentado porque no se usa directamente

// Importar modelo de alimentos para inicializar datos
import Food from './models/food.model';
import { INITIAL_FOODS } from './constants/foodsData';

// Importar modelo de educación para inicializar datos
import Education from './models/education.model';
import { INITIAL_EDUCATION } from './constants/educationData';

dotenv.config();

const PORT = process.env.PORT || 4000;
// En entornos de contenedor, escuchar en todas las interfaces
const HOST = process.env.HOST || '0.0.0.0';

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
    // No detener la ejecución por errores en inicialización de datos
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
    // No detener la ejecución por errores en inicialización de datos
  }
};

// Conexión a la base de datos y arranque del servidor
connectDB().then(async () => {
  try {
    // Conectar a Redis
    // redisClient.connect(); // Comentado para usar mock de Redis
    
    // Inicializar datos (no bloqueante)
    await initializeFoodData();
    await initializeEducationData();
    
    const server = app.listen(PORT, HOST, () => {
      console.log('='.repeat(50));
      console.log(`🚀 SERVIDOR INICIADO CORRECTAMENTE`);
      console.log(`📍 Host: ${HOST}`);
      console.log(`📍 Puerto: ${PORT}`);
      console.log(`🌐 URL: http://${HOST}:${PORT}`);
      console.log(`✅ Health: http://${HOST}:${PORT}/api/health`);
      console.log('='.repeat(50));
    });
    
    // Manejo de errores del servidor
    server.on('error', (error) => {
      console.error('❌ Error en el servidor:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}).catch((error) => {
  console.error('❌ Error fatal al conectar a la base de datos:', error);
  console.log('🚨 El servidor no puede iniciarse debido a un error de conexión a la base de datos');
  process.exit(1);
});