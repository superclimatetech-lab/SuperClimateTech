# SuperTech Backend Deployment Guide

## Overview

This guide covers deploying the SuperTech backend across development, staging, and production environments.

## Project Structure

```
backend/
├── .env.example              # Template for environment variables
├── .env.development          # Development environment config
├── .env.staging              # Staging environment config
├── .env.production           # Production environment config
├── Dockerfile                # Docker image configuration
├── docker-compose.yml        # Docker Compose for local/staging deployment
├── nginx.conf                # Nginx reverse proxy configuration
├── supertech.service         # Systemd service file for Django
├── supertech-celery.service  # Systemd service file for Celery worker
├── supertech-celery-beat.service  # Systemd service file for Celery Beat
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── supertech_backend/        # Django project configuration
│   ├── settings.py          # Environment-aware Django settings
│   ├── urls.py              # URL routing
│   ├── wsgi.py              # WSGI application
│   └── celery.py            # Celery configuration
└── weather_api/             # Main Django app
    ├── models.py
    ├── views.py
    ├── serializers.py
    ├── tasks.py             # Celery tasks
    └── ...
```

## Environment Setup

### 1. Development Environment

**Prerequisites:**
- Python 3.11+
- PostgreSQL (optional, can use SQLite)
- Redis (for Celery)
- Node.js (for frontend)

**Setup Steps:**

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Copy development environment file
cp .env.development .env

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Start development server
python manage.py runserver 0.0.0.0:8000
```

### 2. Staging Environment

**Using Docker Compose:**

```bash
cd backend

# Build images
docker-compose build

# Start services
docker-compose -f docker-compose.yml up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Check logs
docker-compose logs -f backend
```

### 3. Production Environment

**On Your Production Server:**

#### Option A: Docker Deployment

```bash
# Clone repository
git clone <your-repo-url> /var/www/supertech
cd /var/www/supertech/backend

# Setup environment
cp .env.production .env
# Edit .env with production secrets

# Build and run
docker-compose up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser
```

#### Option B: Traditional Deployment (Ubuntu/Debian)

**1. Server Setup:**

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install dependencies
sudo apt-get install -y python3.11 python3.11-venv \
  postgresql postgresql-contrib redis-server nginx supervisor

# Create app user
sudo useradd -m -s /bin/bash supertech

# Create directories
sudo mkdir -p /var/www/supertech /var/log/supertech
sudo chown -R supertech:supertech /var/www/supertech /var/log/supertech
```

**2. Clone and Setup Application:**

```bash
cd /var/www/supertech

# Clone repository
git clone <your-repo-url> .

# Navigate to backend
cd backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.production .env
# Edit .env with your production secrets
nano .env
```

**3. Database Setup:**

```bash
# Create PostgreSQL database
sudo -u postgres psql

CREATE DATABASE supertech_db;
CREATE USER supertech_user WITH PASSWORD 'your_secure_password';
ALTER ROLE supertech_user SET client_encoding TO 'utf8';
ALTER ROLE supertech_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE supertech_user SET default_transaction_deferrable TO on;
ALTER ROLE supertech_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE supertech_db TO supertech_user;
\q
```

**4. Django Setup:**

```bash
cd /var/www/supertech/backend

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput
```

**5. Systemd Services Setup:**

```bash
# Copy service files
sudo cp supertech.service /etc/systemd/system/
sudo cp supertech-celery.service /etc/systemd/system/
sudo cp supertech-celery-beat.service /etc/systemd/system/

# Enable and start services
sudo systemctl enable supertech.service supertech-celery.service supertech-celery-beat.service
sudo systemctl start supertech.service supertech-celery.service supertech-celery-beat.service

# Check status
sudo systemctl status supertech.service
```

**6. Nginx Configuration:**

```bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/supertech

# Enable site
sudo ln -s /etc/nginx/sites-available/supertech /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

## Environment Variables Reference

### Core Django Settings
- `DEBUG` - Set to `False` in production
- `SECRET_KEY` - Django secret key (generate a new one!)
- `ENVIRONMENT` - Options: `development`, `staging`, `production`
- `ALLOWED_HOSTS` - Comma-separated list of allowed hosts

### Database
- `DB_ENGINE` - Database engine (postgresql or sqlite3)
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_HOST` - Database host
- `DB_PORT` - Database port

### Redis & Celery
- `REDIS_HOST` - Redis server host
- `REDIS_PORT` - Redis server port
- `CELERY_BROKER_URL` - Celery broker URL
- `CELERY_RESULT_BACKEND` - Celery result backend

### External APIs
- `OPENWEATHERMAP_API_KEY` - OpenWeatherMap API key
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_PHONE_NUMBER` - Twilio phone number

### Email
- `EMAIL_BACKEND` - Email backend
- `EMAIL_HOST` - SMTP host
- `EMAIL_PORT` - SMTP port
- `EMAIL_USE_TLS` - Use TLS
- `EMAIL_HOST_USER` - Email username
- `EMAIL_HOST_PASSWORD` - Email password
- `DEFAULT_FROM_EMAIL` - Default from email

### Security
- `SECURE_SSL_REDIRECT` - Redirect HTTP to HTTPS
- `SESSION_COOKIE_SECURE` - Secure session cookies
- `CSRF_COOKIE_SECURE` - Secure CSRF cookies
- `SECURE_HSTS_SECONDS` - HSTS max age

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Static files collected
- [ ] Superuser created
- [ ] SSL certificates obtained (if using HTTPS)
- [ ] Nginx configured
- [ ] Services enabled and started
- [ ] Logs configured and rotated
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Domain DNS configured
- [ ] Email notifications tested

## Monitoring and Maintenance

### Viewing Logs

```bash
# Django logs
sudo journalctl -u supertech.service -f

# Celery logs
sudo journalctl -u supertech-celery.service -f

# Celery Beat logs
sudo journalctl -u supertech-celery-beat.service -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Database Backup

```bash
# Backup PostgreSQL database
pg_dump -U supertech_user supertech_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
psql -U supertech_user supertech_db < backup.sql
```

### Updating Application

```bash
# Pull latest code
cd /var/www/supertech
git pull origin main

# Navigate to backend
cd backend

# Activate virtual environment
source venv/bin/activate

# Install new dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Restart services
sudo systemctl restart supertech.service
```

## Troubleshooting

### Service won't start
```bash
# Check service status
sudo systemctl status supertech.service

# View detailed logs
sudo journalctl -u supertech.service -n 50
```

### Database connection issues
```bash
# Test PostgreSQL connection
psql -U supertech_user -d supertech_db -h localhost
```

### Redis connection issues
```bash
# Test Redis connection
redis-cli ping
```

### Static files not loading
```bash
# Recollect static files
python manage.py collectstatic --noinput --clear
```

## Security Best Practices

1. **Never commit .env files** - Add to .gitignore
2. **Use strong SECRET_KEY** - Generate: `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`
3. **Enable HTTPS** - Use Let's Encrypt (free)
4. **Regular backups** - Automate database backups
5. **Keep dependencies updated** - Regularly run `pip list --outdated`
6. **Monitor logs** - Set up log aggregation
7. **Use strong database passwords** - Generate secure passwords
8. **Restrict database access** - Only allow app server to connect

## Performance Tuning

### Gunicorn Workers
```bash
# Calculate optimal workers: (2 x CPU cores) + 1
# For 4 cores: 9 workers
gunicorn --workers 9 supertech_backend.wsgi:application
```

### Database Connection Pooling
Already configured in `settings.py` with `CONN_MAX_AGE = 600`

### Caching
Configure Redis caching in `settings.py` for improved performance

## Support & Resources

- Django Documentation: https://docs.djangoproject.com/
- DRF Documentation: https://www.django-rest-framework.org/
- Celery Documentation: https://docs.celeryproject.org/
- PostgreSQL Documentation: https://www.postgresql.org/docs/
