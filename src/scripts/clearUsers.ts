import mongoose from 'mongoose';
import User from '../models/user.model';
import { connectDB } from '../config/db';

const clearUsers = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Eliminar todos los usuarios
    const result = await User.deleteMany({});
    
    console.log(`✅ ${result.deletedCount} usuarios eliminados correctamente`);
    
    // Cerrar la conexión
    await mongoose.connection.close();
    console.log('Conexión cerrada');
  } catch (error) {
    console.error('❌ Error al eliminar usuarios:', error);
    await mongoose.connection.close();
  }
};

clearUsers();