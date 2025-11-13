#!/bin/bash

# Script de despliegue para Glucosa-App Backend
# Este script construye y despliega la aplicación en un entorno de producción

set -e  # Salir inmediatamente si un comando falla

echo "🚀 Iniciando despliegue de Glucosa-App Backend..."

# Verificar que estamos en el directorio correcto
cd "$(dirname "$0")/.."

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

# Detener contenedores existentes
echo "⏹ Deteniendo contenedores existentes..."
docker-compose down

# Construir imágenes
echo "🏗 Construyendo imágenes Docker..."
docker-compose build

# Iniciar servicios
echo "▶ Iniciando servicios..."
docker-compose up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado de los contenedores
echo "🔍 Verificando estado de los contenedores..."
docker-compose ps

# Verificar logs
echo "📋 Mostrando logs recientes..."
docker-compose logs --tail=20

echo "✅ Despliegue completado exitosamente!"
echo "🌐 Backend disponible en: http://localhost:4000"
echo "📊 MongoDB disponible en: mongodb://localhost:27017"
echo "💾 Redis disponible en: redis://localhost:6379"