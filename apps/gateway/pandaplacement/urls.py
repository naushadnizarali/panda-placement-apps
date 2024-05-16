from django.contrib import admin
from django.urls import path, include, re_path
# from schema_graph.views import Schema
from rest_framework.schemas import get_schema_view
from django.conf import settings
from django.conf.urls.static import static
from backend.views import ApplicationResume, index, MediafilesView, error_404, error_500
from django.conf.urls import handler404, handler500

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView, TokenVerifyView
)

view = get_schema_view(title="Example API")
handler404 = error_404
handler500 = error_500
# handler400 = ''

urlpatterns = [
    # path("schema/", Schema.as_view()),
    path('admin/', admin.site.urls),
    path('api/', include('backend.urls')),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('media/<str:foldername>/<str:filename>', MediafilesView.as_view(), name= "download_cv"),
    # path('user/resumetemplate/', ResumeTemplate, name= "resumetemplateview"),
    re_path(r'^.*$', index, name= "home-page"),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root = settings.STATIC_URL)

