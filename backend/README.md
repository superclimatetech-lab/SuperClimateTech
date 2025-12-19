# SuperTech Backend

Django REST Framework API for the SuperTech climate monitoring platform.

## Quick Start

### Development

```bash
# Setup
./deploy.sh development

# Start development server
python manage.py runserver 0.0.0.0:8000

# In another terminal, start Celery worker
celery -A supertech_backend worker -l info

# In another terminal, start Celery Beat
celery -A supertech_backend beat -l info
```

### Staging (Docker)

```bash
# Setup
./deploy.sh staging

# Start containers
docker-compose up -d

# Access at http://localhost:8000
```

### Production

```bash
# Setup
./deploy.sh production

# Follow instructions in DEPLOYMENT.md
```

## Project Structure

```
backend/
├── supertech_backend/        # Django project settings
│   ├── settings.py          # Environment-aware settings
│   ├── urls.py              # URL configuration
│   ├── wsgi.py              # WSGI application
│   └── celery.py            # Celery configuration
├── weather_api/             # Main Django app
│   ├── models.py            # Database models
│   ├── views.py             # API views
│   ├── serializers.py       # DRF serializers
│   ├── tasks.py             # Celery tasks
│   ├── services/            # Business logic
│   └── management/          # Custom management commands
├── manage.py                # Django CLI
├── requirements.txt         # Python dependencies
├── docker-compose.yml       # Docker configuration
├── Dockerfile               # Docker image
├── nginx.conf               # Nginx configuration
├── .env.example             # Environment template
├── .env.development         # Development config
├── .env.staging             # Staging config
├── .env.production          # Production config
├── deploy.sh                # Setup script
├── DEPLOYMENT.md            # Deployment guide
└── README.md                # This file
```

## Environment Setup

Environment variables are managed through `.env` files:

- `.env.example` - Template with all available options
- `.env.development` - Development environment (SQLite, debug enabled)
- `.env.staging` - Staging environment (PostgreSQL, SSL enabled)
- `.env.production` - Production environment (PostgreSQL, security hardened)

### Key Environment Variables

```
DEBUG                   # Enable debug mode
SECRET_KEY             # Django secret key
ENVIRONMENT            # deployment environment
ALLOWED_HOSTS          # Comma-separated list of allowed hosts
DB_ENGINE              # Database backend
DB_NAME                # Database name
DB_USER                # Database user
DB_PASSWORD            # Database password
DB_HOST                # Database host
REDIS_HOST             # Redis host
REDIS_PORT             # Redis port
OPENWEATHERMAP_API_KEY # Weather API key
EMAIL_HOST_USER        # Email sender
EMAIL_HOST_PASSWORD    # Email password
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile

### Weather Data
- `GET /api/weather/current/` - Current weather
- `GET /api/weather/forecast/` - Weather forecast
- `GET /api/weather/historical/` - Historical data

### Locations
- `GET /api/locations/` - List all locations
- `POST /api/locations/` - Create location
- `GET /api/locations/{id}/` - Get location details

### Alerts
- `GET /api/alerts/` - List user alerts
- `POST /api/alerts/` - Create alert
- `PUT /api/alerts/{id}/` - Update alert
- `DELETE /api/alerts/{id}/` - Delete alert

## Background Tasks (Celery)

The application uses Celery for asynchronous tasks:

### Periodic Tasks
- **fetch-current-weather** - Every 30 minutes
- **fetch-forecast-data** - Every 6 hours
- **check-alert-conditions** - Every hour
- **archive-historical-data** - Daily
- **cleanup-old-data** - Daily

### Starting Workers

```bash
# Development
celery -A supertech_backend worker -l info

# Production (with specific concurrency)
celery -A supertech_backend worker -l info --concurrency=4

# Celery Beat (scheduled tasks)
celery -A supertech_backend beat -l info
```

## Database

### Initial Setup

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data
python manage.py load_locations
```

### PostgreSQL (Production)

```bash
# Connect to database
psql -U supertech_user -d supertech_db

# Backup
pg_dump -U supertech_user supertech_db > backup.sql

# Restore
psql -U supertech_user supertech_db < backup.sql
```

## Testing

```bash
# Run all tests
python manage.py test

# Run specific test file
python manage.py test weather_api.tests.test_views

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

## Logging

Logs are configured based on environment:

- **Development**: DEBUG level, console output
- **Staging**: INFO level, file + console output
- **Production**: WARNING level, file output only

Log files location:
```
logs/
└── django.log          # Main application log
```

View logs:
```bash
# Development
python manage.py runserver  # View console output

# Production (systemd)
sudo journalctl -u supertech.service -f

# View log file directly
tail -f logs/django.log
```

## Performance

### Optimization Techniques

1. **Database Connection Pooling**: Configured with `CONN_MAX_AGE = 600`
2. **Redis Caching**: Available for session and query caching
3. **Gunicorn Workers**: Auto-scaled based on CPU cores
4. **Static File Compression**: Gzip compression enabled in Nginx
5. **Database Indexing**: Indexes on frequently queried fields

### Monitoring

```bash
# Check service status
sudo systemctl status supertech.service

# Monitor Celery tasks
celery -A supertech_backend inspect active

# View application metrics
python manage.py shell_plus  # If django-extensions installed
```

## Security

### Production Checklist

- [ ] `DEBUG = False`
- [ ] Strong `SECRET_KEY` generated
- [ ] `SECURE_SSL_REDIRECT = True`
- [ ] SSL certificates configured
- [ ] Database password secured
- [ ] API keys stored in `.env`
- [ ] CORS origins restricted
- [ ] Rate limiting enabled
- [ ] Admin panel access restricted
- [ ] Logging and monitoring enabled

### Security Headers

Automatically configured in `settings.py`:
- Strict-Transport-Security (HSTS)
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Content-Security-Policy (CSP)

## Deployment

### Docker

```bash
# Build image
docker build -t supertech-backend .

# Run container
docker run -p 8000:8000 --env-file .env.production supertech-backend

# Using Docker Compose
docker-compose up -d
```

### Traditional (Systemd)

```bash
# Copy service files
sudo cp supertech*.service /etc/systemd/system/

# Enable and start
sudo systemctl enable supertech.service
sudo systemctl start supertech.service

# Check status
sudo systemctl status supertech.service
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
lsof -i :8000
kill -9 <PID>
```

**Database connection failed:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U supertech_user -d supertech_db -h localhost
```

**Celery worker won't start:**
```bash
# Check Redis is running
redis-cli ping

# Check Celery configuration
python manage.py shell -c "from django.conf import settings; print(settings.CELERY_BROKER_URL)"
```

**Static files not loading:**
```bash
# Recollect static files
python manage.py collectstatic --noinput --clear
```

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Submit pull request

## Support

For issues and questions:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Review Django and DRF documentation
3. Check application logs
4. Open an issue in the repository

## License

Proprietary - SuperTech Weather Monitoring
