/* eslint-disable */
const { MongoClient } = require('mongodb');

// Tu cadena de conexión de MongoDB Atlas (corregida)
const uri = "mongodb+srv://glucoguideuser:0763641029@cluster0.ay6rjni.mongodb.net/?appName=Cluster0";

async function testConnection() {
  const client = new MongoClient(uri);
  
  try {
    // Conectar al servidor
    console.log('Conectando a MongoDB Atlas...');
    await client.connect();
    console.log('✅ Conexión exitosa a MongoDB Atlas');
    
    // Listar bases de datos
    console.log('\n📋 Bases de datos disponibles:');
    const databases = await client.db().admin().listDatabases();
    databases.databases.forEach(db => {
      console.log(`  - ${db.name}`);
    });
    
    // Verificar base de datos específica
    const db = client.db('glucoguide');
    console.log('\n📊 Verificando base de datos "glucoguide":');
    
    // Listar colecciones
    const collections = await db.listCollections().toArray();
    console.log('  Colecciones:');
    collections.forEach(collection => {
      console.log(`    - ${collection.name}`);
    });
    
    // Contar documentos en colecciones principales
    if (collections.some(c => c.name === 'users')) {
      const usersCount = await db.collection('users').countDocuments();
      console.log(`  👤 Usuarios: ${usersCount} documentos`);
    }
    
    if (collections.some(c => c.name === 'foods')) {
      const foodsCount = await db.collection('foods').countDocuments();
      console.log(`  🍎 Alimentos: ${foodsCount} documentos`);
    }
    
    if (collections.some(c => c.name === 'education')) {
      const educationCount = await db.collection('education').countDocuments();
      console.log(`  📚 Educación: ${educationCount} documentos`);
    }
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    if (error.code) {
      console.error('   Código de error:', error.code);
    }
  } finally {
    await client.close();
    console.log('\n🔒 Conexión cerrada');
  }
}

testConnection();