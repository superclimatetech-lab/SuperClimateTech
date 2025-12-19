"""
Notification service for email, SMS, and in-app notifications
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.conf import settings
from django.core.mail import send_mail
from datetime import datetime
import requests


class NotificationService:
    """Service to handle multi-channel notifications"""

    @staticmethod
    def send_email_notification(recipient_email, subject, message, alert_data=None):
        """
        Send email notification
        
        Args:
            recipient_email: Email address to send to
            subject: Email subject
            message: Email body
            alert_data: Optional dict with alert information
        """
        try:
            # Create HTML email
            html_message = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #e74c3c; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">
                            {subject}
                        </h2>
                        <div style="margin: 20px 0; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                            <p>{message}</p>
                        </div>
                        {NotificationService._format_alert_html(alert_data) if alert_data else ''}
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="font-size: 12px; color: #777;">
                            This is an automated message from SuperTech Weather Monitoring System.
                            <br>Check your preferences to manage notifications.
                        </p>
                    </div>
                </body>
            </html>
            """
            
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL or 'noreply@supertech-weather.com',
                recipient_list=[recipient_email],
                html_message=html_message,
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False

    @staticmethod
    def send_sms_notification(phone_number, message):
        """
        Send SMS notification using Twilio or similar service
        
        Args:
            phone_number: Phone number to send SMS to
            message: SMS message content (limited to 160 chars typically)
        """
        try:
            # Integration with Twilio (example)
            # You would need to set up Twilio credentials in settings
            twilio_account_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', None)
            twilio_auth_token = getattr(settings, 'TWILIO_AUTH_TOKEN', None)
            twilio_phone = getattr(settings, 'TWILIO_PHONE_NUMBER', None)
            
            if not all([twilio_account_sid, twilio_auth_token, twilio_phone]):
                print("Twilio credentials not configured")
                return False
            
            from twilio.rest import Client
            client = Client(twilio_account_sid, twilio_auth_token)
            
            message = client.messages.create(
                body=message,
                from_=twilio_phone,
                to=phone_number
            )
            return True
        except Exception as e:
            print(f"Error sending SMS: {e}")
            return False

    @staticmethod
    def send_in_app_notification(user, title, message, notification_type='info', alert_id=None):
        """
        Send in-app notification
        
        Args:
            user: User object
            title: Notification title
            message: Notification message
            notification_type: Type of notification (info, warning, alert, success)
            alert_id: Optional alert ID if related to an alert
        """
        try:
            from .models import InAppNotification
            notification = InAppNotification.objects.create(
                user=user,
                title=title,
                message=message,
                notification_type=notification_type,
                alert_id=alert_id
            )
            return notification
        except Exception as e:
            print(f"Error creating in-app notification: {e}")
            return None

    @staticmethod
    def _format_alert_html(alert_data):
        """Format alert data as HTML"""
        if not alert_data:
            return ''
        
        html = '<div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0;">'
        
        if alert_data.get('alert_type'):
            html += f"<strong>Alert Type:</strong> {alert_data['alert_type']}<br>"
        if alert_data.get('location'):
            html += f"<strong>Location:</strong> {alert_data['location']}<br>"
        if alert_data.get('severity'):
            html += f"<strong>Severity:</strong> {alert_data['severity']}<br>"
        if alert_data.get('temperature'):
            html += f"<strong>Temperature:</strong> {alert_data['temperature']}°C<br>"
        if alert_data.get('description'):
            html += f"<strong>Details:</strong> {alert_data['description']}"
        
        html += '</div>'
        return html


