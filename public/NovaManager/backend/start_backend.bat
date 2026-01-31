@echo off
REM Script para iniciar el backend de NovaManager con el entorno virtual activado (CMD)
set VENV_PATH=.\venv\Scripts\activate.bat

if exist "%VENV_PATH%" (
    echo Activando entorno virtual...
    call "%VENV_PATH%"
    echo Iniciando Uvicorn...
    uvicorn main:app --reload --port 8000
) else (
    echo Error: No se encontró el entorno virtual en %VENV_PATH%.
    pause
)
