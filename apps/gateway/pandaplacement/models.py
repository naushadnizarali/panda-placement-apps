# from django.db import models
# from django.conf import settings
# from employer.models import Jobs
# from django.contrib.auth.models import AbstractUser

# class User(AbstractUser):
#     is_seeker = models.BooleanField(default=False)
#     is_employer = models.BooleanField(default=False)
#     is_manager = models.BooleanField(default=False)
#     country = models.CharField(max_length=100, default="Pakistan") 
#     phone = models.CharField(max_length=20, default="0351-256849")  
    
# class Application(models.Model):
#     jobseeker = models.OneToOneField(settings.AUTH_JOBSEEKER_USER_MODEL, on_delete=models.CASCADE)
#     job = models.OneToOneField(Jobs, on_delete=models.CASCADE)

#     status = models.CharField(max_length=50, choices=[("Pending","Pending"),("Shortlist","Shortlist"),("Interview","Interview"),("Reject","Reject")], default="Pending")
#     match = models.CharField(max_length=50, default="0 Star")

#     def __str__(self) -> str:
#         return self.jobseeker.first_name + self.jobseeker.last_name + " - " + self.job.title