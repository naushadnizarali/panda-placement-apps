# Generated by Django 5.0.2 on 2024-03-26 15:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employer', '0002_jobs_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobs',
            name='salary_currency',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]