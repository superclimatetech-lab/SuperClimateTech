from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User


class Location(models.Model):
    """Model for African locations/cities"""
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    latitude = models.FloatField(validators=[MinValueValidator(-90), MaxValueValidator(90)])
    longitude = models.FloatField(validators=[MinValueValidator(-180), MaxValueValidator(180)])
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['country', 'name']
        indexes = [
            models.Index(fields=['country']),
            models.Index(fields=['latitude', 'longitude']),
        ]

    def __str__(self):
        return f"{self.name}, {self.country}"


class CurrentWeather(models.Model):
    """Model for real-time weather data"""
    CONDITION_CHOICES = [
        ('clear', 'Clear'),
        ('cloudy', 'Cloudy'),
        ('rainy', 'Rainy'),
        ('stormy', 'Stormy'),
        ('snowy', 'Snowy'),
    ]

    location = models.OneToOneField(Location, on_delete=models.CASCADE, related_name='current_weather')
    temperature = models.FloatField()  # in Celsius
    feels_like = models.FloatField()
    humidity = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    pressure = models.IntegerField()  # in hPa
    wind_speed = models.FloatField()  # in m/s
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    description = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['-timestamp']),
            models.Index(fields=['location']),
        ]

    def __str__(self):
        return f"{self.location} - {self.temperature}°C"


class Forecast(models.Model):
    """Model for weather forecasts (short and long-term)"""
    FORECAST_TYPE_CHOICES = [
        ('short_term', '1-7 Days'),
        ('long_term', '8-30 Days'),
    ]

    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='forecasts')
    forecast_type = models.CharField(max_length=20, choices=FORECAST_TYPE_CHOICES)
    forecast_date = models.DateField()
    max_temperature = models.FloatField()
    min_temperature = models.FloatField()
    avg_temperature = models.FloatField()
    condition = models.CharField(max_length=255)
    precipitation_chance = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    wind_speed = models.FloatField()
    humidity = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['forecast_date']
        indexes = [
            models.Index(fields=['location', 'forecast_date']),
            models.Index(fields=['forecast_type', 'forecast_date']),
        ]

    def __str__(self):
        return f"{self.location} - {self.forecast_date} ({self.forecast_type})"


class Alert(models.Model):
    """Model for heat/cold wave alerts"""
    ALERT_TYPE_CHOICES = [
        ('heat_wave', 'Heat Wave'),
        ('cold_wave', 'Cold Wave'),
    ]

    SEVERITY_CHOICES = [
        ('warning', 'Warning'),
        ('severe', 'Severe'),
        ('extreme', 'Extreme'),
    ]

    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='alerts')
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPE_CHOICES)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    temperature_value = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['location', 'is_active']),
            models.Index(fields=['alert_type', 'is_active']),
        ]

    def __str__(self):
        return f"{self.location} - {self.alert_type} ({self.severity})"


class HistoricalData(models.Model):
    """Model for archiving historical weather patterns"""
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='historical_data')
    date = models.DateField()
    max_temperature = models.FloatField()
    min_temperature = models.FloatField()
    avg_temperature = models.FloatField()
    precipitation = models.FloatField(null=True, blank=True)  # in mm
    humidity = models.IntegerField()
    wind_speed = models.FloatField()
    condition = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        unique_together = [['location', 'date']]
        indexes = [
            models.Index(fields=['location', 'date']),
            models.Index(fields=['date']),
        ]

    def __str__(self):
        return f"{self.location} - {self.date}"


class InAppNotification(models.Model):
    """Model for in-app notifications"""
    NOTIFICATION_TYPES = [
        ('info', 'Information'),
        ('warning', 'Warning'),
        ('alert', 'Alert'),
        ('success', 'Success'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='info')
    alert = models.ForeignKey(Alert, on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f"{self.title} - {self.user.username}"


class SharedContent(models.Model):
    """Model for tracking shared alerts and forecasts"""
    SHARE_PLATFORMS = [
        ('twitter', 'Twitter/X'),
        ('facebook', 'Facebook'),
        ('linkedin', 'LinkedIn'),
        ('whatsapp', 'WhatsApp'),
        ('email', 'Email'),
    ]

    CONTENT_TYPES = [
        ('alert', 'Alert'),
        ('forecast', 'Forecast'),
        ('update', 'Weather Update'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_content')
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    platform = models.CharField(max_length=20, choices=SHARE_PLATFORMS)
    
    # Reference to shared content
    alert = models.ForeignKey(Alert, on_delete=models.SET_NULL, null=True, blank=True, related_name='shares')
    forecast = models.ForeignKey(Forecast, on_delete=models.SET_NULL, null=True, blank=True, related_name='shares')
    
    share_message = models.TextField()
    share_url = models.URLField(blank=True)
    shared_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-shared_at']
        indexes = [
            models.Index(fields=['user', 'content_type']),
            models.Index(fields=['platform']),
        ]

    def __str__(self):
        return f"{self.user.username} shared {self.content_type} on {self.platform}"
