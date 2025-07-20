@echo off
REM Script para iniciar Reino dos Brinquedos com Docker no Windows
REM Uso: docker-start.bat [dev|prod|status|stop|clean]

setlocal enabledelayedexpansion

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Docker nao esta instalado!
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Docker Compose nao esta instalado!
    exit /b 1
)

REM Processar argumentos
set "command=%1"
if "%command%"=="" set "command=help"

if "%command%"=="dev" goto :start_dev
if "%command%"=="prod" goto :start_prod
if "%command%"=="status" goto :show_status
if "%command%"=="stop" goto :stop_all
if "%command%"=="clean" goto :clean_all
goto :show_help

:start_dev
echo.
echo 🚀 Iniciando Reino dos Brinquedos em modo DESENVOLVIMENTO...
echo.
echo 📦 Construindo containers...
docker-compose -f docker-compose.dev.yml build
if errorlevel 1 (
    echo [ERRO] Falha ao construir containers!
    exit /b 1
)

echo.
echo 🔄 Iniciando servicos...
docker-compose -f docker-compose.dev.yml up -d
if errorlevel 1 (
    echo [ERRO] Falha ao iniciar servicos!
    exit /b 1
)

echo.
echo ⏳ Aguardando servicos ficarem prontos...
timeout /t 10 /nobreak >nul

echo.
echo ✅ Servicos iniciados com sucesso!
echo.
echo 🌐 Acesse a aplicacao:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo    Adminer:  http://localhost:8080
echo.
echo 📊 Para ver logs:
echo    docker-compose -f docker-compose.dev.yml logs -f
echo.
echo 🛑 Para parar:
echo    docker-start.bat stop
goto :end

:start_prod
echo.
echo 🚀 Iniciando Reino dos Brinquedos em modo PRODUCAO...
echo.
echo 📦 Construindo containers...
docker-compose build
if errorlevel 1 (
    echo [ERRO] Falha ao construir containers!
    exit /b 1
)

echo.
echo 🔄 Iniciando servicos...
docker-compose up -d
if errorlevel 1 (
    echo [ERRO] Falha ao iniciar servicos!
    exit /b 1
)

echo.
echo ⏳ Aguardando servicos ficarem prontos...
timeout /t 15 /nobreak >nul

echo.
echo ✅ Servicos iniciados com sucesso!
echo.
echo 🌐 Acesse a aplicacao:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo.
echo 📊 Para ver logs:
echo    docker-compose logs -f
echo.
echo 🛑 Para parar:
echo    docker-start.bat stop
goto :end

:show_status
echo.
echo 📊 Status dos containers:
docker-compose -f docker-compose.dev.yml ps
echo.
echo 🔍 Health checks:
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
goto :end

:stop_all
echo.
echo 🛑 Parando todos os servicos...
docker-compose -f docker-compose.dev.yml down
docker-compose down
echo ✅ Todos os servicos foram parados!
goto :end

:clean_all
echo.
echo 🧹 Limpando containers, imagens e volumes...
docker-compose -f docker-compose.dev.yml down -v --rmi all
docker-compose down -v --rmi all
docker system prune -f
echo ✅ Limpeza concluida!
goto :end

:show_help
echo.
echo 🧸 Reino dos Brinquedos - Docker Manager
echo.
echo Uso: %0 [comando]
echo.
echo Comandos disponiveis:
echo   dev      - Iniciar em modo desenvolvimento (recomendado)
echo   prod     - Iniciar em modo producao
echo   status   - Mostrar status dos containers
echo   stop     - Parar todos os servicos
echo   clean    - Limpar containers e volumes
echo   help     - Mostrar esta ajuda
echo.
echo Exemplos:
echo   %0 dev     # Inicia em desenvolvimento
echo   %0 status  # Mostra status
echo   %0 stop    # Para tudo
echo.

:end
endlocal
