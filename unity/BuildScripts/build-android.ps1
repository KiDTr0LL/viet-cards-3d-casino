# Unity Android Build Script
# Run from PowerShell in the unity directory

$unityPath = "C:\Program Files\Unity\Hub\Editor\2022.3.0f1\Editor\Unity.exe"
$projectPath =PWD
$buildOutput = "$projectPath\BuildOutput\Android"

Write-Host "Starting Unity Android build..." -ForegroundColor Green

# Create output directory
if (!(Test-Path $buildOutput)) {
    New-Item -ItemType Directory -Path $buildOutput
}

# Build command
$buildArgs = @(
    "-batchmode",
    "-quit",
    "-projectPath", $projectPath,
    "-buildAndroidPlayer", "$buildOutput\VietnameseCasino.apk"
)

& $unityPath $buildArgs

Write-Host "Build complete! APK located at: $buildOutput" -ForegroundColor Green
