#!/bin/bash
# Event Management App - Quick Start Script for macOS/Linux
# This script sets up the local development environment

echo ""
echo "========================================"
echo "Event Management App - Setup Script"
echo "========================================"
echo ""

# Check if Docker is installed
if command -v docker &> /dev/null; then
    echo "✓ Docker found. You can use: docker-compose up"
    echo ""
else
    echo "✗ Docker not found (optional). Continue with manual setup."
    echo ""
fi

# Check if PostgreSQL is installed
if command -v psql &> /dev/null; then
    echo "✓ PostgreSQL found."
    echo ""
else
    echo "✗ PostgreSQL not found. Please install:"
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu/Debian: sudo apt-get install postgresql"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "✗ Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js found ($(node -v))"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "✗ Python not found. Please install from https://www.python.org/"
    exit 1
fi
echo "✓ Python found ($(python3 --version))"

echo ""
echo "Prerequisites installed successfully!"
echo ""
echo "Next steps:"
echo "1. Create PostgreSQL database (see SETUP_POSTGRESQL.md)"
echo "2. Create .env files in each directory (see .env.example files)"
echo ""
echo "To start development:"
echo ""
echo "Option A - Using Docker:"
echo "  docker-compose up"
echo ""
echo "Option B - Manual:"
echo "  1. cd frontend && npm install && npm start"
echo "  2. cd backend-node && npm install && npm run dev"
echo "  3. cd backend-django && pip install -r requirements.txt && python manage.py migrate && python manage.py runserver"
echo ""
