# SuperTech - African Heat & Cold Wave Monitoring System

A comprehensive real-time monitoring platform for tracking heat waves and cold waves across Africa, featuring advanced data analytics and forecasting capabilities.

## Features

- **Real-Time Monitoring**: Monitor current temperature conditions across African locations
- **Heat Wave Detection**: Automatically detect heat waves (≥35°C for 3+ consecutive days)
- **Cold Wave Detection**: Automatically detect cold waves (<10°C)
- **Short-Term Forecasts**: 1-7 day predictions with hourly/daily breakdowns
- **Long-Term Forecasts**: 8-30 day trend analysis
- **Alert System**: Severity-based alerts (Warning, Severe, Extreme)
- **Historical Data**: Compare current data with historical patterns
- **Multi-Location Support**: Track multiple African locations
- **Responsive Design**: Mobile-first approach for all devices
- **Data Export**: Download reports in CSV format

## Tech Stack

### Backend
- **Django 5.2** with Django REST Framework
- **PostgreSQL/SQLite** for data storage
- **Celery** for task scheduling
- **Redis** for caching and message broker
- **OpenWeatherMap & Open-Meteo APIs** for weather data

### Frontend
- **React 18** with TypeScript
- **Vite** as build tool
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Axios** for API communication
- **React Router v6** for navigation

## Project Structure

```
SuperClimate/
├── supertech_backend/          # Django backend
│   ├── manage.py
│   ├── settings.py             # Django configuration
│   ├── urls.py                 # URL routing
│   ├── celery.py               # Celery configuration
│   └── wsgi.py
├── weather_api/                # Django app
│   ├── models.py               # Database models
│   ├── serializers.py          # DRF serializers
│   ├── views.py                # API views
│   ├── urls.py                 # API endpoints
│   ├── tasks.py                # Celery tasks
│   └── services/               # Business logic
│       ├── weather_service.py  # External API integration
│       └── alert_service.py    # Alert detection logic
├── supertech-frontend/         # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Landing/
│   │   │   ├── Dashboard/
│   │   │   ├── Alerts/
│   │   │   ├── Forecast/
│   │   │   └── shared/
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── context/            # React Context
│   │   ├── types/              # TypeScript types
│   │   └── App.tsx
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

## Setup & Installation

### Backend Setup

1. **Create and activate virtual environment**
```bash
cd /home/subchief/SuperClimate
python3 -m venv venv
source venv/bin/activate
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```
DEBUG=True
SECRET_KEY=your-secret-key
OPENWEATHERMAP_API_KEY=your-api-key
CELERY_BROKER_URL=redis://localhost:6379/0
```

4. **Run migrations**
```bash
python manage.py migrate
```

5. **Create superuser**
```bash
python manage.py createsuperuser
```

6. **Load initial data** (African locations)
```bash
python manage.py loaddata initial_locations
```

