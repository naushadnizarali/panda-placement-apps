# Generated by Django 5.0.2 on 2024-04-15 20:23

import employer.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employer', '0004_jobs_viewcount'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company_info',
            name='logo',
            field=models.FileField(blank=True, null=True, upload_to=employer.models.company_logo),
        ),
    ]