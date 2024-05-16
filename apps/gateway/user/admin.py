from django.contrib import admin

from .models import Bookmarks, Seeker_Info, SSL_Info, Projects, Employment_Status, Experience, Qualification, Seeker_Cv, SeekerApplication


@admin.register(Seeker_Info)
class SeekerAdmin(admin.ModelAdmin):
    list_display = ('id','seeker','get_seeker_country', 'date_of_birth','place_of_birth','gender','passport','city')

    def get_seeker_country(self, obj):
        return obj.seeker.country

    get_seeker_country.short_description = 'Seeker Country'

@admin.register(SSL_Info)
class SummaryAdmin(admin.ModelAdmin):
    list_display = ('id','seeker','shortened_text','skill','language')

    def shortened_text(self, obj):
        
        max_length = 50
        if len(obj.summary) <= max_length:
            return obj.summary
        return f"{obj.summary[:max_length]}..."

    shortened_text.short_description = 'Short Summary'

@admin.register(Projects)
class ProjectsAdmin(admin.ModelAdmin):
    list_display = ('id','seeker','title','role','short_text','url')

    def short_text(self, obj):
        
        max_length = 50
        if len(obj.description) <= max_length:
            return obj.description
        return f"{obj.description[:max_length]}..."

    short_text.short_description = 'Short Description'

@admin.register(Employment_Status)
class Employment_StatusAdmin(admin.ModelAdmin):
    list_display = ('id','seeker','employment_status','employment_experience','employment_position','seeking_position')

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('id','seeker','company','position','country','period_from','period_to')

@admin.register(Qualification)
class QualificationAdmin(admin.ModelAdmin):
    list_display = ('id','seeker','education_level','degree','institute','start_period','complete_period')

@admin.register(Bookmarks)
class BookmarksAdmin(admin.ModelAdmin):
    list_display = ('id','seeker','job')

admin.site.register(Seeker_Cv)

@admin.register(SeekerApplication)
class SeekerApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'job_status', 'seeker_key', 'shortened_job', 'shortened_company','resume' ,'prescreen', 'status', 'applied_date')  
    
    def shortened_job(self, obj):
        
        max_length = 50
        output = str(obj.job)
        return output[:max_length]+"..."
    
    def shortened_company(self, obj):
        
        max_length = 50
        output = str(obj.company)
        return output[:max_length]+"..."