
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.contrib.auth.hashers import make_password
import os
import uuid
# from backend.global_classes import function_before_user_delete
from employer.models import EmployerApplication, Jobs
from pandaplacement import settings
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.core.files.storage import FileSystemStorage
from django.utils.text import slugify
from django.utils import timezone

from user.models import SeekerApplication

def user_profile_path(instance, filename):
    
    user_id = str(instance.id)
    file_extension = filename.split('.')[-1]
    cretime = timezone.now().strftime("%H:%M:%S")
    new_filename = f'user_{user_id}_profile_{cretime}.{file_extension}'
    
    if os.path.exists(f"media/profile_images/{new_filename}"):
        os.remove(f"media/profile_images/{new_filename}")
    
    return os.path.join('profile_images/', new_filename)

class UserManager(BaseUserManager):

    def _create_user(self, email, password,  phone, **extra_fields):
        if not email:
            raise ValueError("Email must be provided")
        if not password:
            raise ValueError("Password is not provided")
        
        user = self.model(
            email = self.normalize_email(email),
            phone = phone,
            **extra_fields
        )

        user.set_password(password)
        user.save(using = self._db)
        return user
    
    def create_user(self, email, password, phone,  **extra_fields):
        extra_fields.setdefault('is_staff',False)
        extra_fields.setdefault('is_active',False)
        extra_fields.setdefault('is_superuser', False)

        return self._create_user(email, password, phone, **extra_fields)
    
    def create_superuser(self, email, password, phone=None, **extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_active',True)
        extra_fields.setdefault('is_seeker', True)
        extra_fields.setdefault('is_employer', True)
        extra_fields.setdefault('is_manager', True)
        extra_fields.setdefault('is_superuser', True)

        return self._create_user(email, password, phone,  **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):

    image = models.FileField(upload_to=user_profile_path, blank=True, null=True)
    email = models.EmailField(unique=True)
    country = models.CharField(max_length=100, default=None, null=True) 
    phone = models.CharField(max_length=20, default=None, null=True)  
    first_name = models.CharField(max_length=100, default=None, null=True, blank=True)
    last_name = models.CharField(max_length=100, default=None, null=True, blank=True)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_superuser  = models.BooleanField(default=False)

    is_seeker = models.BooleanField(default=False)
    is_employer = models.BooleanField(default=False)
    is_manager = models.BooleanField(default=False)

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def save(self, *args, **kwargs):
        
        if not self.password.startswith(('pbkdf2_sha256$', 'bcrypt', 'argon2')):
            
            self.password = make_password(self.password)

        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

@receiver(pre_delete, sender=User)
def user_pre_delete(sender, instance, **kwargs):

    try:
        file_path = instance.image.path
        if os.path.exists(f"{file_path}"):
            os.remove(f"{file_path}")
        
        if instance.is_seeker:
            seeker_applications = SeekerApplication.objects.filter(seeker_key=instance.id)
            seeker_applications.delete()
            
            emp_applications = EmployerApplication.objects.filter(seeker__id=instance.id)
            emp_applications.update(seeker_status=False)
        
    except:
        pass
    
class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user')
    currency = models.CharField(max_length=10, blank=True, null=True)

class ContactUs(models.Model):

    name = models.CharField(max_length=150)
    email = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    subject = models.CharField(max_length=100)
    message = models.TextField()

    class Meta:
        db_table = 'Contact_Us'
        verbose_name = 'Contact_Us'
        verbose_name_plural = 'Contact_Us'

def resume_template_image(instance,filename):
    file_extension = filename.split('.')[-1]
    
    temID = str(instance.temID)
    
    new_filename = f"template-{temID}.{file_extension}"
    file_path = f"media/resumetemplates/{new_filename}"
    
    if os.path.exists(file_path):
        os.remove(file_path)
    
    return os.path.join('resumetemplates',new_filename)

def resume_template_html(instance, filename):
    file_extension = filename.split('.')[-1]
    temID = str(instance.temID)
    
    new_filename = f"template-{temID}.{file_extension}"
    file_path = f"templates/resumetemplates/{new_filename}"
    
    if os.path.exists(file_path):
        os.remove(file_path)
    
    return os.path.join('resumetemplates', new_filename)

class ResumeTemplates(models.Model):
    temID = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    image = models.FileField(upload_to=resume_template_image, blank=True)
    html_file = models.FileField(upload_to=resume_template_html, blank=True, storage=FileSystemStorage(os.path.join(settings.BASE_DIR, "templates")))
    
    class Meta:
        db_table = 'Resume_Template'
        verbose_name = 'Resume_Template'
        verbose_name_plural = 'Resume_Templates'

@receiver(pre_delete, sender=ResumeTemplates)
def resume_template_pre_delete(sender, instance, **kwargs):

    try:
        image_file_path = instance.image.path
        html_file_path = instance.html_file.path
        if os.path.exists(f"{image_file_path}"):
            os.remove(f"{image_file_path}")
        if os.path.exists(f"{html_file_path}"):
            os.remove(f"{html_file_path}")
               
    except:
        pass

class Countries(models.Model):
    name = models.CharField(max_length = 50)
    country_code = models.CharField(max_length = 50)
    phone_code = models.CharField(max_length = 50)
    nationality = models.CharField(max_length = 50)
    
    class Meta:
        db_table = 'Countries'
        verbose_name = 'Country'
        verbose_name_plural = 'Countries'

class Country_State(models.Model):
    country = models.ForeignKey('Countries', on_delete=models.CASCADE)
    name = models.CharField(max_length = 50)
    
    class Meta:
        db_table = 'Country_State'
        verbose_name = 'State'
        verbose_name_plural = 'Country_States'

class Country_State_City(models.Model):
    country = models.ForeignKey('Countries', on_delete=models.CASCADE)
    name = models.CharField(max_length = 50)
    code = models.CharField(max_length = 50)
    cities = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'Country_State_City'
        verbose_name = 'State_City'
        verbose_name_plural = 'Country_States_City'

class Subscribers(models.Model):
    email = models.EmailField()
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Subscriber'
        verbose_name = 'Subscriber'
        verbose_name_plural = 'Subscribers'

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    message = models.TextField()
    is_seen = models.BooleanField(default=False,blank=True)
    notification_type = models.CharField(max_length=50)
    action = models.TextField()
    created_time = models.DateField(auto_now_add=True)
    
    class Meta:
        db_table = 'Notification'
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'

def blog_image_upload_to(instance,filename):
    file_extension = filename.split('.')[-1]

    temID = instance.slug
        
    new_filename = f"blog-{temID}.{file_extension}"
    file_path = f"media/blog/{new_filename}"

    if os.path.exists(file_path):
        os.remove(file_path)

    return os.path.join('blog', new_filename)

class Blog(models.Model):

    title = models.CharField(max_length=100)
    slug = models.SlugField(default="", null=False)
    image = models.FileField(upload_to=blog_image_upload_to)
    description = models.TextField()
    created_time = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)
        super().save(*args, **kwargs)

@receiver(pre_delete, sender=Blog)
def blog_pre_delete(sender, instance, **kwargs):

    try:
        file_path = instance.image.path
        if os.path.exists(f"{file_path}"):
            os.remove(f"{file_path}")
               
    except:
        pass

