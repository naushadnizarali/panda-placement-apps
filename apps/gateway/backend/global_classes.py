
import json
import shutil
import uuid
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from employer.models import Company_Info, Jobs
from employer.serializer import Company_InfoSerializer, JobsSerializer, EmployerApplicationSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.tokens import default_token_generator
from pandaplacement import settings
from django.template.loader import render_to_string, get_template
from django.core.mail import send_mail, EmailMessage
from django.core.exceptions import ObjectDoesNotExist
import os
from backend.models import  Notification, User
from backend.serializer import  UserSerializer
from user.models import Bookmarks, Employment_Status, Experience, Projects, Qualification, SSL_Info, Seeker_Cv, Seeker_Info
from user.serializer import Employment_StatusSerializer, ExperienceSerializer, ProjectsSerializer, QualificationSerializer, SSL_InfoSerializer, Seeker_InfoSerializer, SeekerApplicationSerializer

class get_model_data:
    def __init__(self, model, serializer,filters):
        self.model = model
        self.serializer = serializer
        self.filters = filters
    
    def single(self):
        try:
            model_instance = self.model.objects.get(**self.filters)
            
            serialized_data = self.serializer(instance=model_instance).data
            
            return serialized_data
        except:
            return {}
    
    def multi(self):
        try:
            model_instance = self.model.objects.filter(**self.filters)
            serialized_data = self.serializer(instance=model_instance, many=True).data
            return serialized_data
        
        except Exception as e:
            print(e)
            return {}

class SeekerData:
    
    def __init__(self, userID):
        self.userID = userID
    
    def single(self,model, serializer, filters):
        try:
            model_instance = model.objects.get(**filters)
            serialized_data = serializer(instance=model_instance).data
            return serialized_data
        except model.DoesNotExist:
            return {}
    
    def multi(self, model, serializer, filters):
        try:
            model_instance = model.objects.filter(**filters)
            serialized_data = serializer(instance=model_instance, many=True).data
            return serialized_data
        
        except model.DoesNotExist:
            return {}
        
    def get_ssl_data(self, filters=None):
        if filters is None:
            filters = {'seeker': self.userID}
        return self.single(SSL_Info, SSL_InfoSerializer, filters)
    
    def get_user_data(self, filters=None):
        if filters is None:
            filters = {'id': self.userID}
        return self.single(User, UserSerializer, filters)
    
    def get_seeker_info_data(self, filters=None):
        if filters is None:
            filters = {'seeker': self.userID}
        return self.single(Seeker_Info, Seeker_InfoSerializer, filters)
    
    # def get_employement_data(self, filters=None):
    #     if filters is None:
    #         filters = {'seeker': self.userID}
    #     return self.single(Employment_Status, Employment_StatusSerializer, filters)

    def get_projects_data(self, filters=None):
        if filters is None:
            filters = {'seeker': self.userID}
        return self.multi(Projects, ProjectsSerializer, filters)

    def get_experience_data(self, filters=None):
        
        if filters is None:
            filters = {'seeker': self.userID}
        return self.multi(Experience, ExperienceSerializer, filters)

    def get_qualification_data(self, filters=None):
        if filters is None:
            filters = {'seeker': self.userID}
        return self.multi(Qualification, QualificationSerializer, filters)
    
    def get_all_data(self,filters=None):
        data = {
            "user" : self.get_user_data(),
            "seeker_info" : self.get_seeker_info_data(filters),
            "ssl" : self.get_ssl_data(filters),
            # "employement" :self.get_employement_data(filters),
            "projects" : self.get_projects_data(filters),
            "experience" : self.get_experience_data(filters),
            "qualification_data" : self.get_qualification_data(filters)
        }
        return data

def validate_uploaded_image(request, image_variable, self_serializer, instance):
        
    if image_variable in request.FILES:

        uploaded_file = request.FILES[image_variable]
        max_file_size = 2 * 1024 * 1024  # 2MB in bytes
        file_extension = os.path.splitext(uploaded_file.name)[-1].lower()
        
        if uploaded_file.size > max_file_size:
        
            return Response(
                {'error': {"detail":"File size exceeds the allowed limit (2MB)"}},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if file_extension in ['.jpeg', '.png', '.jpg']:

            serializer = self_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data)
        
        else:

            return Response(
                {'error': {"detail":"Image file fomat error - file should be only (.jpeg, .png, .jpg)"}},
                status=status.HTTP_400_BAD_REQUEST
            )

    else:

        data_copy = request.data.copy()

        if data_copy[image_variable] in ["true", True, "True"]:
            data_copy.pop(image_variable)
                    
        else:
            data_copy[image_variable] = None
        
        serializer = self_serializer(instance, data=data_copy, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)
    
