from datetime import timedelta
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from backend.models import User
from employer.serializer import Company_InfoSerializer
from employer.views import validate_uploaded_image
from pandaplacement import settings
from .models import ManagerTodo_List, ManagerNotes_List
from employer.models import Company_Info, Jobs
from .serializer import  ManagerTodo_ListSerializer, ManagerNotes_ListSerializer, Manager_JobsSerializer, Manager_UserSerializer, Manager_ProfileSerializer, PasswordChangeSerializer, PasswordResetSerializer, PasswordResetConfirmSerializer
from backend.serializer import UserSerializer

from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from django.core.mail import send_mail

def index(request):
    return HttpResponse("this is manager dashboard")

def manager_authenticate(user,instance):
    return (
        not user.is_manager or
        (instance.employer.country != user.country and user.is_manager)
    )

class SigninView(APIView):
    
    def post(self, request):

        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, email=email, password=password)

        if user is not None:

            if user.is_manager:
                login(request, user)

                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                return Response({'message': 'Signed in successfully', 'token': access_token}, status=status.HTTP_200_OK)
            else:
                return Response({'error': {"detail":'Unauthorized'}}, status=status.HTTP_403_FORBIDDEN)
                
        else:
            return Response({'error': {"detail":'Invalid email or password'}}, status=status.HTTP_404_NOT_FOUND)
        
class SignoutView(APIView):
    
    def get(self, request):
        
        logout(request)
        return Response({'message':f"Signed Our Successfuly"}, status=status.HTTP_200_OK)

class InternalViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.queryset.filter(manager=request.user.id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(manager = self.request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.manager != request.user:
            return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.manager != request.user:
            return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.manager != request.user:
            return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PendingJobsView(viewsets.ModelViewSet):
    serializer_class = Manager_JobsSerializer
    queryset = Jobs.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.queryset.filter(employer__country = request.user.country,status='Pending')

        if not request.user.is_manager:
            return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(queryset, many=True).data
        result = []

        for job in serializer:
            
            # print(job['employer'])
            employer = User.objects.get(id=job['employer'])
            # print(employer)
            job['employer'] = UserSerializer(employer).data
            result.append(job)

        return Response(serializer)

    def retrieve(self, request, *args, **kwargs):

        instance = self.get_object()
        if manager_authenticate(request.user, instance):
            return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        if manager_authenticate(request.user, instance):
            return Response({'error':{"error":{"error":{"detail": "Permission denied"}}}}, status=status.HTTP_403_FORBIDDEN)

        copy_data = request.data.copy()
        
        if copy_data['status'] not in ['Approved','Pending','Expire','Reject']:
            return Response({'error':{"detail": "Status Not Accepted"}}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance, data=copy_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if manager_authenticate(request.user, instance):
            return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)

        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# class FilterApplicationByJobView(viewsets.ModelViewSet):
#     permission_classes = [permissions.IsAuthenticated]

#     def list(self, request, *args, **kwargs):

#         queryset = self.queryset.filter(job__hiring_country = request.user.country)

#         if not request.user.is_manager:
#             return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)

#     def create(self, request, *args, **kwargs):

#         if not request.user.is_manager:
#             return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
        
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()

#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     def retrieve(self, request, *args, **kwargs):

#         instance = self.get_object()

#         if manager_authenticate(request.user, instance):
#             return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
#         serializer = self.get_serializer(instance)
#         return Response(serializer.data)

#     def update(self, request, *args, **kwargs):
#         instance = self.get_object()
#         if manager_authenticate(request.user, instance):
#             return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
#         serializer = self.get_serializer(instance, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)

#     def destroy(self, request, *args, **kwargs):
#         instance = self.get_object()
#         if manager_authenticate(request.user, instance):
#             return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
#         instance.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

class FilterByUserView(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.queryset.filter(country = request.user.country)

        if not request.user.is_manager:
            return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):

        if not request.user.is_manager:
            return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):

        instance = self.get_object()

        if not request.user.is_manager or (instance.country != request.user.country and request.user.is_manager):
            return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):

        instance = self.get_object()

        if not request.user.is_manager or (instance.country != request.user.country and request.user.is_manager):
            return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):

        instance = self.get_object()

        if not request.user.is_manager or (instance.country != request.user.country and request.user.is_manager):
            return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class TodosView(InternalViewSet):
    serializer_class = ManagerTodo_ListSerializer
    queryset = ManagerTodo_List.objects.all()

    @action(detail=False, methods=['delete'])
    def clear(self,request):
        queryset = self.get_queryset().filter(manager=request.user)
        queryset.delete()
        return Response({"message": "contents deleted"}, status=status.HTTP_204_NO_CONTENT)

