# SuperTech Quick Start Guide

Get the SuperTech application running locally in just a few steps.

## Prerequisites

Ensure you have installed:
- Python 3.9+
- Node.js 18+
- Git

## Quick Start (3 Steps)

### Step 1: Set Up Backend

```bash
# Navigate to project directory
cd /home/subchief/SuperClimate

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run setup script
bash setup.sh
```

### Step 2: Start Backend Services

**Terminal 1 - Django Server:**
```bash
source venv/bin/activate
python manage.py runserver
```

**Terminal 2 - Celery Worker:**
```bash
source venv/bin/activate
celery -A supertech_backend worker -l info
```

**Terminal 3 - Celery Beat:**
```bash
source venv/bin/activate
celery -A supertech_backend beat -l info
```

### Step 3: Start Frontend

```bash
cd supertech-frontend
npm install  # If not already installed
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:5173
- **Django Admin**: http://localhost:8000/admin
- **API**: http://localhost:8000/api

## Default Credentials

- **Admin Username**: admin
- **Admin Password**: (set during setup.sh)

## Verify Everything is Working

1. Open browser: `http://localhost:5173`
2. Click "Access Dashboard"
3. View featured locations and alerts
4. Switch between different forecast views

## Common Tasks

### Load Sample Locations

Already included in setup.sh. If needed:
```bash
python manage.py load_locations
```

### View Django Admin Panel

1. Go to http://localhost:8000/admin
2. Log in with superuser credentials
3. View/manage all data

### Check Celery Tasks

```bash
# View active tasks
celery -A supertech_backend inspect active

# View scheduled tasks
celery -A supertech_backend inspect scheduled

# View registered tasks
celery -A supertech_backend inspect registered
```

### Reset Database

```bash
# Delete existing database
rm db.sqlite3

# Re-create it
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load locations
python manage.py load_locations
```

## Project Structure Overview

```
SuperClimate/
├── supertech_backend/       # Django backend project
├── weather_api/             # Main Django app
│   ├── models.py            # Database models
│   ├── views.py             # API endpoints
│   ├── services/            # Business logic
│   └── tasks.py             # Celery tasks
├── supertech-frontend/      # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API integration
│   │   └── App.tsx          # Main app component
│   └── tailwind.config.js   # Tailwind configuration
├── README.md                # Full documentation
├── DEPLOYMENT.md            # Production deployment guide
└── requirements.txt         # Python dependencies
```

## Key Features to Try

### 1. **Landing Page**
- Visit http://localhost:5173
- Explore hero, features, and call-to-action sections

### 2. **Dashboard**
- View featured locations overview
- See active alerts
- Monitor real-time conditions

### 3. **Forecasting**
- Short-term forecast (1-7 days) with interactive charts
- Long-term forecast (8-30 days) with trend analysis

### 4. **Alert System**
- Heat wave alerts for high temperatures
- Cold wave alerts for low temperatures
- Severity-based indicators

### 5. **Real-Time Monitoring**
- View current conditions across Africa
- Interactive location cards

## API Examples

### Get All Locations

```bash
curl http://localhost:8000/api/locations/
```

### Get Featured Locations

```bash
curl http://localhost:8000/api/locations/featured/
```

### Get Current Weather for Location 1

```bash
curl http://localhost:8000/api/current-weather/by_location/?location_id=1
```

### Get Active Alerts

```bash
curl http://localhost:8000/api/alerts/active_alerts/
```

### Get Short-Term Forecast

```bash
curl http://localhost:8000/api/forecast/short_term/?location_id=1
```

## Customization

### Change Colors

Edit `supertech-frontend/tailwind.config.js`:
```js
colors: {
  orange: {
    primary: '#FF6B35',  // Change this
    // ... other shades
  },
  blue: {
    light: '#4FC3F7',    // And this
    // ... other shades
  }
}
```

### Add More Locations

Edit `weather_api/management/commands/load_locations.py` and add to `locations_data` list.

### Modify Alert Thresholds

In `weather_api/services/alert_service.py`:
```python
HEAT_WAVE_THRESHOLD = 35  # Change to custom value
COLD_WAVE_THRESHOLD = 10  # Change to custom value
```

## Troubleshooting

### Port Already in Use

Change Django port:
```bash
python manage.py runserver 8001
```

Change Vite port:
```bash
npm run dev -- --port 5174
```

### Import Errors

```bash
# Clear Python cache
find . -type d -name __pycache__ -exec rm -r {} +

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Database Locked

```bash
# Remove lock file
rm .sqlite3-wal .sqlite3-shm

# Reset database
rm db.sqlite3
python manage.py migrate
```

### Node Modules Issues

```bash
# Clear npm cache
npm cache clean --force

# Reinstall packages
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Read Documentation**: Check README.md for detailed information
2. **Explore API**: Test all endpoints using the API documentation
3. **Customize Theme**: Adjust colors and styling in tailwind.config.js
4. **Configure APIs**: Add OpenWeatherMap API key for real weather data
5. **Deploy**: Follow DEPLOYMENT.md for production setup

## Support

For detailed documentation, visit:
- `README.md` - Complete feature documentation
- `DEPLOYMENT.md` - Production deployment guide
- Django Admin - http://localhost:8000/admin

## Tips

- Always keep virtual environment activated: `source venv/bin/activate`
- Terminal multiplexer (tmux/screen) helps manage multiple terminal windows
- Use VS Code REST Client extension to test API endpoints
- Check browser console for frontend errors
- Check Django logs for backend errors

Happy monitoring! 🌡️
