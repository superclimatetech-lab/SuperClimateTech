# User Authentication, Preferences, and Notification System

## Overview

This document outlines the implementation of three key features for the SuperTech Weather Monitoring system:

1. **User Authentication** - Register, login, and manage user profiles
2. **Saved Preferences** - Save locations, alerts, and forecasts for quick access
3. **Email/SMS Alert Notifications** - Multi-channel alert delivery
4. **Social Sharing** - Share alerts and forecasts on social media platforms

---

## Architecture

### Models

#### 1. UserProfile (auth_models.py)
Extends the default Django User model with weather-specific preferences.

**Fields:**
- `user` - OneToOneField to User
- `phone_number` - For SMS notifications
- `country` - User's country
- `preferred_locations` - ManyToMany relationship with Location
- `temperature_unit` - Celsius or Fahrenheit
- `notification_enabled` - Global notification toggle

**Usage:**
```python
profile = UserProfile.objects.get(user=user)
profile.preferred_locations.add(location)
profile.temperature_unit = 'F'  # Fahrenheit
profile.save()
```

#### 2. UserPreferences (auth_models.py)
Detailed preferences for notifications and alerts.

**Fields:**
- `alert_types` - Heat Wave, Cold Wave, Extreme Weather, or All
- `alert_frequency` - Immediate, Daily Digest, or Weekly Digest
- `alert_threshold_temp` - Custom temperature threshold
- `email_notifications` - Enable/disable email alerts
- `sms_notifications` - Enable/disable SMS alerts
- `in_app_notifications` - Enable/disable in-app alerts
- `allow_social_sharing` - Enable/disable sharing features
- `default_share_platforms` - Default platforms for sharing

**Usage:**
```python
prefs = UserPreferences.objects.get(user=user)
prefs.email_notifications = True
prefs.alert_frequency = 'daily'  # Daily digest
prefs.save()
```

#### 3. SavedAlert & SavedForecast (auth_models.py)
Bookmark important alerts and forecasts for quick reference.

**SavedAlert:**
- `user` - ForeignKey to User
- `alert` - ForeignKey to Alert
- `saved_at` - Timestamp
- `notes` - Optional notes about the alert

**SavedForecast:**
- `user` - ForeignKey to User
- `forecast` - ForeignKey to Forecast
- `location_name` - Display name
- `saved_at` - Timestamp

**Usage:**
```python
# Save an alert
SavedAlert.objects.create(user=user, alert=alert, notes="Important heat wave")

# Get user's saved alerts
saved = SavedAlert.objects.filter(user=user).order_by('-saved_at')
```

#### 4. InAppNotification (models.py)
Real-time in-app notifications for immediate updates.

**Fields:**
- `user` - ForeignKey to User
- `title` - Notification title
- `message` - Notification body
- `notification_type` - info, warning, alert, success
- `alert` - Optional reference to Alert
- `is_read` - Read status
- `created_at` - Timestamp
- `read_at` - When notification was read

#### 5. SharedContent (models.py)
Track all social media shares by users.

**Fields:**
- `user` - ForeignKey to User
- `content_type` - alert, forecast, or update
- `platform` - twitter, facebook, linkedin, whatsapp, email
- `alert` / `forecast` - Reference to shared content
- `share_message` - Pre-formatted share message
- `share_url` - Generated share URL
- `shared_at` - Timestamp

---

## API Endpoints

### Authentication Endpoints

#### 1. Register User
```
POST /api/weather/auth/register/
Content-Type: application/json

{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe"
}

Response (201):
{
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "is_active": true
    },
    "token": "abc123def456...",
    "message": "User registered successfully"
}
```

#### 2. Login User
```
POST /api/weather/auth/login/
Content-Type: application/json

{
    "username": "john_doe",
    "password": "SecurePass123!"
}

Response (200):
{
    "user": {...},
    "token": "abc123def456..."
}
```

#### 3. Logout User
```
POST /api/weather/auth/logout/
Authorization: Token abc123def456...

Response (200):
{
    "message": "Logged out successfully"
}
```

### User Profile Endpoints

#### Get My Profile
```
GET /api/weather/profiles/my_profile/
Authorization: Token abc123def456...

Response (200):
{
    "id": 1,
    "user": {...},
    "phone_number": "+1234567890",
    "country": "United States",
    "preferred_locations": [
        {
            "id": 1,
            "name": "Cairo",
            "country": "Egypt",
            "latitude": 30.0444,
            "longitude": 31.2357,
            "is_featured": true
        }
    ],
    "temperature_unit": "C",
    "notification_enabled": true,
    "created_at": "2025-12-18T10:00:00Z",
    "updated_at": "2025-12-18T10:00:00Z"
}
```

