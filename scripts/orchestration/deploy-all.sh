#!/bin/bash

# Script de despliegue para Glucosa-App (Backend y Frontend)
# Este script construye y despliega toda la aplicación en un entorno de producción

set -e  # Salir inmediatamente si un comando falla

echo "🚀 Iniciando despliegue completo de Glucosa-App..."

# Obtener el directorio base
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$BASE_DIR/glucosa-app-backend"
FRONTEND_DIR="$BASE_DIR/proyecto_glucoguide"

echo "📁 Directorio base: $BASE_DIR"
echo "📁 Directorio backend: $BACKEND_DIR"
echo "📁 Directorio frontend: $FRONTEND_DIR"

# Verificar que los directorios existan
if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Directorio de backend no encontrado: $BACKEND_DIR"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Directorio de frontend no encontrado: $FRONTEND_DIR"
    exit 1
fi

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor, instala Docker primero."
    exit 1
fi

# Verificar que Docker Compose esté instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor, instala Docker Compose primero."
    exit 1
fi

# Detener contenedores existentes del backend
echo "⏹ Deteniendo contenedores existentes del backend..."
cd "$BACKEND_DIR"
docker-compose down

# Construir imágenes del backend
echo "🏗 Construyendo imágenes Docker del backend..."
docker-compose build

# Iniciar servicios del backend
echo "▶ Iniciando servicios del backend..."
docker-compose up -d

# Esperar a que el backend esté listo
echo "⏳ Esperando a que el backend esté listo..."
sleep 15

# Verificar estado de los contenedores del backend
echo "🔍 Verificando estado de los contenedores del backend..."
docker-compose ps

# Desplegar el frontend
echo "▶ Iniciando frontend..."
cd "$FRONTEND_DIR"
docker-compose up -d

# Esperar a que el frontend esté listo
echo "⏳ Esperando a que el frontend esté listo..."
sleep 10

# Verificar estado de los contenedores del frontend
echo "🔍 Verificando estado de los contenedores del frontend..."
docker-compose ps

echo "✅ Despliegue completo finalizado!"
echo "🌐 Backend disponible en: http://localhost:4000"
echo "🌐 Frontend disponible en: http://localhost"
echo "📊 MongoDB disponible en: mongodb://localhost:27017"
echo "💾 Redis disponible en: redis://localhost:6379"