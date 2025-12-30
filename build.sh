#!/bin/bash
# Render.com build script
# This script runs during the build phase on Render

set -e

echo "🔨 Building SuperTech Backend for Render..."

# Upgrade pip
echo "📦 Upgrading pip..."
pip install --upgrade pip setuptools wheel

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Change to backend directory
cd backend

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput --clear

# Run migrations (will be done at startup via Procfile, but good to verify)
echo "🗄️  Verifying database schema..."
python manage.py migrate --check || echo "⚠️  Migrations pending (will run at startup)"

cd ..

echo "✅ Build completed successfully!"