def Jobs_list_View(queryset,serializer,userID=None):
    job_data = []

    bookmark_instance = Bookmarks.objects.filter(seeker=userID)
    
    for job in queryset:
        
        company = Company_Info.objects.get(employer=job.employer)

        job_serializer = serializer(instance=job).data
        
        if userID:
            is_bookmarked = bookmark_instance.filter(job_key=job.id).exists()
            
            if is_bookmarked:
                job_serializer['bookmark'] = True
            else:
                job_serializer['bookmark'] = False

        if job.hide_company:
            job_serializer["company"] = {
                "company_name": "Confidential Company",
                "company_type": "Confidential",
                "industry": "N-A",
                "address": "N-A",
                "city": "N-A",
                "website": "N-A",
                "ntn": "N-A",
                "employer_number": "N-A",
                "operating_since": 9999,
                "logo": "/media/company_logo/confidential.jpg",
                "phone": "N-A",
                "email": "N-A"
            }
        else:
            job_serializer["company"] = Company_InfoSerializer(company).data
            company_logo = job_serializer["company"]['logo']

            if company_logo == None or  os.path.exists(company_logo[1:]) is False:
                job_serializer["company"]['logo'] = "/media/company_logo/default.png"

        job_data.append(job_serializer)
    
    return Response(job_data)

def Jobs_single_View(instance, serializer):

    company = Company_Info.objects.get(
        employer=instance.employer)

    job_serializer = serializer(instance=instance).data

    if instance.hide_company:
        job_serializer["company"] = {
            "company_name": "Confidential Company",
            "company_type": "Confidential",
            "industry": "N-A",
            "address": "N-A",
            "city": "N-A",
            "website": "N-A",
            "ntn": "N-A",
            "employer_number": "N-A",
            "operating_since": 9999,
            "logo": "/media/company_logo/confidential.jpg",
            "phone": "N-A",
            "email": "N-A"
        }
    else:
        job_serializer["company"] = Company_InfoSerializer(company).data
        company_logo = job_serializer["company"]['logo']

        if company_logo == None or  os.path.exists(company_logo[1:]) is False:
            job_serializer["company"]['logo'] = "/media/company_logo/default.png"
    
    return job_serializer

def sendActivationEmail(user):
    try:
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        activation_link = f"{settings.DOMAIN}/register/acount_activation/{uid}/{token}/"

        email_subject = 'Employer Account Activation' if user.is_employer else ('Seeker Account Activation' if user.is_seeker else 'Account Activation')

        email_message = render_to_string('emails/account_activation_email.html', {
            'user': user,
            'activation_link': activation_link,
            'domain':settings.DOMAIN,
        })

        email = EmailMessage(email_subject, email_message, settings.EMAIL_HOST_USER, [user.email])
        email.fail_silently = True
        email.content_subtype = "html"
        email.send()
        return True
        
    except Exception as e:
        print(e)
        return e
    
def sendAppRejectEmail(data):
    try:

        job_link = f"{settings.DOMAIN}/job/{data['job']['slug']}/"

        email_subject = f'Application Unselected for {data["job"]["title"]}'

        email_message = render_to_string('emails/application_status_reject.html', {
            'user': data["user"],
            'job_link': job_link,
            'job_title': data["job"]["title"],
            'domain':settings.DOMAIN,
        })

        email = EmailMessage(email_subject, email_message, settings.EMAIL_HOST_USER, [data["user"]["email"]])
        email.fail_silently = True
        email.content_subtype = "html"
        email.send()
        return True
        
    except Exception as e:
        print(e)
        return False

def sendAppShortlistEmail(data):
    try:

        job_link = f"{settings.DOMAIN}/job/{data['job']['slug']}/"

        email_subject = f'Application Shorlisted for {data["job"]["title"]}'

        email_message = render_to_string('emails/application_status-shortlist.html', {
            'user': data["user"],
            'job_link': job_link,
            'job_title': data["job"]["title"],
            'domain':settings.DOMAIN,
        })

        email = EmailMessage(email_subject, email_message, settings.EMAIL_HOST_USER, [data["user"]["email"]])
        email.fail_silently = True
        email.content_subtype = "html"
        email.send()
        return True
        
    except Exception as e:
        print(e)
        return False
    
