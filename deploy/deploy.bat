@echo off
REM Quick deployment script for Google Cloud Run (Windows)

set PROJECT_ID=
for /f "tokens=*" %%i in ('gcloud config get-value project 2^>nul') do set PROJECT_ID=%%i

set REGION=us-central1
set SERVICE_NAME=factory-copilot

if "%PROJECT_ID%"=="" (
    echo Error: No Google Cloud project set.
    echo Run: gcloud config set project YOUR_PROJECT_ID
    exit /b 1
)

echo Deploying Factory Copilot to Google Cloud Run
echo Project: %PROJECT_ID%
echo Region: %REGION%
echo.

REM Build and push image
echo Building Docker image...
gcloud builds submit --tag gcr.io/%PROJECT_ID%/%SERVICE_NAME%

REM Deploy to Cloud Run
echo Deploying to Cloud Run...
gcloud run deploy %SERVICE_NAME% ^
  --image gcr.io/%PROJECT_ID%/%SERVICE_NAME% ^
  --platform managed ^
  --region %REGION% ^
  --allow-unauthenticated ^
  --set-env-vars PORT=8080 ^
  --memory 2Gi ^
  --cpu 2 ^
  --timeout 300

echo.
echo Deployment complete!
echo To get your URL, run:
echo   gcloud run services describe %SERVICE_NAME% --region %REGION% --format "value(status.url)"
