import dotenv from 'dotenv';

dotenv.config();

// Mock de Redis para desarrollo sin Redis instalado
const redisClient = {
  get: (key: string, _callback: (err: any, reply: any) => void) => {
    console.log('Redis mock - get:', key);
    _callback(null, null);
  },
  set: (key: string, value: string, _callback?: (err: any, reply: any) => void) => {
    console.log('Redis mock - set:', key, value);
    if (_callback) _callback(null, 'OK');
  },
  del: (key: string, _callback?: (err: any, reply: any) => void) => {
    console.log('Redis mock - del:', key);
    if (_callback) _callback(null, 1);
  },
  exists: (key: string, _callback: (err: any, reply: any) => void) => {
    console.log('Redis mock - exists:', key);
    _callback(null, 0);
  },
  quit: (_callback?: (err: any, result: any) => void) => {
    console.log('Redis mock - quit');
    if (_callback) _callback(null, 'OK');
  },
  on: (event: string, _callback: (...args: any[]) => void) => {
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