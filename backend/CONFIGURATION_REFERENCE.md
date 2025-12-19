# SuperTech Backend - Configuration Quick Reference

## Environment Selection

| Environment | Use Case | Database | Debug | SSL | Deploy Method |
|---|---|---|---|---|---|
| **development** | Local development | SQLite | ✅ Yes | ❌ No | `python manage.py runserver` |
| **staging** | Testing & QA | PostgreSQL | ❌ No | ✅ Yes | Docker Compose |
| **production** | Live system | PostgreSQL | ❌ No | ✅ Yes | Systemd or Docker |

## Quick Start Commands

### 1. Development Setup (Local)
```bash
cd backend
./deploy.sh development
python manage.py runserver 0.0.0.0:8000
```

### 2. Staging Setup (Docker)
```bash
cd backend
./deploy.sh staging
docker-compose up -d
```

### 3. Production Setup (Server)
```bash
cd backend
./deploy.sh production
# Edit .env with production secrets
sudo systemctl start supertech.service
```

## Environment Variables Summary

### Minimal Required Variables

**Development:**
```env
DEBUG=True
SECRET_KEY=django-insecure-dev-key
ENVIRONMENT=development
OPENWEATHERMAP_API_KEY=your_key
```

**Production:**
```env
DEBUG=False
SECRET_KEY=<generate-new-one>
ENVIRONMENT=production
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_ENGINE=django.db.backends.postgresql
DB_NAME=supertech_db
DB_USER=supertech_user
DB_PASSWORD=<secure-password>
DB_HOST=db-host.com
OPENWEATHERMAP_API_KEY=your_key
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=app_password
SECRET_KEY=<very-secure-key>
```

## Key Files Location

| Purpose | File | Environment |
|---|---|---|
| Settings | `supertech_backend/settings.py` | All |
| Dev Config | `.env.development` | Development |
| Prod Config | `.env.production` | Production |
| Django App | `weather_api/` | All |
| Tasks | `weather_api/tasks.py` | All |
| API Views | `weather_api/views.py` | All |
| Docker | `docker-compose.yml` | Docker |
| Web Server | `nginx.conf` | Production |
| Services | `supertech*.service` | Production |
| Deployment | `deploy.sh` | All |

## Database Selection

### SQLite (Development)
```env
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
```

### PostgreSQL (Production)
```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=supertech_db
DB_USER=supertech_user
DB_PASSWORD=secure_password
DB_HOST=localhost
DB_PORT=5432
```

## Redis/Celery Configuration

### Development (Local Redis)
```env
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

### Production (Remote Redis)
```env
CELERY_BROKER_URL=redis://redis-host:6379/0
CELERY_RESULT_BACKEND=redis://redis-host:6379/0
```

## SSL/Security Settings

### Development (HTTP)
```env
SECURE_SSL_REDIRECT=False
SESSION_COOKIE_SECURE=False
CSRF_COOKIE_SECURE=False
SECURE_HSTS_SECONDS=0
```

### Production (HTTPS)
```env
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_HSTS_SECONDS=31536000
```

## Email Configuration

### Development (Console - prints to terminal)
```env
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

### Production (SMTP - sends real emails)
```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=app_password
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
```

## CORS Configuration

### Development (Allow all local ports)
```env
CORS_ALLOWED_ORIGINS=http://localhost:5174,http://127.0.0.1:5174,http://localhost:3000
```

### Production (Only specific domains)
```env
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Service Management (Production)

```bash
# Start services
sudo systemctl start supertech.service supertech-celery.service supertech-celery-beat.service

# Stop services
sudo systemctl stop supertech.service supertech-celery.service supertech-celery-beat.service

# Restart services
sudo systemctl restart supertech.service

# Check status
sudo systemctl status supertech.service

# View logs
sudo journalctl -u supertech.service -f

# Enable on boot
sudo systemctl enable supertech.service supertech-celery.service supertech-celery-beat.service
```

## Docker Commands

```bash
# Build images
docker-compose build

# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f backend

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Run management command
docker-compose exec backend python manage.py <command>
```

## Nginx Configuration

```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx
```

## Database Management

```bash
# PostgreSQL backup
pg_dump -U supertech_user supertech_db > backup.sql

# PostgreSQL restore
psql -U supertech_user supertech_db < backup.sql

# Django migrations
python manage.py makemigrations
python manage.py migrate

# Django shell
python manage.py shell

# Load sample data
python manage.py loaddata initial_data.json
```

## Celery Task Management

```bash
# View active tasks
celery -A supertech_backend inspect active

# View registered tasks
celery -A supertech_backend inspect registered

# Purge all tasks
celery -A supertech_backend purge

# View worker stats
celery -A supertech_backend inspect stats
```

## Performance Monitoring

```bash
# CPU and memory usage
top

# Disk usage
df -h

# Redis info
redis-cli info

# PostgreSQL connections
psql -U supertech_user -d supertech_db -c "SELECT * FROM pg_stat_activity;"

# Django logs
tail -f logs/django.log

# Celery logs
tail -f logs/celery.log
```

## Troubleshooting Quick Fixes

| Issue | Solution |
|---|---|
| Port 8000 in use | `lsof -i :8000` then `kill -9 <PID>` |
| Database connection error | Check PostgreSQL running: `sudo systemctl status postgresql` |
| Redis connection error | Check Redis running: `redis-cli ping` |
| Static files not loading | `python manage.py collectstatic --noinput --clear` |
| Celery not working | Check Redis: `redis-cli ping` and broker URL in `.env` |
| CORS errors | Check `CORS_ALLOWED_ORIGINS` in `.env` |
| SSL certificate error | Update paths in `nginx.conf` |

## Important Security Notes

⚠️ **BEFORE PRODUCTION:**

1. Generate NEW SECRET_KEY:
   ```bash
   python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
   ```

2. Never commit `.env` files to git

3. Add `.env*` to `.gitignore` (already done)

4. Use strong database passwords

5. Enable HTTPS (Let's Encrypt is free)

6. Keep `SECRET_KEY` absolutely secret

7. Set `DEBUG = False` in production

8. Use strong CSRF tokens

## Useful Documentation

- **Deployment Details**: `backend/DEPLOYMENT.md`
- **Backend README**: `backend/README.md`
- **Environment Template**: `backend/.env.example`
- **Django Settings**: `backend/supertech_backend/settings.py`

## Support

For detailed information:
1. See `DEPLOYMENT.md` for complete deployment guide
2. See `README.md` for API and project details
3. Check inline comments in `settings.py`
4. Review `.env.example` for all available variables

---

**Last Updated:** December 19, 2025
**Version:** 1.0 Production Ready
