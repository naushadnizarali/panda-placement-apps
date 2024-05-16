from celery import Celery
from celery.schedules import crontab
from datetime import timedelta
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pandaplacement.settings')

app = Celery('pandaplacement')

app.conf.enable_utc = False

app.conf.update(timezone = 'Asia/Karachi')

# Load task modules from all registered Django app configs.

app.config_from_object('django.conf:settings', namespace='CELERY')

app.conf.beat_schedule = {
    'read-model-every-minute': {
        'task': 'employer.tasks.read_todays_expire_jobs',
        'schedule': crontab(minute=30, hour=1),  # Run every minute {minute hour daily weekly monthly}
        'args': (),  # Task arguments (if any)
    },
}

app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")
