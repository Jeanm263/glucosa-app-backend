# Glucosa-App Backend

Backend para GlucosaApp - Acompañamiento nutricional y educativo para personas con diabetes tipo II

## Requisitos Previos

- Node.js (versión 14 o superior)
- MongoDB (local o en la nube)
- npm o yarn

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/glucoguide
JWT_SECRET=tequieromuchoa
FRONTEND_URL=http://localhost:5173
```

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   ```

2. Navegar al directorio del backend:
   ```bash
   cd glucosa-app-backend
   ```

3. Instalar dependencias:
   ```bash
   npm install
   ```

## Configuración de la Base de Datos

Asegúrate de tener MongoDB ejecutándose localmente o configura una instancia en la nube (MongoDB Atlas).

Si usas MongoDB localmente:
1. Instala MongoDB en tu sistema
2. Inicia el servicio de MongoDB
3. La aplicación creará automáticamente la base de datos `glucoguide`

## Ejecución

### Modo de Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:4000` (o el puerto especificado en la variable de entorno PORT).

### Modo de Producción

1. Construir el proyecto:
   ```bash
   npm run build
   ```

2. Iniciar el servidor:
   ```bash
   npm start
   ```

## Endpoints de la API

- Health check: `GET /api/health`
- Autenticación: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Usuarios: `GET /api/usuarios`, `GET /api/usuarios/:id`
- Alimentos: `GET /api/foods`, `GET /api/foods/:id`
- Educación: `GET /api/education`, `GET /api/education/:id`
- Registro de alimentos: `POST /api/food-logs`, `GET /api/food-logs`
- Planes de comida: `POST /api/meal-plans`, `GET /api/meal-plans`
- Notificaciones: `POST /api/notifications`, `GET /api/notifications`
- Síntomas: `POST /api/symptoms`, `GET /api/symptoms`

## Scripts Adicionales

- `npm run lint`: Ejecutar el linter
- `npm run test`: Ejecutar pruebas
- `npm run seed`: Inicializar datos de muestra

## Estructura del Proyecto

```
src/
├── config/          # Configuración (base de datos, etc.)
├── constants/       # Datos constantes (alimentos, educación)
├── controllers/     # Lógica de controladores
├── middleware/      # Middleware personalizado
├── models/          # Modelos de Mongoose
├── routes/          # Definición de rutas
└── index.ts         # Punto de entrada principal
```

## Datos Iniciales

La aplicación inicializa automáticamente datos de alimentos y educación si la base de datos está vacía.

## Solución de Problemas

1. **Error de conexión a MongoDB**: Verifica que MongoDB esté ejecutándose y que la URI de conexión sea correcta.
2. **Puerto ocupado**: Cambia el puerto en la variable de entorno PORT.
3. **Errores de dependencias**: Ejecuta `npm install` nuevamente.

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Realiza tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Sube tus cambios (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request