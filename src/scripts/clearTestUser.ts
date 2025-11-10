import mongoose from 'mongoose';
import User from '../models/user.model';
import { connectDB } from '../config/db';

const clearTestUser = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Eliminar el usuario de test
    const result = await User.deleteOne({ email: 'test@example.com' });
    
    if (result.deletedCount > 0) {
      console.log('✅ Usuario de test eliminado correctamente');
    } else {
      console.log('ℹ️  No se encontró el usuario de test');
    }
    
    // Cerrar la conexión
    await mongoose.connection.close();
    console.log('Conexión cerrada');
  } catch (error) {
    console.error('❌ Error al eliminar el usuario de test:', error);
    await mongoose.connection.close();
  }
};

clearTestUser();