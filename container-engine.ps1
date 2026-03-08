# Container Engine Abstraction Layer (PowerShell)
# ------------------------------------------------
# Dot-source this file from other scripts:
#
#   . "$PSScriptRoot\container-engine.ps1" @args
#
# Supported parameters (parsed from the caller's args):
#
#   -Docker   Force Docker
#   -Podman   Force Podman
#
# If neither flag is given:
#   - When only one engine is installed, it is selected automatically.
#   - When both are available, the user is prompted interactively.
#
# After dot-sourcing, the following variables are available:
#
#   $ContainerEngine   – "docker" or "podman"
#   $ComposeEngine     – "docker-compose", "docker compose", or "podman-compose"
#   $ComposeFile       – absolute path to the compose YAML
#   $EngineLabel       – "Docker" or "Podman"
#   $SdkVersion        – loaded from .env (e.g. "25.4.00")
#   $SdkDirName        – "com.bmc.arsys.rx.sdk-<SdkVersion>"
#   $SdkHostPath       – relative host path "sdk\<SdkDirName>"
#   $SdkContainerPath  – container path "/opt/sdk/<SdkDirName>"

param(
    [switch]$Docker,
    [switch]$Podman
)

$ErrorActionPreference = "Stop"

# ── Availability helpers ─────────────────────────────────────────────

function Test-DockerAvailable {
    try {
        $null = Get-Command docker -ErrorAction Stop
        $info = docker info 2>&1
        return $LASTEXITCODE -eq 0
    } catch { return $false }
}

function Test-PodmanAvailable {
    try {
        $null = Get-Command podman -ErrorAction Stop
        return $true
    } catch { return $false }
}

# ── Engine selection ─────────────────────────────────────────────────

$hasDocker = Test-DockerAvailable
$hasPodman = Test-PodmanAvailable

if ($Docker) {
    if (-not $hasDocker) {
        Write-Host "Error: -Docker was specified but Docker is not installed or not running." -ForegroundColor Red
        exit 1
    }
    $script:ContainerEngine = "docker"; $script:EngineLabel = "Docker"
}
elseif ($Podman) {
    if (-not $hasPodman) {
        Write-Host "Error: -Podman was specified but Podman is not installed." -ForegroundColor Red
        exit 1
    }
    $script:ContainerEngine = "podman"; $script:EngineLabel = "Podman"
}
elseif ($hasDocker -and $hasPodman) {
    Write-Host ""
    Write-Host "Both Docker and Podman are available." -ForegroundColor White
    Write-Host ""
    Write-Host "  1) Docker"
    Write-Host "  2) Podman"
    Write-Host ""
    do {
        $choice = Read-Host "Select container engine [1]"
        if ([string]::IsNullOrWhiteSpace($choice)) { $choice = "1" }
    } while ($choice -notin @("1","2"))
    if ($choice -eq "1") {
        $script:ContainerEngine = "docker"; $script:EngineLabel = "Docker"
    } else {
        $script:ContainerEngine = "podman"; $script:EngineLabel = "Podman"
    }
    Write-Host ""
}
elseif ($hasDocker) {
    $script:ContainerEngine = "docker"; $script:EngineLabel = "Docker"
}
elseif ($hasPodman) {
    $script:ContainerEngine = "podman"; $script:EngineLabel = "Podman"
}
else {
    Write-Host "Error: Neither Docker nor Podman is installed." -ForegroundColor Red
    Write-Host "Install one of:"
    Write-Host "  Docker Desktop : https://www.docker.com/products/docker-desktop"
    Write-Host "  Podman         : https://podman.io/getting-started/installation"
    exit 1
}

# ── Compose engine selection ─────────────────────────────────────────

if ($ContainerEngine -eq "docker") {
    $null = docker compose version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $script:ComposeEngine = "docker compose"
    } elseif (Get-Command docker-compose -ErrorAction SilentlyContinue) {
        $script:ComposeEngine = "docker-compose"
    } else {
        Write-Host "Error: Docker Compose is not installed." -ForegroundColor Red
        Write-Host "Install Docker Desktop (includes Compose) or install the plugin separately."
        exit 1
    }
    $script:ComposeFile = Join-Path $PSScriptRoot "docker-compose.yml"
}
else {
    if (Get-Command podman-compose -ErrorAction SilentlyContinue) {
        $script:ComposeEngine = "podman-compose"
    } else {
        Write-Host "Error: podman-compose is not installed." -ForegroundColor Red
        Write-Host "Install it with:  pip install podman-compose"
        exit 1
    }
    $script:ComposeFile = Join-Path $PSScriptRoot "podman-compose.yml"
}

# ── Load .env ────────────────────────────────────────────────────────

$envFile = Join-Path $PSScriptRoot ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
            Set-Variable -Name $Matches[1] -Value $Matches[2].Trim() -Scope Script
        }
    }
}

$script:SdkVersion       = $SDK_VERSION
$script:SdkDirName       = "com.bmc.arsys.rx.sdk-$SdkVersion"
$script:SdkHostPath      = "sdk\$SdkDirName"
$script:SdkContainerPath = "/opt/sdk/$SdkDirName"

# ── Wrapper functions ────────────────────────────────────────────────

function Invoke-Engine {
    & $ContainerEngine @args
    if ($LASTEXITCODE -ne 0) { throw "$ContainerEngine exited with code $LASTEXITCODE" }
}

function Invoke-Compose {
    $parts = $ComposeEngine -split ' '
    if ($parts.Count -eq 2) {
        & $parts[0] $parts[1] -f $ComposeFile @args
    } else {
        & $parts[0] -f $ComposeFile @args
    }
    if ($LASTEXITCODE -ne 0) { throw "$ComposeEngine exited with code $LASTEXITCODE" }
}
