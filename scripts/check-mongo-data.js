/* eslint-disable */
import mongoose from 'mongoose';

// Tu cadena de conexión de MongoDB Atlas
const MONGO_URI = 'mongodb+srv://glucoguideuser:07636410@cluster0.ay6rjni.mongodb.net/glucoguide?retryWrites=true&w=majority';

async function checkMongoData() {
  try {
    // Conectar a MongoDB
    console.log('Conectando a MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conexión exitosa a MongoDB Atlas');
    
    // Verificar que la conexión esté activa
    if (mongoose.connection.readyState !== 1) {
      console.log('❌ No hay conexión activa a la base de datos');
      return;
    }
    
    // Obtener las colecciones disponibles
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Colecciones en la base de datos:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    // Verificar datos en colecciones específicas
    console.log('\n📊 Verificando datos en colecciones...');
    
    // Verificar usuarios
    try {
      const usersCount = await db.collection('users').countDocuments();
      console.log(`  👤 Usuarios: ${usersCount} documentos`);
      
      if (usersCount > 0) {
        const sampleUsers = await db.collection('users').find().limit(3).toArray();
        console.log('  Ejemplos de usuarios:');
        sampleUsers.forEach(user => {
          console.log(`    - ${user.name || user.email || user._id}`);
        });
      }
    } catch (error) {
      console.log('  👤 Colección de usuarios no encontrada o error al acceder');
    }
    
    // Verificar alimentos
    try {
      const foodsCount = await db.collection('foods').countDocuments();
      console.log(`  🍎 Alimentos: ${foodsCount} documentos`);
      
      if (foodsCount > 0) {
        const sampleFoods = await db.collection('foods').find().limit(3).toArray();
        console.log('  Ejemplos de alimentos:');
        sampleFoods.forEach(food => {
          console.log(`    - ${food.name} (${food.category})`);
        });
      }
    } catch (error) {
      console.log('  🍎 Colección de alimentos no encontrada o error al acceder');
    }
    
    // Verificar educación
    try {
      const educationCount = await db.collection('education').countDocuments();
      console.log(`  📚 Educación: ${educationCount} documentos`);
      
      if (educationCount > 0) {
        const sampleEducation = await db.collection('education').find().limit(3).toArray();
        console.log('  Ejemplos de contenido educativo:');
        sampleEducation.forEach(edu => {
          console.log(`    - ${edu.title} (${edu.category})`);
        });
      }
    } catch (error) {
      console.log('  📚 Colección de educación no encontrada o error al acceder');
    }
    
    // Verificar registros de alimentos
    try {
      const foodLogsCount = await db.collection('foodlogs').countDocuments();
      console.log(`  📝 Registros de alimentos: ${foodLogsCount} documentos`);
    } catch (error) {
      console.log('  📝 Colección de registros de alimentos no encontrada o error al acceder');
    }
    
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('\n🔒 Conexión cerrada');
    
  } catch (error) {
    console.error('❌ Error al conectar o verificar datos:', error.message);
    if (error.reason) {
      console.error('   Detalles:', error.reason);
    }
  }
}

// Ejecutar la función
checkMongoData();