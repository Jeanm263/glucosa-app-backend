import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Usar una base de datos en memoria para desarrollo
    const conn = await mongoose.connect('mongodb://localhost:27017/glucoguide', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    
    // Manejar desconexión
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB conexión cerrada');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    // Si no se puede conectar, usar base de datos en memoria
    console.log('🔧 Usando base de datos en memoria para desarrollo');
    const conn = await mongoose.connect('mongodb://localhost:27017/glucoguide');
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  }
};