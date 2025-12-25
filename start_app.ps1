$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Starting Neighborhood Help Portal" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$root = $PSScriptRoot
$backendPath = Join-Path $root "backend"
$frontendPath = Join-Path $root "frontend"

# Check if paths exist
if (-not (Test-Path $backendPath)) {
    Write-Error "Backend folder not found at $backendPath"
    exit
}

Write-Host "Starting Backend Server..." -ForegroundColor Green
Start-Process "cmd.exe" -ArgumentList "/k npm run dev" -WorkingDirectory $backendPath

Write-Host "Starting Frontend Application..." -ForegroundColor Green
Start-Process "cmd.exe" -ArgumentList "/k npm start" -WorkingDirectory $frontendPath

Write-Host "Waiting for servers to initialize (15s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "Opening Browser..." -ForegroundColor Green
Start-Process "http://localhost:4200"

Write-Host "Done! Keep the black windows open to keep the server running." -ForegroundColor Cyan
Read-Host "Press Enter to exit this launcher..."
