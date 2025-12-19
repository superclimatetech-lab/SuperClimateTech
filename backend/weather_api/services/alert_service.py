import logging
from datetime import datetime, timedelta
from typing import Optional, Tuple
from django.utils import timezone

from ..models import Alert, Location, CurrentWeather

logger = logging.getLogger(__name__)


class AlertService:
    """Service for detecting and managing weather alerts"""
    
    HEAT_WAVE_THRESHOLD = 35  # Celsius
    COLD_WAVE_THRESHOLD = 10  # Celsius
    CONSECUTIVE_DAYS_THRESHOLD = 3
    
    @staticmethod
    def check_heat_wave(location: Location, temperature: float) -> Optional[Alert]:
        """
        Check if heat wave conditions exist
        Heat wave: Temperature > 35°C for 3+ consecutive days
        """
        try:
            # Check recent temperatures
            recent_weather = CurrentWeather.objects.filter(
                location=location,
                timestamp__gte=timezone.now() - timedelta(days=3)
            ).order_by('-timestamp')
            
            consecutive_hot_days = 0
            for weather in recent_weather:
                if weather.temperature >= AlertService.HEAT_WAVE_THRESHOLD:
                    consecutive_hot_days += 1
                else:
                    break
            
            if consecutive_hot_days >= AlertService.CONSECUTIVE_DAYS_THRESHOLD and temperature >= AlertService.HEAT_WAVE_THRESHOLD:
                # Determine severity
                if temperature >= 42:
                    severity = 'extreme'
                elif temperature >= 38:
                    severity = 'severe'
                else:
                    severity = 'warning'
                
                # Check if alert already exists
                existing_alert = Alert.objects.filter(
                    location=location,
                    alert_type='heat_wave',
                    is_active=True
                ).first()
                
                if not existing_alert:
                    alert = Alert.objects.create(
                        location=location,
                        alert_type='heat_wave',
                        severity=severity,
                        description=f'Heat wave detected in {location.name}. Temperature: {temperature}°C',
                        start_date=timezone.now(),
                        is_active=True,
                        temperature_value=temperature
                    )
                    logger.info(f"Heat wave alert created for {location.name}")
                    return alert
                else:
                    # Update existing alert
                    existing_alert.severity = severity
                    existing_alert.temperature_value = temperature
                    existing_alert.updated_at = timezone.now()
                    existing_alert.save()
                    return existing_alert
        
        except Exception as e:
            logger.error(f"Error checking heat wave for {location.name}: {e}")
        
        return None
    
    @staticmethod
    def check_cold_wave(location: Location, temperature: float) -> Optional[Alert]:
        """
        Check if cold wave conditions exist
        Cold wave: Temperature < 10°C or unusual drops
        """
        try:
            # Check if temperature is below threshold
            if temperature < AlertService.COLD_WAVE_THRESHOLD:
                # Determine severity
                if temperature < 0:
                    severity = 'extreme'
                elif temperature < 5:
                    severity = 'severe'
                else:
                    severity = 'warning'
                
                # Check if alert already exists
                existing_alert = Alert.objects.filter(
                    location=location,
                    alert_type='cold_wave',
                    is_active=True
                ).first()
                
                if not existing_alert:
                    alert = Alert.objects.create(
                        location=location,
                        alert_type='cold_wave',
                        severity=severity,
                        description=f'Cold wave detected in {location.name}. Temperature: {temperature}°C',
                        start_date=timezone.now(),
                        is_active=True,
                        temperature_value=temperature
                    )
                    logger.info(f"Cold wave alert created for {location.name}")
                    return alert
                else:
                    # Update existing alert
                    existing_alert.severity = severity
                    existing_alert.temperature_value = temperature
                    existing_alert.updated_at = timezone.now()
                    existing_alert.save()
                    return existing_alert
        
        except Exception as e:
            logger.error(f"Error checking cold wave for {location.name}: {e}")
        
        return None
    
    @staticmethod
    def close_alert(location: Location, alert_type: str) -> bool:
        """
        Close an active alert
        """
        try:
            alert = Alert.objects.filter(
                location=location,
                alert_type=alert_type,
                is_active=True
            ).first()
            
            if alert:
                alert.is_active = False
                alert.end_date = timezone.now()
                alert.save()
                logger.info(f"Alert closed for {location.name}")
                return True
        
        except Exception as e:
            logger.error(f"Error closing alert for {location.name}: {e}")
        
        return False
    
    @staticmethod
    def get_alert_status(location: Location) -> dict:
        """
        Get current alert status for a location
        """
        alerts = Alert.objects.filter(
            location=location,
            is_active=True
        )
        
        return {
            'has_alerts': alerts.exists(),
            'heat_wave': alerts.filter(alert_type='heat_wave').exists(),
            'cold_wave': alerts.filter(alert_type='cold_wave').exists(),
            'alerts_count': alerts.count(),
            'active_alerts': list(alerts.values('id', 'alert_type', 'severity', 'temperature_value'))
        }
