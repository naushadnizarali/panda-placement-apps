
from django.urls import path, include
from . import views

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'', views.ProfileView,basename='profile')
router.register(r'todos', views.TodosView)
router.register(r'notes', views.NotesView)
router.register(r'jobs', views.JobsView)
router.register(r'pending_jobs', views.PendingJobsView)
router.register(r'employers', views.EmployerView)
router.register(r'seekers', views.SeekerView)
# router.register(r'applications', views.ApplicationsView)

urlpatterns = [

    path('', include(router.urls)),

    path('todos/clear',views.TodosView.as_view({'delete','clear'}), name="manager_todos_clear"),
    path('notes/clear',views.NotesView.as_view({'delete','clear'}), name="manager_notes_clear"),
    
    path('statistics',views.Statistics.as_view(), name="statistics"),

    path('signin', views.SigninView.as_view()),
    path('signout', views.SignoutView.as_view()),

    path('password_change/', views.PasswordChangeView.as_view()),
    path('password_reset/', views.PasswordResetView.as_view()),
    path('password_reset/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    
    path('create_manager', views.CreateManagerView.as_view()),

]


# {
#     "api/manager/profile",
#     "api/manager/todos",
#     "api/manager/todos/clear",
#     "api/manager/notes",
#     "api/manager/notes/clear",
#     "api/manager/jobs",
#     "api/manager/employers",
#     "api/manager/seekers",
#     "api/manager/applications",
#     "api/manager/signin",
#     "api/manager/signout",
#     "api/manager/password_change/",
#     "api/manager/password_reset/",
#     "api/manager/password_reset/<uidb64>/<token>/",
  
# }