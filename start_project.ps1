
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Neighborhood Help Portal Launcher      " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Set location to script directory
$ScriptDir = $PSScriptRoot
Set-Location $ScriptDir
Write-Host "Working Directory: $ScriptDir" -ForegroundColor Gray

# 2. Check Backend
if (!(Test-Path "backend")) {
    Write-Host "[ERROR] 'backend' folder not found!" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit
}
Write-Host "[OK] Backend folder found." -ForegroundColor Green
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process "cmd.exe" -ArgumentList "/k cd /d ""$ScriptDir\backend"" && npm run dev" -WindowStyle Normal

# 3. Check Frontend
if (!(Test-Path "frontend")) {
    Write-Host "[ERROR] 'frontend' folder not found!" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit
}
Write-Host "[OK] Frontend folder found." -ForegroundColor Green
Write-Host "Starting Frontend Application..." -ForegroundColor Yellow
Start-Process "cmd.exe" -ArgumentList "/k cd /d ""$ScriptDir\frontend"" && npm start" -WindowStyle Normal

# 4. Open Browser
Write-Host "Waiting 10 seconds for servers to warm up..." -ForegroundColor Gray
Start-Sleep -Seconds 10
Write-Host "Opening Browser..." -ForegroundColor Cyan
Start-Process "http://localhost:4200"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Done! Applications are running in new windows." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Read-Host "Press Enter to close this launcher..."
