$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot

if (-not (Test-Path -LiteralPath ".venv\Scripts\python.exe")) {
  Write-Host "Local environment was not found. Running setup first ..."
  & powershell -ExecutionPolicy Bypass -File ".\setup.ps1"
}

$python = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"
$port = "8000"

if (Test-Path -LiteralPath ".env") {
  $portLine = Select-String -Path ".env" -Pattern "^PORT=" -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($portLine) {
    $port = $portLine.Line.Split("=", 2)[1].Trim()
  }
}

$url = "http://localhost:$port"
Write-Host "Starting Paper Library: $url"
Start-Process $url
& $python server.py
