# Implementation Reference Guide

## Quick Reference for All New Features

### 🔐 Authentication Endpoints

#### Register
```bash
curl -X POST http://localhost:8000/api/weather/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!"
  }'
```
Response: `{"user": {...}, "token": "xyz...", "message": "..."}`

#### Login
```bash
curl -X POST http://localhost:8000/api/weather/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "SecurePass123!"}'
```
Response: `{"user": {...}, "token": "xyz..."}`

#### Logout
```bash
curl -X POST http://localhost:8000/api/weather/auth/logout/ \
  -H "Authorization: Token YOUR_TOKEN"
```
Response: `{"message": "Logged out successfully"}`

---

### 👤 User Profile Endpoints

#### Get My Profile
```bash
curl http://localhost:8000/api/weather/profiles/my_profile/ \
  -H "Authorization: Token YOUR_TOKEN"
```

#### Add Preferred Location
```bash
curl -X POST http://localhost:8000/api/weather/profiles/add_preferred_location/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"location_id": 1}'
```

#### Remove Preferred Location
```bash
curl -X POST http://localhost:8000/api/weather/profiles/remove_preferred_location/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"location_id": 1}'
```

---

### ⚙️ User Preferences Endpoints

#### Get My Preferences
```bash
curl http://localhost:8000/api/weather/preferences/my_preferences/ \
  -H "Authorization: Token YOUR_TOKEN"
```

#### Update Notification Settings
```bash
curl -X POST http://localhost:8000/api/weather/preferences/update_notification_settings/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email_notifications": true,
    "sms_notifications": true,
    "in_app_notifications": true
  }'
```

#### Update Alert Settings
```bash
curl -X POST http://localhost:8000/api/weather/preferences/update_alert_settings/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "alert_types": "heat_wave",
    "alert_frequency": "daily",
    "alert_threshold_temp": 38.0
  }'
```

Alert types: `heat_wave`, `cold_wave`, `extreme_weather`, `all`
Frequencies: `immediate`, `daily`, `weekly`

---

### 💾 Saved Alerts & Forecasts

#### Save an Alert
```bash
curl -X POST http://localhost:8000/api/weather/saved-alerts/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "alert_id": 5,
    "notes": "Critical heat wave"
  }'
```

#### Get Saved Alerts
```bash
curl http://localhost:8000/api/weather/saved-alerts/ \
  -H "Authorization: Token YOUR_TOKEN"
```

#### Delete Saved Alert
```bash
curl -X DELETE http://localhost:8000/api/weather/saved-alerts/1/ \
  -H "Authorization: Token YOUR_TOKEN"
```

#### Save a Forecast
```bash
curl -X POST http://localhost:8000/api/weather/saved-forecasts/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "forecast_id": 10,
    "location_name": "Cairo, Egypt"
  }'
```

---

### 📲 Notifications

#### Get All Notifications
```bash
curl http://localhost:8000/api/weather/notifications/ \
  -H "Authorization: Token YOUR_TOKEN"
```

#### Get Unread Only
```bash
curl http://localhost:8000/api/weather/notifications/unread/ \
  -H "Authorization: Token YOUR_TOKEN"
```

#### Mark as Read
```bash
curl -X POST http://localhost:8000/api/weather/notifications/1/mark_as_read/ \
  -H "Authorization: Token YOUR_TOKEN"
```

#### Mark All as Read
```bash
curl -X POST http://localhost:8000/api/weather/notifications/mark_all_as_read/ \
  -H "Authorization: Token YOUR_TOKEN"
```

#### Get Summary
```bash
curl http://localhost:8000/api/weather/notifications/summary/ \
  -H "Authorization: Token YOUR_TOKEN"
```

---

### 📱 Social Sharing

#### Share an Alert
```bash
curl -X POST http://localhost:8000/api/weather/shared-content/share_alert/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "alert_id": 5,
    "platform": "twitter"
  }'
```

Platforms: `twitter`, `facebook`, `linkedin`, `whatsapp`, `email`

#### Share a Forecast
```bash
curl -X POST http://localhost:8000/api/weather/shared-content/share_forecast/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "forecast_id": 10,
    "platform": "facebook"
  }'
```

#### View All Shares
```bash
curl http://localhost:8000/api/weather/shared-content/ \
  -H "Authorization: Token YOUR_TOKEN"
```

#### Sharing Statistics
```bash
curl http://localhost:8000/api/weather/shared-content/share_stats/ \
  -H "Authorization: Token YOUR_TOKEN"
```

---

## Environment Variables (.env)

```bash
# Email Configuration (optional)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# SMS Configuration (optional)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Python Integration Examples

### Registration
```python
import requests

