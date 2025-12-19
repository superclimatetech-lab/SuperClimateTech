#!/bin/bash

# SuperTech - Startup Script

echo "🚀 Starting SuperTech Application..."
echo ""

# Check if running in virtual environment
if [[ -z "$VIRTUAL_ENV" ]]; then
    echo "❌ Virtual environment not activated. Please run:"
    echo "source venv/bin/activate"
    exit 1
fi

echo "✓ Virtual environment activated"
echo ""

# Create initial database
echo "📦 Setting up database..."
python manage.py migrate --noinput
echo "✓ Database setup complete"
echo ""

# Load sample data
echo "📍 Loading sample locations..."
python manage.py shell << EOF
from weather_api.models import Location

locations = [
    {"name": "Cairo", "country": "Egypt", "latitude": 30.0444, "longitude": 31.2357, "is_featured": True},
    {"name": "Lagos", "country": "Nigeria", "latitude": 6.5244, "longitude": 3.3792, "is_featured": True},
    {"name": "Johannesburg", "country": "South Africa", "latitude": -26.2023, "longitude": 28.0436, "is_featured": True},
    {"name": "Nairobi", "country": "Kenya", "latitude": -1.2921, "longitude": 36.8219, "is_featured": True},
    {"name": "Addis Ababa", "country": "Ethiopia", "latitude": 9.0320, "longitude": 38.7469, "is_featured": True},
    {"name": "Accra", "country": "Ghana", "latitude": 5.6037, "longitude": -0.1870, "is_featured": True},
    {"name": "Algiers", "country": "Algeria", "latitude": 36.7538, "longitude": 3.0588, "is_featured": True},
    {"name": "Cape Town", "country": "South Africa", "latitude": -33.9249, "longitude": 18.4241, "is_featured": True},
]

for loc in locations:
    Location.objects.get_or_create(**loc)

print(f"✓ Loaded {Location.objects.count()} locations")
EOF
echo ""

echo "🎉 Setup complete!"
echo ""
echo "Start the Django development server:"
echo "  python manage.py runserver"
echo ""
echo "In another terminal, start Celery worker:"
echo "  celery -A supertech_backend worker -l info"
echo ""
echo "And Celery Beat (in another terminal):"
echo "  celery -A supertech_backend beat -l info"
echo ""
echo "Frontend development server:"
echo "  cd supertech-frontend && npm run dev"