#### Add Preferred Location
```
POST /api/weather/profiles/add_preferred_location/
Authorization: Token abc123def456...
Content-Type: application/json

{
    "location_id": 1
}

Response (200): Updated profile with new location
```

#### Remove Preferred Location
```
POST /api/weather/profiles/remove_preferred_location/
Authorization: Token abc123def456...
Content-Type: application/json

{
    "location_id": 1
}

Response (200): Updated profile without location
```

### User Preferences Endpoints

#### Get My Preferences
```
GET /api/weather/preferences/my_preferences/
Authorization: Token abc123def456...

Response (200):
{
    "id": 1,
    "user": {...},
    "alert_types": "all",
    "alert_frequency": "daily",
    "alert_threshold_temp": 35.0,
    "email_notifications": true,
    "sms_notifications": false,
    "in_app_notifications": true,
    "allow_social_sharing": true,
    "default_share_platforms": ["twitter", "facebook"],
    "default_share_platforms_list": ["twitter", "facebook"]
}
```

#### Update Notification Settings
```
POST /api/weather/preferences/update_notification_settings/
Authorization: Token abc123def456...
Content-Type: application/json

{
    "email_notifications": true,
    "sms_notifications": true,
    "in_app_notifications": true
}

Response (200): Updated preferences
```

#### Update Alert Settings
```
POST /api/weather/preferences/update_alert_settings/
Authorization: Token abc123def456...
Content-Type: application/json

{
    "alert_types": "heat_wave",
    "alert_frequency": "immediate",
    "alert_threshold_temp": 38.0
}

Response (200): Updated preferences
```

### Saved Alerts/Forecasts Endpoints

#### Save an Alert
```
POST /api/weather/saved-alerts/
Authorization: Token abc123def456...
Content-Type: application/json

{
    "alert_id": 5,
    "notes": "Critical heat wave in Cairo"
}

Response (201): Saved alert object
```

#### Get My Saved Alerts
```
GET /api/weather/saved-alerts/
Authorization: Token abc123def456...

Response (200): [
    {
        "id": 1,
        "user": 1,
        "alert": 5,
        "alert_data": {...},
        "saved_at": "2025-12-18T10:00:00Z",
        "notes": "Critical heat wave"
    }
]
```

#### Remove Saved Alert
```
DELETE /api/weather/saved-alerts/{id}/
Authorization: Token abc123def456...

Response (204): No content
```

### In-App Notifications Endpoints

#### Get Unread Notifications
```
GET /api/weather/notifications/unread/
Authorization: Token abc123def456...

Response (200): [
    {
        "id": 1,
        "user": 1,
        "title": "Heat Wave Alert",
        "message": "Extreme heat wave detected in Cairo",
        "notification_type": "alert",
        "alert": 5,
        "is_read": false,
        "created_at": "2025-12-18T10:30:00Z"
    }
]
```

#### Mark Notification as Read
```
POST /api/weather/notifications/{id}/mark_as_read/
Authorization: Token abc123def456...

Response (200): Updated notification object
```

#### Mark All as Read
```
POST /api/weather/notifications/mark_all_as_read/
Authorization: Token abc123def456...

Response (200): {
    "message": "All notifications marked as read"
}
```

#### Get Notification Summary
```
GET /api/weather/notifications/summary/
Authorization: Token abc123def456...

Response (200): {
    "total": 15,
    "unread": 3,
    "by_type": {
        "alert": 5,
        "warning": 4,
        "info": 6
    }
}
```

### Social Sharing Endpoints

#### Share an Alert
```
POST /api/weather/shared-content/share_alert/
Authorization: Token abc123def456...
Content-Type: application/json

{
    "alert_id": 5,
    "platform": "twitter"  # or facebook, linkedin, whatsapp
}

Response (201): {
    "id": 1,
    "user": 1,
    "content_type": "alert",
    "platform": "twitter",
    "alert": 5,
    "share_message": "🚨 WEATHER ALERT: Extreme Heat Wave at Cairo! Temperature: 42°C. Stay safe! #WeatherAlert #SuperTech",
    "share_url": "https://twitter.com/intent/tweet?text=...",
    "shared_at": "2025-12-18T10:45:00Z"
}
```

#### Share a Forecast
```
POST /api/weather/shared-content/share_forecast/
Authorization: Token abc123def456...
Content-Type: application/json

{
    "forecast_id": 10,
    "platform": "facebook"
}

Response (201): Shared forecast object
```

#### Get Sharing Statistics
```
GET /api/weather/shared-content/share_stats/
Authorization: Token abc123def456...

Response (200): {
    "total_shares": 42,
    "by_platform": {
        "twitter": 18,
        "facebook": 12,
        "linkedin": 8,
        "whatsapp": 4
    },
    "by_content_type": {
        "alert": 20,
        "forecast": 15,
        "update": 7
    }
}
```

