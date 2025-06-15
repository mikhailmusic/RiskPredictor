@echo off
setlocal

set VENV_DIR=venv
set APP_PATH=src\app.py

if not exist %VENV_DIR%\Scripts\activate (
    echo [INFO] Creating virtual environment...
    python -m venv %VENV_DIR%

    echo [INFO] Activating virtual environment...
    call %VENV_DIR%\Scripts\activate

    echo [INFO] Upgrading pip...
    %VENV_DIR%\Scripts\python.exe -m pip install --upgrade pip

    echo [INFO] Installing dependencies from requirements.txt...
    %VENV_DIR%\Scripts\python.exe -m pip install -r requirements.txt
) else (
    echo [INFO] Activating virtual environment...
    call %VENV_DIR%\Scripts\activate
)

echo [INFO] Starting API...
python %APP_PATH%

pause
endlocal
