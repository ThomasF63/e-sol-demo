@echo off
title Demo e-Sol
cd /d "%~dp0.."

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js est introuvable. Installez-le depuis https://nodejs.org puis relancez.
  pause
  exit /b 1
)

echo Compilation du site...
node build.js
if errorlevel 1 echo   (compilation en echec - la derniere version compilee sera utilisee)

node scripts\serve.js
if errorlevel 1 pause
