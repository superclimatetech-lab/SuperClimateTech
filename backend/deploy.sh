#!/bin/bash

# SuperTech Backend - Production Deployment Setup Script
# Run this script to set up the backend for production deployment

set -e  # Exit on error

echo "🚀 SuperTech Backend - Deployment Setup"
echo "========================================"
echo ""

# Check environment
ENVIRONMENT=${1:-development}

if [[ "$ENVIRONMENT" != "development" && "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    echo "❌ Invalid environment. Use: development, staging, or production"
    exit 1
fi

echo "📦 Environment: $ENVIRONMENT"
echo ""

# Check Python version
echo "🔍 Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python $python_version"

# Create virtual environment if needed
if [ ! -d "venv" ]; then
    echo "📝 Creating virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "📦 Upgrading pip..."
pip install --upgrade pip setuptools wheel

# Install requirements
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    if [ "$ENVIRONMENT" = "production" ]; then
        cp .env.production .env
    elif [ "$ENVIRONMENT" = "staging" ]; then
        cp .env.staging .env
    else
        cp .env.development .env
    fi
    echo "⚠️  Please update .env file with your configuration"
    echo "   File location: $(pwd)/.env"
fi

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Create staticfiles directory
echo "📁 Creating staticfiles directory..."
mkdir -p staticfiles

# Create media directory
echo "📁 Creating media directory..."
mkdir -p media

# Run migrations
echo ""
echo "🗄️  Running database migrations..."
python manage.py migrate

# Collect static files
echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

# Create superuser prompt
echo ""
echo "👤 Create superuser? (y/n)"
read -r create_superuser

if [ "$create_superuser" = "y" ] || [ "$create_superuser" = "Y" ]; then
    python manage.py createsuperuser
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📝 Next steps:"
echo ""

if [ "$ENVIRONMENT" = "production" ]; then
    echo "1. Update .env file with production settings:"
    echo "   nano .env"
    echo ""
    echo "2. Set up Systemd services:"
    echo "   sudo cp supertech.service /etc/systemd/system/"
    echo "   sudo cp supertech-celery.service /etc/systemd/system/"
    echo "   sudo cp supertech-celery-beat.service /etc/systemd/system/"
    echo ""
    echo "3. Enable and start services:"
    echo "   sudo systemctl daemon-reload"
    echo "   sudo systemctl enable supertech.service supertech-celery.service supertech-celery-beat.service"
    echo "   sudo systemctl start supertech.service supertech-celery.service supertech-celery-beat.service"
    echo ""
    echo "4. Configure Nginx:"
    echo "   sudo cp nginx.conf /etc/nginx/sites-available/supertech"
    echo "   sudo ln -s /etc/nginx/sites-available/supertech /etc/nginx/sites-enabled/"
    echo "   sudo nginx -t && sudo systemctl restart nginx"
elif [ "$ENVIRONMENT" = "staging" ]; then
    echo "1. Update .env file with staging settings:"
    echo "   nano .env"
    echo ""
    echo "2. Start Docker containers:"
    echo "   docker-compose up -d"
    echo ""
    echo "3. Access application at http://localhost:8000"
else
    echo "1. Update .env file with development settings (if needed):"
    echo "   nano .env"
    echo ""
    echo "2. Start development server:"
    echo "   python manage.py runserver 0.0.0.0:8000"
    echo ""
    echo "3. Start Celery worker (in another terminal):"
    echo "   celery -A supertech_backend worker -l info"
    echo ""
    echo "4. Start Celery Beat (in another terminal):"
    echo "   celery -A supertech_backend beat -l info"
fi

echo ""
echo "📚 For more information, see DEPLOYMENT.md"