class NotesView(InternalViewSet):
    serializer_class = ManagerNotes_ListSerializer
    queryset = ManagerNotes_List.objects.all()

    @action(detail=False, methods=['delete'])
    def clear(self,request):
        queryset = self.get_queryset().filter(manager=request.user)
        queryset.delete()
        return Response({"message": "contents deleted"}, status=status.HTTP_204_NO_CONTENT)

class CreateManagerView(APIView):

    serializer_class = UserSerializer

    def post(self, request):
        
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            user.is_manager = True
            user.save()

            return Response({'message': 'Manager created successfully'}, status=status.HTTP_201_CREATED)
        else:
            errors = {}
            errors.update(serializer.errors)
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

class JobsView(viewsets.ModelViewSet):
    serializer_class = Manager_JobsSerializer
    queryset = Jobs.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.queryset.filter(employer__country = request.user.country)

        if not request.user.is_manager:
            return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(queryset, many=True).data
        result = []

        for job in serializer:
            employer = job['employer']
            job['employer'] = UserSerializer(User.objects.get(id=employer)).data
            job['company'] = Company_InfoSerializer(Company_Info.objects.get(employer=employer)).data

            result.append(job)

        return Response(result)

    def create(self, request, *args, **kwargs):

        if not request.user.is_manager:
            return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            employer = User.objects.get(email=request.data['employer'], is_employer=True)

        except:
            return Response({"error":{"error":{"detail": "employer email not registered"}}}, status=status.HTTP_403_FORBIDDEN)

        data_copy = request.data.copy()
        data_copy['employer'] = employer.id

        
        serializer = self.get_serializer(data=data_copy)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):

        instance = self.get_object()

        if manager_authenticate(request.user,instance):
            return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(instance).data

        employer = serializer['employer']
        serializer['employer'] = UserSerializer(User.objects.get(id=employer)).data
        serializer['company'] = Company_InfoSerializer(Company_Info.objects.get(employer=employer)).data

        return Response(serializer)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if manager_authenticate(request.user,instance):
            return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            employer = User.objects.get(email=request.data['employer'], is_employer=True)

        except:
            return Response({"error":{"error":{"detail": "employer email not registered"}}}, status=status.HTTP_403_FORBIDDEN)

        data_copy = request.data.copy()
        data_copy['employer'] = employer.id
        
        serializer = self.get_serializer(instance, data=data_copy, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if manager_authenticate(request.user,instance):
            return Response({"error":{"error":{"detail": "Permission denied"}}}, status=status.HTTP_403_FORBIDDEN)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class EmployerView(FilterByUserView):
    serializer_class = Manager_UserSerializer
    queryset = User.objects.filter(is_employer=True)

class SeekerView(FilterByUserView):
    serializer_class = Manager_UserSerializer
    queryset = User.objects.filter(is_seeker=True)

# class ApplicationsView(FilterApplicationByJobView):
#     serializer_class = ApplicationSerializer
#     queryset = Application.objects.all()

class ProfileView(viewsets.GenericViewSet):
    serializer_class = Manager_ProfileSerializer
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
                return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

            request.user.set_password(new_password)
            request.user.save()

            return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetView(APIView): # The Token will be Active for 1800 Seconds or 30Min and one try Only
    def post(self, request, format=None):
        serializer = PasswordResetSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'error': 'No user with this email address'}, status=status.HTTP_400_BAD_REQUEST)

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            reset_link = f"{settings.DOMAIN}/emails/password_reset/{uid}/{token}/"
            print(reset_link)

            email_subject = 'Password Reset Request'
            email_message = render_to_string('emails/password_reset_email.html', {
                'user': user,
                'reset_link': reset_link,
                'domain': settings.DOMAIN,
            })

            # send_mail(email_subject, email_message, 's.209.kaj@outlook.com', [user.email])
            # return render(request,'emails/password_reset_email.html')

            return Response({'message': f'Password reset link:{reset_link}'}, status=status.HTTP_200_OK)
            return Response({'message': 'Password reset link sent to your email'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PasswordResetConfirmView(APIView):
        
    def post(self, request, uidb64, token, format=None):

        try:

            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            print("uid", uid, "--", "user", user)
            print('Token Check: ', default_token_generator.check_token(user, token))

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
            return Response({'error': 'Invalid token or user'}, status=status.HTTP_400_BAD_REQUEST)

class Statistics(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        manager_country = request.user.country
        jobs = Jobs.objects.filter(employer__country = manager_country).count()
        employer = User.objects.filter(country =  manager_country,is_employer=True).count()        
        seeker = User.objects.filter(country =  manager_country,is_seeker=True).count()        
        application = Application.objects.filter(job__employer__country= manager_country).count()        

        response_data = {
            "jobs":jobs,
            "employers":employer,
            "seekers":seeker,
            "applications":application
            }
        
        
        return Response(response_data)








