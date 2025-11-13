# Despliegue en Fly.io

## Prerrequisitos
1. Cuenta en Fly.io (https://fly.io)
2. CLI de Fly instalado: `flyctl`
3. Cuenta en MongoDB Atlas (https://cloud.mongodb.com)

## Pasos para el despliegue

### 1. Iniciar sesión en Fly.io
```bash
flyctl auth login
```

### 2. Crear la aplicación en Fly.io
```bash
flyctl launch --no-deploy
```
- Selecciona un nombre único para tu aplicación
- Elige una región cercana
- No despliegues aún

### 3. Configurar MongoDB Atlas
1. Crea una cuenta gratuita en MongoDB Atlas
2. Crea un cluster gratuito
3. Configura las reglas de acceso:
   - Agrega la IP 0.0.0.0/0 para permitir conexiones desde Fly.io
4. Crea un usuario de base de datos
5. Obtén la cadena de conexión

### 4. Configurar las variables de entorno
```bash
flyctl secrets set MONGO_URI="tu_uri_de_mongodb"
flyctl secrets set JWT_SECRET="tu_secreto_jwt_seguro"
flyctl secrets set FRONTEND_URL="https://tu-frontend-url.com"
```

### 5. Desplegar la aplicación
```bash
flyctl deploy
```

### 6. Verificar el despliegue
```bash
flyctl status
flyctl logs
```

## Acceder a la aplicación
Una vez desplegada, tu aplicación estará disponible en:
https://nombre-de-tu-app.fly.dev

## Comandos útiles
- Ver logs: `flyctl logs`
- Reiniciar: `flyctl restart`
- Escalar: `flyctl scale`
- Ver variables: `flyctl secrets list`