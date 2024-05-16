from django.contrib import admin
from django.urls import path, include
from django.contrib.staticfiles.urls import static # type: ignore
from django.conf import settings
from . import views
from rest_framework import routers
from django.views.generic import TemplateView

router = routers.DefaultRouter()
# router.register('get_countries', views.Get_Countries)
router.register('settings', views.UserSettingsView)
router.register('guest_jobs', views.GuestJobs)

# router.register('get_blogs', views.BlogView)
# router.register('get_state/<id:countryID>', views.Get_State)
# router.register('get_city', views.Get_City)

urlpatterns = [
    path('', include(router.urls)),
    path('user/', include('user.urls')),
    path('employer/', include('employer.urls')),
    path('manager/', include('manager.urls')),
    
    path('related_job/<str:search_term>',views.Related_Jobs.as_view(), name="related_job"),
    
    path('contactus/', views.ContactUsView.as_view(), name= "contactus"),
    path('viewtemplate/<str:id>', views.viewTemplates, name= "viewtemplate"),
    
    path('acount_activation/<uidb64>/<token>/', views.AccountActivation.as_view(), name="account_activation"),
    path('resent_activation_code/', views.ResentAccountActivation.as_view(), name="resent_account_activation"),
    
    path('get_countries/', views.Get_Countries.as_view(), name= "get_countries"),
    path('get_states/<int:countryID>', views.Get_State.as_view(), name= "get_state"),
    path('get_cities/', views.Get_City.as_view(), name= "get_city"),
    
    path('get_blogs/', views.BlogView.as_view(), name="get_blogs"),
    path('post_blogs/', views.BlogCreate.as_view(), name="post_blogs"),
    
    path('subscribe/', views.SubscribersView.as_view(), name= "subscribe"),
    
    #TEST URLS
    path('testpage/', views.TestPage, name= "contactus"),
    # view-user-resume/?template=69&user=99
    path('view-user-resume/', views.viewResumeWithTemplate, name= "view-user-resume"),
    
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)