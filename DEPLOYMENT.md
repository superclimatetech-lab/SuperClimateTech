# SuperTech Deployment Guide

This guide covers deploying the SuperTech application to production.

## Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL 12+
- Redis 6+
- Git
- A web server (Nginx/Apache)

## Backend Deployment

### 1. Environment Setup

```bash
# Clone repository
git clone <repository-url>
cd SuperClimate

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Django

Create `.env` file:
```
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@localhost:5432/supertech
OPENWEATHERMAP_API_KEY=your-api-key
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

### 3. Database Setup

```bash
# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load initial locations
python manage.py load_locations

# Collect static files
python manage.py collectstatic --noinput
```

### 4. Set Up Gunicorn

Create `gunicorn_config.py`:
```python
import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'sync'
worker_connections = 1000
timeout = 30
keepalive = 2
bind = '127.0.0.1:8000'
errorlog = '/var/log/supertech/gunicorn_error.log'
accesslog = '/var/log/supertech/gunicorn_access.log'
loglevel = 'info'
```

### 5. Set Up Systemd Services

#### Django Service (`/etc/systemd/system/supertech-django.service`)

```ini
[Unit]
Description=SuperTech Django Application
After=network.target postgresql.service redis.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/supertech
Environment="PATH=/var/www/supertech/venv/bin"
ExecStart=/var/www/supertech/venv/bin/gunicorn \
    --config gunicorn_config.py \
    supertech_backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

#### Celery Worker Service (`/etc/systemd/system/supertech-celery.service`)

```ini
[Unit]
Description=SuperTech Celery Worker
After=network.target redis.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/supertech
Environment="PATH=/var/www/supertech/venv/bin"
ExecStart=/var/www/supertech/venv/bin/celery -A supertech_backend worker \
    --loglevel=info \
    --logfile=/var/log/supertech/celery_worker.log

[Install]
WantedBy=multi-user.target
```

#### Celery Beat Service (`/etc/systemd/system/supertech-celery-beat.service`)

```ini
[Unit]
Description=SuperTech Celery Beat
After=network.target redis.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/supertech
Environment="PATH=/var/www/supertech/venv/bin"
ExecStart=/var/www/supertech/venv/bin/celery -A supertech_backend beat \
    --loglevel=info \
    --logfile=/var/log/supertech/celery_beat.log

[Install]
WantedBy=multi-user.target
```

Enable services:
```bash
sudo systemctl daemon-reload
sudo systemctl enable supertech-django supertech-celery supertech-celery-beat
sudo systemctl start supertech-django supertech-celery supertech-celery-beat
```

### 6. Set Up Nginx

Create `/etc/nginx/sites-available/supertech`:

```nginx
upstream django {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    client_max_body_size 100M;

    location / {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /var/www/supertech/staticfiles/;
    }

    location /media/ {
        alias /var/www/supertech/media/;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/supertech /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Frontend Deployment

### 1. Build Production Bundle

```bash
cd supertech-frontend
npm run build
```

### 2. Deploy to CDN/Web Server

Option A: AWS S3 + CloudFront
```bash
npm install -g aws-cli
aws s3 sync dist/ s3://your-bucket/
```

Option B: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Option C: Self-hosted
```bash
# Copy dist folder to server
scp -r dist/ user@server:/var/www/supertech-frontend/
```

Configure nginx for SPA:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 3. Environment Configuration

Create `.env.production`:
```
VITE_API_URL=https://api.yourdomain.com
```

## Monitoring & Maintenance

### Logging

Monitor service logs:
```bash
# Django
tail -f /var/log/supertech/gunicorn_error.log

# Celery Worker
tail -f /var/log/supertech/celery_worker.log

# Celery Beat
tail -f /var/log/supertech/celery_beat.log
```

### Database Backups

```bash
# Daily backup script
0 2 * * * pg_dump supertech > /backups/supertech_$(date +\%Y\%m\%d).sql

# Restore
psql supertech < /backups/supertech_20251217.sql
```

### Health Checks

Create health check endpoint:
```python
# In supertech_backend/urls.py
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({'status': 'healthy'})
```

### Performance Monitoring

Use Sentry for error tracking:
```python
# In settings.py
import sentry_sdk
sentry_sdk.init("your-sentry-dsn")
```

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**: Use HAProxy or AWS ELB
2. **Multiple Django Instances**: Deploy on multiple servers
3. **Separate Celery Workers**: Dedicated worker servers
4. **Database**: PostgreSQL replication for read replicas

### Caching Strategy

- Redis for session storage
- CloudFront for static assets
- Browser caching for API responses

### Database Optimization

```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_current_weather_location ON weather_api_currentweather(location_id);
CREATE INDEX idx_alert_is_active ON weather_api_alert(is_active, location_id);
CREATE INDEX idx_forecast_date ON weather_api_forecast(forecast_date, location_id);
```

## Troubleshooting

### Service Won't Start

```bash
# Check service status
sudo systemctl status supertech-django

# View detailed error
sudo journalctl -u supertech-django -n 50
```

### Database Connection Error

```bash
# Test connection
psql -h localhost -U supertech -d supertech
```

### Celery Tasks Not Running

```bash
# Check Celery status
celery -A supertech_backend inspect active

# Check scheduled tasks
celery -A supertech_backend inspect scheduled
```

## Backup & Disaster Recovery

### Full Backup Script

```bash
#!/bin/bash
BACKUP_DIR="/backups/supertech"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
pg_dump supertech > $BACKUP_DIR/db_$DATE.sql

# Backup application
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/supertech

# Upload to S3
aws s3 sync $BACKUP_DIR s3://supertech-backups/
```

### Recovery Steps

1. Restore database: `psql supertech < backup.sql`
2. Restore application files
3. Run migrations: `python manage.py migrate`
4. Restart services

## Security Checklist

- [ ] Set DEBUG=False in production
- [ ] Update SECRET_KEY to random string
- [ ] Configure ALLOWED_HOSTS properly
- [ ] Enable HTTPS/SSL
- [ ] Set SECURE_SSL_REDIRECT=True
- [ ] Configure CSRF and CORS properly
- [ ] Use environment variables for secrets
- [ ] Regular security updates
- [ ] Database password is strong
- [ ] Redis is behind firewall
- [ ] Regular backups
- [ ] Monitor logs for attacks

## Performance Optimization

- Enable gzip compression in Nginx
- Optimize database queries
- Use caching headers
- Minify CSS/JS
- Use CDN for static assets
- Implement rate limiting
- Database connection pooling