class AlertNotificationService:
    """Service to handle alert-specific notifications"""

    @staticmethod
    def notify_alert(user, alert, preferences):
        """
        Send notifications for an alert based on user preferences
        
        Args:
            user: User object
            alert: Alert object
            preferences: UserPreferences object
        """
        results = {
            'email': False,
            'sms': False,
            'in_app': False
        }

        alert_data = {
            'alert_type': alert.get_alert_type_display(),
            'location': str(alert.location),
            'severity': alert.get_severity_display(),
            'temperature': alert.temperature_value,
            'description': alert.description,
        }

        # Email notification
        if preferences.email_notifications and user.email:
            subject = f"⚠️ {alert.get_alert_type_display()} Alert: {alert.location}"
            message = f"""
            A {alert.get_severity_display()} {alert.get_alert_type_display()} has been detected at {alert.location}.
            
            Current Temperature: {alert.temperature_value}°C
            Severity: {alert.get_severity_display()}
            
            {alert.description}
            
            Please stay safe and take appropriate precautions.
            """
            results['email'] = NotificationService.send_email_notification(
                user.email, subject, message, alert_data
            )

        # SMS notification
        if preferences.sms_notifications and user.profile.phone_number:
            sms_message = f"🚨 {alert.get_alert_type_display()} at {alert.location}: {alert.temperature_value}°C ({alert.get_severity_display()})"
            results['sms'] = NotificationService.send_sms_notification(
                user.profile.phone_number, sms_message
            )

        # In-app notification
        results['in_app'] = NotificationService.send_in_app_notification(
            user,
            f"{alert.get_alert_type_display()} Alert",
            f"A {alert.get_severity_display()} {alert.get_alert_type_display()} has been detected at {alert.location}.",
            notification_type='alert',
            alert_id=alert.id
        ) is not None

        return results

    @staticmethod
    def create_alert_digest(user, alerts, digest_type='daily'):
        """
        Create a digest of multiple alerts
        
        Args:
            user: User object
            alerts: List of alert objects
            digest_type: 'daily' or 'weekly'
        """
        if not alerts:
            return None

        period = "Daily" if digest_type == 'daily' else "Weekly"
        subject = f"{period} Weather Alert Digest - SuperTech"
        
        alert_summary = "\n".join([
            f"• {alert.get_alert_type_display()} at {alert.location}: {alert.temperature_value}°C ({alert.get_severity_display()})"
            for alert in alerts
        ])

        message = f"""
        {period} Weather Alert Summary
        
        You have {len(alerts)} active weather alerts:
        
        {alert_summary}
        
        Please review these alerts and take appropriate precautions.
        """

        return message


class SocialSharingService:
    """Service to handle social media sharing"""

    SHARE_TEMPLATES = {
        'alert': "🚨 WEATHER ALERT: {severity} {alert_type} at {location}! Temperature: {temperature}°C. Stay safe! #WeatherAlert #SuperTech",
        'forecast': "🌤️ Weather Forecast: {location} - {forecast_date}. High: {high_temp}°C, Low: {low_temp}°C. {condition} #WeatherForecast #SuperTech",
        'update': "📊 Real-time Weather Update: {location} - {temperature}°C and {condition}. {description} #WeatherMonitoring #SuperTech",
    }

    @staticmethod
    def generate_share_url(share_type, data, platform='twitter'):
        """
        Generate shareable URL for different platforms
        
        Args:
            share_type: 'alert', 'forecast', or 'update'
            data: Dictionary with required data
            platform: 'twitter', 'facebook', 'linkedin', 'whatsapp'
        
        Returns:
            Dictionary with share URLs and message
        """
        template = SocialSharingService.SHARE_TEMPLATES.get(share_type, '')
        message = template.format(**data) if template else "Check out this weather update on SuperTech!"

        # Truncate for Twitter if needed
        if platform == 'twitter' and len(message) > 280:
            message = message[:277] + "..."

        urls = {
            'twitter': f"https://twitter.com/intent/tweet?text={message}",
            'facebook': f"https://www.facebook.com/sharer/sharer.php?quote={message}",
            'linkedin': f"https://www.linkedin.com/sharing/share-offsite/?url=https://supertech-weather.com&title=Weather Alert",
            'whatsapp': f"https://wa.me/?text={message}",
        }

        return {
            'message': message,
            'url': urls.get(platform, ''),
            'platform': platform
        }

    @staticmethod
    def create_shareable_alert(alert):
        """Create shareable content for an alert"""
        data = {
            'severity': alert.get_severity_display(),
            'alert_type': alert.get_alert_type_display(),
            'location': str(alert.location),
            'temperature': alert.temperature_value,
        }
        return SocialSharingService.generate_share_url('alert', data)

    @staticmethod
    def create_shareable_forecast(forecast, location):
        """Create shareable content for a forecast"""
        data = {
            'location': str(location),
            'forecast_date': forecast.forecast_date.strftime('%Y-%m-%d'),
            'high_temp': forecast.max_temperature,
            'low_temp': forecast.min_temperature,
            'condition': forecast.condition,
        }
        return SocialSharingService.generate_share_url('forecast', data)

    @staticmethod
    def create_shareable_update(weather, location):
        """Create shareable content for a weather update"""
        data = {
            'location': str(location),
            'temperature': weather.temperature,
            'condition': weather.condition,
            'description': weather.description,
        }
        return SocialSharingService.generate_share_url('update', data)
