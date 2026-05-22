# Run Property Chat API on port 8001 (8000 is often used by other local apps).
$ErrorActionPreference = "Stop"
$BackendRoot = Split-Path -Parent $PSScriptRoot
Set-Location $BackendRoot

if (-not (Test-Path "venv\Scripts\python.exe")) {
    Write-Host "venv not found. Run: .\scripts\install.ps1" -ForegroundColor Yellow
    exit 1
}

& ".\venv\Scripts\python.exe" -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
