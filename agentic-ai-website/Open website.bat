@echo off
cd /d "%~dp0"

echo Building website...
call npm run build
if errorlevel 1 (
  echo Build failed. Make sure you ran "npm install" first.
  pause
  exit /b 1
)

echo Starting preview server...
start "SentinelOps AI Preview" cmd /k "npm run preview"

echo Waiting for server to start...
timeout /t 3 /nobreak >nul

echo Opening in browser...
start http://127.0.0.1:4173

echo.
echo Website is open. Close the "SentinelOps AI Preview" window to stop the server.
pause
