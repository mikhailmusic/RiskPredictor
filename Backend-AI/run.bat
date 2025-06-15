@echo off
setlocal

set VENV_DIR=venv
set APP_PATH=src\app.py

if not exist %VENV_DIR%\Scripts\activate (
    echo [INFO] Creating virtual environment...
    python -m venv %VENV_DIR%
    call %VENV_DIR%\Scripts\activate

    echo [INFO] Installing dependencies from requirements.txt...
    pip install --upgrade pip >nul
    pip install -r requirements.txt
) else (
    call %VENV_DIR%\Scripts\activate
)

echo [INFO] Starting API...
python %APP_PATH%

pause
endlocal
