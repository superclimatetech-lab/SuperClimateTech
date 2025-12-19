"""
Example tasks for Celery to handle async notifications
Add these to weather_api/tasks.py
"""

from celery import shared_task
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

from .models import Alert, InAppNotification
from .auth_models import UserPreferences, SavedAlert
from .notification_service import (
    NotificationService, AlertNotificationService, SocialSharingService
)


@shared_task
def send_alert_notifications(alert_id):
    """
    Send alert notifications to all subscribed users asynchronously
    
    Args:
        alert_id: ID of the alert
    """
    try:
        alert = Alert.objects.get(id=alert_id)
        
        # Get all users with notifications enabled
        users = User.objects.filter(
            profile__notification_enabled=True,
            preferences__allow_social_sharing=True  # Or other filter conditions
        )
        
        for user in users:
            try:
                preferences = UserPreferences.objects.get(user=user)
                
                # Check alert type matches user preferences
                if preferences.alert_types != 'all':
                    if alert.get_alert_type_display().lower() not in preferences.alert_types:
                        continue
                
                # Send notifications
                AlertNotificationService.notify_alert(user, alert, preferences)
                
            except UserPreferences.DoesNotExist:
                continue
        
        return f"Notifications sent for alert {alert_id}"
    except Alert.DoesNotExist:
        return f"Alert {alert_id} not found"


@shared_task
def send_daily_alert_digest(user_id):
    """
    Send daily digest of alerts to user
    
    Args:
        user_id: ID of the user
    """
    try:
        user = User.objects.get(id=user_id)
        preferences = UserPreferences.objects.get(user=user)
        
        if preferences.alert_frequency != 'daily' or not preferences.email_notifications:
            return f"User {user_id} not subscribed to daily digests"
        
        # Get alerts from last 24 hours
        yesterday = timezone.now() - timedelta(days=1)
        alerts = Alert.objects.filter(
            created_at__gte=yesterday,
            is_active=True
        )
        
        if not alerts.exists():
            return f"No alerts for user {user_id} today"
        
        # Create digest message
        digest_message = AlertNotificationService.create_alert_digest(user, alerts, 'daily')
        
        if user.email:
            NotificationService.send_email_notification(
                recipient_email=user.email,
                subject="Daily Weather Alert Digest - SuperTech",
                message=digest_message
            )
        
        return f"Daily digest sent to user {user_id}"
    except (User.DoesNotExist, UserPreferences.DoesNotExist):
        return f"User {user_id} not found"


@shared_task
def send_weekly_alert_digest(user_id):
    """
    Send weekly digest of alerts to user
    
    Args:
        user_id: ID of the user
    """
    try:
        user = User.objects.get(id=user_id)
        preferences = UserPreferences.objects.get(user=user)
        
        if preferences.alert_frequency != 'weekly' or not preferences.email_notifications:
            return f"User {user_id} not subscribed to weekly digests"
        
        # Get alerts from last 7 days
        last_week = timezone.now() - timedelta(days=7)
        alerts = Alert.objects.filter(
            created_at__gte=last_week,
            is_active=True
        )
        
        if not alerts.exists():
            return f"No alerts for user {user_id} this week"
        
        # Create digest message
        digest_message = AlertNotificationService.create_alert_digest(user, alerts, 'weekly')
        
        if user.email:
            NotificationService.send_email_notification(
                recipient_email=user.email,
                subject="Weekly Weather Alert Summary - SuperTech",
                message=digest_message
            )
        
        return f"Weekly digest sent to user {user_id}"
    except (User.DoesNotExist, UserPreferences.DoesNotExist):
        return f"User {user_id} not found"


@shared_task
def cleanup_old_notifications(days=30):
    """
    Delete old notifications to save database space
    
    Args:
        days: Delete notifications older than this many days
    """
    cutoff_date = timezone.now() - timedelta(days=days)
    deleted_count, _ = InAppNotification.objects.filter(
        created_at__lt=cutoff_date,
        is_read=True  # Only delete read notifications
    ).delete()
    
    return f"Deleted {deleted_count} old notifications"


@shared_task
def notify_extreme_conditions():
    """
    Check for extreme weather conditions and notify all relevant users
    Run this periodically to check for new extreme conditions
    """
    from .models import Location, CurrentWeather
    
    # Get all active users
    users = User.objects.filter(
        profile__notification_enabled=True,
        is_active=True
    )
    
    notifications_sent = 0
    
    for user in users:
        try:
            preferences = UserPreferences.objects.get(user=user)
            profile = user.profile
            
            # Check each of user's preferred locations
            for location in profile.preferred_locations.all():
                try:
                    weather = CurrentWeather.objects.get(location=location)
                    
                    # Check if temperature exceeds threshold
                    if abs(weather.temperature - preferences.alert_threshold_temp) > 5:
                        # Create in-app notification
                        NotificationService.send_in_app_notification(
                            user=user,
                            title=f"Extreme Temperature at {location}",
                            message=f"Current temperature: {weather.temperature}°C (Threshold: {preferences.alert_threshold_temp}°C)",
                            notification_type='warning'
                        )
                        notifications_sent += 1
                
                except CurrentWeather.DoesNotExist:
                    continue
        
        except UserPreferences.DoesNotExist:
            continue
    
    return f"Sent {notifications_sent} extreme condition notifications"


@shared_task
def sync_user_preferences_to_cache():
    """
    Cache user preferences for faster access
    Useful for high-traffic systems
    """
    from django.core.cache import cache
    
    users = User.objects.all()
    
    for user in users:
        try:
            preferences = UserPreferences.objects.get(user=user)
            cache.set(f'user_prefs_{user.id}', {
                'email_notifications': preferences.email_notifications,
                'sms_notifications': preferences.sms_notifications,
                'in_app_notifications': preferences.in_app_notifications,
                'alert_threshold_temp': preferences.alert_threshold_temp,
            }, timeout=3600)  # Cache for 1 hour
        except UserPreferences.DoesNotExist:
            continue
    
    return f"Cached preferences for {users.count()} users"


# Celery Beat Schedule Configuration
# Add to supertech_backend/settings.py CELERY_BEAT_SCHEDULE:

"""
'send-daily-digests': {
    'task': 'weather_api.tasks.send_daily_alert_digest',
    'schedule': crontab(hour=8, minute=0),  # 8 AM daily
},
'send-weekly-digests': {
    'task': 'weather_api.tasks.send_weekly_alert_digest',
    'schedule': crontab(day_of_week=0, hour=9, minute=0),  # Monday 9 AM
},
'cleanup-old-notifications': {
    'task': 'weather_api.tasks.cleanup_old_notifications',
    'schedule': crontab(hour=2, minute=0),  # 2 AM daily
},
'notify-extreme-conditions': {
    'task': 'weather_api.tasks.notify_extreme_conditions',
    'schedule': 3600,  # Every hour
},
'sync-preferences-cache': {
    'task': 'weather_api.tasks.sync_user_preferences_to_cache',
    'schedule': 1800,  # Every 30 minutes
},
"""
