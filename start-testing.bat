@echo off
echo ========================================
echo Vietnamese Card Games - Testing Setup
echo ========================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running. Please start Docker Desktop first.
    echo.
    pause
    exit /b 1
)

echo [1/4] Starting PostgreSQL...
docker-compose up -d postgres
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start Docker container.
    pause
    exit /b 1
)

echo [2/4] Setting up server...
cd server
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo Running database migrations...
call npx prisma migrate dev --name init
call npx prisma generate
call npm run seed

echo Starting server on port 3001...
start "Viet Cards Server" cmd /k "npm run dev"
cd ..

echo.
echo [3/4] Setting up mobile app...
cd apps/mobile-rn
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo Starting Expo dev server...
start "Viet Cards Mobile" cmd /k "npm start"
cd ..

echo.
echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo The following should be opening in new windows:
echo   1. Server running on http://localhost:3001
echo   2. Expo dev server on http://localhost:8081
echo.
echo To test:
echo   - Press 'w' in the Expo window to open web version
echo   - Or visit http://localhost:8081 in your browser
echo   - Click "Continue as Dev User" to login
echo.
echo To test API directly:
echo   curl http://localhost:3001/api/health
echo   curl -X POST http://localhost:3001/api/auth/dev/login -H "Content-Type: application/json" -d "{\"displayName\":\"Test\"}"
echo.
pause
