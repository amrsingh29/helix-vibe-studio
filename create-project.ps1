<#
.SYNOPSIS
    BMC Helix Innovation Studio - New Project Setup Script (Windows)
.DESCRIPTION
    Creates a new BMC Helix coded application project using the Maven archetype.
    Auto-detects Docker or Podman, or use -Docker / -Podman to force a specific engine.
.EXAMPLE
    .\create-project.ps1              # auto-detect / interactive prompt
    .\create-project.ps1 -Docker      # force Docker
    .\create-project.ps1 -Podman      # force Podman
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

$ContainerName    = "bmc-helix-innovation-studio"
$ArchetypeVersion = "${SdkVersion}-SNAPSHOT"

Write-Host ""
Write-Host "==========================================" -ForegroundColor White
Write-Host " BMC Helix Innovation Studio"              -ForegroundColor White
Write-Host " New Project Setup ($EngineLabel)"         -ForegroundColor White
Write-Host "==========================================" -ForegroundColor White
Write-Host ""

# -------------------------------------------------------------------
# Pre-flight checks
# -------------------------------------------------------------------

Write-Host "Checking prerequisites..." -ForegroundColor Cyan
Write-Host ""
Write-Host "  [OK] $EngineLabel is installed" -ForegroundColor Green

# Check container is running
$running = & $ContainerEngine ps --format '{{.Names}}' 2>&1
if ($running -notcontains $ContainerName) {
    Write-Host "Error: Container '$ContainerName' is not running." -ForegroundColor Red
    Write-Host "  Start it first with: $ComposeEngine -f $ComposeFile up -d"
    exit 1
}
Write-Host "  [OK] Container '$ContainerName' is running" -ForegroundColor Green

# Check archetype is available
& $ContainerEngine exec $ContainerName bash -c "ls /root/.m2/repository/com/bmc/arsys/rx-sdk-archetype-application/$ArchetypeVersion/ > /dev/null 2>&1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: BMC archetype (rx-sdk-archetype-application:$ArchetypeVersion) not found in Maven local repo." -ForegroundColor Red
    Write-Host "  Make sure the SDK has been installed with: mvn clean install"
    exit 1
}
Write-Host "  [OK] BMC archetype available ($ArchetypeVersion)" -ForegroundColor Green
Write-Host ""

# -------------------------------------------------------------------
# Collect project information
# -------------------------------------------------------------------

Write-Host "--- Project Configuration ---" -ForegroundColor White
Write-Host ""

# Project Name (required)
do {
    $ProjectName = (Read-Host "Project Name (e.g. my-poc-app)").Trim()
    if ([string]::IsNullOrWhiteSpace($ProjectName)) {
        Write-Host "  Project name is required." -ForegroundColor Red
        continue
    }
    if ($ProjectName -notmatch '^[a-z][a-z0-9-]*$') {
        Write-Host "  Invalid name. Use lowercase letters, numbers, and hyphens only (must start with a letter)." -ForegroundColor Red
        continue
    }
    if (Test-Path "workspace\$ProjectName") {
        Write-Host "  Project 'workspace\$ProjectName' already exists. Choose a different name." -ForegroundColor Red
        continue
    }
    break
} while ($true)

# Friendly Name
$defaultFriendly = ($ProjectName -replace '-', ' ') -replace '\b(\w)', { $_.Groups[1].Value.ToUpper() }
$FriendlyName = Read-Host "Friendly Name [$defaultFriendly]"
if ([string]::IsNullOrWhiteSpace($FriendlyName)) { $FriendlyName = $defaultFriendly }

# Group ID
$GroupId = Read-Host "Group ID [com.mycompany]"
if ([string]::IsNullOrWhiteSpace($GroupId)) { $GroupId = "com.mycompany" }

# Version
$Version = Read-Host "Version [1.0.0-SNAPSHOT]"
if ([string]::IsNullOrWhiteSpace($Version)) { $Version = "1.0.0-SNAPSHOT" }

# Java package
$PackageName = "$GroupId.$($ProjectName -replace '-', '')"

# Developer credentials
$DevUser = Read-Host "Developer Username [Demo]"
if ([string]::IsNullOrWhiteSpace($DevUser)) { $DevUser = "Demo" }

$DevPass = Read-Host "Developer Password [P@ssw0rd]" -AsSecureString
$DevPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($DevPass))
if ([string]::IsNullOrWhiteSpace($DevPassPlain)) { $DevPassPlain = "P@ssw0rd" }

# Server URL
$ServerUrl = Read-Host "Server URL [https://srini-pv-is.pun-itrnch-01.bmc.com]"
if ([string]::IsNullOrWhiteSpace($ServerUrl)) { $ServerUrl = "https://srini-pv-is.pun-itrnch-01.bmc.com" }

# Bundle type
$IsApp = Read-Host "Is Application? (true/false) [true]"
if ([string]::IsNullOrWhiteSpace($IsApp)) { $IsApp = "true" }

# Skip UI
$SkipUI = Read-Host "Skip UI Code Generation? (true/false) [false]"
if ([string]::IsNullOrWhiteSpace($SkipUI)) { $SkipUI = "false" }

# -------------------------------------------------------------------
# Confirm
# -------------------------------------------------------------------

