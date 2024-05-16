from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import  Company_Info, EmployerApplication, Todo_List, Notes_List, Jobs, Job_Reviews

@admin.register(Company_Info)
class Company_InfoAdmin(admin.ModelAdmin):
    list_display = ("id","employer","company_name","industry","city","website","operating_since")

@admin.register(Todo_List)
class TodoAdmin(admin.ModelAdmin):
    list_display = ('employer', 'shortened_todo', 'is_complete')

    def shortened_todo(self, obj):
        
        max_length = 50
        if len(obj.todo) <= max_length:
            return obj.todo
        return f"{obj.todo[:max_length]}..."

    shortened_todo.short_description = 'Shortened Todo'

@admin.register(Notes_List)
class NotesAdmin(admin.ModelAdmin):
    list_display = ('employer', 'shortened_todo', 'is_complete')

    def shortened_todo(self, obj):
        
        max_length = 50
        if len(obj.notes) <= max_length:
            return obj.notes
        return f"{obj.notes[:max_length]}..."

    shortened_todo.short_description = 'Shortened Todo'

@admin.register(Jobs)
class JobsAdmin(admin.ModelAdmin):
    list_display = ('id','employer', 'title', 'category','hiring_country', 'status','phase','salary_start_range','salary_end_range','created_at')

@admin.register(Job_Reviews)
class Job_ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'job', 'email', 'review','shortlisted_candidate','interview_candidate','rate')

@admin.register(EmployerApplication)
class EmployerApplicationAdmin(admin.ModelAdmin):
    list_display = ('id','job_key','seeker_status','shortened_seeker', 'resume','prescreen', 'status', 'applied_date')
    
    def shortened_seeker(self, obj):
        
        max_length = 50
        output = str(obj.seeker)
        return output[:max_length]+"..."