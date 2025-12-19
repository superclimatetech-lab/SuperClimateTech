import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supertech_backend.settings')

app = Celery('supertech_backend')

# Load configuration from Django settings, all configuration keys will be prefixed with `CELERY_`
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks from all registered Django apps
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
