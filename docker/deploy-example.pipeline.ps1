# deploy.ps1
# Script para build, deploy y actualización completa del stack

param(
    [string]$WslDistro = "Ubuntu",
    [string]$StackName = "myapp",
    [string]$ProjectPath = "/home/tu-usuario/proyecto"  # Ajusta según tu ruta en WSL
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Iniciando proceso de deploy..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# ============================================
# 1. BUILD DE QUASAR
# ============================================
Write-Host "`n📦 Building Quasar application..." -ForegroundColor Yellow

try {
    # Limpiar build anterior
    if (Test-Path "dist\spa") {
        Remove-Item -Recurse -Force "dist\spa"
        Write-Host "   ✓ Limpiado build anterior" -ForegroundColor Green
    }

    # Build de Quasar
    Write-Host "   Building..." -ForegroundColor Gray
    quasar build
    
    if ($LASTEXITCODE -ne 0) {
        throw "Error en Quasar build"
    }
    
    Write-Host "   ✓ Quasar build completado" -ForegroundColor Green
}
catch {
    Write-Host "   ✗ Error en build de Quasar: $_" -ForegroundColor Red
    exit 1
}

# ============================================
# 2. CREAR NGINX.CONF
# ============================================
Write-Host "`n📝 Creando configuración de nginx..." -ForegroundColor Yellow

$nginxConfig = @"
server {
    listen 80;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing
    location / {
        try_files `$uri `$uri/ /index.html;
    }

    # Proxy para API
    location /api/ {
        rewrite ^/api/(.*)$ /`$1 break;
        
        proxy_pass http://loopback-app:3000;
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
        
        proxy_cache_bypass `$http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
}
"@

$nginxConfig | Out-File -FilePath "nginx.conf" -Encoding UTF8 -NoNewline
Write-Host "   ✓ nginx.conf creado" -ForegroundColor Green

# ============================================
# 3. TRANSFERIR ARCHIVOS A WSL
# ============================================
Write-Host "`n📤 Transfiriendo archivos a WSL..." -ForegroundColor Yellow

try {
    # Crear directorio en WSL si no existe
    wsl -d $WslDistro bash -c "mkdir -p $ProjectPath"
    
    # Copiar docker-compose.yml
    Write-Host "   Copiando docker-compose.yml..." -ForegroundColor Gray
    wsl -d $WslDistro bash -c "cat > $ProjectPath/docker-compose.yml" < docker-compose.yml
    
    # Copiar nginx.conf
    Write-Host "   Copiando nginx.conf..." -ForegroundColor Gray
    wsl -d $WslDistro bash -c "cat > $ProjectPath/nginx.conf" < nginx.conf
    
    # Copiar dist/spa a WSL
    Write-Host "   Copiando build de Quasar..." -ForegroundColor Gray
    $distPath = (Resolve-Path "dist\spa").Path
    wsl -d $WslDistro bash -c "rm -rf $ProjectPath/dist/spa && mkdir -p $ProjectPath/dist"
    
    # Copiar archivos usando wslpath
    $wslDistPath = wsl -d $WslDistro wslpath -a "'$distPath'"
    wsl -d $WslDistro bash -c "cp -r $wslDistPath $ProjectPath/dist/spa"
    
    Write-Host "   ✓ Archivos transferidos a WSL" -ForegroundColor Green
}
catch {
    Write-Host "   ✗ Error transfiriendo archivos: $_" -ForegroundColor Red
    exit 1
}

# ============================================
# 4. VERIFICAR DOCKER EN WSL
# ============================================
Write-Host "`n🐳 Verificando Docker en WSL..." -ForegroundColor Yellow

$dockerRunning = wsl -d $WslDistro bash -c "docker info > /dev/null 2>&1 && echo 'ok' || echo 'fail'"

if ($dockerRunning -ne "ok") {
    Write-Host "   ⚠ Docker no está corriendo en WSL. Iniciando..." -ForegroundColor Yellow
    wsl -d $WslDistro bash -c "sudo service docker start"
    Start-Sleep -Seconds 3
}

Write-Host "   ✓ Docker está corriendo" -ForegroundColor Green

# ============================================
# 5. VERIFICAR DOCKER SWARM
# ============================================
Write-Host "`n🐝 Verificando Docker Swarm..." -ForegroundColor Yellow

$swarmActive = wsl -d $WslDistro bash -c "docker info --format '{{.Swarm.LocalNodeState}}'"

if ($swarmActive -ne "active") {
    Write-Host "   Inicializando Docker Swarm..." -ForegroundColor Gray
    wsl -d $WslDistro bash -c "docker swarm init"
    Write-Host "   ✓ Swarm inicializado" -ForegroundColor Green
} else {
    Write-Host "   ✓ Swarm ya está activo" -ForegroundColor Green
}

# ============================================
# 6. DETENER STACK ANTERIOR
# ============================================
Write-Host "`n🛑 Deteniendo stack anterior (si existe)..." -ForegroundColor Yellow

$stackExists = wsl -d $WslDistro bash -c "docker stack ls | grep -w $StackName || echo 'not-found'"

if ($stackExists -ne "not-found") {
    wsl -d $WslDistro bash -c "cd $ProjectPath && docker stack rm $StackName"
    Write-Host "   Esperando a que los servicios se detengan..." -ForegroundColor Gray
    Start-Sleep -Seconds 10
    Write-Host "   ✓ Stack anterior removido" -ForegroundColor Green
} else {
    Write-Host "   ✓ No hay stack previo" -ForegroundColor Green
}

# ============================================
# 7. COPIAR ARCHIVOS AL VOLUMEN
# ============================================
Write-Host "`n📁 Copiando archivos al volumen de Docker..." -ForegroundColor Yellow

wsl -d $WslDistro bash -c @"
docker run --rm \
  -v public_directory:/data \
  -v $ProjectPath/dist/spa:/src \
  alpine sh -c 'rm -rf /data/* && cp -r /src/. /data/ && echo "Archivos copiados: \$(ls -la /data | wc -l) items"'
"@

Write-Host "   ✓ Archivos copiados al volumen" -ForegroundColor Green

# ============================================
# 8. DEPLOY DEL STACK
# ============================================
Write-Host "`n🚢 Desplegando stack..." -ForegroundColor Yellow

wsl -d $WslDistro bash -c "cd $ProjectPath && docker stack deploy -c docker-compose.yml $StackName"

Write-Host "   ✓ Stack desplegado" -ForegroundColor Green

# ============================================
# 9. ESPERAR Y VERIFICAR SERVICIOS
# ============================================
Write-Host "`n⏳ Esperando a que los servicios estén listos..." -ForegroundColor Yellow


Start-Sleep -Seconds 5

Write-Host "`n📊 Estado de los servicios:" -ForegroundColor Cyan
wsl -d $WslDistro bash -c "docker stack services $StackName"

# ============================================
# 10. VERIFICAR LOGS
# ============================================
Write-Host "`n📋 Últimos logs del frontend:" -ForegroundColor Cyan
wsl -d $WslDistro bash -c "docker service logs --tail 20 ${StackName}_frontend"

# ============================================
# 11. VERIFICACIÓN FINAL
# ============================================
Write-Host "`n🔍 Verificando conectividad..." -ForegroundColor Yellow

Start-Sleep -Seconds 5

# Test al frontend
Write-Host "   Testing frontend (http://localhost:8080)..." -ForegroundColor Gray
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✓ Frontend respondiendo correctamente" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠ Frontend aún no responde, puede necesitar más tiempo" -ForegroundColor Yellow
}

# Test al API
Write-Host "   Testing API (http://localhost:3000)..." -ForegroundColor Gray
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10 -UseBasicParsing
    Write-Host "   ✓ API respondiendo correctamente" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ API aún no responde, puede necesitar más tiempo" -ForegroundColor Yellow
}

# ============================================
# RESUMEN FINAL
# ============================================
Write-Host "`n=================================" -ForegroundColor Cyan
Write-Host "✅ DEPLOY COMPLETADO" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 URLs disponibles:" -ForegroundColor White
Write-Host "   Frontend:  http://localhost:8080" -ForegroundColor Cyan
Write-Host "   API:       http://localhost:3000" -ForegroundColor Cyan
Write-Host "   SQL:       localhost:1433" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Comandos útiles:" -ForegroundColor White
Write-Host "   Ver servicios:  wsl -d $WslDistro docker stack services $StackName" -ForegroundColor Gray
Write-Host "   Ver logs:       wsl -d $WslDistro docker service logs -f ${StackName}_frontend" -ForegroundColor Gray
Write-Host "   Detener stack:  wsl -d $WslDistro docker stack rm $StackName" -ForegroundColor Gray
Write-Host ""