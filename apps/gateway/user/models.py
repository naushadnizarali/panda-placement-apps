from django.db import models
from django.contrib.auth.models import User,AbstractUser, Group, Permission
from django.conf import settings
from django.db.models.signals import pre_delete
from django.dispatch import receiver
import os
import uuid

from employer.models import Jobs

class Bookmarks(models.Model):
    seeker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="seeker")
    job_key = models.ForeignKey(Jobs, on_delete=models.SET_NULL, null=True)
    job = models.JSONField()
    
    created_date = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'Bookmark'
        verbose_name = 'Bookmark'
        verbose_name_plural = 'Bookmarks'
    
class Seeker_Info(models.Model):
    seeker = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="seeker_info")

    headline = models.CharField(max_length=150,blank=True, null=True)
    date_of_birth  = models.DateField(blank=True, null=True)
    place_of_birth = models.CharField(max_length=50,blank=True, null=True)
    gender = models.CharField(max_length=50,blank=True, null=True)
    passport = models.CharField(max_length=50,blank=True, null=True)
    area_of_residence = models.CharField(max_length=500,blank=True, null=True)
    zip_code = models.CharField(max_length=15,blank=True, null=True)
    country = models.CharField(max_length=50,blank=True, null=True)
    state = models.CharField(max_length=50,blank=True, null=True)
    city = models.CharField(max_length=50,blank=True, null=True)
    married = models.CharField(max_length=50,blank=True, null=True)
    nationality = models.CharField(max_length=50,blank=True, null=True)

    class Meta:
        db_table = 'Seekers_Info'
        verbose_name = 'Seeker_Info'
        verbose_name_plural = 'Seekers_Info'

    def __str__(self) -> str:
        return self.seeker.email + " Detail Info"

class SSL_Info(models.Model):
    seeker = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ssl_info")
    summary = models.TextField( null=True, blank=True)
    skill = models.TextField( null=True, blank=True)
    language = models.TextField( null=True, blank=True)

    class Meta:
        db_table = 'Summary_Skills_Language'
        verbose_name_plural = 'Summary_Skills_Language'
        
    def __str__(self) -> str:
        return self.seeker.email
 
class Projects(models.Model):
    seeker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="projects")

    title = models.CharField(max_length=50,blank=True, null=True)
    role = models.CharField(max_length=50,blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    url = models.CharField(max_length=200,blank=True, null=True) 
    
    class Meta:
        db_table = 'Projects'
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'

class Employment_Status(models.Model):
    seeker = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='employment')

    employment_status = models.CharField(max_length=50)
    employment_experience = models.CharField(max_length=50, blank=True, null=True)
    employment_position = models.CharField(max_length=50, blank=True, null=True)
    employment_function = models.CharField(max_length=50, blank=True, null=True)

    seeking_industry = models.CharField(max_length=50, blank=True, null=True)
    seeking_function = models.CharField(max_length=50, blank=True, null=True)
    seeking_position = models.CharField(max_length=50, blank=True, null=True)
    current_salary = models.CharField(max_length=50, blank=True, null=True)
    expected_salary = models.CharField(max_length=50, blank=True, null=True)
    # area_of_expertise  = models.CharField(max_length=200)

    class Meta:
        db_table = 'Employment_Status'
        verbose_name = 'Employment_Statu'
        verbose_name_plural = 'Employment_Status'
    
class Experience(models.Model):
    seeker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name='experience')

    company = models.CharField(max_length=50)
    position = models.CharField(max_length=50)
    country = models.CharField(max_length=50, blank=True, null=True)
    employment_status = models.CharField(max_length=50)
    
    description = models.TextField(blank=True, null=True)
    period_from = models.DateField(blank=True, null=True) 
    period_to = models.DateField(blank=True, null=True)
    currently_working = models.BooleanField(blank=True, null=True)

    description = models.TextField()

    class Meta:
        db_table = 'Experiences'
        verbose_name = 'Experience'
        verbose_name_plural = 'Experiences'

class Qualification(models.Model):
    seeker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="qualification")

    education_level = models.CharField(max_length=50)
    degree = models.CharField(max_length=50)
    institute = models.CharField(max_length=50)
    start_period = models.DateField(max_length=50,blank=True, null=True)
    complete_period = models.DateField(max_length=50,blank=True, null=True)
    location = models.CharField(max_length=50,blank=True, null=True)
    currently_enrolled = models.BooleanField(blank=True, null=True)

    class Meta:
        db_table = 'Qualifications'
        verbose_name =  'Qualification'
        verbose_name_plural =  'Qualifications'

    def __str__(self) -> str:
       return self.seeker.email + self.education_level + " in " + self.degree

def user_cv_path(instance, filename):
    
    user_id = str(instance.seeker.id)
    file_extension = filename.split('.')[-1]
    
    new_filename = f'seeker_{user_id}_cv.pdf'
    
    if os.path.exists(f"media/seeker_cv/{new_filename}"):
        os.remove(f"media/seeker_cv/{new_filename}")
    
    return os.path.join('seeker_cv', new_filename)

class Seeker_Cv(models.Model):
    seeker = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cv')

    file = models.FileField(upload_to=user_cv_path,blank=True)

    class Meta:
        db_table = 'Seeker_Cvs'
        verbose_name =  'Seeker_Cv'
        verbose_name_plural =  'Seeker_Cvs'

    def __str__(self) -> str:
       return self.seeker.email +"'s" + " resume"
   
def seeker_applicant_resume(instance,filename):
    
    file_extension = filename.split('.')[-1]
    unique_id = str(uuid.uuid4().hex)[:10]
    new_filename = f'app-{unique_id}.{file_extension}'
    
    if os.path.exists(f"media/seekerapplication/{new_filename}"):
        os.remove(f"media/seekerapplication/{new_filename}")
    
    return os.path.join('application/', new_filename)

class SeekerApplication(models.Model):
    
    seeker_key = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True, related_name="applied_jobs")
    # job_key = models.ForeignKey(Jobs, on_delete=models.SET_NULL, blank=True, null=True)
    job_status = models.BooleanField(default=True)
    job = models.JSONField()
    company = models.JSONField()
    resume = models.FileField(upload_to = seeker_applicant_resume, blank=True)
    prescreen = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=[("Pending","Pending"), ("Shortlist","Shortlist"), ("Interview","Interview"),("Reject","Reject"),("Viewed","Viewed")], default="Pending", null=True, blank=True)
    applied_date = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'SeekerApplication'
        verbose_name = 'Seeker Application'
        verbose_name_plural = 'Seeker Applications'

@receiver(pre_delete, sender=SeekerApplication)
def delete_resume_if_job_deleted(sender, instance, **kwargs):

    try:
        file_path = instance.resume.path
        if os.path.exists(f"{file_path}"):
            os.remove(f"{file_path}")
        
    except:
        pass
    






