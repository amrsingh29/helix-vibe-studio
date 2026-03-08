<#
.SYNOPSIS
    BMC Helix Innovation Studio - Docker/Podman Setup Script (Windows)
.DESCRIPTION
    Sets up the containerized development environment. Auto-detects Docker or
    Podman, or use -Docker / -Podman to force a specific engine.
.EXAMPLE
    .\setup.ps1              # auto-detect / interactive prompt
    .\setup.ps1 -Docker      # force Docker
    .\setup.ps1 -Podman      # force Podman
#>
param(
    [switch]$Docker,
    [switch]$Podman
)

$ErrorActionPreference = "Stop"

# Source the container engine abstraction layer
$engineArgs = @{}
if ($Docker) { $engineArgs["Docker"] = $true }
if ($Podman) { $engineArgs["Podman"] = $true }
. "$PSScriptRoot\container-engine.ps1" @engineArgs

Set-Location $PSScriptRoot

Write-Host "=========================================="
Write-Host "BMC Helix Innovation Studio Setup"
Write-Host "=========================================="
Write-Host ""

Write-Host "Checking prerequisites..."
Write-Host "  [OK] $EngineLabel is installed" -ForegroundColor Green
Write-Host "  [OK] Compose ($ComposeEngine) is available" -ForegroundColor Green
Write-Host ""

# Create necessary directories
Write-Host "Creating workspace directories..."
New-Item -ItemType Directory -Force -Path "workspace" | Out-Null
New-Item -ItemType Directory -Force -Path "sdk" | Out-Null
Write-Host "  [OK] Directories created" -ForegroundColor Green
Write-Host ""

# Check if SDK exists
if (-not (Test-Path $SdkHostPath)) {
    Write-Host "  [!] Warning: BMC Helix Innovation Studio SDK not found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please download the SDK and extract it to:"
    Write-Host "  $((Get-Location).Path)\$SdkHostPath\"
    Write-Host ""
    $reply = Read-Host "Do you want to continue without the SDK? (y/n)"
    if ($reply -notmatch '^[Yy]') { exit 1 }
} else {
    Write-Host "  [OK] SDK found" -ForegroundColor Green
}
Write-Host ""

# Build container image
Write-Host "Building container image ($EngineLabel)..."
Write-Host "This may take several minutes on first run..."
try { Invoke-Compose build }
catch {
    Write-Host "  [FAIL] Failed to build container image" -ForegroundColor Red
    exit 1
}
Write-Host "  [OK] Container image built successfully" -ForegroundColor Green
Write-Host ""

# Start container
Write-Host "Starting container..."
try { Invoke-Compose up -d }
catch {
    Write-Host "  [FAIL] Failed to start container" -ForegroundColor Red
    exit 1
}
Write-Host "  [OK] Container started successfully" -ForegroundColor Green
Write-Host ""

# Install SDK if it exists
if (Test-Path $SdkHostPath) {
    Write-Host "Installing SDK dependencies..."
    try {
        Invoke-Compose exec -T bmc-helix-dev bash -c "cd $SdkContainerPath/lib && mvn clean install"
        Write-Host "  [OK] SDK dependencies installed" -ForegroundColor Green
    } catch {
        Write-Host "  [!] Warning: Failed to install SDK dependencies" -ForegroundColor Yellow
        Write-Host "You can manually install them later by running:"
        Write-Host "  $ContainerEngine exec bmc-helix-innovation-studio bash"
        Write-Host "  cd $SdkContainerPath/lib"
        Write-Host "  mvn clean install"
    }
    Write-Host ""
}

# Verify installation
Write-Host "Verifying installation..."
Write-Host ""
Write-Host "Java version:"
Invoke-Compose exec -T bmc-helix-dev java -version
Write-Host ""
Write-Host "Maven version:"
Invoke-Compose exec -T bmc-helix-dev mvn -version
Write-Host ""
Write-Host "Node.js version:"
Invoke-Compose exec -T bmc-helix-dev node --version
Write-Host ""
Write-Host "Yarn version:"
Invoke-Compose exec -T bmc-helix-dev yarn --version
Write-Host ""
Write-Host "Grunt version:"
Invoke-Compose exec -T bmc-helix-dev grunt --version
Write-Host ""

Write-Host "=========================================="
Write-Host "Setup completed successfully! ($EngineLabel)" -ForegroundColor Green
Write-Host "=========================================="
Write-Host ""
Write-Host "To access the development environment:"
Write-Host "  $ContainerEngine exec -it bmc-helix-innovation-studio bash"
Write-Host ""
Write-Host "To stop the environment:"
Write-Host "  $ComposeEngine -f $ComposeFile down"
Write-Host ""
Write-Host "Your workspace is located at:"
Write-Host "  $((Get-Location).Path)\workspace"
Write-Host ""
Write-Host "For more information, see README.md"
Write-Host ""
