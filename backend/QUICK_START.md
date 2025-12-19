# 🚀 SuperTech Backend - Quick Start Guide

## 30-Second Setup (Development)

```bash
# 1. Navigate to backend
cd backend

# 2. Run setup script
./deploy.sh development

# 3. Start server
python manage.py runserver 0.0.0.0:8000

# 4. In another terminal, start Celery
celery -A supertech_backend worker -l info

# 5. In another terminal, start Beat
celery -A supertech_backend beat -l info

# 6. Access the app
# Frontend: http://localhost:5174
# Backend API: http://localhost:8000
# Admin: http://localhost:8000/admin
```

## Environment Selection

### For Development
```bash
./deploy.sh development
# Uses SQLite, DEBUG=True, console emails
```

### For Staging (Docker)
```bash
./deploy.sh staging
docker-compose up -d
# Uses PostgreSQL, Nginx, full stack
```

### For Production
```bash
./deploy.sh production
# Uses PostgreSQL, HTTPS, systemd services
# Requires manual SECRET_KEY and credentials
```

## Key Commands

```bash
# Database operations
python manage.py migrate              # Apply migrations
python manage.py makemigrations       # Create migrations
python manage.py createsuperuser      # Create admin user
python manage.py shell                # Django shell

# Static files
python manage.py collectstatic        # Collect static files

# Testing
python manage.py test                 # Run tests
coverage run --source='.' manage.py test
coverage report                       # Coverage report

# Celery tasks
celery -A supertech_backend worker -l info      # Run worker
celery -A supertech_backend beat -l info        # Run scheduler
celery -A supertech_backend inspect active      # Check tasks
```

## Environment Files

Place in `backend/` directory:

```
.env.development  ← Use for local development
.env.staging      ← Use for Docker staging
.env.production   ← Use for production server
.env              ← Active env (which one you're using)
```

## Project Structure

```
backend/
├── supertech_backend/          # Django config
├── weather_api/                # Main app
├── manage.py                   # Django CLI
├── requirements.txt            # Python packages
├── Dockerfile                  # Docker image
├── docker-compose.yml          # Docker stack
├── nginx.conf                  # Web server
├── supertech*.service          # Systemd services
├── deploy.sh                   # Setup script
├── .env.example                # Env template
├── README.md                   # Project docs
├── DEPLOYMENT.md               # Deploy guide
└── CONFIGURATION_REFERENCE.md  # Quick ref
```

## Common Issues

### Port 8000 already in use
```bash
lsof -i :8000
kill -9 <PID>
```

### Database not migrating
```bash
# Check database connection
python manage.py dbshell

# Recreate from scratch
rm db.sqlite3
python manage.py migrate
```

### Static files not loading
```bash
python manage.py collectstatic --noinput --clear
```

### Celery not working
```bash
# Check Redis is running
redis-cli ping

# Check broker URL
python manage.py shell -c "from django.conf import settings; print(settings.CELERY_BROKER_URL)"
```

## API Endpoints

All endpoints require authentication (token in header):

```
Authorization: Token <your-token>
```

### Weather Endpoints
```
GET    /api/weather/current/           # Current weather
GET    /api/weather/forecast/          # Weather forecast
GET    /api/weather/historical/        # Historical data
POST   /api/weather/locations/         # Create location
GET    /api/weather/locations/         # List locations
```

### Alert Endpoints
```
GET    /api/alerts/                    # List alerts
POST   /api/alerts/                    # Create alert
PUT    /api/alerts/{id}/               # Update alert
DELETE /api/alerts/{id}/               # Delete alert
```

### Admin
Access at: `http://localhost:8000/admin`

## Monitoring

### View Logs
```bash
# Development
tail -f logs/django.log

# Production (systemd)
sudo journalctl -u supertech.service -f

# Docker
docker-compose logs -f backend
```

### Check Services
```bash
# All systemd services
sudo systemctl status supertech.service
sudo systemctl status supertech-celery.service
sudo systemctl status supertech-celery-beat.service

# Docker services
docker-compose ps
```

## For More Help

- **Backend Guide**: See `README.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Configuration Reference**: See `CONFIGURATION_REFERENCE.md`
- **All Variables**: See `.env.example`

## Video Walkthrough (Local Setup)

1. `cd backend`
2. `./deploy.sh development`
3. `python manage.py runserver`
4. Visit `http://localhost:8000/admin`
5. Create test user in Django admin
6. Use API endpoints

---

**Ready?** Start with: `cd backend && ./deploy.sh development`