def sendPasswordReset(user):
    try:
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        
        role = "employer"  if user.is_employer else ('user' if user.is_seeker else 'unknown')

        reset_link = f"{settings.DOMAIN}/{role}/Reset-password/{uid}/{token}"
        print(reset_link)

        email_subject = f'Password Reset'
        email_message = render_to_string('emails/password_reset_email.html', {
            'user': user,
            'user_code': uid,
            'reset_token':token,
            'reset_link': reset_link,
            'domain':settings.DOMAIN,
        })

        # send_mail(email_subject, email_message, 's.209.kaj@outlook.com', [user.email])
        email = EmailMessage(email_subject, email_message, settings.EMAIL_HOST_USER, [user.email])
        email.fail_silently = True
        email.content_subtype = "html"
        email.send()
        return True
        
    except Exception as e:
        return e
    
class ApplicationSubmit:
    SUCCESS = 1
    FILE_NOT_FOUND_OS = 7
    FILE_NOT_FOUND_DB = 8
    ERROR = 0
    
    def __init__(self,userID ):
        self.userID = userID
        
    def isSizeBig(self, uploadFile, limit_size= 2 * 1024 * 1024 ):
        if uploadFile.size > limit_size:
            return True
        return False
    
    def copy_usercv_to_apps_folder(self,new_file_name):
        
        try:
            filePath = Seeker_Cv.objects.get(seeker=self.userID).file.path

        except:
            return self.FILE_NOT_FOUND_DB
        
        try: 

            if os.path.exists(filePath):
                inputFolder, file_name = os.path.split(filePath)

                new_folder_path1 = inputFolder.replace("seeker_cv", "employerapplication")
                outputDestination1 = os.path.join(new_folder_path1, new_file_name)

                new_folder_path2 = inputFolder.replace("seeker_cv", "seekerapplication")
                outputDestination2 = os.path.join(new_folder_path2, new_file_name)
                
                if os.path.exists(outputDestination1):
                    os.remove(outputDestination1)
                if os.path.exists(outputDestination2):
                    os.remove(outputDestination2)
                            
                shutil.copyfile(filePath, outputDestination1)
                shutil.copyfile(filePath, outputDestination2)
                
                return self.SUCCESS
                
            else:
                return self.FILE_NOT_FOUND_OS
            
        except:
            return self.ERROR
        
    def getUserData(self):
        return  SeekerData(self.userID).get_all_data()
        
    def getJobData(self, jobID):
        
        job = Jobs.objects.get(id = jobID)
        return JobsSerializer(instance = job).data
          
    def getCompanyData(self, jobID):
        
        job = Jobs.objects.get(id = jobID)
        if job.hide_company:
            company_data = {
                "id": 99999,
                "company_name": "Confidential Company",
                "company_type": "Confidential",
                "industry": "N-A",
                "address": "N-A",
                "city": "N-A",
                "website": "N-A",
                "ntn": "N-A",
                "employer_number": "N-A",
                "operating_since": 9999,
                "logo": "/media/company_logo/confidential.jpg",
                "phone": "N-A",
                "email": "N-A"
            }
            
        else:
            company = Company_Info.objects.get(employer = job.employer)
            company_data = Company_InfoSerializer(instance = company).data
             #if logo None or not exist send default
            if company_data.get("logo") == None or  os.path.exists(company_data.get("logo")[1:]) is not True: # type: ignore
                company_data["logo"] = "/media/company_logo/default.png" # type: ignore
        
        return company_data

    def createAppModelWithUpload(self, post_data):
        # print(post_data)
        
        job_app = EmployerApplicationSerializer(data=post_data)
        seeker_app = SeekerApplicationSerializer(data=post_data)

        if seeker_app.is_valid() and job_app.is_valid() :
            job_instance = job_app.save()
            seeker_instance = seeker_app.save()

            return self.SUCCESS
        
        return self.ERROR

    def createAppModelWithCopy(self, post_data):
        # print(post_data)

        post_data = removeDictField(post_data,'resume')
        unique_id = str(uuid.uuid4().hex)[:10]
        resume_file_name = f'app-{unique_id}.pdf'

        job_app = EmployerApplicationSerializer(data=post_data)
        seeker_app = SeekerApplicationSerializer(data=post_data)
        if seeker_app.is_valid() and job_app.is_valid():

            copy_resume = self.copy_usercv_to_apps_folder(resume_file_name)
            if copy_resume == 1:
                job_instance = job_app.save(resume=f'employerapplication/{resume_file_name}')
                seeker_instance = seeker_app.save(resume=f'seekerapplication/{resume_file_name}')

                return self.SUCCESS
            else:
                print(copy_resume)
            
        return self.ERROR


    def checkPostFields(self, postData):
        # Define the model fields
        if type(postData) != dict:
            postData = {key:value for key,value in postData.items()}
        print(postData)
        model_fields = ['prescreen', 'check', 'job']

        # Check if all required fields are present in the data
        missing_fields = [field for field in model_fields if field not in postData]
        if missing_fields:
            return {'status': 'error', 'errors': f'Missing fields: {", ".join(missing_fields)}'}

        error_message = {}

        # Custom validation for the 'check' field
        if not postData['check'] in ['True','False','true','false',False,True]:
            error_message['check'] = 'Field "check" must be a boolean'

        # Custom validation for the 'job' field
        try:
            job_id = int(postData['job'])
        except ValueError:
            error_message['job'] = 'Field "job" must be an integer'
        try:
            prescreen_data = json.loads(postData['prescreen'])
            if not isinstance(prescreen_data, list):
                raise ValueError('Prescreen must be a list')
        except (json.JSONDecodeError, ValueError) as e:
            error_message['prescreen'] = f'Error decoding "prescreen": {str(e)}'

        if error_message:
            print(error_message)
            return {'status': 'error', 'errors': error_message}
        else:
            print('--1--')
            return {'status': 'success'}