---

## Notification Services

### NotificationService (notification_service.py)

Multi-channel notification delivery system.

#### Email Notifications
```python
from weather_api.notification_service import NotificationService

NotificationService.send_email_notification(
    recipient_email="user@example.com",
    subject="Heat Wave Alert",
    message="A severe heat wave has been detected...",
    alert_data={
        'alert_type': 'Heat Wave',
        'location': 'Cairo, Egypt',
        'severity': 'Extreme',
        'temperature': 42.5,
        'description': 'Extreme heat expected for 5 days'
    }
)
```

#### SMS Notifications
```python
NotificationService.send_sms_notification(
    phone_number="+1234567890",
    message="🚨 Heat Wave at Cairo: 42°C (Extreme)"
)
```

#### In-App Notifications
```python
NotificationService.send_in_app_notification(
    user=user,
    title="Heat Wave Alert",
    message="Extreme heat wave detected in Cairo",
    notification_type='alert',
    alert_id=5
)
```

### AlertNotificationService

Specialized service for alert notifications.

#### Notify Alert Based on Preferences
```python
from weather_api.notification_service import AlertNotificationService
from weather_api.models import Alert
from django.contrib.auth.models import User

user = User.objects.get(username='john_doe')
alert = Alert.objects.get(id=5)
preferences = user.preferences

results = AlertNotificationService.notify_alert(user, alert, preferences)
# results = {'email': True, 'sms': True, 'in_app': True}
```

### SocialSharingService

Generate shareable content for social platforms.

#### Create Shareable Alert
```python
from weather_api.notification_service import SocialSharingService
from weather_api.models import Alert

alert = Alert.objects.get(id=5)
share_data = SocialSharingService.create_shareable_alert(alert)

# For specific platform
share_twitter = SocialSharingService.generate_share_url(
    share_type='alert',
    data={
        'severity': 'Extreme',
        'alert_type': 'Heat Wave',
        'location': 'Cairo, Egypt',
        'temperature': 42.5
    },
    platform='twitter'
)
```

---

## Configuration

### Email Setup (settings.py)

For Gmail:
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
DEFAULT_FROM_EMAIL = 'noreply@supertech-weather.com'
```

Generate Gmail App Password:
1. Enable 2-factor authentication on Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Select Mail and Windows Computer
4. Use the generated 16-character password

### SMS Setup (Twilio)

1. Create Twilio account at https://www.twilio.com
2. Get Account SID and Auth Token
3. Configure in settings.py:

```python
TWILIO_ACCOUNT_SID = 'your-account-sid'
TWILIO_AUTH_TOKEN = 'your-auth-token'
TWILIO_PHONE_NUMBER = '+1234567890'
```

### Environment Variables (.env)
```
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=xxxx xxxx xxxx xxxx
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Frontend Integration

### Authentication Flow

```javascript
// Register
const register = async (username, email, password) => {
    const response = await fetch('/api/weather/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username, email, password,
            password_confirm: password
        })
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
};

// Login
const login = async (username, password) => {
    const response = await fetch('/api/weather/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
};

// Authorized API calls
const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
        ...options.headers
    };
    return fetch(endpoint, { ...options, headers });
};

// Get saved alerts
const getSavedAlerts = async () => {
    return apiCall('/api/weather/saved-alerts/');
};

// Save an alert
const saveAlert = async (alertId, notes) => {
    return apiCall('/api/weather/saved-alerts/', {
        method: 'POST',
        body: JSON.stringify({ alert_id: alertId, notes })
    });
};
```

---

## Testing

### Test User Registration
```bash
curl -X POST http://localhost:8000/api/weather/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "password_confirm": "TestPass123!",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### Test Get User Profile
```bash
curl -X GET http://localhost:8000/api/weather/profiles/my_profile/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### Test Save Alert
```bash
curl -X POST http://localhost:8000/api/weather/saved-alerts/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "alert_id": 1,
    "notes": "Important alert"
  }'
```

---

## Database Migrations

Apply migrations to create new tables:

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Summary

This implementation provides:

✅ **User Authentication** - Secure registration and login with token-based auth
✅ **Saved Preferences** - Locations, alert settings, notification preferences
✅ **Multi-Channel Notifications** - Email, SMS, and in-app alerts
✅ **Social Sharing** - Share alerts/forecasts on Twitter, Facebook, LinkedIn, WhatsApp
✅ **User Dashboard** - Saved alerts, notifications, sharing statistics
✅ **Customizable Alerts** - Per-user thresholds and frequencies
✅ **Audit Trail** - Track all notifications and shares

All features are fully integrated with the Django REST API and ready for frontend consumption.
