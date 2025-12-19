"""
Migration for adding user authentication and preferences models
"""
from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('weather_api', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('phone_number', models.CharField(blank=True, max_length=20, null=True)),
                ('country', models.CharField(blank=True, max_length=255)),
                ('temperature_unit', models.CharField(choices=[('C', 'Celsius'), ('F', 'Fahrenheit')], default='C', max_length=1)),
                ('notification_enabled', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
                ('preferred_locations', models.ManyToManyField(blank=True, related_name='preferred_by_users', to='weather_api.location')),
            ],
        ),
        migrations.CreateModel(
            name='UserPreferences',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('alert_types', models.CharField(choices=[('heat_wave', 'Heat Wave'), ('cold_wave', 'Cold Wave'), ('extreme_weather', 'Extreme Weather'), ('all', 'All Alerts')], default='all', max_length=50)),
                ('alert_frequency', models.CharField(choices=[('immediate', 'Immediate'), ('daily', 'Daily Digest'), ('weekly', 'Weekly Digest')], default='immediate', max_length=20)),
                ('alert_threshold_temp', models.FloatField(default=35, help_text='Temperature threshold in Celsius for alerts')),
                ('email_notifications', models.BooleanField(default=True)),
                ('sms_notifications', models.BooleanField(default=False)),
                ('in_app_notifications', models.BooleanField(default=True)),
                ('allow_social_sharing', models.BooleanField(default=True)),
                ('default_share_platforms', models.CharField(default='twitter,facebook', help_text='Comma-separated list of default platforms', max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='preferences', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'User Preferences',
            },
        ),
        migrations.CreateModel(
            name='SavedAlert',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('saved_at', models.DateTimeField(auto_now_add=True)),
                ('notes', models.TextField(blank=True)),
                ('alert', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='saved_by_users', to='weather_api.alert')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='saved_alerts', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-saved_at'],
                'unique_together': {('user', 'alert')},
            },
        ),
        migrations.CreateModel(
            name='SavedForecast',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('saved_at', models.DateTimeField(auto_now_add=True)),
                ('notes', models.TextField(blank=True)),
                ('forecast', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='saved_by_users', to='weather_api.forecast')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='saved_forecasts', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-saved_at'],
                'unique_together': {('user', 'forecast')},
            },
        ),
        migrations.CreateModel(
            name='InAppNotification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('message', models.TextField()),
                ('notification_type', models.CharField(choices=[('info', 'Information'), ('warning', 'Warning'), ('alert', 'Alert'), ('success', 'Success')], default='info', max_length=20)),
                ('is_read', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('read_at', models.DateTimeField(blank=True, null=True)),
                ('alert', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='notifications', to='weather_api.alert')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='SharedContent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content_type', models.CharField(choices=[('alert', 'Alert'), ('forecast', 'Forecast'), ('update', 'Weather Update')], max_length=20)),
                ('platform', models.CharField(choices=[('twitter', 'Twitter/X'), ('facebook', 'Facebook'), ('linkedin', 'LinkedIn'), ('whatsapp', 'WhatsApp'), ('email', 'Email')], max_length=20)),
                ('share_message', models.TextField()),
                ('share_url', models.URLField(blank=True)),
                ('shared_at', models.DateTimeField(auto_now_add=True)),
                ('alert', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='shares', to='weather_api.alert')),
                ('forecast', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='shares', to='weather_api.forecast')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shared_content', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-shared_at'],
            },
        ),
        migrations.AddIndex(
            model_name='userprofile',
            index=models.Index(fields=['user'], name='weather_api_user_prof_idx'),
        ),
        migrations.AddIndex(
            model_name='userpreferences',
            index=models.Index(fields=['user'], name='weather_api_user_pref_idx'),
        ),
        migrations.AddIndex(
            model_name='savedalert',
            index=models.Index(fields=['user'], name='weather_api_user_alert_idx'),
        ),
        migrations.AddIndex(
            model_name='savedforecast',
            index=models.Index(fields=['user'], name='weather_api_user_fcst_idx'),
        ),
        migrations.AddIndex(
            model_name='inappnotification',
            index=models.Index(fields=['user', 'is_read'], name='weather_api_user_is_re_idx'),
        ),
        migrations.AddIndex(
            model_name='inappnotification',
            index=models.Index(fields=['-created_at'], name='weather_api_created__idx'),
        ),
        migrations.AddIndex(
            model_name='sharedcontent',
            index=models.Index(fields=['user', 'content_type'], name='weather_api_user_cont_idx'),
        ),
        migrations.AddIndex(
            model_name='sharedcontent',
            index=models.Index(fields=['platform'], name='weather_api_platfrm_idx'),
        ),
    ]
