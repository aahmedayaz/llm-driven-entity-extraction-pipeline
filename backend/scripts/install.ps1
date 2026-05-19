# Install dependencies into the project venv (avoids global Python permission errors)
$ErrorActionPreference = "Stop"
$BackendRoot = Split-Path -Parent $PSScriptRoot
Set-Location $BackendRoot

if (-not (Test-Path "venv\Scripts\python.exe")) {
    python -m venv venv
}

& ".\venv\Scripts\python.exe" -m pip install --upgrade pip
& ".\venv\Scripts\pip.exe" install -r requirements.txt
Write-Host "Done. Activate with: .\venv\Scripts\Activate.ps1"