class FieldCheck:
    def __init__(self):
        self.progress = 0
        self.total = 0
        self.result = {}

    def fieldsPassOrFail(self, row):

        if len(row) == 0 or any(row[i] in ["null", "", "[]", None] for i in row):
            return False
        return True

    def singleRow(self, table, row, rate=10):
        tableData = {"aquire" : 0 ,"total" : rate}
        
        self.total += rate
        if self.fieldsPassOrFail(row):
            self.progress += rate
            tableData['aquire'] += rate
        self.result[table] = tableData
                  
    def multiRow(self, table, data, rate=10):

        tableData = {"aquire" : 0 , "total" : rate}
        self.total += rate
        
        if len(data) != 0 :
            if all(self.fieldsPassOrFail(row) for row in data):
                self.progress += rate
                tableData['aquire'] += rate
        
        self.result[table] = tableData

    def singleField(self, table, row, singleFieldRate=5):
        
        if len(row) != 0:
            row.pop("id")
            tableData = {"aquire" : 0 , "total" : singleFieldRate * len(row)}
            self.total += singleFieldRate * len(row)

            for field in row:
                if row[field] not in ["null", "", "[]", None] :
                    self.progress += singleFieldRate
                    tableData['aquire'] += singleFieldRate
            
            self.result[table] = tableData
            
        else:
            self.total += 15
            self.result[table] = {"aquire" : 0 , "total" : 15}
        
    def userRow(self, table,row):
        tableData = {"aquire" : 0 ,"total" : 15}
        self.total += 15
        image = row.pop("image")

        if image is not None:
            self.progress +=5
            tableData['aquire'] +=5

        if all(field != "image" and row[field] not in ["null", "", "[]", None]  for field in row):
            self.progress += 10
            tableData['aquire'] +=10
            
        self.result[table] = tableData                

    def getProgress(self):
        return self.progress

    def getTotal(self):
        return self.total
    
    def getResult(self):
        return self.result

def removeDictField(dicttt, field):
    if field in dicttt:
        dicttt.pop(field)
    return dicttt

class NotificationManager:
    @staticmethod
    def create(user, title, message='New Notification', is_seen=False, notification_type=None, action=None):
        try:

            notification = Notification.objects.create(
                user=user,
                title=title,
                message=message,
                is_seen=is_seen,
                notification_type=notification_type,
                action=action
            )
            return notification
        
        except Exception as e:
            raise e
    
    @staticmethod
    def mark_as_seen(notification_id):
        try:
            notification = Notification.objects.get(id=notification_id)
            notification.is_seen = True
            notification.save()

        except Exception as e:
            raise e

    @staticmethod
    def delete(notification_id):    
        try: 
            Notification.objects.filter(id=notification_id).delete()
        except Exception as e:
            raise e
        
           