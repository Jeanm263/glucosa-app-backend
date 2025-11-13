# Script de despliegue para Glucosa-App (Backend y Frontend) (PowerShell)
# Este script construye y despliega toda la aplicación en un entorno de producción

Write-Host "🚀 Iniciando despliegue completo de Glucosa-App..." -ForegroundColor Green

# Obtener el directorio base
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BaseDir = Resolve-Path "$ScriptDir\..\..\.."
$BackendDir = Join-Path $BaseDir "glucosa-app-backend"
$FrontendDir = Join-Path $BaseDir "proyecto_glucoguide"

Write-Host "📁 Directorio base: $BaseDir" -ForegroundColor Cyan
Write-Host "📁 Directorio backend: $BackendDir" -ForegroundColor Cyan
Write-Host "📁 Directorio frontend: $FrontendDir" -ForegroundColor Cyan

# Verificar que los directorios existan
if (!(Test-Path $BackendDir)) {
    Write-Host "❌ Directorio de backend no encontrado: $BackendDir" -ForegroundColor Red
    exit 1
}

if (!(Test-Path $FrontendDir)) {
    Write-Host "❌ Directorio de frontend no encontrado: $FrontendDir" -ForegroundColor Red
    exit 1
}

# Verificar que Docker esté instalado
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker no está instalado. Por favor, instala Docker primero." -ForegroundColor Red
    exit 1
}

# Verificar que Docker Compose esté instalado
if (!(Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose no está instalado. Por favor, instala Docker Compose primero." -ForegroundColor Red
    exit 1
}

# Detener contenedores existentes del backend
Write-Host "⏹ Deteniendo contenedores existentes del backend..." -ForegroundColor Yellow
Set-Location -Path $BackendDir
docker-compose down

# Construir imágenes del backend
Write-Host "🏗 Construyendo imágenes Docker del backend..." -ForegroundColor Yellow
docker-compose build

# Iniciar servicios del backend
Write-Host "▶ Iniciando servicios del backend..." -ForegroundColor Yellow
docker-compose up -d

# Esperar a que el backend esté listo
Write-Host "⏳ Esperando a que el backend esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Verificar estado de los contenedores del backend
Write-Host "🔍 Verificando estado de los contenedores del backend..." -ForegroundColor Yellow
docker-compose ps

# Desplegar el frontend
Write-Host "▶ Iniciando frontend..." -ForegroundColor Yellow
Set-Location -Path $FrontendDir
docker-compose up -d

# Esperar a que el frontend esté listo
Write-Host "⏳ Esperando a que el frontend esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar estado de los contenedores del frontend
Write-Host "🔍 Verificando estado de los contenedores del frontend..." -ForegroundColor Yellow
docker-compose ps

Write-Host "✅ Despliegue completo finalizado!" -ForegroundColor Green
Write-Host "🌐 Backend disponible en: http://localhost:4000" -ForegroundColor Cyan
Write-Host "🌐 Frontend disponible en: http://localhost" -ForegroundColor Cyan
Write-Host "📊 MongoDB disponible en: mongodb://localhost:27017" -ForegroundColor Cyan
Write-Host "💾 Redis disponible en: redis://localhost:6379" -ForegroundColor Cyan