
from backend.models import User
from rest_framework import serializers
from .models import Company_Info, Todo_List, Notes_List, Jobs, Job_Reviews, EmployerApplication

class Company_InfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company_Info
        fields = ["id", "company_name", "company_type", "industry", "address", "city", "website", 
                  "ntn", "employer_number", "operating_since","logo", "phone", "email"]

class Todo_ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo_List
        fields = ["id","todo", "is_complete"]
    
class Notes_ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notes_List
        fields = ["id","notes", "is_complete"]

class JobsSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Jobs
        fields = ["id","title","slug", "hiring_number","hiring_country","hiring_state","hiring_city",
            "phase","description","type","salary_rate", "salary_start_range", "salary_end_range",'salary_currency',
            'application_deadline', 'hiring_timeline','status','question', 'created_at',"category","hide_company","salary_type",'skills','experience','viewcount']
        
class EmployerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerApplication
        fields = ('id','job_key','seeker_status','seeker','resume','prescreen',"status",'applied_date')

class Job_ReviewsSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Job_Reviews
        fields = "__all__" 

class Employer_ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', "first_name", "last_name", "email", "phone",'image'] 

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True)
