@echo off
echo ==========================================
echo   Neighborhood Help Portal Launcher
echo ==========================================

REM 1. Go to script directory
cd /d "%~dp0"
echo Current Directory: %CD%

REM 2. Check Backend
if not exist "backend" (
    echo [ERROR] 'backend' folder not found!
    pause
    exit /b
)
echo [OK] Backend folder found.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0backend && npm run dev"

REM 3. Check Frontend
if not exist "frontend" (
    echo [ERROR] 'frontend' folder not found!
    pause
    exit /b
)
echo [OK] Frontend folder found.
echo Starting Frontend Application...
start "Frontend App" cmd /k "cd /d %~dp0frontend && npm start"

REM 4. Open Browser
echo Waiting 10 seconds...
timeout /t 10
echo Opening Browser...
start http://localhost:4200

echo ==========================================
echo   Done! 
echo   If you see black windows with errors, please let me know what they say.
echo ==========================================
pause
