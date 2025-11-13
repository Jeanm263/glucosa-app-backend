# Despliegue en Render

## Requisitos previos

1. Cuenta en [Render](https://render.com/)
2. Base de datos MongoDB (puedes usar MongoDB Atlas)
3. Claves VAPID para notificaciones push (opcional)

## Pasos para el despliegue

### 1. Preparar MongoDB

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster gratuito
3. Configura las reglas de acceso para permitir conexiones desde cualquier IP (0.0.0.0/0)
4. Obten la cadena de conexión URI

### 2. Generar claves VAPID (opcional)

Si deseas usar notificaciones push, genera claves VAPID:

```bash
npx web-push generate-vapid-keys
```

### 3. Configurar variables de entorno en Render

En el dashboard de Render, configura las siguientes variables de entorno:

- `MONGO_URI`: Tu cadena de conexión de MongoDB Atlas
- `JWT_SECRET`: Una cadena segura y única para firmar tokens JWT
- `VAPID_PUBLIC_KEY`: Clave pública VAPID (si usas notificaciones)
- `VAPID_PRIVATE_KEY`: Clave privada VAPID (si usas notificaciones)
- `FRONTEND_URL`: La URL de tu frontend (ej: https://tu-app-frontend.onrender.com)

### 4. Desplegar en Render

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Haz clic en "New" y selecciona "Web Service"
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio del backend
5. Configura:
   - Name: `glucosa-app-backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Plan: Free (para pruebas)
6. Añade las variables de entorno configuradas anteriormente
7. Haz clic en "Create Web Service"

### 5. Configurar dominio personalizado (opcional)

Render proporcionará automáticamente un subdominio. Si deseas usar un dominio personalizado:

1. En el dashboard de Render, ve a tu servicio
2. Haz clic en "Settings"
3. En la sección "Custom Domains", añade tu dominio
4. Sigue las instrucciones para configurar los registros DNS

## Configuración del frontend

Después de desplegar el backend, actualiza la URL del API en tu frontend:

1. En el archivo `.env.production` del frontend, actualiza:
   ```
   VITE_API_URL=https://tu-backend-en-render.onrender.com/api
   ```

2. Reconstruye y despliega el frontend

## Monitoreo y logs

Puedes ver los logs de tu aplicación en tiempo real desde el dashboard de Render:

1. Ve a tu servicio en Render
2. Haz clic en "Logs" para ver los registros en tiempo real

## Escalabilidad

Para producción, considera actualizar a un plan de pago en Render para mejor rendimiento y disponibilidad.

## Solución de problemas

### Problemas comunes

1. **Conexión a MongoDB fallida**:
   - Verifica que la cadena de conexión sea correcta
   - Asegúrate de que las reglas de IP en MongoDB Atlas permitan conexiones

2. **Errores de CORS**:
   - Verifica que `FRONTEND_URL` esté correctamente configurada
   - Asegúrate de que la URL del frontend coincida exactamente

3. **Errores de JWT**:
   - Verifica que `JWT_SECRET` esté configurado y sea una cadena segura

### Comandos útiles

```bash
# Ver logs en Render
# (desde el dashboard de Render)

# Reiniciar servicio
# (desde el dashboard de Render -> Manual Deploy -> Clear build cache & deploy)

# Verificar salud del servicio
curl https://tu-backend-en-render.onrender.com/api/health
```

## Mantenimiento

1. **Actualizaciones de seguridad**: Mantén tus dependencias actualizadas
2. **Backups**: Configura backups regulares de tu base de datos MongoDB
3. **Monitoreo**: Usa las herramientas de monitoreo de Render para vigilar el rendimiento