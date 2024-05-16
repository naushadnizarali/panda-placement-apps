from django.urls import path, include
from . import views

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'', views.ProfileView, basename='profile')
router.register(r'seeker_information', views.Seeker_InfoView)
router.register(r'ssl_info', views.SSL_InfoView)
router.register(r'project', views.ProjectsView)
# router.register(r'employment_status', views.Employment_StatusView)
router.register(r'experience', views.ExperienceView)
router.register(r'qualification', views.QualificationView)
router.register(r'upload_resume', views.Upload_Resume)
router.register(r'applied_jobs', views.ApplicationView)
router.register(r'user_jobs', views.UserJobs)
router.register(r'get_userdata', views.UserDataView)
router.register(r'bookmarks', views.BookmarksView)
router.register(r'markjobviewed', views.CountJobViews)

urlpatterns = [

    path('', include(router.urls)),
    path('signin', views.SeekerSigninView.as_view()),
    path('signout', views.SeekerSignoutView.as_view()),
    
    path('notification/<int:pk>/mark_as_seen/', views.NotificationView.as_view({'post': 'mark_as_seen'}), name='mark_notification_as_seen'),
    path('notification/mark_all_as_seen/', views.NotificationView.as_view({'post': 'mark_all_as_seen'}), name='mark_all_notifications_as_seen'),
        
    path('saved-jobs',views.BookmarksView.as_view({'delete':'clear'}), name="saved-jobs"),
    # path('saved-jobs',views.BookmarksView.as_view({'delete','delete'}), name="saved-jobs"),

    path('password_change/', views.PasswordChangeView.as_view()),
    path('password_reset/', views.PasswordResetView.as_view()),
    path('Reset-password/<str:uidb64>/<str:token>', views.PasswordResetConfirmView.as_view(), name='Reset-password'),

    path('create_seeker', views.CreateSeekerView.as_view()),
    
    path('create_resume/template', views.Create_Resume.as_view()),
    path('resume', views.ViewResume.as_view()),
    path('user_jobs/<slug:slug>/',views.UserJobs.as_view({'get':'jobwithslug'}), name="user_jobs"),
    
    path('openresume/<int:pk>', views.OpenResume.as_view()),
    path('get_profile',views.Get_Profile.as_view(), name='get_profile'),
    
    path('get_resumetemplates/',views.ResumeTemplatesView.as_view(), name='get_resumetemplates'),
    
    #TEST URLS
    # path('get_userdata/',views.UserDataView.as_view(), name='get_userdata'),
    # path('make_seeker', views.MakeSeeker.as_view(), name="make_seeker"),
    path('password_reset_template/', views.passwordResetEmailTemplate),

]
