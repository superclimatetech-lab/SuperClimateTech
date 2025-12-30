# Render Deployment Quick Reference

## Files Created for Render Deployment

| File | Purpose |
|------|---------|
| `app.py` | WSGI entry point for Gunicorn on Render |
| `Procfile` | Process types for Render (web, worker, beat) |
| `runtime.txt` | Python version specification |
| `render.yaml` | Infrastructure as Code configuration |
| `build.sh` | Custom build script |
| `.env.render` | Environment variables template for Render |
| `RENDER_DEPLOYMENT.md` | Complete deployment guide |

## Quick Deployment Steps

### 1. Prepare Your Repository

```bash
# Make sure all files are committed
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Connect to Render

1. Go to https://dashboard.render.com
2. Click **New** → **Web Service**
3. Connect your GitHub repository

### 3. Configure Service

**Build Command:**
```bash
pip install -r requirements.txt && cd backend && python manage.py collectstatic --noinput && cd ..
```

**Start Command:**
```bash
gunicorn app:app --bind 0.0.0.0:10000 --workers 4
```

### 4. Add Environment Variables

Copy from `.env.render` and fill in your actual values:

```
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=<generate-new>
ALLOWED_HOSTS=yourdomain.render.com
DB_ENGINE=django.db.backends.postgresql
DB_NAME=supertech_db
DB_USER=supertech_user
DB_PASSWORD=<secure-password>
DB_HOST=<render-db-host>
DB_PORT=5432
OPENWEATHERMAP_API_KEY=<your-key>
EMAIL_HOST_USER=<your-email>
EMAIL_HOST_PASSWORD=<your-app-password>
```

### 5. Add PostgreSQL Database

1. Click **New** → **PostgreSQL**
2. Link to your web service
3. Copy connection string to environment variables

### 6. Deploy

1. Click **Deploy**
2. Monitor build logs
3. Wait for "Live" status
4. Access your app at provided URL

## Verifying Deployment

### Check Application Is Running

```bash
# Visit your Render URL
https://yourdomain.render.com/admin/
```

### View Logs

```bash
# In Render Dashboard:
Your Service → Logs tab
```

### Test API

```bash
curl https://yourdomain.render.com/api/health/
```

## Troubleshooting

### Error: "No module named 'app'"

**Fix:** Ensure `app.py` exists in project root with correct WSGI configuration

### Error: "ModuleNotFoundError: No module named 'supertech_backend'"

**Fix:** Check that backend directory structure is correct:
```
backend/
  ├── supertech_backend/
  ├── weather_api/
  ├── manage.py
  └── requirements.txt
```

### Error: "Database connection refused"

**Fix:** 
1. Verify PostgreSQL is linked
2. Check DB credentials in environment variables
3. Run migrations: `cd backend && python manage.py migrate && cd ..`

### Static Files Not Loading

**Fix:** Run in Render console:
```bash
cd backend && python manage.py collectstatic --noinput --clear && cd ..
```

## Environment Variables Reference

### Required
- `SECRET_KEY` - Generate new with `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`
- `ALLOWED_HOSTS` - Your domain(s)
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Database credentials

### Recommended
- `OPENWEATHERMAP_API_KEY` - Weather data source
- `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD` - Notifications
- `TWILIO_*` - SMS alerts

### Security
- `SECURE_SSL_REDIRECT=True`
- `SESSION_COOKIE_SECURE=True`
- `CSRF_COOKIE_SECURE=True`
- `SECURE_HSTS_SECONDS=31536000`

## Useful Render Console Commands

```bash
# View Python version
python --version

# Check installed packages
pip list

# Run Django management commands
python manage.py createsuperuser
python manage.py migrate
python manage.py collectstatic

# View environment variables
env | grep DJANGO

# Check application logs in real-time
tail -f /var/log/app/output.log
```

## Monitoring in Render

1. **Logs Tab** - Real-time application output
2. **Metrics Tab** - CPU, Memory, Network graphs
3. **Deployments Tab** - Deployment history
4. **Environment Tab** - Manage variables

## Cost Estimation

| Component | Free | Starter | Standard |
|-----------|------|---------|----------|
| Web Service | 0.5hr/month | $7/month | $12+/month |
| PostgreSQL | 90 days free | $7-15/month | $50+/month |
| Redis | 90 days free | $5-15/month | $30+/month |

## Custom Domain Setup

1. Go to Service Settings → Custom Domain
2. Add your domain
3. Update DNS records (CNAME) as instructed
4. SSL certificate auto-generated

## Auto-Deployment

Render automatically redeploys when:
- You push to connected branch (main)
- Environment variables change
- Service configuration updates

To disable: Service Settings → Auto-Deploy = Off

## Manual Deployment

In Render Dashboard:
1. Service → Deployments
2. Click "Deploy latest commit"

## Contact Support

- Render Docs: https://render.com/docs
- Support Email: support@render.com
- Community: https://community.render.com

---

**Happy Deploying! 🚀**
