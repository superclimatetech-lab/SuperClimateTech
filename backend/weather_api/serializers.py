from rest_framework import serializers
from .models import Location, CurrentWeather, Forecast, Alert, HistoricalData


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
