from datetime import timedelta
from pathlib import Path
import os

from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("SECRET_KEY")

DEBUG = False

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "192.168.0.106",
    "pandaplacement.com",
    ".vercel.app",
    "hakimahmadi.pythonanywhere.com",
    "45.133.178.97",
]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "whitenoise.runserver_nostatic",  # For deployment
    "rest_framework",
    "rest_framework.authtoken",
    "backend",
    "employer",
    "user",
    "manager",
    "django_extensions",
    "rest_framework_simplejwt",
    "django_celery_results",
    "django_celery_beat",
    # 'schema_graph',
]

SIMPLE_JWT = {
    "REFRESH_TOKEN_LIFETIME": timedelta(days=15),
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=12),
}

CACHE_MIDDLEWARE_SECONDS = 0

MIDDLEWARE = [
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

ROOT_URLCONF = "pandaplacement.urls"

SESSION_ENGINE = "django.contrib.sessions.backends.db"

SESSION_COOKIE_NAME = "sessionid1"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            os.path.join(BASE_DIR, "static/build"),
            os.path.join(BASE_DIR, "templates"),
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "pandaplacement.wsgi.application"

print(os.environ.get("DB_ENGINE"))
print(os.environ.get("DB_NAME"))
print(os.environ.get("DB_USER"))
print(os.environ.get("DB_PASSWORD"))
print(os.environ.get("DB_HOST"))
print(os.environ.get("DB_PORT"))


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
    # 'default': {
    #     'ENGINE': 'django.db.backends.mysql', # 'django_db_connection_pool',  # or 'django.db.backends.postgresql'
    #     'NAME': 'pandaplacement',
    #     'USER': 'kaj',
    #     'PASSWORD': 'Un*pnDa!P16?',
    #     'HOST': 'mysql-pandaplacement.cpssgu5mfojt.us-east-2.rds.amazonaws.com',
    #     'PORT': '3306',  # or '5432' for PostgreSQL
    # }
    # "default": {
    #     "ENGINE": "django.db.backends.mysql",  # os.environ.get("DB_ENGINE"),
    #     "NAME": os.environ.get("DB_NAME"),
    #     "USER": os.environ.get("DB_USER"),
    #     "PASSWORD": os.environ.get("DB_PASSWORD"),
    #     "HOST": os.environ.get("DB_HOST"),
    #     "PORT": os.environ.get("DB_PORT"),
    # }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")  # Production Root

STATICFILES_DIRS = [
    BASE_DIR / "static",
    BASE_DIR / "static/build",
]  # Development Root

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "backend.User"

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        # 'rest_framework.authentication.SessionAuthentication',
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.BasicAuthentication",
        # 'rest_framework.authentication.TokenAuthentication',
    ),
    # 'DEFAULT_PERMISSION_CLASSES': (
    #     'rest_framework_simplejwt.authentication.JWTAuthentication',
    # ),
    # 'DEFAULT_RENDERER_CLASSES': [
    #     'rest_framework.renderers.JSONRenderer',
    # ],
}

DEFAULT_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"
# DATA_UPLOAD_MAX_MEMORY_SIZE = 2 * 1024 * 1024  #2MB

PASSWORD_RESET_TIMEOUT = 900  # 900 seconds = 15 minutes
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

# Outlook SMPT
EMAIL_HOST = os.environ.get("MAIL_HOST")
EMAIL_PORT = os.environ.get("MAIL_PORT")
EMAIL_USE_TLS = os.environ.get("MAIL_USE_TLS")
EMAIL_HOST_USER = os.environ.get("MAIL_EMAIL")
EMAIL_HOST_PASSWORD = os.environ.get("MAIL_PASSWORD")

DEFAULT_FROM_EMAIL = "your_gmail@gmail.com"

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https?://.*$",
]

CORS_ALLOWED_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True  # CORS_ORIGIN_ALLOW_ALL = True
# Allow all headers for simplicity. You can restrict this to the necessary headers.
CORS_ALLOW_HEADERS = ["*"]
# Allow all HTTP methods (GET, POST, PUT, DELETE, etc.).
CORS_ALLOW_METHODS = ["*"]

CSRF_COOKIE_SAMESITE = "Strict"
SESSION_COOKIE_SAMESITE = "Strict"
CSRF_COOKIE_HTTPONLY = False

X_FRAME_OPTIONS = "None"

DOMAIN = "https://pandaplacement.com"
# DOMAIN = 'http://192.168.0.106:8000'

# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,

#     "loggers": {
#         "django": {
#             "handlers": ['console', 'file'],
#             "level": "INFO",  # Set the logging level to the lowest level you want to capture.
#         },
#     },
#     "handlers": {
#         "console": {
#             "class": "logging.StreamHandler",
#             "formatter": "rootStyle",
#         },

#         "file": {
#             "level": "INFO",  # Set the logging level to the lowest level you want to capture.
#             "class": "logging.FileHandler",
#             "filename": "./pandalog.log",
#             "formatter": "rootStyle",
#         }
#     },
#     "formatters": {
#         "rootStyle": {
#             "format": "{levelname} {asctime} {message}",
#             "style": "{",
#         },
#     }
# }


# Celery Settings
CELERY_BROKER_URL = "redis://localhost:6379"
CELERY_RESULT_BACKEND = "redis://localhost:6379"
CELERY_ACCEPT_CONTENT = ["application/json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "Asia/Karachi"

CELERY_RESULT_BACKEND = "django-db"

# CELERY BEAT SCHEDULER
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"
