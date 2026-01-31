# Script para iniciar el backend de NovaManager con el entorno virtual activado
$VENV_PATH = ".\venv\Scripts\Activate.ps1"

if (Test-Path $VENV_PATH) {
    Write-Host "Activando entorno virtual..." -ForegroundColor Cyan
    . $VENV_PATH
    Write-Host "Iniciando Uvicorn..." -ForegroundColor Green
    uvicorn main:app --reload --port 8000
} else {
    Write-Error "No se encontró el entorno virtual en $VENV_PATH. Asegúrate de haberlo creado."
}
