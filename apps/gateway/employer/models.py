import json
import uuid
from django.db import models
from django.conf import settings
import os
from django.db.models.signals import pre_delete, pre_save, post_save
from django.dispatch import receiver
from django.utils.text import slugify
from django.utils import timezone

def company_logo(instance,filename):
    
    file_extension = filename.split('.')[-1]
    cretime = timezone.now().strftime("%H:%M:%S")
    
    # new_filename = f'{instance.id}_id.{file_extension}'
    new_filename = f'{instance.id}_id_{cretime}.{file_extension}'
    
    if os.path.exists(f"media/company_logo/{new_filename}"):
        os.remove(f"media/company_logo/{new_filename}")

    return os.path.join('company_logo/', new_filename)

class Company_Info(models.Model):
    employer = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name="company")

    logo = models.FileField(upload_to=company_logo, blank=True, null=True)
    phone = models.CharField(max_length=25, blank=True)
    email = models.CharField(max_length=50, blank=True)
    company_name = models.CharField(max_length=100, default="None")
    company_type = models.CharField(max_length=100, default="None")
    industry = models.CharField(max_length=100, blank=True, null=True)
    address = models.CharField(max_length=150, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    website = models.CharField(max_length=100, blank=True, null=True)
    ntn = models.CharField(max_length=100, blank=True, null=True)
    employer_number = models.CharField(max_length=100, blank=True, null=True)
    operating_since = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'Company_Info'
        verbose_name = 'Company_Info'
        verbose_name_plural = 'Companies_Info'

    def __str__(self) -> str:
        return self.employer.email
    
class Todo_List(models.Model):
    employer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    todo = models.TextField(blank=True, null=True)
    is_complete = models.BooleanField(default=False)

    class Meta:
        db_table = 'Todos'
        verbose_name = 'Todo'
        verbose_name_plural = 'Todos'

    def __str__(self) -> str:
        return self.employer.email +" > " +self.todo[0:20]+"..."

class Notes_List(models.Model):
    employer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    notes = models.TextField(blank=True, null=True)
    is_complete = models.BooleanField(default=False)

    class Meta:
        db_table = 'Notes'
        verbose_name = 'Note'
        verbose_name_plural = 'Notes'

    def __str__(self) -> str:
        return self.employer.email +" > "+ self.notes[0:20]+"..."
    
class Jobs(models.Model):
    
    employer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="jobs")
    
    title = models.CharField(max_length=100,blank=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    hiring_number = models.CharField(max_length=100, blank=True, null=True)
    hiring_country = models.CharField(max_length=50,blank=True, null=True)
    hiring_state = models.CharField(max_length=50,blank=True, null=True)
    hiring_city =  models.CharField(max_length=50,blank=True, null=True)
    type = models.CharField(max_length=50, blank=True, null=True)

    status = models.CharField(max_length=50, blank=True, null=True,default="Approved") #Options Pending, Approved, Unapproved, Expired
    phase = models.CharField(max_length=50, choices=[("Open","Open"),("Close","Close")], default="Open")

    description = models.TextField(blank=True, null=True)
    salary_currency = models.CharField(max_length=50, blank=True, null=True)
    salary_type = models.CharField(max_length=50, blank=True, null=True)
    salary_rate = models.CharField(max_length=50, blank=True, null=True)
    salary_start_range = models.CharField(max_length=50, blank=True, null=True)
    salary_end_range = models.CharField(max_length=50, blank=True, null=True)

    application_deadline = models.DateField( blank=True, null=True)
    hiring_timeline = models.BooleanField(blank=True, null=True,default=False)
    category =  models.CharField(max_length=50, blank=True, null=True)
    hide_company = models.BooleanField(blank=True, null=True,default=False)
    skills =  models.CharField(max_length=150, blank=True, null=True)
    experience =  models.CharField(max_length=150, blank=True, null=True)
    viewcount = models.IntegerField(default=0)
        
    question = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Jobs'
        verbose_name = 'Job'
        verbose_name_plural = 'Jobs'
    
    def __str__(self) -> str:
        return str(self.id)

@receiver(pre_save, sender=Jobs)
def generate_job_slug(sender, instance, *args, **kwargs):

    try:
        if instance.slug in [None, ""]:
            slug = slugify(instance.title)
            temp_slug = slug + ""
            lumber = 0
            jobs_list = Jobs.objects.all()
            
            while jobs_list.filter(slug=temp_slug).exists(): 

                lumber += 1
                temp_slug = f"{slug}-{lumber}"
                
            instance.slug = temp_slug
        
    except Exception as e:
        print(e)

@receiver(pre_delete, sender=Jobs)
def jobs_pre_delete(sender, instance, **kwargs):
    from user.models import SeekerApplication

    try:
        seeker_applications = SeekerApplication.objects.filter(job__id=instance.id)
        seeker_applications.update(job_status=False)
        
        emp_applications = EmployerApplication.objects.filter(job_key=instance.id)
        emp_applications.delete()
                
    except:
        pass

def job_applicant_resume(instance,filename):
    
    file_extension = filename.split('.')[-1]
    unique_id = str(uuid.uuid4().hex)[:10]
    new_filename = f'app-{unique_id}.{file_extension}'
    
    if os.path.exists(f"media/employerapplication/{new_filename}"):
        os.remove(f"media/employerapplication/{new_filename}")
    
    return os.path.join('application/', new_filename)
        
class EmployerApplication(models.Model):
    
    job_key = models.ForeignKey(Jobs, on_delete=models.CASCADE, blank=True, null=True, related_name="jobs")
    # seeker_key = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True)
    seeker_status = models.BooleanField(default=True)
    seeker = models.JSONField()
    resume = models.FileField(upload_to = job_applicant_resume, blank=True)
    prescreen = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=[("Pending","Pending"),("Shortlist","Shortlist"),("Interview","Interview"),("Reject","Reject")], default="Pending", null=True, blank=True)
    applied_date = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'EmployerApplication'
        verbose_name = 'Employer Application'
        verbose_name_plural = 'Employer Applications'

@receiver(post_save,sender=EmployerApplication)
def employerApp_presave(sender, instance,**kwargs):
    from backend.global_classes import NotificationManager
    from backend.models import User
    try:
        print(instance.job_key.employer)
        seeker_instance = User.objects.get(id = instance.job_key.employer.id )
        NotificationManager.create(user = seeker_instance, title="Job Application", message=f"New Application at {instance.job_key.title}", notification_type = "NewApplication", action = f"{settings.DOMAIN}/employer/job/all_candidates/{instance.job_key.slug}")
        
    except Exception as e:
        print(e)

@receiver(pre_delete, sender=EmployerApplication)
def delete_resume_with_app_removal(sender, instance, **kwargs):

    try:
        file_path = instance.resume.path
        if os.path.exists(f"{file_path}"):
            os.remove(f"{file_path}")
        
    except:
        pass
        
class Job_Reviews(models.Model):
    job = models.ForeignKey(Jobs, on_delete=models.CASCADE)

    email = models.CharField(max_length=50, blank=True, null=True)
    review = models.TextField(blank=True, null=True)
    shortlisted_candidate = models.CharField(max_length=50, blank=True, null=True)
    interview_candidate = models.CharField(max_length=50, blank=True, null=True)
    rate = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'Jobs_Reviews'
        verbose_name = 'Job_Reviews'
        verbose_name_plural = 'Jobs_Reviews'

    def __str__(self) -> str:
        return self.job.title + " - Review"
    