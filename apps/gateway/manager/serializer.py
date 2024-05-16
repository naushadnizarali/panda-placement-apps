from backend.models import User
from rest_framework import serializers
from .models import ManagerTodo_List, ManagerNotes_List
from employer.models import Jobs
from django.contrib.auth.forms import PasswordResetForm

# class ManagerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Manager
#         fields = "__all__" 

class ManagerTodo_ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagerTodo_List
        fields = ['id',"todo",'is_complete']

class ManagerNotes_ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagerNotes_List
        fields = ["id","notes", "is_complete"]

class Manager_JobsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jobs
        fields = "__all__" 

class Manager_UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","password", "last_login", "email", "country", "phone", "first_name", "last_name", "is_active", "is_seeker", "is_employer"]

class Manager_ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User

        fields = ["first_name", "last_name", "email", "phone"]

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True)

# class ApplicationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Application
#         fields = "__all__"







