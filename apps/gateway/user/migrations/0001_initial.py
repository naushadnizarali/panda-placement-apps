# Generated by Django 5.0 on 2024-02-28 16:17

import django.db.models.deletion
import user.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('employer', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Bookmarks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('job', models.JSONField()),
                ('created_date', models.DateField(auto_now_add=True)),
                ('job_key', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='employer.jobs')),
                ('seeker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='seeker', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Bookmark',
                'verbose_name_plural': 'Bookmarks',
                'db_table': 'Bookmark',
            },
        ),
        migrations.CreateModel(
            name='Employment_Status',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('employment_status', models.CharField(max_length=50)),
                ('employment_experience', models.CharField(blank=True, max_length=50, null=True)),
                ('employment_position', models.CharField(blank=True, max_length=50, null=True)),
                ('employment_function', models.CharField(blank=True, max_length=50, null=True)),
                ('seeking_industry', models.CharField(blank=True, max_length=50, null=True)),
                ('seeking_function', models.CharField(blank=True, max_length=50, null=True)),
                ('seeking_position', models.CharField(blank=True, max_length=50, null=True)),
                ('current_salary', models.CharField(blank=True, max_length=50, null=True)),
                ('expected_salary', models.CharField(blank=True, max_length=50, null=True)),
                ('seeker', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='employment', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Employment_Statu',
                'verbose_name_plural': 'Employment_Status',
                'db_table': 'Employment_Status',
            },
        ),
        migrations.CreateModel(
            name='Experience',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company', models.CharField(max_length=50)),
                ('position', models.CharField(max_length=50)),
                ('country', models.CharField(blank=True, max_length=50, null=True)),
                ('employment_status', models.CharField(max_length=50)),
                ('period_from', models.DateField(blank=True, null=True)),
                ('period_to', models.DateField(blank=True, null=True)),
                ('currently_working', models.BooleanField(blank=True, null=True)),
                ('description', models.TextField()),
                ('seeker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='experience', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Experience',
                'verbose_name_plural': 'Experiences',
                'db_table': 'Experiences',
            },
        ),
        migrations.CreateModel(
            name='Projects',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, max_length=50, null=True)),
                ('role', models.CharField(blank=True, max_length=50, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('url', models.CharField(blank=True, max_length=200, null=True)),
                ('seeker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='projects', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Project',
                'verbose_name_plural': 'Projects',
                'db_table': 'Projects',
            },
        ),
        migrations.CreateModel(
            name='Qualification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('education_level', models.CharField(max_length=50)),
                ('degree', models.CharField(max_length=50)),
                ('institute', models.CharField(max_length=50)),
                ('start_period', models.DateField(blank=True, max_length=50, null=True)),
                ('complete_period', models.DateField(blank=True, max_length=50, null=True)),
                ('location', models.CharField(blank=True, max_length=50, null=True)),
                ('currently_enrolled', models.BooleanField(blank=True, null=True)),
                ('seeker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='qualification', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Qualification',
                'verbose_name_plural': 'Qualifications',
                'db_table': 'Qualifications',
            },
        ),
        migrations.CreateModel(
            name='Seeker_Cv',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(blank=True, upload_to=user.models.user_cv_path)),
                ('seeker', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='cv', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Seeker_Cv',
                'verbose_name_plural': 'Seeker_Cvs',
                'db_table': 'Seeker_Cvs',
            },
        ),
        migrations.CreateModel(
            name='Seeker_Info',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('headline', models.CharField(blank=True, max_length=150, null=True)),
                ('date_of_birth', models.DateField(blank=True, null=True)),
                ('place_of_birth', models.CharField(blank=True, max_length=50, null=True)),
                ('gender', models.CharField(blank=True, max_length=50, null=True)),
                ('passport', models.CharField(blank=True, max_length=50, null=True)),
                ('area_of_residence', models.CharField(blank=True, max_length=500, null=True)),
                ('zip_code', models.CharField(blank=True, max_length=15, null=True)),
                ('country', models.CharField(blank=True, max_length=50, null=True)),
                ('state', models.CharField(blank=True, max_length=50, null=True)),
                ('city', models.CharField(blank=True, max_length=50, null=True)),
                ('married', models.CharField(blank=True, max_length=50, null=True)),
                ('nationality', models.CharField(blank=True, max_length=50, null=True)),
                ('seeker', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='seeker_info', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Seeker_Info',
                'verbose_name_plural': 'Seekers_Info',
                'db_table': 'Seekers_Info',
            },
        ),
        migrations.CreateModel(
            name='SeekerApplication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('job_status', models.BooleanField(default=True)),
                ('job', models.JSONField()),
                ('company', models.JSONField()),
                ('resume', models.FileField(blank=True, upload_to=user.models.seeker_applicant_resume)),
                ('prescreen', models.TextField(blank=True, null=True)),
                ('status', models.CharField(blank=True, choices=[('Pending', 'Pending'), ('Shortlist', 'Shortlist'), ('Interview', 'Interview'), ('Reject', 'Reject')], default='Pending', max_length=50, null=True)),
                ('applied_date', models.DateField(auto_now_add=True)),
                ('seeker_key', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='applied_jobs', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Seeker Application',
                'verbose_name_plural': 'Seeker Applications',
                'db_table': 'SeekerApplication',
            },
        ),
        migrations.CreateModel(
            name='SSL_Info',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('summary', models.TextField(blank=True, null=True)),
                ('skill', models.CharField(blank=True, max_length=200, null=True)),
                ('language', models.CharField(blank=True, max_length=200, null=True)),
                ('seeker', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='ssl_info', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Summary_Skills_Language',
                'db_table': 'Summary_Skills_Language',
            },
        ),
    ]
