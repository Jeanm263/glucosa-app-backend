# Despliegue en Render

## Configuración Requerida

### Variables de Entorno
```env
MONGO_URI=mongodb+srv://glucoguideuser:0763641029@cluster0.ay6rjni.mongodb.net/glucoguide?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
VAPID_PUBLIC_KEY=BBoY4t8Xad26ePZ3qNfGITT9HO8mCU6FXoHjT1EH9CzpSGE0E0XvHeYfeAlVKhV7xc0lTFWK6nhP7JNiB0zw4lM
VAPID_PRIVATE_KEY=9cRi4nvIDd77lTOxeJPc0Tcmm22ScxuhIhxtZYDfWC8
PORT=4000
HOST=0.0.0.0
NODE_ENV=production
```

### Punto Final de Salud (Health Check)
- **Ruta**: `/api/health`
- **Puerto**: 4000
- **Método**: GET
- **Respuesta esperada**: 200 OK

## Pasos para el Despliegue

1. **Crear una cuenta en Render**:
   - Ve a [https://render.com](https://render.com)
   - Regístrate o inicia sesión

2. **Conectar tu repositorio de GitHub**:
   - En el dashboard de Render, haz clic en "New Web Service"
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `glucosa-app-backend`

3. **Configurar el servicio**:
   - **Name**: glucosa-app-backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/index.js`
   - **Instance Type**: Free (para desarrollo) o Standard (para producción)

4. **Configurar Variables de Entorno**:
   - Ve a la sección "Advanced" en la configuración
   - Agrega todas las variables de entorno requeridas

5. **IMPORTANTE - Configurar el método de construcción**:
   - En "Settings" → "Build & Deploy"
   - Cambia "Build Mode" de "Docker" a "Node"
   - Esto hará que Render use los comandos de construcción en lugar de buscar el Dockerfile

6. **Desplegar**:
   - Haz clic en "Create Web Service"
   - Render construirá y desplegará automáticamente tu aplicación

## Solución de Problemas

### Error: "failed to solve: failed to read dockerfile"

1. **Cambiar el método de construcción**:
   - Ve a "Settings" → "Build & Deploy"
   - Cambia "Build Mode" de "Docker" a "Node"
   - Esto evita que Render busque el Dockerfile

2. **Verificar la estructura del proyecto**:
   - Asegúrate de que package.json esté en la raíz del repositorio
   - Verifica que no haya estructuras de carpetas anidadas

### Error: "Service Unavailable" o "Application Error"

1. **Verifica las variables de entorno**:
   - Asegúrate de que `MONGO_URI` tenga la cadena de conexión correcta
   - Verifica que `JWT_SECRET` esté configurado
   - Confirma que `PORT` esté establecido en `4000`

2. **Verifica la conexión a MongoDB**:
   - Asegúrate de que la IP de Render esté en la lista blanca de MongoDB Atlas
   - Puedes agregar `0.0.0.0/0` temporalmente para pruebas

3. **Revisa los logs**:
   - En el dashboard de Render, ve a la pestaña "Logs"
   - Busca errores relacionados con la conexión a la base de datos o inicialización

### Tiempo de espera del health check

- La primera vez que se despliega, puede tardar varios minutos en iniciar completamente
- El health check de Render espera una respuesta en el puerto configurado
- Si el servidor no responde en 5 minutos, el despliegue fallará

### Problemas comunes:

1. **Puerto incorrecto**:
   - Asegúrate de que la aplicación escuche en el puerto especificado en la variable de entorno `PORT`
   - Render inyecta el puerto en la variable de entorno `PORT`

2. **Dirección de host**:
   - La aplicación debe escuchar en `0.0.0.0` en lugar de `localhost` o `127.0.0.1`

3. **Variables de entorno faltantes**:
   - Todas las variables de entorno sensibles deben configurarse en el dashboard de Render

## Comandos Útiles

```bash
# Verificar el estado de salud localmente
npm run health-check

# Construir el proyecto
npm run build

# Iniciar el servidor localmente con configuración de Render
PORT=4000 HOST=0.0.0.0 npm start
```

## Configuración del Frontend

Después de desplegar el backend, actualiza la URL del API en el frontend:

1. En el archivo `.env.production` del frontend, actualiza:
   ```
   VITE_API_URL=https://tu-app-en-render.onrender.com/api
   ```

2. Reconstruye el frontend con esta configuración

## Escalabilidad

- Render automáticamente escala tu aplicación según la demanda
- Para producción, considera usar un plan de pago para mejor rendimiento
- Puedes configurar auto scaling y CDN según tus necesidades