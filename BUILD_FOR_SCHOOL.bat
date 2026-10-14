@echo off
setlocal
cd /d "%~dp0"
echo [1/3] Installing dependencies...
call npm install --no-audit --no-fund
if errorlevel 1 goto FAIL
echo [2/3] Building website...
call npm run build
if errorlevel 1 goto FAIL
echo [3/3] Copying files to GitHub_upload folder...
if exist "GitHub_upload" rmdir /s /q "GitHub_upload"
mkdir "GitHub_upload"
xcopy "dist\*" "GitHub_upload\" /E /I /Y >nul
if not exist "GitHub_upload\index.html" goto FAIL
echo.
echo SUCCESS! Upload CONTENTS of GitHub_upload folder to the ROOT of your GitHub repository.
echo Do not upload the enclosing GitHub_upload folder itself.
pause
exit /b 0
:FAIL
echo.
echo ERROR: Build did not finish. Copy the error message and send it to ChatGPT.
pause
exit /b 1
