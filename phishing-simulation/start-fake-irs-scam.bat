@echo off
title Fake IRS Scam - Local Server
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-fake-irs-scam.ps1"
pause
