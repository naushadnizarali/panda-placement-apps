from rest_framework import serializers
from employer.models import Jobs

from .models import Blog, Countries, Country_State, Country_State_City, Notification, ResumeTemplates, Subscribers, User, ContactUs, UserSettings
from django.core.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','email', 'phone', 'country','password','first_name','last_name','image')
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            phone=validated_data['phone'],
            country=validated_data['country'],
            # first_name=validated_data['first_name'],
            # last_name=validated_data['last_name'],
            
        )
        return user
    
    def validate_email(self, value):
        if not value.endswith('.com') and "@" not in value: 
            raise ValidationError("Invalid email format. Only example.com emails are allowed.")
        return value
    
class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields = '__all__'
        
class SubscribersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscribers
        fields = ['id', 'email', 'created_date']
                
class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ('user','currency')
        
class CountriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Countries
        fields = ('id','name','country_code','phone_code','nationality')

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Country_State
        fields = ('id','country','name')

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country_State_City
        fields = ('id','country', 'name', 'code', 'cities')

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = "__all__"
        read_only_fields = ['slug']

class ResumeTemplatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeTemplates
        fields = "__all__"