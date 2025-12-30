# Deploying SuperTech on Render.com

## Overview

This guide walks you through deploying the SuperTech backend on Render.com, a modern platform-as-a-service provider.

## Prerequisites

- Render.com account (https://render.com)
- GitHub repository with this project
- Domain name (optional, Render provides a free subdomain)

## Step-by-Step Deployment

### 1. Connect Your Repository

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Select your GitHub repository containing SuperTech
4. Click **Connect**

### 2. Configure the Web Service

**Basic Settings:**
- **Name**: `supertech-backend`
- **Environment**: Python 3
- **Build Command**: `pip install -r requirements.txt && cd backend && python manage.py collectstatic --noinput && cd ..`
- **Start Command**: `gunicorn app:app --bind 0.0.0.0:10000 --workers 4`
- **Instance Type**: Standard (or Starter for testing)

### 3. Set Environment Variables

In the **Environment** section, add all required variables:

```
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=<generate-new-key>
DJANGO_SETTINGS_MODULE=supertech_backend.settings
ALLOWED_HOSTS=yourdomain.render.com,yourdomain.com
PYTHONUNBUFFERED=true

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=supertech_db
DB_USER=supertech_user
DB_PASSWORD=<secure-password>
DB_HOST=<render-postgres-host>
DB_PORT=5432

# Redis (if using Render Redis add-on)
REDIS_HOST=<render-redis-host>
REDIS_PORT=6379
REDIS_DB=0
CELERY_BROKER_URL=redis://<host>:6379/0
CELERY_RESULT_BACKEND=redis://<host>:6379/0

# External APIs
OPENWEATHERMAP_API_KEY=<your-api-key>
TWILIO_ACCOUNT_SID=<your-twilio-sid>
TWILIO_AUTH_TOKEN=<your-twilio-token>
TWILIO_PHONE_NUMBER=<your-twilio-number>

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=<your-email>
EMAIL_HOST_PASSWORD=<your-app-password>
DEFAULT_FROM_EMAIL=noreply@supertech-weather.com

# Security
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_HSTS_SECONDS=31536000
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://yourdomain.render.com
CSRF_TRUSTED_ORIGINS=https://yourdomain.com,https://yourdomain.render.com
```

### 4. Add PostgreSQL Database

1. In Render Dashboard, click **New +** → **PostgreSQL**
2. Name it: `supertech-db`
3. Under **Connections**, link it to your web service
4. Note the connection string and update environment variables

### 5. Add Redis (Optional, for Celery)

1. Click **New +** → **Redis**
2. Name it: `supertech-redis`
3. Link it to your web service
4. Update `REDIS_HOST`, `REDIS_PORT` in environment variables

### 6. Configure Deployment Hooks

**Pre-Deploy Hook (Optional):**
```bash
cd backend && python manage.py migrate && cd ..
```

This runs migrations before each deploy.

### 7. Deploy

1. Click **Deploy** button
2. Monitor the build logs in real-time
3. Wait for successful deployment
4. Access your app at the provided URL

## Important Render-Specific Configurations

### Port Configuration

Render assigns port `10000` dynamically. The `app.py` file and Procfile are configured for this.

### Static Files

Render automatically serves static files. They're collected during build and stored in `/staticfiles`.

### Media Files

For user-uploaded files, consider using:
- **Render Disk** - For persistent storage within the service
- **AWS S3** - For scalable cloud storage
- **Cloudinary** - For image storage and optimization

### Database Connection

Render provides PostgreSQL. Connection string format:
```
postgresql://username:password@host:5432/database
```

### Environment-Specific Settings

The Django settings automatically detect `ENVIRONMENT=production` and apply security settings.

## Troubleshooting

### Build Fails with "No module named 'app'"

**Solution:** Ensure `app.py` exists in the project root and `PYTHONPATH` includes the backend directory.

### Migrations Not Running

**Solution:** Add to Render's **Deploy Hook**:
```bash
cd backend && python manage.py migrate && cd ..
```

### Static Files Not Loading

**Solution:** Run in Render console:
```bash
cd backend && python manage.py collectstatic --noinput --clear && cd ..
```

### Database Connection Refused

**Solution:**
1. Verify PostgreSQL service is running
2. Check `DB_HOST`, `DB_PORT`, credentials in environment
3. Ensure web service is linked to database

### Celery Tasks Not Running

**Solution:**
1. Add Redis add-on if using Celery
2. Verify `REDIS_HOST` and `CELERY_BROKER_URL`
3. Deploy Celery worker service separately

## Production Checklist

- [ ] DEBUG = False
- [ ] Generate new SECRET_KEY
- [ ] Set all required environment variables
- [ ] PostgreSQL database created and linked
- [ ] Static files collected successfully
- [ ] Migrations run without errors
- [ ] SSL certificate valid (auto-enabled by Render)
- [ ] Custom domain configured (optional)
- [ ] Email notifications tested
- [ ] External APIs configured and keys added
- [ ] Logging and monitoring enabled
- [ ] Database backups configured

## Monitoring and Logs

### View Logs

1. Go to your web service in Render Dashboard
2. Click **Logs** tab
3. View real-time application logs

### Metrics

1. Click **Metrics** tab
2. Monitor CPU, Memory, Network usage

## Scaling

### Horizontal Scaling

Render handles auto-scaling based on traffic.

### Vertical Scaling

Upgrade instance type in service settings:
- **Starter**: Free, low traffic
- **Standard**: Production workloads
- **Pro**: High-traffic production

## Custom Domain

1. Go to **Settings** → **Custom Domain**
2. Add your domain
3. Follow DNS configuration steps
4. SSL certificate auto-generated

## Cost Optimization

- Use **Starter** instance for development
- Scale to **Standard** for production traffic
- PostgreSQL starter: ~$7/month
- Redis starter: ~$5/month
- Keep free tier web service for non-critical services

## Backing Up Data

### PostgreSQL Backups

Render provides automatic daily backups. Access via:
1. PostgreSQL service → **Backups** tab
2. Download backup files
3. Create manual backups before major updates

## Updating the Application

1. Push changes to GitHub
2. Render auto-deploys (if auto-deploy enabled)
3. Review build logs
4. Access updated application

## Advanced Configuration

### Environment Files

For different stages, Render supports environment groups:

```yaml
environments:
  - name: production
    variables:
      ENVIRONMENT: production
      DEBUG: False
  
  - name: staging
    variables:
      ENVIRONMENT: staging
      DEBUG: False
```

### Private Services

For internal services (Celery, Cache), use **Private Services**:
- Not accessible from internet
- Communication only within Render environment

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Django Deployment**: https://docs.djangoproject.com/en/stable/howto/deployment/
- **PostgreSQL on Render**: https://render.com/docs/databases
- **Custom Domains**: https://render.com/docs/custom-domains

## Common Render Limitations

| Feature | Availability |
|---------|--------------|
| PostgreSQL | ✅ Yes |
| Redis | ✅ Yes |
| Static Files | ✅ Yes |
| Cron Jobs | ⚠️ Celery Beat |
| Persistent Storage | ✅ Disk |
| Custom Domain | ✅ Yes |
| SSL Certificate | ✅ Free |
| Deployment Webhooks | ✅ Yes |

## Next Steps

1. ✅ Deploy to Render
2. ✅ Test core functionality
3. ✅ Configure monitoring
4. ✅ Set up automated backups
5. ✅ Monitor performance and scale as needed
