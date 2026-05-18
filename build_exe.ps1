$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot

if (-not (Test-Path -LiteralPath ".venv\Scripts\python.exe")) {
  & powershell -ExecutionPolicy Bypass -File ".\setup.ps1"
}

$python = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"

Write-Host "Installing PyInstaller ..."
& $python -m pip install pyinstaller

Write-Host "Building Windows executable bundle ..."
& $python -m PyInstaller --clean ".\PaperLibrary.spec"

Copy-Item -LiteralPath ".env.example" -Destination "dist\PaperLibrary\.env" -Force

Write-Host ""
Write-Host "Build complete: dist\PaperLibrary\PaperLibrary.exe" -ForegroundColor Green
