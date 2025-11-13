import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/glucoguide';
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
    process.exit(1);
  }
};