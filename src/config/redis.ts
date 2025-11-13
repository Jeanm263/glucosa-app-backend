import dotenv from 'dotenv';

dotenv.config();

// Mock de Redis para desarrollo sin Redis instalado
const redisClient = {
  get: (key: string, callback: (err: any, reply: any) => void) => {
    console.log('Redis mock - get:', key);
    callback(null, null);
  },
  set: (key: string, value: string, callback?: (err: any, reply: any) => void) => {
    console.log('Redis mock - set:', key, value);
    if (callback) callback(null, 'OK');
  },
  del: (key: string, callback?: (err: any, reply: any) => void) => {
    console.log('Redis mock - del:', key);
    if (callback) callback(null, 1);
  },
  exists: (key: string, callback: (err: any, reply: any) => void) => {
    console.log('Redis mock - exists:', key);
    callback(null, 0);
  },
  quit: (callback?: (err: any, result: any) => void) => {
    console.log('Redis mock - quit');
    if (callback) callback(null, 'OK');
  },
  on: (event: string, callback: (...args: any[]) => void) => {
    // No hacer nada para eventos
    if (event === 'error') {
      // Silenciar errores de Redis
      console.log('Redis mock - error event silenced');
    } else if (event === 'connect') {
      // Simular conexión exitosa
      console.log('Redis mock - connect event (simulated)');
    }
  }
};

export default redisClient;