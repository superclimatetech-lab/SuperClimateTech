from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Location, CurrentWeather, Forecast, Alert, HistoricalData,
    InAppNotification, SharedContent
)
from .auth_models import UserProfile, UserPreferences, SavedAlert, SavedForecast


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name', 'country', 'latitude', 'longitude', 'is_featured', 'created_at', 'updated_at']


class CurrentWeatherSerializer(serializers.ModelSerializer):
    location_data = LocationSerializer(source='location', read_only=True)
    
    class Meta:
        model = CurrentWeather
        fields = [
            'id', 'location', 'location_data', 'temperature', 'feels_like', 'humidity',
            'pressure', 'wind_speed', 'condition', 'description', 'timestamp'
        ]


class ForecastSerializer(serializers.ModelSerializer):
    location_data = LocationSerializer(source='location', read_only=True)
    
    class Meta:
        model = Forecast
        fields = [
            'id', 'location', 'location_data', 'forecast_type', 'forecast_date',
            'max_temperature', 'min_temperature', 'avg_temperature', 'condition',
            'precipitation_chance', 'wind_speed', 'humidity', 'created_at', 'updated_at'
        ]


class AlertSerializer(serializers.ModelSerializer):
    location_data = LocationSerializer(source='location', read_only=True)
    
    class Meta:
        model = Alert
        fields = [
            'id', 'location', 'location_data', 'alert_type', 'severity', 'description',
            'start_date', 'end_date', 'is_active', 'temperature_value', 'created_at', 'updated_at'
        ]


class HistoricalDataSerializer(serializers.ModelSerializer):
    location_data = LocationSerializer(source='location', read_only=True)
    
    class Meta:
        model = HistoricalData
        fields = [
            'id', 'location', 'location_data', 'date', 'max_temperature', 'min_temperature',
            'avg_temperature', 'precipitation', 'humidity', 'wind_speed', 'condition', 'created_at'
        ]


# User Authentication & Preferences Serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active']
        read_only_fields = ['id']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    preferred_locations = LocationSerializer(many=True, read_only=True)
    preferred_location_ids = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(),
        write_only=True,
        many=True,
        source='preferred_locations',
        required=False
    )
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'phone_number', 'country', 'preferred_locations',
            'preferred_location_ids', 'temperature_unit', 'notification_enabled',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserPreferencesSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    default_share_platforms_list = serializers.SerializerMethodField()
    
    class Meta:
        model = UserPreferences
        fields = [
            'id', 'user', 'alert_types', 'alert_frequency', 'alert_threshold_temp',
            'email_notifications', 'sms_notifications', 'in_app_notifications',
            'allow_social_sharing', 'default_share_platforms', 'default_share_platforms_list',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_default_share_platforms_list(self, obj):
        return [p.strip() for p in obj.default_share_platforms.split(',')]


class SavedAlertSerializer(serializers.ModelSerializer):
    alert_data = AlertSerializer(source='alert', read_only=True)
    
    class Meta:
        model = SavedAlert
        fields = ['id', 'user', 'alert', 'alert_data', 'saved_at', 'notes']
        read_only_fields = ['id', 'saved_at']


class SavedForecastSerializer(serializers.ModelSerializer):
    forecast_data = ForecastSerializer(source='forecast', read_only=True)
    
    class Meta:
        model = SavedForecast
        fields = ['id', 'user', 'forecast', 'forecast_data', 'location_name', 'saved_at']
        read_only_fields = ['id', 'saved_at']


class InAppNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = InAppNotification
        fields = [
            'id', 'user', 'title', 'message', 'notification_type', 'alert',
            'is_read', 'created_at', 'read_at'
        ]
        read_only_fields = ['id', 'created_at']


class SharedContentSerializer(serializers.ModelSerializer):
    alert_data = AlertSerializer(source='alert', read_only=True)
    forecast_data = ForecastSerializer(source='forecast', read_only=True)
    
    class Meta:
        model = SharedContent
        fields = [
            'id', 'user', 'content_type', 'platform', 'alert', 'alert_data',
            'forecast', 'forecast_data', 'share_message', 'share_url', 'shared_at'
        ]
        read_only_fields = ['id', 'shared_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password': 'Passwords must match.'})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        # Create user profile and preferences
        UserProfile.objects.create(user=user)
        UserPreferences.objects.create(user=user)
        return user
