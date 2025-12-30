# 🚀 Render Deployment Checklist

## Pre-Deployment (Local)

### Repository Setup
- [ ] All changes committed to Git
- [ ] No uncommitted files blocking deployment
- [ ] `.env` files in `.gitignore`
- [ ] No sensitive data in Git history

### Project Files Verified
- [ ] `wsgi_render.py` exists in project root
- [ ] `Procfile` exists in project root
- [ ] `runtime.txt` exists in project root
- [ ] `render.yaml` exists in project root
- [ ] `build.sh` is executable
- [ ] `.env.render` template exists

### Backend Structure
- [ ] `/backend/supertech_backend/settings.py` exists
- [ ] `/backend/supertech_backend/wsgi.py` exists
- [ ] `/backend/weather_api/` app directory exists
- [ ] `/backend/manage.py` exists
- [ ] `/backend/requirements.txt` exists

### Code Quality
- [ ] Django settings support environment variables
- [ ] No hardcoded secrets in code
- [ ] Static files configuration correct
- [ ] Database migrations up to date

## Render Dashboard Setup

### Web Service Configuration
- [ ] GitHub repository connected
- [ ] Build command configured
- [ ] Start command set to: `gunicorn wsgi_render:app --bind 0.0.0.0:10000`
- [ ] Python 3.11 specified (or 3.13)
- [ ] Auto-deploy enabled (optional)

### Environment Variables
- [ ] `ENVIRONMENT=production` set
- [ ] `DEBUG=False` set
- [ ] `SECRET_KEY` generated and set (NEW KEY, not from .env)
- [ ] `ALLOWED_HOSTS` includes your domain
- [ ] `DJANGO_SETTINGS_MODULE` set if needed
- [ ] `PYTHONUNBUFFERED=true` set

### Database Configuration
- [ ] PostgreSQL service created and linked
- [ ] `DB_ENGINE=django.db.backends.postgresql`
- [ ] `DB_NAME` set correctly
- [ ] `DB_USER` set correctly
- [ ] `DB_PASSWORD` set securely
- [ ] `DB_HOST` set to Render PostgreSQL host
- [ ] `DB_PORT` set to 5432

### External Services (if used)
- [ ] Redis service created (if using Celery)
- [ ] Redis credentials set in environment
- [ ] `CELERY_BROKER_URL` configured
- [ ] `CELERY_RESULT_BACKEND` configured

### API Keys & Credentials
- [ ] `OPENWEATHERMAP_API_KEY` set
- [ ] `TWILIO_ACCOUNT_SID` set (if using)
- [ ] `TWILIO_AUTH_TOKEN` set (if using)
- [ ] `TWILIO_PHONE_NUMBER` set (if using)

### Email Configuration
- [ ] `EMAIL_BACKEND` set to SMTP
- [ ] `EMAIL_HOST=smtp.gmail.com`
- [ ] `EMAIL_PORT=587`
- [ ] `EMAIL_HOST_USER` set to sender email
- [ ] `EMAIL_HOST_PASSWORD` set to app password (NOT Gmail password!)
- [ ] `DEFAULT_FROM_EMAIL` set

### Security Settings
- [ ] `SECURE_SSL_REDIRECT=True` set
- [ ] `SESSION_COOKIE_SECURE=True` set
- [ ] `CSRF_COOKIE_SECURE=True` set
- [ ] `SECURE_HSTS_SECONDS=31536000` set
- [ ] `CORS_ALLOWED_ORIGINS` configured for your domain(s)
- [ ] `CSRF_TRUSTED_ORIGINS` configured for your domain(s)

## Deployment Execution

### Initial Deployment
- [ ] Click "Deploy" button
- [ ] Monitor build logs (should see no Python import errors)
- [ ] Wait for "Live" status
- [ ] Check "Deployments" tab for success

### First Test
- [ ] Access admin panel: `https://yourdomain/admin/`
- [ ] Create superuser account
- [ ] Test API endpoints
- [ ] Check application logs for errors

