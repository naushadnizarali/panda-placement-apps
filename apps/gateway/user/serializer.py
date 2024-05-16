
from rest_framework import serializers
from employer.models import Jobs

from employer.serializer import JobsSerializer
from .models import SSL_Info, Bookmarks, Seeker_Info, Projects, Employment_Status, Experience, Qualification, Seeker_Cv, SeekerApplication
from backend.models import ResumeTemplates, User

class Seeker_InfoSerializer(serializers.ModelSerializer):
    
    # def to_internal_value(self, data):
    #     field = data.get('zip_code')

    #     if not field:
    #         raise serializers.ValidationError("No file provided.")

    #     # Your additional validation logic here

    #     return {'zip_code': field}
    class Meta:
        model = Seeker_Info
        fields = ['id','headline','date_of_birth','place_of_birth','gender','passport','area_of_residence','zip_code','city','country','married','state','nationality']

class SSL_InfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SSL_Info
        fields = ["id", "summary","skill","language"]

class BookmarksSerializer(serializers.ModelSerializer):
    # job = JobsSerializer()  # Specify the nested serializer for the job field

    class Meta:
        model = Bookmarks
        fields = ["id", 'job_key','job']
        
    # def create(self, validated_data):
    #     job_data = validated_data.pop('job')  # Extract job data from validated data
    #     job = Jobs.objects.get(id=job_data)  # Create job instance
    #     saved_job = Bookmarks.objects.create(job=job, **validated_data)  # Create saved job instance
    #     return saved_job

class ProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = ["id", "title","role","description", "url"]

class Employment_StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employment_Status
        fields = ["id", "employment_status","employment_experience", "employment_position", "employment_function","seeking_industry", "seeking_function", "seeking_position", "current_salary", "expected_salary"]

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ["id", 'company', 'position', 'country', 'period_from', 'period_to', 'description','currently_working','employment_status']

class QualificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Qualification
        fields = ["id", 'education_level', 'degree', 'institute','start_period', 'complete_period','location','currently_enrolled']

class Seeker_CvSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seeker_Cv
        fields = ["id","file"] 

class Seeker_ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","first_name", "last_name", "email", "phone",'image']

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True)

class SeekerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeekerApplication
        fields = ('id','job_status','seeker_key','job','company','resume','prescreen','applied_date')
        
class ResumeTemplatesViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeTemplates
        fields = ("temID","image")