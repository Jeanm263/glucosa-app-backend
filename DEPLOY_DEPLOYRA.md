# Despliegue en Deployra

## Configuración Requerida

### Variables de Entorno
```env
MONGO_URI=mongodb+srv://glucoguideuser:0763641029@cluster0.ay6rjni.mongodb.net/glucoguide?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
VAPID_PUBLIC_KEY=BBoY4t8Xad26ePZ3qNfGITT9HO8mCU6FXoHjT1EH9CzpSGE0E0XvHeYfeAlVKhV7xc0lTFWK6nhP7JNiB0zw4lM
VAPID_PRIVATE_KEY=9cRi4nvIDd77lTOxeJPc0Tcmm22ScxuhIhxtZYDfWC8
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
  },
  "restartPolicy": "always",
  "maxRestarts": 10
}
```

## Pasos para el Despliegue

1. **Configurar Variables de Entorno** en Deployra:
   - Ve a la sección de variables de entorno en Deployra
   - Agrega todas las variables de entorno requeridas con los valores correctos
   - Asegúrate de usar la cadena de conexión MongoDB correcta

2. **Verificar el Dockerfile**:
   - El proyecto incluye un Dockerfile optimizado para producción
   - No es necesario hacer cambios en el Dockerfile

3. **Configurar el Punto Final de Salud**:
   - Asegúrate de que Deployra esté configurado para verificar `/api/health` en el puerto 4000

4. **Desplegar**:
   - Sigue el flujo de despliegue estándar de Deployra
   - El sistema usará automáticamente el Dockerfile para construir la imagen

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
   - Confirma que `MONGO_URI` tenga la cadena de conexión correcta

### Problemas comunes de despliegue:

1. **Tiempo de espera del health check**:
   - La primera vez que se despliega, puede tardar varios minutos en iniciar completamente
   - El sistema de salud tiene un timeout de 10 segundos, pero el servidor puede tardar más en iniciarse
   - Espera al menos 5 minutos antes de considerar que hay un problema

2. **Errores de conexión a MongoDB**:
   - Verifica que la cadena de conexión sea correcta
   - Asegúrate de que la IP de Deployra esté en la lista blanca de MongoDB Atlas
   - Confirma que las credenciales sean correctas

3. **Errores en la construcción de Docker**:
   - Verifica que todas las dependencias estén en package.json
   - Asegúrate de que no haya errores de sintaxis en el código TypeScript

### Comandos Útiles

```bash
# Verificar el estado de salud localmente
npm run health-check

# Construir el proyecto
npm run build

# Iniciar el servidor
npm start
```

## Configuración del Frontend

Después de desplegar el backend, actualiza la URL del API en el frontend:

1. En el archivo `.env.production` del frontend, actualiza:
   ```
   VITE_API_URL=https://tu-url-de-deployra.com/api
   ```

2. Reconstruye el frontend con esta configuración

## Actualización de Variables de Entorno

Puedes actualizar las variables de entorno en Deployra sin necesidad de hacer un nuevo git push:
- Los cambios en variables de entorno reinician automáticamente el servicio
- Solo necesitas hacer git push si hay cambios en el código