### Database Verification
- [ ] Migrations ran successfully (check logs)
- [ ] Database tables created
- [ ] Initial data loaded
- [ ] No "ERROR" messages in logs

## Post-Deployment

### Monitoring
- [ ] Logs tab shows no errors
- [ ] Metrics show reasonable CPU/Memory usage
- [ ] No repeated error messages in logs

### Functionality Testing
- [ ] User registration works
- [ ] User login works
- [ ] API endpoints return data
- [ ] Authentication tokens generated correctly
- [ ] Email notifications working (if configured)
- [ ] SMS notifications working (if configured)

### Database Operations
- [ ] Can create new records via API
- [ ] Can query existing data
- [ ] Filtering and searching works
- [ ] Pagination working correctly

### Static Files
- [ ] CSS/JS loading (admin panel looks correct)
- [ ] No 404 errors in browser console
- [ ] Images loading if applicable

### SSL/TLS
- [ ] HTTPS enabled
- [ ] No certificate warnings
- [ ] Redirect from HTTP to HTTPS working

## Ongoing Monitoring

### Weekly Checks
- [ ] Review error logs
- [ ] Check disk usage (if applicable)
- [ ] Monitor database growth
- [ ] Verify backups are running

### Monthly Checks
- [ ] Review performance metrics
- [ ] Check for dependency updates
- [ ] Verify security settings still optimal
- [ ] Test disaster recovery procedures

### Before Major Updates
- [ ] Backup database
- [ ] Test in staging environment
- [ ] Review migration files
- [ ] Plan deployment window

## Troubleshooting - If Deployment Fails

### Build Phase Issues
- [ ] Check "Requirements" section - all dependencies installed?
- [ ] Review build logs for Python syntax errors
- [ ] Verify Python version compatibility
- [ ] Check for missing files (Procfile, requirements.txt)

### Runtime Issues
- [ ] Check start command in logs
- [ ] Verify `wsgi_render.py` exists and is correct
- [ ] Confirm all imports in `wsgi_render.py` are available
- [ ] Check environment variables are set

### Database Connection Issues
- [ ] Verify PostgreSQL service is running
- [ ] Check connection string format
- [ ] Confirm credentials are correct
- [ ] Verify database name exists

### Import Errors
- [ ] Ensure `/backend` directory structure is correct
- [ ] Verify `sys.path` modification in `wsgi_render.py`
- [ ] Check all relative imports in Django app
- [ ] Ensure `__init__.py` files exist in packages

## Rollback Procedure

If deployment has critical issues:

1. Go to "Deployments" tab
2. Find previous successful deployment
3. Click "Rollback"
4. Verify service is back to stable state
5. Investigate issue before redeploying

## Performance Optimization

### If Experiencing Slow Response:
- [ ] Increase worker count (adjust in Procfile)
- [ ] Upgrade to Standard instance type
- [ ] Enable database connection pooling
- [ ] Add Redis for caching

### If Database Performance Degrades:
- [ ] Add database indexes
- [ ] Archive old data
- [ ] Upgrade PostgreSQL instance
- [ ] Enable query optimization

## Security Audit

Before considering production ready:

- [ ] No debug mode enabled
- [ ] SECRET_KEY is cryptographically random
- [ ] Database password is strong (16+ chars, mixed case/numbers/symbols)
- [ ] HTTPS is enforced
- [ ] CORS origins are restricted
- [ ] Admin account has strong password
- [ ] No test users in production
- [ ] Logging is configured for security events
- [ ] Regular backups are configured
- [ ] SSL certificate is valid and auto-renewing

## Documentation

- [ ] Team knows deployment process
- [ ] Emergency contacts documented
- [ ] Rollback procedure documented
- [ ] Monitoring/alerting configured
- [ ] Backup/recovery procedures documented

## Sign-Off

- [ ] All checklist items completed
- [ ] Team lead approves deployment
- [ ] Ready for production use

---

**Date Deployed:** _______________

**Deployed By:** _______________

**Approved By:** _______________

**Notes:** 

---

**🎉 You're ready to deploy to Render!**
