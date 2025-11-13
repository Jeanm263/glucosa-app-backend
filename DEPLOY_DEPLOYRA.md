# Despliegue en Deployra

## Configuración Requerida

### Variables de Entorno
```
MONGO_URI=mongodb://localhost:27017/glucoguide
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
VAPID_PUBLIC_KEY=your-public-vapid-key
VAPID_PRIVATE_KEY=your-private-vapid-key
PORT=4000
NODE_ENV=production
```

### Punto Final de Salud (Health Check)
- **Ruta**: `/api/health`
- **Puerto**: 4000
- **Método**: GET
- **Respuesta esperada**: 200 OK

### Configuración de Deployra
El archivo `deployra.config.json` contiene la configuración necesaria para el despliegue:

```json
{
  "name": "glucosa-app-backend",
  "port": 4000,
  "healthCheckPath": "/api/health",
  "healthCheckPort": 4000,
  "environment": {
    "NODE_ENV": "production",
    "PORT": 4000
  },
  "build": {
    "command": "npm install && npm run build"
  },
  "start": {
    "command": "node dist/index.js"
  },
  "docker": {
    "enabled": true,
    "dockerfile": "Dockerfile"
  }
}
```

## Pasos para el Despliegue

1. **Configurar Variables de Entorno** en Deployra:
   - Asegúrate de establecer todas las variables de entorno requeridas

2. **Verificar el Dockerfile**:
   - El proyecto incluye un Dockerfile optimizado para producción

3. **Configurar el Punto Final de Salud**:
   - Asegúrate de que Deployra esté configurado para verificar `/api/health` en el puerto 4000

4. **Desplegar**:
   - Sigue el flujo de despliegue estándar de Deployra

## Solución de Problemas

### Error: "Verifique su Mapeos de puertos y Ruta de control de salud"

1. **Verifica que el puerto esté correctamente configurado**:
   - El backend escucha en el puerto 4000 por defecto
   - Asegúrate de que Deployra esté mapeando este puerto correctamente

2. **Verifica el endpoint de salud**:
   - El endpoint es `/api/health`
   - Debe responder con 200 OK

3. **Verifica las variables de entorno**:
   - Asegúrate de que `PORT` esté establecido en 4000
   - Verifica que `NODE_ENV` esté establecido en `production`

### Comandos Útiles

```bash
# Verificar el estado de salud localmente
npm run health-check

# Construir el proyecto
npm run build

# Iniciar el servidor
npm start
```