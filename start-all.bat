@echo off
echo =========================================
echo  InterviewExplainer - Enterprise Startup
echo =========================================
echo.

REM Check if Docker is running
docker info > /dev/null 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [1/3] Stopping any existing containers...
docker-compose down

echo.
echo [2/3] Building and starting all services...
docker-compose up --build -d

echo.
echo [3/3] Waiting for services to start...
timeout /t 15 /nobreak > /dev/null

echo.
echo =========================================
echo  Services Status:
echo =========================================
docker-compose ps

echo.
echo =========================================
echo  Application URLs:
echo =========================================
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:8080
echo API Docs:  http://localhost:8080/swagger-ui.html
echo Health:    http://localhost:8080/actuator/health
echo =========================================
echo.
echo Press any key to view logs (Ctrl+C to exit)...
pause > /dev/null

docker-compose logs -f
