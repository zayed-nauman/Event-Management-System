@echo off
REM Event Management App - Quick Start Script for Windows
REM This script sets up the local development environment

echo.
echo ========================================
echo Event Management App - Setup Script
echo ========================================
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% equ 0 (
    echo Docker found. You can use: docker-compose up
    echo.
) else (
    echo Docker not found. Continue with manual setup.
    echo.
)

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %errorlevel% equ 0 (
    echo PostgreSQL found.
    echo.
) else (
    echo PostgreSQL not found. Please install from: https://www.postgresql.org/download/windows/
    pause
    exit /b
)

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js not found. Please install from: https://nodejs.org/
    pause
    exit /b
)

REM Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Python not found. Please install from: https://www.python.org/
    pause
    exit /b
)

echo.
echo Prerequisites installed successfully!
echo.
echo Next steps:
echo 1. Create PostgreSQL database (see SETUP_POSTGRESQL.md)
echo 2. Create .env files in each directory (see .env.example files)
echo.
echo To start development:
echo.
echo Option A - Using Docker:
echo   docker-compose up
echo.
echo Option B - Manual:
echo   1. cd frontend && npm install && npm start
echo   2. cd backend-node && npm install && npm run dev
echo   3. cd backend-django && pip install -r requirements.txt && python manage.py migrate && python manage.py runserver
echo.
pause
