import dotenv from 'dotenv';
import { connectDB } from '../config/db';
import Food from '../models/food.model';
import { INITIAL_FOODS } from '../constants/foodsData';
import Education from '../models/education.model';
import { INITIAL_EDUCATION } from '../constants/educationData';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Eliminar datos existentes
    await Food.deleteMany({});
    console.log('🗑️  Datos anteriores de alimentos eliminados');
    
    // Insertar nuevos datos de alimentos
    await Food.insertMany(INITIAL_FOODS);
    console.log('🌱 Base de datos de alimentos inicializada con datos de ejemplo');
    
    // Eliminar datos existentes de educación
    await Education.deleteMany({});
    console.log('🗑️  Datos anteriores de educación eliminados');
    
    // Insertar nuevos datos educativos
    await Education.insertMany(INITIAL_EDUCATION);
    console.log('📚 Base de datos educativa inicializada con datos de ejemplo');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};

seedDatabase();