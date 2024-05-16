from django.contrib import admin
from .models import Blog, Countries, Country_State, Notification, ResumeTemplates, Subscribers, User, ContactUs, UserSettings

# admin.site.register([User])

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id','email','country','phone', 'is_seeker','is_employer','is_manager',"is_superuser")

@admin.register(ContactUs)
class ContactUsAdmin(admin.ModelAdmin):
    list_display = ('id','email','name','phone', 'subject','message')

@admin.register(ResumeTemplates)
class ResumeTemplatesAdmin(admin.ModelAdmin):
    list_display = ('id', 'image', 'html_file')

@admin.register(Countries)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'country_code','nationality','phone_code')

@admin.register(UserSettings)
class SettingsAdmin(admin.ModelAdmin):
    list_display = ('id', 'user','currency')

@admin.register(Subscribers)
class SubscribersAdmin(admin.ModelAdmin):
    list_display = ('id', 'email','created_date')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'title','user','notification_type','created_time')

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ["id",'title',"slug","image","description","created_time"]