7. **Start Django server**
```bash
python manage.py runserver
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd supertech-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API endpoint**
Update `.env` file:
```
VITE_API_URL=http://localhost:8000/api
```

4. **Start development server**
```bash
npm run dev
```

## Running Celery Tasks

1. **Start Celery worker** (in a separate terminal)
```bash
celery -A supertech_backend worker -l info
```

2. **Start Celery Beat** (for scheduled tasks)
```bash
celery -A supertech_backend beat -l info
```

## API Endpoints

### Locations
- `GET /api/locations/` - List all locations
- `GET /api/locations/{id}/` - Get location details
- `GET /api/locations/featured/` - Get featured locations
- `GET /api/locations/{id}/nearby/` - Get nearby locations

### Current Weather
- `GET /api/current-weather/` - Get all current weather
- `GET /api/current-weather/by_location/?location_id={id}` - Get weather for location
- `GET /api/current-weather/hottest_locations/?limit=10` - Get hottest locations
- `GET /api/current-weather/coldest_locations/?limit=10` - Get coldest locations

### Forecasts
- `GET /api/forecast/short_term/?location_id={id}` - 1-7 day forecast
- `GET /api/forecast/long_term/?location_id={id}` - 8-30 day forecast

### Alerts
- `GET /api/alerts/active_alerts/` - Get active alerts
- `GET /api/alerts/heat_wave_alerts/` - Get heat wave alerts
- `GET /api/alerts/cold_wave_alerts/` - Get cold wave alerts
- `GET /api/alerts/by_location/?location_id={id}` - Get alerts for location

### Historical Data
- `GET /api/historical/by_location/?location_id={id}` - Get historical data
- `GET /api/historical/comparison/?location_ids=1,2,3` - Compare multiple locations

## Scheduled Tasks

The application includes the following Celery scheduled tasks:

1. **Fetch Current Weather** - Every 30 minutes
   - Fetches latest weather data from external APIs
   - Updates temperature records
   - Checks for new alerts

2. **Fetch Forecast Data** - Every 6 hours
   - Updates short and long-term forecasts
   - Stores predictions in database

3. **Check Alert Conditions** - Every hour
   - Monitors active alerts
   - Updates alert status

4. **Archive Historical Data** - Daily at midnight
   - Archives daily aggregates
   - Cleans up old data

5. **Cleanup Old Data** - Daily
   - Removes forecasts older than 90 days

## Color Scheme

- **Primary Orange**: #FF6B35 (buttons, alerts, hot temperatures)
- **Light Blue**: #4FC3F7 (accents, cool temperatures)
- **Neutral Gray**: #333333 (text)
- **Background**: #F5F5F5 (main background)

## Alert Thresholds

### Heat Wave
- **Temperature**: ≥ 35°C
- **Duration**: 3+ consecutive days
- **Severity Levels**:
  - Warning: 35-37°C
  - Severe: 38-41°C
  - Extreme: ≥ 42°C

### Cold Wave
- **Temperature**: < 10°C
- **Severity Levels**:
  - Warning: 5-10°C
  - Severe: 0-5°C
  - Extreme: < 0°C

## External APIs

The system integrates with:

1. **Open-Meteo** (Free, no API key required)
   - Current weather conditions
   - 90-day forecasts
   - Historical data

2. **OpenWeatherMap** (Optional, requires API key)
   - Detailed weather data
   - Advanced forecasting

## Development

### Adding New Features

1. **Create backend models** in `weather_api/models.py`
2. **Create serializers** in `weather_api/serializers.py`
3. **Create views/viewsets** in `weather_api/views.py`
4. **Register URLs** in `weather_api/urls.py`
5. **Create React components** in `src/components/`
6. **Add API service methods** in `src/services/weatherService.ts`

### Database Schema

The system uses the following models:

- **Location** - African cities/locations
- **CurrentWeather** - Real-time weather data
- **Forecast** - Short and long-term predictions
- **Alert** - Heat/cold wave alerts
- **HistoricalData** - Archived weather records

## Performance Considerations

- Redis caching for frequent API calls
- Pagination for large datasets (20 items per page)
- Lazy loading for map components
- Optimized database queries with indexes
- Frontend bundle optimization with Vite

## Future Enhancements

- [ ] User authentication and saved preferences
- [ ] Email/SMS alert notifications
- [ ] Advanced Google Maps integration with custom markers
- [ ] Multi-language support (English, French, Arabic, Swahili)
- [ ] Dark mode toggle
- [ ] Social sharing capabilities
- [ ] PDF report generation
- [ ] Machine learning for anomaly detection
- [ ] Mobile app (React Native)

## Troubleshooting

### Django Issues
- Ensure PostgreSQL/SQLite is running
- Check ALLOWED_HOSTS in settings.py
- Verify CORS configuration for frontend URL

### Celery Issues
- Ensure Redis is running: `redis-server`
- Check Celery worker logs for errors
- Verify task routing in celery.py

### Frontend Issues
- Clear Node modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`
- Check browser console for API errors

## License

This project is provided for educational and commercial use.

## Support

For issues and questions, please refer to the project documentation or open an issue in the repository.
# SuperClimateTech
