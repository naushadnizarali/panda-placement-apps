# Generated by Django 5.0.2 on 2024-03-28 20:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_alter_ssl_info_language_alter_ssl_info_skill'),
    ]

    operations = [
        migrations.AlterField(
            model_name='seekerapplication',
            name='status',
            field=models.CharField(blank=True, choices=[('Pending', 'Pending'), ('Shortlist', 'Shortlist'), ('Interview', 'Interview'), ('Reject', 'Reject'), ('Viewed', 'Viewed')], default='Pending', max_length=50, null=True),
        ),
    ]