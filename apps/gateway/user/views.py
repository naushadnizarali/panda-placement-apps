from datetime import timedelta, datetime
import time
from backend.views import NotificationBase
from rest_framework import status

import os
import json
from django.shortcuts import render
from django.http import FileResponse, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string, get_template
from django.contrib.auth.tokens import default_token_generator

from rest_framework.views import APIView
import rest_framework
from rest_framework.response import Response
from rest_framework import viewsets, permissions 
from rest_framework.generics import ListAPIView
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from backend.global_classes import ApplicationSubmit, FieldCheck, Jobs_list_View, Jobs_single_View, SeekerData, get_model_data, sendActivationEmail, sendPasswordReset
# from rest_framework_simplejwt.tokens import Token

from backend.models import User, ResumeTemplates
from backend.serializer import  UserSerializer
from employer.models import  Jobs
from employer.serializer import JobsSerializer
from employer.views import validate_uploaded_image
from pandaplacement import settings
from .models import  SSL_Info, Bookmarks, Seeker_Info,   Projects,  Employment_Status, Experience, Qualification, Seeker_Cv, SeekerApplication
from .serializer import  ResumeTemplatesViewSerializer, SSL_InfoSerializer, BookmarksSerializer, Seeker_InfoSerializer, ProjectsSerializer, Employment_StatusSerializer, ExperienceSerializer, QualificationSerializer, Seeker_CvSerializer, Seeker_ProfileSerializer, PasswordChangeSerializer, PasswordResetSerializer, PasswordResetConfirmSerializer, SeekerApplicationSerializer

import pdfkit

class SeekerSigninView(APIView):
    
    def post(self, request):

        email = request.data.get('email')
        password = request.data.get('password')
        remember_me = request.data.get('remember_me')
        print(request.data)
        
        if User.objects.filter(email=email, is_active=False).first():
            return Response({'error': {"detail":'Varify your account first'}}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(request, email=email, password=password)

        if user is not None:
            if user.is_seeker: # type: ignore
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
                    token = str(refresh.access_token) # type: ignore

                # print('refresh_token_expires_at: ',(refresh['exp']- timezone.now().timestamp()) / 3600)

                return Response({'message': 'Signed in successfully', 'token': token}, status=status.HTTP_200_OK)
            
            else:
                return Response({'error': {"detail":'You are not authorized to sign in as an Job Seeker'}}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'error': {"detail":'Invalid username or password'}}, status=status.HTTP_404_NOT_FOUND)

