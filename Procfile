release: cd backend && python manage.py migrate --noinput && cd ..
web: gunicorn wsgi_render:app --bind 0.0.0.0:10000 --workers 4 --worker-class sync --timeout 60 --access-logfile - --error-logfile -
worker: cd backend && celery -A supertech_backend worker -l info
beat: cd backend && celery -A supertech_backend beat -l info