response = requests.post(
    'http://localhost:8000/api/weather/auth/register/',
    json={
        'username': 'john_doe',
        'email': 'john@example.com',
        'password': 'SecurePass123!',
        'password_confirm': 'SecurePass123!'
    }
)
data = response.json()
token = data['token']
```

### Authenticated API Call
```python
headers = {'Authorization': f'Token {token}'}
response = requests.get(
    'http://localhost:8000/api/weather/profiles/my_profile/',
    headers=headers
)
profile = response.json()
```

### Save an Alert
```python
response = requests.post(
    'http://localhost:8000/api/weather/saved-alerts/',
    headers=headers,
    json={'alert_id': 5, 'notes': 'Important'}
)
saved_alert = response.json()
```

### Share Content
```python
response = requests.post(
    'http://localhost:8000/api/weather/shared-content/share_alert/',
    headers=headers,
    json={'alert_id': 5, 'platform': 'twitter'}
)
share_data = response.json()
print(share_data['share_url'])  # Open in browser
```

---

## JavaScript/TypeScript Integration

### Login and Store Token
```javascript
async function login(username, password) {
    const response = await fetch('/api/weather/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
}
```

### Authenticated Fetch Helper
```javascript
async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
        ...options.headers
    };
    return fetch(endpoint, { ...options, headers });
}

// Usage:
const response = await apiCall('/api/weather/saved-alerts/', {
    method: 'POST',
    body: JSON.stringify({ alert_id: 5, notes: 'Important' })
});
```

### Get Notifications
```javascript
async function getUnreadNotifications() {
    const response = await apiCall('/api/weather/notifications/unread/');
    return response.json();
}

// Use:
const notifications = await getUnreadNotifications();
console.log(notifications);
```

### Share Alert
```javascript
async function shareAlert(alertId, platform = 'twitter') {
    const response = await apiCall('/api/weather/shared-content/share_alert/', {
        method: 'POST',
        body: JSON.stringify({ alert_id: alertId, platform })
    });
    const data = await response.json();
    // Open share URL in new window
    window.open(data.share_url, '_blank');
}
```

---

## Common Response Formats

### User Object
```json
{
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true
}
```

### Saved Alert
```json
{
    "id": 1,
    "user": 1,
    "alert": 5,
    "alert_data": {
        "id": 5,
        "location": "Cairo, Egypt",
        "alert_type": "heat_wave",
        "severity": "extreme",
        "temperature_value": 42.5,
        "description": "Extreme heat expected..."
    },
    "saved_at": "2025-12-18T10:00:00Z",
    "notes": "Critical heat wave"
}
```

### Notification
```json
{
    "id": 1,
    "user": 1,
    "title": "Heat Wave Alert",
    "message": "Extreme heat wave detected in Cairo",
    "notification_type": "alert",
    "alert": 5,
    "is_read": false,
    "created_at": "2025-12-18T10:30:00Z",
    "read_at": null
}
```

### Share Record
```json
{
    "id": 1,
    "user": 1,
    "content_type": "alert",
    "platform": "twitter",
    "alert": 5,
    "share_message": "🚨 WEATHER ALERT: Extreme Heat Wave at Cairo!...",
    "share_url": "https://twitter.com/intent/tweet?text=...",
    "shared_at": "2025-12-18T11:00:00Z"
}
```

---

## Error Responses

### Invalid Credentials
```json
{
    "error": "Invalid credentials"
}
```

### Missing Required Field
```json
{
    "username": ["This field is required."],
    "email": ["This field is required."]
}
```

### Not Found
```json
{
    "error": "Alert not found"
}
```

### Unauthorized
```json
{
    "error": "Invalid token"
}
```

---

## Testing Checklist

- [ ] Register new user
- [ ] Login with credentials
- [ ] Get user profile
- [ ] Add preferred location
- [ ] Update preferences
- [ ] Save an alert
- [ ] List saved alerts
- [ ] Get notifications
- [ ] Mark notification as read
- [ ] Share alert on Twitter
- [ ] Share forecast on Facebook
- [ ] View sharing statistics

---

## Useful Django Admin Commands

```bash
# Create superuser
python manage.py createsuperuser

# Run migrations
python manage.py migrate

# Create migration for model changes
python manage.py makemigrations

# Show migration status
python manage.py showmigrations

# Load sample data
python manage.py load_locations

# Access Django shell
python manage.py shell

# Run tests
python manage.py test

# Collect static files
python manage.py collectstatic
```

---

## Production Deployment Checklist

- [ ] Set DEBUG=False in settings
- [ ] Generate new SECRET_KEY
- [ ] Configure ALLOWED_HOSTS
- [ ] Set up HTTPS/SSL
- [ ] Configure email credentials
- [ ] Configure SMS credentials
- [ ] Set up database backups
- [ ] Configure Celery/Redis
- [ ] Set up logging
- [ ] Enable rate limiting
- [ ] Configure monitoring
- [ ] Run security check: `python manage.py check --deploy`

---

For comprehensive documentation, see:
- `AUTH_IMPLEMENTATION.md` - Complete feature guide
- `AUTH_QUICKSTART.md` - Quick start examples
- `SYSTEM_ARCHITECTURE.md` - Architecture diagrams
