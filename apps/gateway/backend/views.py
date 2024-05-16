from functools import reduce
from django.http import FileResponse, Http404, HttpResponse
from django.shortcuts import get_object_or_404, render
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework import viewsets, permissions

from backend.global_classes import Jobs_list_View, Jobs_single_View, SeekerData, sendActivationEmail
from employer.models import Jobs
from employer.serializer import JobsSerializer
from pandaplacement import settings

from .serializer import BlogSerializer, CitySerializer, ContactUsSerializer, CountriesSerializer, NotificationSerializer, StateSerializer, SubscribersSerializer, UserSerializer, UserSettingsSerializer
from .models import Blog, Countries, Country_State, Country_State_City, Notification, ResumeTemplates, Subscribers, User, UserSettings
import os
import json
import operator

class UserSettingsView(viewsets.ModelViewSet):
    serializer_class = UserSettingsSerializer
    queryset = UserSettings.objects.all()
    def get(self, request):
        settings = self.get_queryset(user=request.user)
        return Response(settings, status=status.HTTP_200_OK)
    
    def create(self, request, *args, **kwargs):
        print(request.data)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(seeker=self.request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.seeker != request.user:
            return Response({'error': {"detail":"Permission denied"}}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.seeker != request.user:
            return Response({'error': {"detail":"Permission denied"}}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class ContactUsView(APIView):

    serializer_class = ContactUsSerializer

    def post(self, request):
        print(request.data)

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            contactus = serializer.save()
            contactus.save() # type: ignore

            return Response({'message': 'Contact Form Submited Successfuly'}, status=status.HTTP_201_CREATED)
        else:
            errors = {}
            errors.update(serializer.errors)
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

class ApplicationResume(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, file):
        filename = file.split("_")
        response = FileResponse(
            open(file, 'rb'), content_type='application/pdf')
            # response['Content-Disposition'] = f'attachment; filename="{resume_file_path}"'

        return response

        user = request.user
        directory_path = "media/application/"
        resume_file_path = os.path.join(directory_path, file)
        # print(resume_file_path)

        if not os.path.exists(resume_file_path):
            return Response({'error': {"detail": "Not Found"}}, status=status.HTTP_404_NOT_FOUND)

        try:
            app = Application.objects.filter(
                resume=f"application/{file}").first()

        except Exception as e:

            if user.is_superuser or user.is_manager:
                response = FileResponse(
                    open(resume_file_path, 'rb'), content_type='application/pdf')
                # response['Content-Disposition'] = f'attachment; filename="{resume_file_path}"'

                return response

            return Response({'error': {"detail": "File Without User"}}, status=status.HTTP_400_BAD_REQUEST)
        has_access = Application.objects.filter(job__employer=user).exists()
        # print('Employer Access: ', has_access, "\nSuperUser: ", user.is_superuser , "\nManager: ",user.is_manager,"\nSeeker: ", str(user) == str(app.seeker))

        if not has_access and not user.is_superuser and str(user) != str(app.seeker) and not user.is_manager:
            return Response({'error': {"detail":"Permission denied"}}, status=status.HTTP_403_FORBIDDEN)

        cv_file = app.resume.open(mode='rb')

        response = FileResponse(cv_file, content_type='application/pdf')

        # response['Content-Disposition'] = f'attachment; filename="{resume_file_path}"'
        return response

class GuestJobs(viewsets.GenericViewSet):
    serializer_class = JobsSerializer
    queryset = Jobs.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.queryset.filter(status="Approved", phase="Open")
        return Jobs_list_View(queryset, self.serializer_class)

    def retrieve(self, request, *args, **kwargs):

        slug = kwargs.get("pk")
        instance = self.queryset.filter(slug=slug, status="Approved", phase="Open").first()
        
        if instance:

            result = Jobs_single_View(instance, self.serializer_class)
            return Response(result, status=status.HTTP_200_OK)

        else:
            return Response("no Job found", status=status.HTTP_404_NOT_FOUND)
    
class Related_Jobs(APIView):
    serializer_class = JobsSerializer
    queryset = Jobs.objects.filter(status="Approved", phase="Open")

    def get(self, request, search_term):
        user = request.user

        # findings = self.queryset.filter(title__icontains=search_term)
        # serializer = JobsSerializer(instance=findings, many=True).data

        q_list = [Q(title__icontains=word)
                  for word in search_term.split()]  # Create a list of Q objects
        if q_list:
            # Combine Q objects using OR operator
            combined_filter = reduce(operator.or_, q_list)
            # Filter and get unique results
            queryset = self.queryset.filter(combined_filter).distinct()
        else:
            queryset = self.queryset.objects.none() # type: ignore

        return Jobs_list_View(queryset, self.serializer_class)
    
def index(request):
    return render(request, 'index.html')

class SubscribersView(APIView):
    serializer_class = SubscribersSerializer
    queryset = Subscribers.objects.all()
    
    def post(self, request):
        print(request.data)
        email = request.data.get("email")

        try:
            
            existing_subscriber = self.queryset.filter(email=email).exists()
            
            if existing_subscriber:
                return Response({'error': {"detail":'Email already subscribed'}}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            return Response({'message': 'Successfully subscribed'}, status=status.HTTP_201_CREATED)
            
        except ValidationError as e:
            return Response({'error': {"detail": e.detail}}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print(e)
            return Response({'error': {"detail": 'Unexpected Error Occurred'}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MediafilesView(APIView):
    def get(self, request, foldername, filename):
        file_path = f'media/{foldername}/{filename}'
        try:

            if not os.path.exists(file_path):
                return render(request, "404.html", {})

            if foldername in ['employerapplication','seekerapplication','seeker_cv']:
                response = FileResponse(open(f'media/{foldername}/{filename}', 'rb'), content_type='application/pdf')

            else:
                response = FileResponse(open(f'media/{foldername}/{filename}', 'rb'), content_type = 'image/jpeg')

            # Optionally, you can set the Content-Disposition header for downloading the file
            # response['Content-Disposition'] = f'attachment; filename="{filename}"'

            return response
        except:
            return render(request, "404-2.html", {})

@csrf_exempt
def TestPage(request):
    try:
        model = ResumeTemplates.objects.get(id=1)
    except:
        return JsonResponse({'error': 'model not found'}, status=status.HTTP_404_NOT_FOUND)
    
    model.template_html = ""
    print('Cities imported successfully')
    return JsonResponse({'message': 'States imported successfully'}, status=status.HTTP_201_CREATED)

class AccountActivation(APIView):
        
    def get(self, request, uidb64, token, format=None):

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and default_token_generator.check_token(user, token):
            
            user.is_active = True
            user.save()
            
            role = ""
            if user.is_employer:
                role = "employer"
            elif user.is_seeker:
                role = "user"
            
            return Response({'message': 'Account Activated Succefully', "redirect_url": f"/{role}/login"}, status=status.HTTP_200_OK)

        else:
            return Response({'error': {"detail":'Invalid token or user'}}, status=status.HTTP_400_BAD_REQUEST)

class ResentAccountActivation(APIView):

    def post(self, request):

        email = request.data.get("email")

        try:
            
            try:
                user = User.objects.get(email=email)
            except:
                return Response({'error': {"detail":'Email not registered'}}, status=status.HTTP_403_FORBIDDEN)
            
            sendEmail = sendActivationEmail(user)
                
            if  sendEmail != True:
                return Response({'error': {"detail":'Registration error email not send'}}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({'message': 'Varification code sent successfully check email'}, status=status.HTTP_201_CREATED)
            
        except:
            return Response({'error': {"detail":'Unsuccessfull sending varification code'}}, status=status.HTTP_400_BAD_REQUEST)

def error_404(request, exception):
    return render(request,'404.html',{})
    
def error_500(request):
    return render(request,'500.html',{})

def viewTemplates(request,id):
    template = f"resumetemplates/template-{id}.html" 

    seeker = SeekerData(22)
    seeker_data = seeker.get_all_data()
    try:
        seeker_data['ssl']['skill'] = json.loads(seeker_data['ssl']['skill'])
    except:
        seeker_data['ssl']['skill'] = []
        
    try:
        seeker_data['ssl']['language'] = json.loads(seeker_data['ssl']['language'])
    except:
        seeker_data['ssl']['language'] = []
        
    seeker_data['id'] = 16
    print(seeker_data)
    return render(request, template, seeker_data)

def viewResumeWithTemplate(request):
    
    templateID = request.GET.get("template")
    userID = request.GET.get("user")
    template = f"resumetemplates/template-{templateID}.html"
    
    if not os.path.exists(os.path.join(settings.BASE_DIR,"templates",template)):
        raise Http404("Template not found")
    
    if not User.objects.filter(id=userID).exists():
        raise Http404("User not found")
    
    seeker = SeekerData(userID)
    seeker_data = seeker.get_all_data()
    try:
        seeker_data['ssl']['skill'] = json.loads(seeker_data['ssl']['skill'])
    except:
        seeker_data['ssl']['skill'] = []
        
    try:
        seeker_data['ssl']['language'] = json.loads(seeker_data['ssl']['language'])
    except:
        seeker_data['ssl']['language'] = []
        
    seeker_data['id'] = userID
    print(seeker_data)
    return render(request, template, seeker_data)

class Get_Countries(ListAPIView):
    serializer_class = CountriesSerializer
    queryset = Countries.objects.all()

class Get_State(APIView):
    serializer_class = StateSerializer
    queryset = Country_State.objects.all()

    def get(self, request, countryID):
        try:
            country = Countries.objects.get(id=countryID)
        except Countries.DoesNotExist:
            return Response({"error": {"detail": "Country not found"}}, status=status.HTTP_404_NOT_FOUND)

        state_list = self.queryset.filter(country=country)
        serializer = self.serializer_class(state_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class Get_City(APIView):
    serializer_class = CitySerializer
    queryset = Country_State_City.objects.all()

    def get(self, request):
        
        country = self.request.query_params.get('country')
        state = self.request.query_params.get('state')

        try:
            state_instance = self.queryset.get(country__name=country, name=state)

        except Country_State_City.DoesNotExist:
            return Response({"error": {"detail": "Cities not found for given query"}}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(state_instance).data
        print(serializer['cities'])
        return Response(serializer, status=status.HTTP_200_OK)
    
class NotificationBase(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()

    def list(self, request):
        user=request.user
        notifications = self.queryset.filter(user=user)
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)

    # def create(self, request):
    #     user=request.user
    #     serializer = self.get_serializer(data=request.data)
        
    #     if serializer.is_valid():
    #         serializer.save(user=user)
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        user=request.user
        
        instance = self.get_object()
        
        if instance.user != user:
            return Response({"error": {"detail":"Permission denied"}}, status=status.HTTP_403_FORBIDDEN)
        instance.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['post'])
    def mark_as_seen(self, request, pk=None):
        user = request.user
        
        try:
            notification = self.queryset.get(id=pk, user=user)
            notification.is_seen = True
            notification.save()
            serializer = self.get_serializer(notification)
        
            return Response(serializer.data)
        
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=False, methods=['post'])
    def mark_all_as_seen(self, request):
        
        user = request.user
        notifications = self.queryset.filter(user=user, is_seen=False)
        notifications.update(is_seen=True)
        
        return Response(status=status.HTTP_200_OK)

class BlogView(ListAPIView):
    serializer_class = BlogSerializer
    queryset = Blog.objects.all()

class BlogCreate(CreateAPIView):
    serializer_class = BlogSerializer
    queryset = Blog.objects.all()


