class MakeSeeker(APIView):
    def post(self, request):

        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, email=email, password=password)

        if user is not None:
            if user.is_employer and not user.is_seeker: # type: ignore
                user.is_seeker = True # type: ignore
                user.save()
                return Response({'message': 'Seeker Role Added to entered email'}, status=status.HTTP_201_CREATED )
            elif user.is_seeker: # type: ignore
                return Response({'message': 'The Provided email already has Seeker access'}, status=status.HTTP_200_OK )
            else:
                return Response({'error': {"detail":'User is not an employer'}}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': {"detail":'Invalid username or password'}}, status=status.HTTP_401_UNAUTHORIZED)

class ProfileView(viewsets.GenericViewSet):
    serializer_class = Seeker_ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return User.objects.get(id=self.request.user.id) # type: ignore

    @action(detail=False, methods=['GET', 'PUT'])
    def profile(self, request):
        instance = self.get_object()

        if request.method == 'GET':
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        
        elif request.method == 'PUT':
            
            if instance != request.user:
                return Response({'error': {"detail": "Permission denied"}}, status=status.HTTP_403_FORBIDDEN)

            return validate_uploaded_image(request,'image',self.get_serializer,instance)

    # @action(detail=False, methods=['GET'])
    # def profile(self, request):
        
    #     user_profile = self.queryset.get(id=request.user.id)

    #     serializer = self.get_serializer(user_profile)
        
    #     dic = serializer.data
    #     dic['header'] = request.headers
    #     return Response(dic)

    # @action(detail=False, methods=['PUT', 'PATCH'])
    # def update_profile(self, request):

    #     user_profile = self.queryset.get(id=request.user.id)
    #     serializer = self.get_serializer(user_profile, data=request.data, partial=True)
    #     serializer.is_valid(raise_exception=True)
    #     serializer.save()
    #     return Response(serializer.data)

class SeekerSignoutView(APIView):
    
    def get(self, request):
        
        logout(request)
        return Response({'message':f"Signed Our Successfuly"}, status=status.HTTP_200_OK)

class Create_Resume(APIView):

    serializer_class = Seeker_CvSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Seeker_Cv.objects.all()

    def get(self, request, *args, **kwargs):
        
        user = request.user
        temID = self.request.query_params.get('temID')
        seeker = SeekerData(user.id)
        seeker_data = seeker.get_all_data()
        seeker_data['domain']=settings.DOMAIN
        seeker_data['base_dir']=settings.BASE_DIR
        
        try:
            seeker_data['ssl']['skill'] = json.loads(seeker_data['ssl']['skill'])
        except:
            seeker_data['ssl']['skill'] = []
            
        try:
            seeker_data['ssl']['language'] = json.loads(seeker_data['ssl']['language'])
        except:
            seeker_data['ssl']['language'] = []
            
        seeker_data['id'] = user.id
        
        # template_path = 'resumetemplates/template-666.html'
        template_path = f'resumetemplates/template-{temID}.html'
        # return render(request,template_path,context)

        try:
            template = get_template(template_path)
        except Exception as e:
            print(e)
            return Response({'error': {"detail":"Selected Template doesnot exist"}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        print(seeker_data)
        html = template.render(seeker_data)
        
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'seeker_{user.id}_cv.pdf'

        #config = pdfkit.configuration(wkhtmltopdf = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe")
        config = pdfkit.configuration(wkhtmltopdf = "/usr/bin/wkhtmltopdf")
        
        options = {
            'page-size': 'Legal',
            'encoding': "UTF-8",
            'custom-header': [
                ('Accept-Encoding', 'gzip')
            ],
            'cookie': [],
            'no-outline': None,
            'margin-top':'0',
            'margin-bottom':'22',
            'margin-right':'0',
            'margin-left':'0',
            'enable-local-file-access': None,
            "--footer-html":r"templates\resumetemplates\footer.html",
            "--footer-line":True,
            "--footer-spacing":"1",
            # 'disable-smart-shrinking': None,
            # 'javascript-delay': 5000,
            
        }

        try:
            file_name = f"seeker_{user.id}_cv.pdf"
            file_path_os = os.path.join('media',"seeker_cv",file_name)
            cv_created = pdfkit.from_string(html, file_path_os, configuration=config, options=options)
            
            file_path_model = os.path.join("seeker_cv",file_name)
            user_cv, created = Seeker_Cv.objects.get_or_create(seeker=user)
            user_cv.file = file_path_model
            user_cv.save()

            return Response({"success":"Resume Created Successfully"}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            print(e)
            cv_created = None
            return Response({'error': {"detail":"Resume Creation Failed"}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class BaseModelViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.queryset.filter(seeker=request.user.id) # type: ignore
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

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

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.seeker != request.user:
            return Response({'error': {"detail":"Permission denied"}}, status=status.HTTP_403_FORBIDDEN)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class Seeker_InfoView(BaseModelViewSet):
    serializer_class = Seeker_InfoSerializer
    queryset = Seeker_Info.objects.all()

    def create(self, request, *args, **kwargs):
        info = Seeker_Info.objects.filter(seeker = request.user).first()
        print(request.data)

        if info:
            serializer = self.get_serializer(info, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(seeker=self.request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SSL_InfoView(BaseModelViewSet):
    serializer_class = SSL_InfoSerializer
    queryset = SSL_Info.objects.all()

    def create(self, request, *args, **kwargs):
        ssl = SSL_Info.objects.filter(seeker = request.user).first()
        print(request.data)

        if ssl:
            serializer = self.get_serializer(ssl, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)


        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(seeker=self.request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ProjectsView(BaseModelViewSet):
    serializer_class = ProjectsSerializer
    queryset = Projects.objects.all()

class ExperienceView(BaseModelViewSet):
    serializer_class = ExperienceSerializer
    queryset = Experience.objects.all()

class QualificationView(BaseModelViewSet):
    serializer_class = QualificationSerializer
    queryset = Qualification.objects.all()

class Upload_Resume(viewsets.GenericViewSet):
    serializer_class = Seeker_CvSerializer
    queryset = Seeker_Cv.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.queryset.filter(seeker=request.user.id)
        serializer = self.get_serializer(queryset, many=True)
        
        return Response(serializer.data)


    def create(self, request, *args, **kwargs):
        file = request.FILES.get('file')

        if not file:
            return Response({'error': {"detail": "No file provided."}}, status=status.HTTP_400_BAD_REQUEST)

        existing_cv = Seeker_Cv.objects.filter(seeker=request.user).first()

        if existing_cv:
            print(file.content_type)

            if not file.content_type == "application/pdf":
                return Response({'error': {"detail":"resume format should be only pdf."}}, status=status.HTTP_400_BAD_REQUEST)
            
            existing_cv.file.delete(save=False)
            existing_cv.file = file
            existing_cv.save()

            return Response(self.serializer_class(existing_cv).data, status=status.HTTP_200_OK)
        else:
            new_cv = Seeker_Cv(seeker=request.user, file=file)
            new_cv.save()

            return Response(self.serializer_class(new_cv).data, status=status.HTTP_201_CREATED)

class CreateSeekerView(APIView):

    serializer_class = UserSerializer

    def post(self, request):
        fname, lname = request.data.get('first_name'),request.data.get('last_name')

        email = request.data.get("email")

        try:
            existing_user = User.objects.get(email=email)
            if existing_user.is_active:

                if existing_user.is_seeker:
                    return Response({'error': {"detail":'Seeker with this email already exists'}}, status=status.HTTP_409_CONFLICT)
                if existing_user.is_employer:
                    return Response({'error': {"detail":'Email already registered as Employer'}}, status=status.HTTP_403_FORBIDDEN)
            
            else:
                return Response({'error': {"detail":'Email already registered but not varified'}}, status=status.HTTP_403_FORBIDDEN)
            
        except:
            print(request.data)

            serializer = self.serializer_class(data=request.data)

            if serializer.is_valid():
                user = serializer.save()
                user.is_seeker = True # type: ignore
                user.first_name = fname # type: ignore
                user.last_name = lname # type: ignore
                user.save() # type: ignore
                
                sendEmail = sendActivationEmail(user)
                
                if  sendEmail != True:
                    return Response({'error': {"detail":'Registration error email not send'}}, status=status.HTTP_400_BAD_REQUEST)

                return Response({'message': 'Seeker created successfully'}, status=status.HTTP_201_CREATED)
            
            else:
                errors = {}
                errors.update(serializer.errors)
                return Response(errors, status=status.HTTP_400_BAD_REQUEST)

class ViewResume(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        
        user = request.user

        try:
            cv = Seeker_Cv.objects.filter(seeker=user).first()
        except FileNotFoundError:
            return Response({'error': {'detail':'User has no resume'}}, status=status.HTTP_404_NOT_FOUND)

        try:
            if cv:
                file_path = os.path.join(settings.BASE_DIR,cv.file.path.replace("\\", "/"))
                print(file_path)

                if os.path.exists(file_path):
                    response = FileResponse(open(file_path,'rb'), content_type='application/pdf')
                    # response['Content-Type'] = 'application/pdf'
                    # response['Content-Disposition'] = f'attachment; filename="{cv.file.path}"'

                    return response
                else:
                    
                    return Response({'error': {"detail":"could not find file"},"file":file_path}, status=status.HTTP_400_BAD_REQUEST)
                    

            return Response({'error': {"detail":"File Without User"}}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({'error': {'detail':'Error occured while opening resume'}}, status=status.HTTP_404_NOT_FOUND)
            
class OpenResume(APIView):
    authentication_classes = []

    def get(self, request, pk):
        
        try:
            cv = Seeker_Cv.objects.filter(seeker__id=pk).first()
        except FileNotFoundError:
            return Response({'error': {'detail':'User has no resume'}}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            if cv:
                file_path = os.path.join(settings.BASE_DIR,cv.file.path.replace("\\", "/"))
                print(file_path)
                response = FileResponse(open(file_path,'rb'), content_type='application/pdf')
        
                return response

            return Response({'error': {"detail":"File Without User"}}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({'error': {'detail':'Error occured while opening resume'}}, status=status.HTTP_404_NOT_FOUND)
        
        # try:
        #     cv = f"seeker_cv/seeker_{pk}_cv.pdf"

        #     cv = Seeker_Cv.objects.filter(seeker=pk).first()
        #     print(cv.file.path)

        #     if cv.file.path  and os.path.exists(cv.file.path): # type: ignore
                
        #         response = FileResponse(open(cv.file.path,'rb'), content_type='application/pdf') # type: ignore
        #         # response['Content-Type'] = 'application/pdf'
        #         # response['Content-Disposition'] = f'attachment; filename="{cv.file.path}"'
                
        #         return response
            
        #     return Response({'error': {"detail":"File not found"}}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': {"detail":"File not found"}}, status=status.HTTP_404_NOT_FOUND)

class PasswordChangeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        serializer = PasswordChangeSerializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.validated_data['old_password'] # type: ignore
            new_password = serializer.validated_data['new_password'] # type: ignore

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
                user = User.objects.get(email=email, is_seeker=True)
            except User.DoesNotExist:
                return Response({'error': {"detail":'No user with this email address'}}, status=status.HTTP_400_BAD_REQUEST)
            
            sendEmail = sendPasswordReset(user)
            
            if sendEmail != True:
                return Response({'error': {"detail":'Reset email failed to send'}}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'message':"reset email sent successfuly"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def passwordResetEmailTemplate(request):
    return render(request,'emails/password_reset_email.html')

class PasswordResetConfirmView(APIView):
    
    def post(self, request, uidb64,token, format=None):

        try:

            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and default_token_generator.check_token(user, token):
            serializer = PasswordResetConfirmSerializer(data=request.data)

            if serializer.is_valid():
                new_password = serializer.validated_data['new_password'] # type: ignore

                user.set_password(new_password)
                user.save()
                return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response({'error': {"detail":'Invalid token or user'}}, status=status.HTTP_400_BAD_REQUEST)
        
class ApplicationView(viewsets.GenericViewSet):
    serializer_class = SeekerApplicationSerializer
    queryset = SeekerApplication.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        
        post_data = request.data.copy()
        uploaded_file = post_data.get('resume')
        jobID = int(post_data.get('job'))
        user = request.user
        check = post_data.get('check')
        max_file_size = 2 * 1024 * 1024  # 2MB in bytes
        post_data['seeker_status'] = True
        post_data['job_status'] = True
        
        existing_application = self.queryset.filter(job__id=jobID,seeker_key=user.id).first()
        
        if existing_application:
            return Response({'error': {"detail":f"Already Applied for the selected job"}}, status=status.HTTP_409_CONFLICT)
        
        application = ApplicationSubmit(user.id)
        input_validity = application.checkPostFields(post_data)

        if input_validity.get('status') == 'error':

            return Response({'error': {"detail":f"Invalid Input: {input_validity.get('errors')}"}}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            post_data["seeker"] = json.dumps(dict(application.getUserData()))
            post_data["job"] = json.dumps(dict(application.getJobData(jobID)))
            post_data["company"] = json.dumps(dict(application.getCompanyData(jobID)))
            post_data["seeker_key"] = user.id
            post_data["job_key"] = jobID
            
        except Exception as e:
            print(e)
            
            return Response({'error': {"detail":"Error Data Fectching"}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    
        if check in ['True','true',True]:
 
            try:
                if application.isSizeBig(uploaded_file, max_file_size ):
                    return Response(
                        {"error": "File size exceeds the allowed limit (2MB)"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if application.createAppModelWithUpload(post_data): # returns > add models return 1 else 0
                    
                    return Response({"detail":"Application Submitted Successfully"}, status=status.HTTP_201_CREATED)

                else:
                    return Response({"detail":"Application Submition failed"}, status=status.HTTP_400_BAD_REQUEST)
                
            except Exception as e:
                
                return Response({'error': {"detail":"Application submition failed - entered data not valid"}}, status=status.HTTP_400_BAD_REQUEST)

        else: 

            try:
                
                if application.createAppModelWithCopy(post_data): # returns > copyFile to app|seekerapplication > add models return 1 else 0

                    return Response({"detail":"Application Submitted Successfully"}, status=status.HTTP_201_CREATED)

                else:
                    return Response({'error': {"detail":"Application Submition failed user resume error"}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            except:
                return Response({'error': {"detail":"Application submition failed - entered data not valid"}}, status=status.HTTP_400_BAD_REQUEST)
    
    def list(self, request, *args, **kwargs):
        queryset = self.queryset.filter(seeker_key=request.user.id)
        bookmark_instance = Bookmarks.objects.filter(seeker=request.user)
        
        response_data = []

        for application in queryset:

            app_data = SeekerApplicationSerializer(application).data
                          
            is_bookmarked = bookmark_instance.filter(job_key=app_data['job']['id']).exists()
            if is_bookmarked:
                app_data['job']['bookmark'] = True
            else:
                app_data['job']['bookmark'] = False
                
            app_data['job']['application_status'] = application.status
            additional_data = {
                'job_title' : app_data['job']['title'], 
                'job_id' : app_data['job']['id'],
                'status' : application.status
            }
            
            result = {**app_data,**additional_data}
            response_data.append(result)

        return Response(response_data)

    def retrieve(self, request, *args, **kwargs):
        application = self.get_object()
 
        if application.seeker_key != request.user:
            return Response({'error': {"detail":"Permission denied"}}, status=status.HTTP_403_FORBIDDEN)
        try:
            app_data = self.serializer_class(application).data
            
            app_data['job']['application_status'] = application.status
            additional_data = {
                'job_title' : app_data['job']['title'], 
                'job_id' : app_data['job']['id'],
                'status' : application.status
            }
            
            result = {**app_data,**additional_data}

            return Response(result)
        except:
            return Response({'error': {"detail":"Application output error"}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class Get_Profile(APIView):
    
    serializer_class = Seeker_CvSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # seeker = SeekerData(user.id)
        # context = seeker.get_all_data()

        context = {
            "userInfo" : UserSerializer(instance=user).data,
            'seeker_info' : get_model_data(Seeker_Info,Seeker_InfoSerializer,{'seeker':user}).single(),
            'ssl_info' : get_model_data(SSL_Info,SSL_InfoSerializer,{'seeker':user}).single(),
            # 'employment_status' : get_model_data(Employment_Status,Employment_StatusSerializer,{'seeker':user}).single(),
            'projects' : get_model_data(Projects,ProjectsSerializer,{'seeker':user}).multi(),
            'experience' : get_model_data(Experience,ExperienceSerializer,{'seeker':user}).multi(),
            'qualification' : get_model_data(Qualification,QualificationSerializer,{'seeker':user}).multi(),
            'resume':get_model_data(Seeker_Cv, Seeker_CvSerializer,{'seeker':user}).single(),
        }
    
        return Response(context)

class UserJobs(viewsets.GenericViewSet):
    serializer_class = JobsSerializer
    queryset = Jobs.objects.all()
    def list(self, request, *args, **kwargs):
        queryset = self.queryset.filter(status="Approved", phase="Open")
        
        applied_jobs = SeekerApplication.objects.filter(seeker_key = request.user)
        
        applied_job_ids = []
        
        for applied in applied_jobs:
            applied_job_ids.append(applied.job['id'])

        unapplied_jobs = []
        
        for job in queryset:
            
            if job.id not in applied_job_ids: # type: ignore
                unapplied_jobs.append(job)
                
        return Jobs_list_View(unapplied_jobs, self.serializer_class, request.user.id)
         
    
    def retrieve(self, request, *args, **kwargs):

        slug = kwargs.get("pk")
        instance = self.queryset.filter(slug=slug).first()
        
        if instance:
            result = Jobs_single_View(instance, self.serializer_class)
            
            if Bookmarks.objects.filter(job__id=instance.id):
                result['bookmark'] = True
                
            return Response(result, status=status.HTTP_200_OK)

        else:
            return Response("no Job found", status=status.HTTP_404_NOT_FOUND)

        
class UserDataView(viewsets.GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        
        try:
                        
            user = self.queryset.get(email=request.user) #15 points
            instance = self.get_serializer(instance=user).data
            
            ssl_info = get_model_data(SSL_Info,SSL_InfoSerializer, {'seeker':user}).single() #15 points
            # print("ssl_info", ssl_info)
            seeker_info = get_model_data(Seeker_Info,Seeker_InfoSerializer, {'seeker':user}).single() #10 points
            # print("seeker_info", seeker_info)
            # employment_status = get_model_data(Employment_Status,Employment_StatusSerializer, {'seeker':user}).single() #10 points
            # print("employment_status", employment_status)
            projects = get_model_data(Projects,ProjectsSerializer, {'seeker':user}).multi() #10 points
            # print("projects", projects)
            experience = get_model_data(Experience,ExperienceSerializer, {'seeker':user}).multi() #10 points
            # print("experience", experience)
            qualification = get_model_data(Qualification,QualificationSerializer, {'seeker':user}).multi() #10 points
            # print("qualification", qualification)
            
            if experience:
                for exp in experience:
                    if exp['currently_working']:
                        exp.pop('period_to')
                    else:
                        exp.pop('currently_working')

            if qualification:
                for exp in qualification:
                    if exp['currently_enrolled']:
                        exp.pop('complete_period')
                    else:
                        exp.pop('currently_enrolled')
            
            progress = FieldCheck()
            progress.userRow("RegisterData",instance) #15
            progress.singleField("ssl",ssl_info, 5) #15
            progress.singleRow("seeker_info", seeker_info, 20)
            # progress.singleRow("employment_status", employment_status, 10)
            progress.multiRow("projects", projects, 15)
            progress.multiRow("experience", experience, 15)
            progress.multiRow("qualification", qualification, 20)
            
            data = {"total": progress.getTotal(), "progress":progress.getProgress(), "progressResult":progress.getResult()}
        
        
            return Response(data,status=status.HTTP_200_OK)
        
        except Exception as e:
            print(e)
            return Response({"error":{"detail":"Failed to Calculate the progress result"}}, status=status.HTTP_404_NOT_FOUND)
            
# class ResumeTemplatesView(viewsets.ModelViewSet):
#     permission_classes = [permissions.IsAuthenticated]

#     def list(self, request, *args, **kwargs):
        
#         queryset = self.queryset.filter(seeker=request.user.id) # type: ignore
#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)    
        
class BookmarksView(viewsets.ModelViewSet):
    serializer_class = BookmarksSerializer
    queryset = Bookmarks.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        
        data = request.data.copy()
        jobID = data.get('job_key')
        
        job_instance = Jobs.objects.filter(id=jobID).first()

        if job_instance:
            if self.queryset.filter(seeker=request.user, job_key=jobID).exists():
                return Response({'conflict': {'detail': "job already saved"}}, status=status.HTTP_409_CONFLICT)

            jobData = Jobs_single_View(job_instance, JobsSerializer)
                
            data['job'] = jobData
            
            serializer = self.get_serializer(data = data)
            serializer.is_valid(raise_exception=True)
            serializer.save(seeker=self.request.user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'error':{'detail':"job not found"}}, status=status.HTTP_400_BAD_REQUEST)
    
    def list(self, request, *args, **kwargs):
        queryset = self.queryset.filter(seeker=request.user)       
        serializer = self.get_serializer(queryset, many=True)
        
        for obj in serializer.data:
            obj['bookmark'] = True
    
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.seeker != request.user:
            return Response({'error': {"detail":"Permission denied"}}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(instance).data
        serializer['bookmark'] = True
        return Response(serializer)

    @action(detail=False, methods=['delete'])
    def delete(self, request, *args, **kwargs):
        jobID = request.data.get('job_key')

        instance = self.queryset.filter(seeker=request.user.id, job_key=jobID).first()
        
        if not instance:
            return Response({'conflict': {'detail': "job not saved"}}, status=status.HTTP_409_CONFLICT)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # @action(detail=False, methods=['delete'])
    # def clear(self,request):
        
    #     queryset = self.get_queryset().filter(seeker=request.user)
    #     queryset.delete()
    #     return Response({"message": "contents deleted"}, status=status.HTTP_204_NO_CONTENT)
    
class NotificationView(NotificationBase):
    pass
    
class ResumeTemplatesView(ListAPIView):
    serializer_class = ResumeTemplatesViewSerializer
    queryset = ResumeTemplates.objects.all()
    
class CountJobViews(viewsets.GenericViewSet):
    serializer_class = JobsSerializer
    queryset = Jobs.objects.all()
    
    def retrieve(self, request, *args, **kwargs):

        slug = kwargs.get("pk")
        instance = self.queryset.filter(slug=slug).first()
        
        if instance:
            instance.viewcount += 1
            instance.save()
            
            return Response("Job Viewed", status=status.HTTP_200_OK)
        else:
            return Response("no Job found", status=status.HTTP_404_NOT_FOUND)
