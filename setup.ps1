$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot

$pythonCommand = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCommand) {
  Write-Host "Python was not found. Please install Python 3.10 or newer:" -ForegroundColor Red
  Write-Host "https://www.python.org/downloads/"
  exit 1
}

Write-Host "Detected Python:"
python --version

if (-not (Test-Path -LiteralPath ".venv\Scripts\python.exe")) {
  Write-Host "Creating local virtual environment .venv ..."
  python -m venv .venv
}

$python = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"

Write-Host "Installing Python dependencies ..."
& $python -m pip install -r requirements.txt

if (-not (Test-Path -LiteralPath ".env")) {
  Copy-Item -LiteralPath ".env.example" -Destination ".env"
  Write-Host "Created .env"
}

Write-Host "Installing local English-to-Chinese model ..."
& $python install_argos_zh.py

Write-Host ""
Write-Host "Setup complete. Run start.bat to launch the app." -ForegroundColor Green
