# Despliegue en Render

## Configuración Requerida

### Variables de Entorno
```env
MONGO_URI=mongodb+srv://glucoguideuser:0763641029@cluster0.ay6rjni.mongodb.net/glucoguide?retryWrites=true&w=majority
JWT_SECRET=una_clave_secreta_muy_segura_que_debes_cambiar
VAPID_PUBLIC_KEY=BBoY4t8Xad26ePZ3qNfGITT9HO8mCU6FXoHjT1EH9CzpSGE0E0XvHeYfeAlVKhV7xc0lTFWK6nhP7JNiB0zw4lM
VAPID_PRIVATE_KEY=9cRi4nvIDd77lTOxeJPc0Tcmm22ScxuhIhxtZYDfWC8
PORT=4000
HOST=0.0.0.0
NODE_ENV=production
FRONTEND_URL=https://tu-dominio-de-frontend-en-render.com
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
   - **Name**: `glucosa-app-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/index.js`
   - **Instance Type**: `Free` (para desarrollo) o `Standard` (para producción)

4. **Configurar Variables de Entorno**:
   - En la sección "Advanced" de la configuración, agrega todas las variables de entorno listadas arriba
   - Asegúrate de reemplazar `https://tu-dominio-de-frontend-en-render.com` con la URL real de tu frontend en Render

5. **Configurar el Health Check**:
   - **Path**: `/api/health`
   - **Port**: `4000`

6. **Desplegar**:
   - Haz clic en "Create Web Service"
   - Espera a que termine el despliegue (puede tardar varios minutos)

## Solución de Problemas Comunes

### Error 401 Unauthorized
Si recibes errores 401 al acceder a endpoints protegidos:

1. **Verifica las variables de entorno**:
   - Asegúrate de que `JWT_SECRET` esté configurado correctamente
   - Verifica que `FRONTEND_URL` apunte al dominio correcto

2. **Verifica CORS**:
   - Asegúrate de que el dominio del frontend esté en la lista de orígenes permitidos en el backend

3. **Verifica las cookies**:
   - Confirma que el frontend esté enviando cookies con las solicitudes (`withCredentials: true`)

### Problemas de Conexión a MongoDB
Si el servicio no puede conectarse a MongoDB:

1. **Verifica la cadena de conexión**:
   - Asegúrate de que `MONGO_URI` esté configurada correctamente
   - Verifica que las credenciales sean válidas

2. **Verifica la IP en la lista blanca**:
   - En MongoDB Atlas, asegúrate de que la IP de Render esté en la lista blanca
   - Puedes usar `0.0.0.0/0` temporalmente para pruebas (no recomendado para producción)

## Monitoreo

- Verifica los logs en el dashboard de Render para ver mensajes de error detallados
- Usa el endpoint `/api/health` para verificar que el servicio esté funcionando correctamente
- Usa el endpoint `/api/metrics` para monitorear el rendimiento