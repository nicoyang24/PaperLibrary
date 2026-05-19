$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot

function Get-UsablePython {
  $candidates = @(
    @{ Command = "py"; VersionArgs = @("-3.10", "--version"); VenvArgs = @("-3.10", "-m", "venv", ".venv"); ClearVenvArgs = @("-3.10", "-m", "venv", "--clear", ".venv") },
    @{ Command = "python"; VersionArgs = @("--version"); VenvArgs = @("-m", "venv", ".venv"); ClearVenvArgs = @("-m", "venv", "--clear", ".venv") },
    @{ Command = "py"; VersionArgs = @("-3", "--version"); VenvArgs = @("-3", "-m", "venv", ".venv"); ClearVenvArgs = @("-3", "-m", "venv", "--clear", ".venv") }
  )

  foreach ($candidate in $candidates) {
    $command = Get-Command $candidate.Command -ErrorAction SilentlyContinue
    if (-not $command) {
      continue
    }

    $output = & $candidate.Command @($candidate.VersionArgs) 2>&1
    if ($LASTEXITCODE -eq 0 -and ($output -join "`n") -match "Python 3\.") {
      return $candidate
    }
  }

  return $null
}

function Invoke-Checked {
  param (
    [string]$Command,
    [string[]]$Arguments,
    [string]$Description
  )

  & $Command @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "$Description failed."
  }
}

$pythonCommand = Get-UsablePython
if (-not $pythonCommand) {
  Write-Host "Python was not found. Please install Python 3.10 or newer:" -ForegroundColor Red
  Write-Host "https://www.python.org/downloads/"
  exit 1
}

Write-Host "Detected Python:"
Invoke-Checked $pythonCommand.Command $pythonCommand.VersionArgs "Python detection"

if (-not (Test-Path -LiteralPath ".venv\Scripts\python.exe")) {
  Write-Host "Creating local virtual environment .venv ..."
  Invoke-Checked $pythonCommand.Command $pythonCommand.VenvArgs "Virtual environment creation"
}

$python = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"
$previousErrorActionPreference = $ErrorActionPreference
$ErrorActionPreference = "Continue"
& $python -m pip --version *> $null
$pipExitCode = $LASTEXITCODE
$ErrorActionPreference = $previousErrorActionPreference
if ($pipExitCode -ne 0) {
  Write-Host "Local virtual environment is incomplete. Recreating .venv ..."
  Invoke-Checked $pythonCommand.Command $pythonCommand.ClearVenvArgs "Virtual environment recreation"
}

if (-not (Test-Path -LiteralPath ".venv\Scripts\python.exe")) {
  Write-Host "Failed to create .venv. Please check the Python installation." -ForegroundColor Red
  exit 1
}

Write-Host "Installing Python dependencies ..."
Invoke-Checked $python @("-m", "pip", "install", "-r", "requirements.txt") "Dependency installation"

if (-not (Test-Path -LiteralPath ".env")) {
  Copy-Item -LiteralPath ".env.example" -Destination ".env"
  Write-Host "Created .env"
}

Write-Host "Installing local English-to-Chinese model ..."
Invoke-Checked $python @("install_argos_zh.py") "Argos model installation"

Write-Host ""
Write-Host "Setup complete. Run start.bat to launch the app." -ForegroundColor Green
