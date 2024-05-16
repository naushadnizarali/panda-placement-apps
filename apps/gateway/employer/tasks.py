from django.utils import timezone
from celery import shared_task
from .models import Jobs

@shared_task(bind=True)
def read_todays_expire_jobs(self):
    today = timezone.now().date()

    expired_job = Jobs.objects.filter(application_deadline__lt=today).exclude(status="Expired")
    
    for job in expired_job:
        job.status = "Expired"
        job.save()

# def read_todays_expire_jobs(self):
#     today = timezone.now().date()
#     print(today, "----", today - timezone.timedelta(days=3))

#     job = Jobs.objects.filter(id=8).first()
    
#     if job.application_deadline == today or job.application_deadline - today <= datetime.timedelta(days=3):
#         print(f'expiring job {job.title}')
        
#     print(job.title, job.slug)