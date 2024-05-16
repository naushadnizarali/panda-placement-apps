import ast
import json
import shutil
import uuid
import zipfile
import os
from rest_framework.views import APIView
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from user.serializer import SeekerApplicationSerializer

from .serializer import  Company_InfoSerializer, EmployerApplicationSerializer, Todo_ListSerializer, Notes_ListSerializer, JobsSerializer, Job_ReviewsSerializer, Employer_ProfileSerializer, PasswordChangeSerializer, PasswordResetSerializer, PasswordResetConfirmSerializer, EmployerApplicationSerializer
from .models import  Company_Info, Todo_List, Notes_List, Jobs, Job_Reviews, EmployerApplication

from user.models import SeekerApplication

from backend.views import NotificationBase
from backend.serializer import  UserSerializer
from backend.models import Notification, User
from backend.global_classes import Jobs_single_View, SeekerData, get_model_data, sendActivationEmail, sendAppRejectEmail, sendAppShortlistEmail, sendPasswordReset, validate_uploaded_image

from django.shortcuts import get_object_or_404, render
from django.http import FileResponse, HttpResponse, HttpResponseForbidden
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.tokens import default_token_generator

from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from datetime import timedelta
from django.db.models import Q
# from xhtml2pdf import pisa

class SigninView(APIView):
    
    def post(self, request):

        email = request.data.get('email')
        password = request.data.get('password')
        remember_me = request.data.get('rememberme')
        print(request.data)

        if User.objects.filter(email=email, is_active=False).first():
            return Response({'error': {"detail":'Varify your account first'}}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(request, email=email, password=password)

        if user is not None:

            if user.is_employer:
                # login(request, user)

                # sessionid = request.session.session_key
                # csrftoken = request.COOKIES.get('csrftoken', '')
                # token, created = Token.objects.get_or_create(user=user)
                # access_token = str(refresh.access_token)
                # refresh_token = str(refresh)

                if remember_me:
                    refresh = RefreshToken.for_user(user)
                    access_token = AccessToken(token=str(refresh.access_token)) # type: ignore
                    access_token.set_exp(lifetime=timedelta(days=7))
                    token = str(access_token)
                else:
                    refresh = RefreshToken.for_user(user)
                    token = str(refresh.access_token)

                # print('refresh_token_expires_at: ',(refresh['exp']- timezone.now().timestamp()) / 3600)

                return Response({'message': 'Signed in successfully', 'token': token}, status=status.HTTP_200_OK)
            
            else:
                return Response({'error': {"detail":'You are not authorized to sign in as an Employer'}}, status=status.HTTP_403_FORBIDDEN) 
        else:
            return Response({'error': {"detail":'Invalid email or password'}}, status=status.HTTP_404_NOT_FOUND)

class MakeEmployer(APIView):
    def post(self, request):

        email = request.data.get('email')
        password = request.data.get('password')
        print(request.headers)

        user = authenticate(request, email=email, password=password)

        if user is not None:
            if user.is_seeker and not user.is_employer:
                user.is_employer = True
                user.save()
                return Response({'message': 'Employer Role Added to entered email'}, status=status.HTTP_201_CREATED )
            elif user.is_employer:
                return Response({'message': 'The Provided email already has employer access'}, status=status.HTTP_200_OK )
            else:
                return Response({'error': {"detail": 'User is not a seeker'}}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': {"detail": 'Invalid username or password'}}, status=status.HTTP_401_UNAUTHORIZED)

class SignoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Use the refresh token to blacklist the access token
        try:
            print(request.data)
            refresh = RefreshToken.for_user(request.user)
            accessToken = refresh.access_token
            refresh.access_token.set_exp(lifetime=timedelta(seconds=5))
            refresh.set_exp(lifetime=timedelta(seconds=5))

            logout(request)

            return Response({'message': 'Logged out successfully', 
                             'logout code':str(refresh)}, status=status.HTTP_200_OK)

        except Exception as e:
            # return Response({'error': 'Invalid or expired refresh token','error message': str(e)})
            return Response({'error': str(e)})

class index(viewsets.ModelViewSet):
    serializer_class = Todo_ListSerializer
    queryset = Todo_List.objects.all()

class FilterByEmployerViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.queryset.filter(employer=request.user.id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        print(request.data)

        try: request.data.pop('status')
        except: pass
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(employer=self.request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        
        instance = self.get_object()
        if instance.employer != request.user:
            return Response({"error": {"detail":"Permission denied"}}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        
        instance = self.get_object()
        if instance.employer != request.user:
            return Response({"error": {"detail":"Permission denied"}}, status=status.HTTP_403_FORBIDDEN)

        try: request.data.pop('status')
        except: pass

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.employer != request.user:
            return Response({"error": {"detail":"Permission denied"}}, status=status.HTTP_403_FORBIDDEN)
        instance.delete()
        return Response({"message": "item deleted"},status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['delete'])
    def clear(self,request):
        queryset = self.get_queryset().filter(employer=request.user)
        queryset.delete()
        return Response({"message": "contents deleted"}, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['delete'])
    def clearSelected(self,request):
        ids_to_delete = request.data.get('ids', [])
        
        # Validate if IDs are provided
        if not ids_to_delete:
            return Response({"error": "No IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Filter the queryset to include only the instances with the provided IDs
        queryset = self.get_queryset().filter(id__in=ids_to_delete, employer=request.user)
        
        # Check if any instances exist with the provided IDs
        if not queryset.exists():
            return Response({"error": "No matching instances found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Delete the selected instances
        queryset.delete()
        
        return Response({"message": "Selected contents deleted"}, status=status.HTTP_204_NO_CONTENT)
    
class FilterByJobViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.queryset.filter(job__employer=request.user.id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        instance = Jobs.objects.filter(id=request.data['job'])[0]
        
        if instance.employer != request.user:
            return Response({'error':{"detail": "Permission denied"}}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.job.employer != request.user:
            return Response({"error": {"detail":"Permission denied"}}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.jobs.employer != request.user:
            return Response({"error": {"detail":"Permission denied"}}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.jobs.employer != request.user:
            return Response({"error": {"detail": "Permission denied"}}, status=status.HTTP_403_FORBIDDEN)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CompanyInfoView(FilterByEmployerViewSet):
    serializer_class = Company_InfoSerializer
    queryset = Company_Info.objects.all()

    def create(self, request, *args, **kwargs):
        company = self.queryset.filter(employer=request.user).first()

        if company:
            # if request.data['logo'] and company.logo:
            #     os.remove(company.logo.path)

            return validate_uploaded_image(request, "logo", self.get_serializer, company)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(employer=self.request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        
        instance = self.get_object()
        if instance.employer != request.user:
            return Response({"error": {"detail":"Permission denied"}}, status=status.HTTP_403_FORBIDDEN)

        try: request.data.pop('status')
        except: pass

        if request.data['logo'] and instance.logo:
            os.remove(instance.logo.path)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class Todo_ListView(FilterByEmployerViewSet):
    serializer_class = Todo_ListSerializer
    queryset = Todo_List.objects.all()

class Notes_ListView(FilterByEmployerViewSet):
    serializer_class = Notes_ListSerializer
    queryset = Notes_List.objects.all()

class JobsView(FilterByEmployerViewSet):
    serializer_class = JobsSerializer
    queryset = Jobs.objects.all()
    
    def retrieve(self, request, *args, **kwargs):

        slug = kwargs.get("pk")
        instance = self.queryset.filter(slug=slug).first()
        
        if instance:

            result = Jobs_single_View(instance, self.serializer_class)
            return Response(result, status=status.HTTP_200_OK)

        else:
            return Response("no Job found", status=status.HTTP_404_NOT_FOUND)
        
class Job_ReviewsView(FilterByJobViewSet):
    serializer_class = Job_ReviewsSerializer
    queryset = Job_Reviews.objects.all()

class CreateEmployerView(APIView):
    serializer_class = UserSerializer

    def post(self, request):
        company_name, company_type = request.data.get('company_name'), request.data.get('company_type')

        email = request.data.get("email")

        try:
            existing_user = User.objects.get(email=email)
            
            if existing_user.is_active:

                if existing_user.is_employer:
                    return Response({'error': {"detail":'Employer with this email already exists'}}, status=status.HTTP_409_CONFLICT)
                
                if existing_user.is_seeker:
                    return Response({'error': {"detail":'Email already registered as Job Seeker'}}, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({'error': {"detail":'Email already registered but not varified'}}, status=status.HTTP_403_FORBIDDEN)
                            
        except:

            serializer = self.serializer_class(data=request.data)

            if serializer.is_valid():
                user = serializer.save()
                user.is_employer = True
                user.save()
                
                company_info = Company_Info( employer = user, company_name= company_name, company_type= company_type)
                company_info.save()
                
                sendEmail = sendActivationEmail(user)
                
                if  sendEmail != True:
                    return Response({'error': {"detail":'Registration error email not send'}}, status=status.HTTP_201_CREATED)
                                
                return Response({'message': 'Employer created successfully check email for varification'}, status=status.HTTP_201_CREATED)
            else:
                errors = {}
                errors.update(serializer.errors)
                return Response(errors, status=status.HTTP_400_BAD_REQUEST)
   
class Job_Applicants(viewsets.GenericViewSet):
    serializer_class = EmployerApplicationSerializer
    queryset = EmployerApplication.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, jobslug, *args, **kwargs ):
        try:
            if not jobslug:
                return Response({'error': {"detail":"jobslug Error"}}, status=status.HTTP_400_BAD_REQUEST)

            queryset = self.queryset.filter(job_key__employer=request.user, job_key__slug = jobslug)

            response_data = []

            for application in queryset:
                try:
                                            
                    app_data = self.get_serializer(application).data

                    if len(app_data['seeker']['qualification_data']) > 0:
                        recent_education_level = max(app_data['seeker']['qualification_data'], key=lambda x: x['start_period'])
                        app_data['seeker']["qualification"] = recent_education_level["education_level"]

                    app_data['seeker']['seeker_name'] = f"{app_data['seeker']['user']['first_name']} {app_data['seeker']['user']['last_name']}"
                    app_data['seeker']['prescreen'] = application.prescreen
                    app_data['seeker']['status'] = application.status

                    app_data['seeker']['seeker_resume'] = f"/media/{application.resume}" if application.resume and application.resume else ""
                    
                    app_data['pre_screening'] = app_data.pop('prescreen','')
                    app_data["seeker_cv"] = app_data["resume"]
                    app_data['job_id'] = application.job_key.id
                    app_data['job_title'] = application.job_key.title
                    
                    response_data.append(app_data)
                except Exception as e:                    
                    print(e)
                    pass

            return Response(response_data)

        except Exception as e:
            
            return Response({'error': f'Unexpected error: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Applicants(viewsets.GenericViewSet):
    serializer_class = EmployerApplicationSerializer
    queryset = EmployerApplication.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        
        queryset = self.queryset.filter(job_key__employer=request.user)

        response_data = []

        for application in queryset:
            try:
                app_data = self.serializer_class(application).data

                if len(app_data['seeker']['qualification_data']) > 0:
                    recent_education_level = max(app_data['seeker']['qualification_data'], key=lambda x: x['start_period'])
                    app_data['seeker']["qualification"] = recent_education_level["education_level"]
                
                app_data['seeker']['seeker_name'] = f"{app_data['seeker']['user']['first_name']} {app_data['seeker']['user']['last_name']}"
                app_data['seeker']['status'] = application.status
                app_data['seeker']['seeker_resume'] = f"/media/{application.resume}" if application.resume and application.resume else ""
               
                app_data['pre_screening'] = app_data.pop('prescreen','')
                app_data["seeker_cv"] = app_data["resume"]

                app_data['job_id'] = application.job_key.id
                app_data['job_title'] = application.job_key.title
                
                response_data.append(app_data)
                
            except Exception as e:
                print(e)
                pass

        return Response(response_data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        app_data = self.get_serializer(instance).data

        try:
            if instance.job_key.employer != request.user:
                return Response({'error': {"detail":"Permission denied"}}, status=status.HTTP_403_FORBIDDEN)
            
            app_data['seeker']['seeker_name'] = f"{app_data['seeker']['user']['first_name']} {app_data['seeker']['user']['last_name']}"

            if len(app_data['seeker']['qualification_data']) > 0:
                recent_education_level = max(app_data['seeker']['qualification_data'], key=lambda x: x['start_period'])
                app_data['seeker']["qualification"] = recent_education_level["education_level"]
                
            app_data['pre_screening'] = app_data.pop('prescreen','')
            app_data["seeker_cv"] = app_data["resume"]

            app_data['job_id'] = instance.job_key.id
            app_data['job_title'] = instance.job_key.title
             
            return Response(app_data)
        except Exception as e:
            return Response({"error": {"detail":"Error reading application"}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()

            # Permission check
            if instance.job_key.employer != request.user:
                return Response({"error": {"detail": "Permission denied"}}, status=status.HTTP_403_FORBIDDEN)

            # Validation check
            allowed_fields = ['status']
            if not all(field in request.data for field in allowed_fields) or len(request.data) != len(allowed_fields):
                return Response({"error": {"detail": "Only 'status' is allowed to be updated"}}, status=status.HTTP_400_BAD_REQUEST)
            
            # Update the main object instance
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            # Update SeekerApplication instance
            try: 
                
                seeker_id, job_id, status = instance.seeker['user']['id'] , instance.job_key.id, request.data.get('status')
                
                seeker_instance = SeekerApplication.objects.filter(Q(seeker_key_id = seeker_id) & Q( job__id=job_id)).first()
                seeker_instance.status = status
                seeker_instance.save()
                
                # Sending Email to Seeker for Application Update
                job_data = JobsSerializer(instance.job_key).data
                seeker_data = UserSerializer(seeker_instance.seeker_key).data

                data = {'user':seeker_data,"job":job_data}
                
                send_update_email = sendAppRejectEmail(data) if status == "Reject" else (sendAppShortlistEmail(data) if status == "Shortlist" else "")
                
            except Exception as e:
                print("Error: ", e)
                
            return Response(serializer.data)

        except Exception as e:
            # Log the exception for debugging or monitoring
            print(f"Error during update: {e}")
            return Response({"error": {"detail": "An unexpected error occurred"}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['PUT'])
    def mark_app_viewed(self, request):
        
        try:
            job_id = self.request.query_params.get("id")
            instance = self.queryset.filter(id=job_id).first()
            
            seeker_id, job_id = instance.seeker['user']['id'] , instance.job_key.id
                    
            seeker_instance = SeekerApplication.objects.filter(Q(seeker_key_id = seeker_id) & Q( job__id=job_id)).first()
            
            if seeker_instance.status == "Pending":
                seeker_instance.status = "Viewed"
                seeker_instance.save()
                        
            return Response("Application Marked as Viewed",status=status.HTTP_200_OK)
        
        except Exception as e:
            print(e)
            return Response("Error occured while marking application as viewed",status=status.HTTP_400_BAD_REQUEST)
        
class ProfileView(viewsets.GenericViewSet):
    serializer_class = Employer_ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return User.objects.get(id=self.request.user.id)

    @action(detail=False, methods=['GET', 'PUT'])
    def profile(self, request):
        instance = self.get_object()

        if request.method == 'GET':
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        
        elif request.method == 'PUT':

            if instance != request.user:
                return Response({"error": {"detail":"Permission denied"}}, status=status.HTTP_403_FORBIDDEN)
            
            return validate_uploaded_image(request,'image',self.get_serializer,instance)

class PasswordChangeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        serializer = PasswordChangeSerializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not request.user.check_password(old_password):
                return Response({'error': {"detail":'Old password is incorrect'}}, status=status.HTTP_400_BAD_REQUEST)
                

            request.user.set_password(new_password)
            request.user.save()

            return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetView(APIView): # The Token will be Active for 1800 Seconds or 30Min and one try Only    

    def post(self, request, format=None):
        serializer = PasswordResetSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email'] # type: ignore

            try:
                user = User.objects.get(email=email, is_employer=True)
                print("user request reset: ", user)

            except User.DoesNotExist:
                return Response({'error': {"detail":'No user with this email address'}}, status=status.HTTP_400_BAD_REQUEST)

            # uid = urlsafe_base64_encode(force_bytes(user.pk))
            # token = default_token_generator.make_token(user)

            
            # reset_link = f"{settings.HOME_PAGE_URL}/employer/Reset-password/{uid}/{token}/"
            # print(reset_link)

            # email_subject = 'Password Reset Request'
            # email_message = render_to_string('emails/password_reset_email.html', {
            #     'user': user,
            #     'user_code': uid,
            #     'reset_token':token,
            #     'reset_link': reset_link,
            # })

            # # send_mail(email_subject, email_message, 's.209.kaj@outlook.com', [user.email])
            # email = EmailMessage(email_subject, email_message, settings.EMAIL_HOST_USER, [user.email])
            # email.fail_silently = True
            # email.content_subtype = "html"
            # email.send()
            
            sendEmail = sendPasswordReset(user)
            
            if  sendEmail != True:
                return Response({'error': {"detail":'Reset email failed to send'}}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'message':"reset email sent successfuly"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    
    def post(self, request, uidb64, token, format=None):

        try:

            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            # print("uid", uid, "--", "user", user)
            # print('Token Check: ', default_token_generator.check_token(user, token))

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
            
        if user is not None and default_token_generator.check_token(user, token):
            serializer = PasswordResetConfirmSerializer(data=request.data)

            if serializer.is_valid():
                new_password = serializer.validated_data['new_password']

                user.set_password(new_password)
                user.save()
                return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response({'error': {"detail":'Invalid token or user'}}, status=status.HTTP_400_BAD_REQUEST)

class DownloadResumesView(APIView):
    #permission_classes = [permissions.IsAuthenticated]
    queryset = EmployerApplication.objects.all()
    
    def get(self, request, *args, **kwargs):

        app_ids_str = request.query_params.get('ids')
        
        app_ids = ast.literal_eval(app_ids_str)
        
        if not app_ids:
            return Response({"error": {"detail": "No Application selected"}}, status=status.HTTP_400_BAD_REQUEST)
        
        #queryset = EmployerApplication.objects.filter(job_key__employer=request.user,id__in=app_ids)
        
            
        queryset = EmployerApplication.objects.filter(id__in=app_ids)
         
        if not queryset.exists():
            return render(request, '404-2.html', {})

        temp_dir = f'/tmp/resumes-{uuid.uuid4().hex[:5]}'
        os.makedirs(temp_dir, exist_ok=True)
        
        resume_files = []
        for app in queryset:
            if app.resume and app.resume:
                first_name = app.seeker.get("user", {}).get("first_name", "")
                last_name = app.seeker.get("user", {}).get("last_name", "")
                random_chars = uuid.uuid4().hex[:5]
                resume_file_name = f"{first_name}_{last_name}_{random_chars}_resume.pdf"
                new_resume_file_path = os.path.join(temp_dir, resume_file_name)
                
                try:
                    shutil.copy(app.resume.path, new_resume_file_path)
                    resume_files.append(new_resume_file_path)
                except Exception as e:
                    print("---------",e)
        
        if not resume_files:
            shutil.rmtree(temp_dir)
            return render(request, '404-2.html', {})
        
        if len(resume_files) == 1:  # If only one resume file, return it as a downloadable attachment
            resume_file_path = resume_files[0]
            with open(resume_file_path, 'rb') as resume_file:
                response = HttpResponse(resume_file.read(), content_type='application/pdf')
                response['Content-Disposition'] = 'attachment; filename="pandaresumes.pdf"'
            shutil.rmtree(temp_dir)  # Delete the temporary directory
            return response

        zip_file_path = os.path.join(temp_dir, 'resumes.zip')
        with zipfile.ZipFile(zip_file_path, 'w') as zipf:
            for resume_file in resume_files:
                zipf.write(resume_file, os.path.basename(resume_file))
                
        with open(zip_file_path, 'rb') as zip_file:
            response = HttpResponse(zip_file.read(), content_type='application/zip')
            response['Content-Disposition'] = 'attachment; filename="pandaresumes.zip"'
        
        os.remove(zip_file_path)
        shutil.rmtree(temp_dir)
        return response

# def download(request):
#     file_path = "employer\seeker_2_cv.pdf"
    
#     # Return the file as a response
#     return FileResponse(open(file_path, 'rb'), as_attachment=True)


class NotificationView(NotificationBase):
    pass










