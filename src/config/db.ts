import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    // Usar MongoDB Atlas o fallback a localhost
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/glucoguide';
    
    // Para pruebas en Deployra, usar una conexión que no falle
    console.log(` Intentando conectar a MongoDB: ${mongoUri}`);
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    
    // Manejar desconexión
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB conexión cerrada');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    // En producción, continuar sin MongoDB si es necesario para pruebas
    console.log('⚠️  Continuando sin conexión a MongoDB para pruebas');
  }
};