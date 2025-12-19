import requests
import logging
from django.conf import settings
from typing import Optional, Dict, List
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


class OpenWeatherMapService:
    """Service for OpenWeatherMap API integration"""
    
    BASE_URL = "https://api.openweathermap.org/data/2.5"
    
    def __init__(self):
        self.api_key = getattr(settings, 'OPENWEATHERMAP_API_KEY', None)
        self.timeout = 10
    
    def get_current_weather(self, latitude: float, longitude: float) -> Optional[Dict]:
        """
        Fetch current weather data for given coordinates
        """
        if not self.api_key:
            logger.warning("OpenWeatherMap API key not configured")
            return None
        
        try:
            url = f"{self.BASE_URL}/weather"
            params = {
                'lat': latitude,
                'lon': longitude,
                'appid': self.api_key,
                'units': 'metric'
            }
            
            response = requests.get(url, params=params, timeout=self.timeout)
            response.raise_for_status()
            
            data = response.json()
            
            return {
                'temperature': data['main']['temp'],
                'feels_like': data['main']['feels_like'],
                'humidity': data['main']['humidity'],
                'pressure': data['main']['pressure'],
                'wind_speed': data['wind']['speed'],
                'condition': data['weather'][0]['main'].lower(),
                'description': data['weather'][0]['description'],
            }
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching current weather from OpenWeatherMap: {e}")
            return None
    
    def get_forecast(self, latitude: float, longitude: float, days: int = 5) -> Optional[List[Dict]]:
        """
        Fetch forecast data for given coordinates (5-day forecast)
        """
        if not self.api_key:
            logger.warning("OpenWeatherMap API key not configured")
            return None
        
        try:
            url = f"{self.BASE_URL}/forecast"
            params = {
                'lat': latitude,
                'lon': longitude,
                'appid': self.api_key,
                'units': 'metric'
            }
            
            response = requests.get(url, params=params, timeout=self.timeout)
            response.raise_for_status()
            
            data = response.json()
            forecasts = []
            
            for item in data['list'][:days * 8]:  # 8 items per day
                forecasts.append({
                    'timestamp': datetime.fromtimestamp(item['dt']),
                    'temperature': item['main']['temp'],
                    'max_temperature': item['main']['temp_max'],
                    'min_temperature': item['main']['temp_min'],
                    'humidity': item['main']['humidity'],
                    'condition': item['weather'][0]['main'].lower(),
                    'precipitation_chance': item.get('pop', 0) * 100,
                    'wind_speed': item['wind']['speed'],
                })
            
            return forecasts
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching forecast from OpenWeatherMap: {e}")
            return None


class OpenMeteoService:
    """Service for Open-Meteo API integration (free forecast)"""
    
    BASE_URL = "https://api.open-meteo.com/v1"
    
    def __init__(self):
        self.timeout = 10
    
    def get_forecast(self, latitude: float, longitude: float, days: int = 30) -> Optional[Dict]:
        """
        Fetch long-term forecast from Open-Meteo API
        """
        try:
            url = f"{self.BASE_URL}/forecast"
            params = {
                'latitude': latitude,
                'longitude': longitude,
                'daily': 'temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max',
                'timezone': 'auto',
                'forecast_days': min(days, 90)
            }
            
            response = requests.get(url, params=params, timeout=self.timeout)
            response.raise_for_status()
            
            data = response.json()
            daily = data['daily']
            forecasts = []
            
            for i, date in enumerate(daily['time']):
                forecasts.append({
                    'date': date,
                    'max_temperature': daily['temperature_2m_max'][i],
                    'min_temperature': daily['temperature_2m_min'][i],
                    'avg_temperature': (daily['temperature_2m_max'][i] + daily['temperature_2m_min'][i]) / 2,
                    'precipitation': daily['precipitation_sum'][i],
                    'wind_speed': daily['windspeed_10m_max'][i],
                })
            
            return forecasts
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching forecast from Open-Meteo: {e}")
            return None
    
    def get_current_weather(self, latitude: float, longitude: float) -> Optional[Dict]:
        """
        Fetch current weather from Open-Meteo API
        """
        try:
            url = f"{self.BASE_URL}/forecast"
            params = {
                'latitude': latitude,
                'longitude': longitude,
                'current': 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
                'timezone': 'auto'
            }
            
            response = requests.get(url, params=params, timeout=self.timeout)
            response.raise_for_status()
            
            current = response.json()['current']
            
            return {
                'temperature': current['temperature_2m'],
                'humidity': current['relative_humidity_2m'],
                'wind_speed': current['wind_speed_10m'],
                'weather_code': current['weather_code'],
            }
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching current weather from Open-Meteo: {e}")
            return None


class WeatherAggregator:
    """Aggregates weather data from multiple sources"""
    
    def __init__(self):
        self.openweathermap = OpenWeatherMapService()
        self.open_meteo = OpenMeteoService()
    
    def get_current_weather(self, latitude: float, longitude: float) -> Optional[Dict]:
        """
        Get current weather, trying OpenWeatherMap first, then Open-Meteo
        """
        # Try OpenWeatherMap first
        weather = self.openweathermap.get_current_weather(latitude, longitude)
        if weather:
            return weather
        
        # Fallback to Open-Meteo
        return self.open_meteo.get_current_weather(latitude, longitude)
    
    def get_forecast(self, latitude: float, longitude: float, days: int = 7) -> Optional[Dict]:
        """
        Get forecast, using Open-Meteo as it's free and reliable
        """
        return self.open_meteo.get_forecast(latitude, longitude, days)
