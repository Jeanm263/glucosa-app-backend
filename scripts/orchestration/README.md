# Scripts de Orquestación

Esta carpeta contiene scripts para la orquestación y despliegue completo de la aplicación Glucosa-App.

## Descripción

Los scripts en esta carpeta están diseñados para coordinar el despliegue de ambos servicios (backend y frontend) de la aplicación Glucosa-App en un entorno de producción.

## Scripts Disponibles

### deploy-all.sh
Script de despliegue para entornos Unix/Linux/macOS.

**Uso:**
```bash
./deploy-all.sh
```

### deploy-all.ps1
Script de despliegue para entornos Windows PowerShell.

**Uso:**
```powershell
.\deploy-all.ps1
```

## Funcionalidad

Ambos scripts realizan las siguientes acciones:

1. Verifican la existencia de los directorios de backend y frontend
2. Comprueban que Docker y Docker Compose estén instalados
3. Detienen contenedores existentes
4. Construyen las imágenes Docker del backend
5. Inician los servicios del backend
6. Esperan a que el backend esté listo
7. Verifican el estado de los contenedores del backend
8. Inician el frontend
9. Esperan a que el frontend esté listo
10. Verifican el estado de los contenedores del frontend

## Requisitos

- Docker instalado
- Docker Compose instalado
- Acceso a ambos directorios del proyecto (glucosa-app-backend y proyecto_glucoguide)

## Salida

Al finalizar, los scripts mostrarán las URLs donde están disponibles los servicios:
- Backend: http://localhost:4000
- Frontend: http://localhost
- MongoDB: mongodb://localhost:27017
- Redis: redis://localhost:6379