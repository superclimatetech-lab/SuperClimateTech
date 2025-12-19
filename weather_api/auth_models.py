from django.db import models
from django.contrib.auth.models import User
from django.core.validators import URLValidator, EmailValidator
import uuid


class UserProfile(models.Model):
    """Extended user profile with preferences"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=255, blank=True)
    preferred_locations = models.ManyToManyField('Location', related_name='preferred_by_users', blank=True)
    temperature_unit = models.CharField(
        max_length=1,
        choices=[('C', 'Celsius'), ('F', 'Fahrenheit')],
        default='C'
    )
    notification_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.username}"


class UserPreferences(models.Model):
    """User preferences for alerts and notifications"""
    ALERT_TYPES = [
        ('heat_wave', 'Heat Wave'),
        ('cold_wave', 'Cold Wave'),
        ('extreme_weather', 'Extreme Weather'),
        ('all', 'All Alerts'),
    ]

    FREQUENCY_CHOICES = [
        ('immediate', 'Immediate'),
        ('daily', 'Daily Digest'),
        ('weekly', 'Weekly Digest'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
    
    # Alert preferences
    alert_types = models.CharField(
        max_length=50,
        choices=ALERT_TYPES,
        default='all'
    )
    alert_frequency = models.CharField(
        max_length=20,
        choices=FREQUENCY_CHOICES,
        default='immediate'
    )
    alert_threshold_temp = models.FloatField(
        default=35,
        help_text="Temperature threshold in Celsius for alerts"
    )
    
    # Notification preferences
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    in_app_notifications = models.BooleanField(default=True)
    
    # Social sharing preferences
    allow_social_sharing = models.BooleanField(default=True)
    default_share_platforms = models.CharField(
        max_length=255,
        default='twitter,facebook',
        help_text="Comma-separated list of default platforms"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "User Preferences"

    def __str__(self):
        return f"Preferences for {self.user.username}"


class SavedAlert(models.Model):
    """User's saved alerts for quick access"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_alerts')
    alert = models.ForeignKey('Alert', on_delete=models.CASCADE, related_name='saved_by_users')
    saved_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ['user', 'alert']
        ordering = ['-saved_at']

    def __str__(self):
        return f"{self.user.username} saved {self.alert}"


class SavedForecast(models.Model):
    """User's saved forecasts"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_forecasts')
    forecast = models.ForeignKey('Forecast', on_delete=models.CASCADE, related_name='saved_by_users')
    location_name = models.CharField(max_length=255, blank=True)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'forecast']
        ordering = ['-saved_at']

    def __str__(self):
        return f"{self.user.username} saved forecast for {self.location_name}"