Write-Host ""
Write-Host "--- Review Configuration ---" -ForegroundColor White
Write-Host ""
Write-Host "  Container Engine  : $EngineLabel"   -ForegroundColor Green
Write-Host "  Project Name      : $ProjectName"    -ForegroundColor Green
Write-Host "  Friendly Name     : $FriendlyName"   -ForegroundColor Green
Write-Host "  Group ID          : $GroupId"         -ForegroundColor Green
Write-Host "  Artifact ID       : $ProjectName"    -ForegroundColor Green
Write-Host "  Version           : $Version"         -ForegroundColor Green
Write-Host "  Java Package      : $PackageName"     -ForegroundColor Green
Write-Host "  Bundle ID         : $GroupId.$ProjectName" -ForegroundColor Green
Write-Host "  Is Application    : $IsApp"           -ForegroundColor Green
Write-Host "  Skip UI           : $SkipUI"          -ForegroundColor Green
Write-Host "  Developer User    : $DevUser"         -ForegroundColor Green
Write-Host "  Server URL        : $ServerUrl"       -ForegroundColor Green
Write-Host "  Location          : workspace\$ProjectName\" -ForegroundColor Green
Write-Host ""

$confirm = Read-Host "Proceed? (y/n)"
if ($confirm -notmatch '^[Yy]') {
    Write-Host "Aborted." -ForegroundColor Yellow
    exit 0
}
Write-Host ""

# -------------------------------------------------------------------
# Generate project with Maven archetype
# -------------------------------------------------------------------

Write-Host "Generating project with Maven archetype..." -ForegroundColor Cyan

$safeFriendlyName = $FriendlyName -replace "'", "'\\''"
& $ContainerEngine exec $ContainerName bash -c @"
cd /workspace && mvn archetype:generate -B \
    -DarchetypeGroupId=com.bmc.arsys \
    -DarchetypeArtifactId=rx-sdk-archetype-application \
    -DarchetypeCatalog=local \
    -DarchetypeVersion=$ArchetypeVersion \
    -DgroupId=$GroupId \
    -DartifactId=$ProjectName \
    -Dversion=$Version \
    -Dpackage=$PackageName \
    -Dname='$safeFriendlyName' \
    -DisApplication=$IsApp \
    -DskipUICodeGeneration=$SkipUI
"@

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to generate project." -ForegroundColor Red
    exit 1
}
Write-Host "  [OK] Project generated" -ForegroundColor Green
Write-Host ""

# -------------------------------------------------------------------
# Configure environment properties in pom.xml
# -------------------------------------------------------------------

Write-Host "Configuring environment properties..." -ForegroundColor Cyan

$pomFile = "workspace\$ProjectName\pom.xml"

if (-not (Test-Path $pomFile)) {
    Write-Host "  Warning: pom.xml not visible on host yet (bind mount delay)." -ForegroundColor Yellow
    Write-Host "  Extracting from container..."
    & $ContainerEngine cp "${ContainerName}:/workspace/$ProjectName/pom.xml" $pomFile
}

$pomContent = Get-Content $pomFile -Raw
$pomContent = $pomContent -replace '<developerUserName>developer</developerUserName>', "<developerUserName>$DevUser</developerUserName>"
$pomContent = $pomContent -replace '<developerPassword>developer</developerPassword>', "<developerPassword>$DevPassPlain</developerPassword>"
$pomContent = $pomContent -replace '<webUrl>http://localhost:8008</webUrl>', "<webUrl>$ServerUrl</webUrl>"
Set-Content -Path $pomFile -Value $pomContent -NoNewline

# Sync updated pom.xml back to container
& $ContainerEngine cp $pomFile "${ContainerName}:/workspace/$ProjectName/pom.xml"

Write-Host "  [OK] Environment properties configured" -ForegroundColor Green
Write-Host ""

# -------------------------------------------------------------------
# Configure yarn to ignore engine compatibility checks
# -------------------------------------------------------------------

Write-Host "Configuring yarn engine compatibility workaround..." -ForegroundColor Cyan

$yarnrcFile = "workspace\$ProjectName\bundle\src\main\webapp\.yarnrc"
Set-Content -Path $yarnrcFile -Value "--ignore-engines true"
& $ContainerEngine cp $yarnrcFile "${ContainerName}:/workspace/$ProjectName/bundle/src/main/webapp/.yarnrc"

Write-Host "  [OK] Created .yarnrc with --ignore-engines (Node.js compatibility fix)" -ForegroundColor Green
Write-Host ""

# -------------------------------------------------------------------
# Summary
# -------------------------------------------------------------------

Write-Host "==========================================" -ForegroundColor White
Write-Host " Project '$ProjectName' created successfully!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor White
Write-Host ""
Write-Host "  Container Engine:  $EngineLabel"
Write-Host "  Project location:  workspace\$ProjectName\"
Write-Host "  Bundle ID:         $GroupId.$ProjectName"
Write-Host "  Friendly Name:     $FriendlyName"
Write-Host ""
Write-Host "--- Next Steps ---" -ForegroundColor White
Write-Host ""
Write-Host "  1. Install frontend dependencies:"
Write-Host "     $ContainerEngine exec $ContainerName bash -c `"cd /workspace/$ProjectName/bundle/src/main/webapp && yarn install`"" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2. Build the project:"
Write-Host "     $ContainerEngine exec $ContainerName bash -c `"cd /workspace/$ProjectName && mvn clean install -DskipTests`"" -ForegroundColor Cyan
Write-Host ""
Write-Host "  3. Build and deploy to server:"
Write-Host "     $ContainerEngine exec $ContainerName bash -c `"cd /workspace/$ProjectName && mvn clean install -Pdeploy -DskipTests`"" -ForegroundColor Cyan
Write-Host ""
Write-Host "  4. Start dev server (optional):"
Write-Host "     $ContainerEngine exec $ContainerName bash -c `"cd /workspace/$ProjectName/bundle/src/main/webapp && npx nx serve shell --host 0.0.0.0 --port 4200 --disable-host-check`"" -ForegroundColor Cyan
Write-Host ""
