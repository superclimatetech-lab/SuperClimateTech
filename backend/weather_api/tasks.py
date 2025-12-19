from celery import shared_task
from django.utils import timezone
from django.db.models import Q
from datetime import datetime, timedelta
import logging

from .models import Location, CurrentWeather, Forecast, HistoricalData
from .services.weather_service import WeatherAggregator
from .services.alert_service import AlertService

logger = logging.getLogger(__name__)


@shared_task
def fetch_current_weather():
    """
    Periodic task to fetch current weather data from API
    Run every 30 minutes
    """
    try:
        aggregator = WeatherAggregator()
        locations = Location.objects.filter(is_featured=True)
        
        for location in locations:
            weather_data = aggregator.get_current_weather(
                location.latitude,
                location.longitude
            )
            
            if weather_data:
                CurrentWeather.objects.update_or_create(
                    location=location,
                    defaults={
                        'temperature': weather_data.get('temperature', 0),
                        'feels_like': weather_data.get('feels_like', 0),
                        'humidity': weather_data.get('humidity', 0),
                        'pressure': weather_data.get('pressure', 1013),
                        'wind_speed': weather_data.get('wind_speed', 0),
                        'condition': weather_data.get('condition', 'unknown'),
                        'description': weather_data.get('description', ''),
                    }
                )
                
                # Check for alerts
                temperature = weather_data.get('temperature', 0)
                AlertService.check_heat_wave(location, temperature)
                AlertService.check_cold_wave(location, temperature)
                
                logger.info(f"Updated weather for {location.name}")
        
        return f"Successfully fetched weather for {locations.count()} locations"
    
    except Exception as e:
        logger.error(f"Error fetching current weather: {e}")
        return f"Error: {str(e)}"


@shared_task
def fetch_forecast_data():
    """
    Periodic task to fetch forecast data from API
    Run every 6 hours
    """
    try:
        aggregator = WeatherAggregator()
        locations = Location.objects.filter(is_featured=True)
        
        for location in locations:
            forecast_data = aggregator.get_forecast(
                location.latitude,
                location.longitude,
                days=30
            )
            
            if forecast_data:
                for forecast in forecast_data:
                    forecast_date = datetime.strptime(forecast['date'], '%Y-%m-%d').date()
                    
                    # Determine forecast type
                    days_ahead = (forecast_date - timezone.now().date()).days
                    forecast_type = 'short_term' if days_ahead <= 7 else 'long_term'
                    
                    Forecast.objects.update_or_create(
                        location=location,
                        forecast_date=forecast_date,
                        forecast_type=forecast_type,
                        defaults={
                            'max_temperature': forecast.get('max_temperature', 0),
                            'min_temperature': forecast.get('min_temperature', 0),
                            'avg_temperature': forecast.get('avg_temperature', 0),
                            'condition': 'Mixed',
                            'precipitation_chance': 0,
                            'wind_speed': forecast.get('wind_speed', 0),
                            'humidity': 50,
                        }
                    )
                
                logger.info(f"Updated forecast for {location.name}")
        
        return f"Successfully fetched forecast for {locations.count()} locations"
    
    except Exception as e:
        logger.error(f"Error fetching forecast data: {e}")
        return f"Error: {str(e)}"


@shared_task
def archive_historical_data():
    """
    Task to archive current weather data to historical records
    Run daily at midnight
    """
    try:
        locations = Location.objects.all()
        yesterday = timezone.now().date() - timedelta(days=1)
        
        for location in locations:
            # Calculate daily aggregates from current weather records
            weather = CurrentWeather.objects.filter(
                location=location,
                timestamp__date=yesterday
            )
            
            if weather.exists():
                temps = [w.temperature for w in weather]
                humidities = [w.humidity for w in weather]
                winds = [w.wind_speed for w in weather]
                
                HistoricalData.objects.update_or_create(
                    location=location,
                    date=yesterday,
                    defaults={
                        'max_temperature': max(temps),
                        'min_temperature': min(temps),
                        'avg_temperature': sum(temps) / len(temps),
                        'humidity': sum(humidities) / len(humidities),
                        'wind_speed': sum(winds) / len(winds),
                        'condition': weather.first().condition,
                    }
                )
                
                logger.info(f"Archived historical data for {location.name}")
        
        return f"Successfully archived data for {locations.count()} locations"
    
    except Exception as e:
        logger.error(f"Error archiving historical data: {e}")
        return f"Error: {str(e)}"


@shared_task
def check_alert_conditions():
    """
    Task to check and update alert conditions
    Run every hour
    """
    try:
        locations = Location.objects.filter(
            current_weather__isnull=False
        ).distinct()
        
        for location in locations:
            try:
                current_weather = location.current_weather
                temp = current_weather.temperature
                
                # Check heat wave
                if temp >= AlertService.HEAT_WAVE_THRESHOLD:
                    AlertService.check_heat_wave(location, temp)
                else:
                    # Close heat wave alert if active
                    AlertService.close_alert(location, 'heat_wave')
                
                # Check cold wave
                if temp < AlertService.COLD_WAVE_THRESHOLD:
                    AlertService.check_cold_wave(location, temp)
                else:
                    # Close cold wave alert if active
                    AlertService.close_alert(location, 'cold_wave')
            
            except Exception as e:
                logger.error(f"Error checking alerts for {location.name}: {e}")
        
        return f"Checked alert conditions for {locations.count()} locations"
    
    except Exception as e:
        logger.error(f"Error in check_alert_conditions task: {e}")
        return f"Error: {str(e)}"


@shared_task
def cleanup_old_data():
    """
    Task to cleanup old forecast and weather data
    Run daily
    """
    try:
        # Delete forecasts older than 90 days
        old_date = timezone.now().date() - timedelta(days=90)
        deleted_count, _ = Forecast.objects.filter(forecast_date__lt=old_date).delete()
        
        logger.info(f"Deleted {deleted_count} old forecast records")
        
        return f"Cleanup completed: deleted {deleted_count} records"
    
    except Exception as e:
        logger.error(f"Error in cleanup_old_data task: {e}")
        return f"Error: {str(e)}"
