
from django.urls import path, include
from . import views

from rest_framework import routers

router = routers.DefaultRouter()
# router.register(r'', views.index)
router.register(r'', views.ProfileView, basename='profile')
router.register(r'company_info', views.CompanyInfoView)
router.register(r'todos', views.Todo_ListView)
router.register(r'notes', views.Notes_ListView)
router.register(r'jobs', views.JobsView)
router.register(r'application', views.Applicants)
router.register(r'job_review', views.Job_ReviewsView)
router.register(r'notification', views.NotificationView)
# router.register(r'job_applicants', views.Job_ReviewsView)

urlpatterns = [
    path('', include(router.urls)),
    
    path('notification/<int:pk>/mark_as_seen/', views.NotificationView.as_view({'post': 'mark_as_seen'}), name='mark_notification_as_seen'),
    path('notification/mark_all_as_seen/', views.NotificationView.as_view({'post': 'mark_all_as_seen'}), name='mark_all_notifications_as_seen'),
    
    path('todos/clear',views.Todo_ListView.as_view({'delete','clear'}), name="todos_clear"),
    path('notes/clear',views.Notes_ListView.as_view({'delete','clear'}), name="notes_clear"),
    path('jobs/clearSelected/', views.JobsView.as_view({'delete': 'clearSelected'}), name="clearSelected"),

    path('job_applicants/<str:jobslug>/',views.Job_Applicants.as_view({"get":"list"}), name="job_applicants"),
    
    path('applicationviewed/',views.Applicants.as_view({"put":"mark_app_viewed"}), name="application_viewed"),
    
    path('jobs/<slug:slug>/',views.JobsView.as_view({'get':'jobwithslug'}), name="jobs"),
    path('downloadresumes', views.DownloadResumesView.as_view(), name="downloadresumes"),

    path('create_employer', views.CreateEmployerView.as_view(), name="create_employer"),

    path('signin', views.SigninView.as_view(), name="employer_signin"),
    path('signout', views.SignoutView.as_view(), name="employer_signout"),
    # path('download', views.download),

    path('password_change/', views.PasswordChangeView.as_view()),
    path('password_reset/', views.PasswordResetView.as_view()),
    path('Reset-password/<uidb64>/<token>', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    
]

