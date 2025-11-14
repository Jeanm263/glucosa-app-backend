/* eslint-disable */
const http = require('http');

// Configuración
const PORT = process.env.PORT || 4000;
const HEALTH_CHECK_PATH = '/api/health';

// Realizar la solicitud de verificación de salud
const options = {
  hostname: 'localhost',
  port: PORT,
  path: HEALTH_CHECK_PATH,
  method: 'GET',
  timeout: 10000 // 10 segundos de timeout
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  
  if (res.statusCode === 200) {
    console.log('✅ Health check PASSED');
    process.exit(0);
  } else {
    console.log('❌ Health check FAILED');
    process.exit(1);
  }
});

req.on('error', (e) => {
  console.error(`❌ Problem with request: ${e.message}`);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('❌ Request timeout - Server might be starting up');
  req.destroy();
  process.exit(1);
});

// Establecer timeout
req.setTimeout(10000);

req.end();