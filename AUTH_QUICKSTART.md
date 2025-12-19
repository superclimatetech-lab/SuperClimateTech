# Quick Start Guide - User Authentication & Notifications

## Installation & Setup

### 1. Install Dependencies
```bash
cd /home/subchief/SuperClimate
pip install -r requirements.txt
```

### 2. Apply Migrations
```bash
python manage.py makemigrations weather_api
python manage.py migrate
```

### 3. Create Superuser (Admin)
```bash
python manage.py createsuperuser
# Enter username, email, password
```

### 4. Start Development Server
```bash
python manage.py runserver
```

### 5. Access API Documentation
Visit: `http://localhost:8000/api/weather/`

---

## Quick API Tests

### Test 1: Register a New User
```bash
curl -X POST http://localhost:8000/api/weather/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

**Expected Response:**
```json
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

**Save the token!** You'll need it for authenticated requests.

---

### Test 2: Login
```bash
curl -X POST http://localhost:8000/api/weather/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123!"
  }'
```

---

### Test 3: Get User Profile
```bash
curl -X GET http://localhost:8000/api/weather/profiles/my_profile/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

Replace `YOUR_TOKEN_HERE` with the token from registration/login.

---

### Test 4: Update Profile Settings
```bash
curl -X PATCH http://localhost:8000/api/weather/profiles/1/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+1234567890",
    "country": "United States",
    "temperature_unit": "F"
  }'
```

---

### Test 5: Get User Preferences
```bash
curl -X GET http://localhost:8000/api/weather/preferences/my_preferences/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

---

### Test 6: Update Notification Settings
```bash
curl -X POST http://localhost:8000/api/weather/preferences/update_notification_settings/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "email_notifications": true,
    "sms_notifications": true,
    "in_app_notifications": true
  }'
```

---

### Test 7: Update Alert Settings
```bash
curl -X POST http://localhost:8000/api/weather/preferences/update_alert_settings/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "alert_types": "heat_wave",
    "alert_frequency": "daily",
    "alert_threshold_temp": 38.0
  }'
```

---

### Test 8: Add Preferred Location
First, get a location ID from `/api/weather/locations/`

```bash
curl -X POST http://localhost:8000/api/weather/profiles/add_preferred_location/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "location_id": 1
  }'
```

---

### Test 9: Save an Alert
First, get an alert ID from `/api/weather/alerts/`

```bash
curl -X POST http://localhost:8000/api/weather/saved-alerts/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "alert_id": 1,
    "notes": "Important heat wave in Cairo"
  }'
```

---

### Test 10: View Saved Alerts
```bash
curl -X GET http://localhost:8000/api/weather/saved-alerts/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

---

### Test 11: Get Unread Notifications
```bash
curl -X GET http://localhost:8000/api/weather/notifications/unread/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

---

### Test 12: Share an Alert
```bash
curl -X POST http://localhost:8000/api/weather/shared-content/share_alert/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "alert_id": 1,
    "platform": "twitter"
  }'
```

Supported platforms: `twitter`, `facebook`, `linkedin`, `whatsapp`, `email`

---

### Test 13: Get Sharing Statistics
```bash
curl -X GET http://localhost:8000/api/weather/shared-content/share_stats/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

---

## Email Configuration (Optional)

To enable email notifications, update your `.env` file:

```
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

Then update `/home/subchief/SuperClimate/supertech_backend/settings.py`:

```python
import os
from decouple import config

EMAIL_HOST_USER = config('EMAIL_HOST_USER', default=None)
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default=None)
```

---

## SMS Configuration (Optional)

To enable SMS notifications with Twilio:

1. Sign up at https://www.twilio.com
2. Get your Account SID, Auth Token, and Twilio Phone Number
3. Update `.env`:

```
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

4. Update settings.py:

```python
TWILIO_ACCOUNT_SID = config('TWILIO_ACCOUNT_SID', default=None)
TWILIO_AUTH_TOKEN = config('TWILIO_AUTH_TOKEN', default=None)
TWILIO_PHONE_NUMBER = config('TWILIO_PHONE_NUMBER', default=None)
```

---

## Frontend Integration

### Example: React Component for Login

```typescript
// services/authService.ts
export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) {
  const response = await fetch('/api/weather/auth/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  const result = await response.json();
  if (response.ok) {
    localStorage.setItem('token', result.token);
  }
  return result;
}

export async function loginUser(username: string, password: string) {
  const response = await fetch('/api/weather/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const result = await response.json();
  if (response.ok) {
    localStorage.setItem('token', result.token);
  }
  return result;
}

export function getAuthToken() {
  return localStorage.getItem('token');
}

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
    ...options.headers
  };
  
  return fetch(endpoint, { ...options, headers });
}
```

### Example: Save Alert Component

```typescript
// components/AlertSaver.tsx
import { apiCall } from '../services/authService';

export function AlertSaver({ alertId, location }: Props) {
  const [saved, setSaved] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    const response = await apiCall('/api/weather/saved-alerts/', {
      method: 'POST',
      body: JSON.stringify({
        alert_id: alertId,
        notes: notes
      })
    });
    
    if (response.ok) {
      setSaved(true);
    }
  };

  return (
    <div>
      <textarea 
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add notes..."
      />
      <button onClick={handleSave}>
        {saved ? '✓ Saved' : 'Save Alert'}
      </button>
    </div>
  );
}
```

### Example: Share on Social Media

```typescript
// components/SocialShare.tsx
import { apiCall } from '../services/authService';

export function SocialShare({ alertId }: Props) {
  const platforms = ['twitter', 'facebook', 'linkedin', 'whatsapp'];

  const handleShare = async (platform: string) => {
    const response = await apiCall('/api/weather/shared-content/share_alert/', {
      method: 'POST',
      body: JSON.stringify({
        alert_id: alertId,
        platform: platform
      })
    });
    
    const data = await response.json();
    if (data.share_url) {
      window.open(data.share_url, '_blank');
    }
  };

  return (
    <div className="share-buttons">
      {platforms.map(platform => (
        <button
          key={platform}
          onClick={() => handleShare(platform)}
          className={`share-btn share-${platform}`}
        >
          Share on {platform}
        </button>
      ))}
    </div>
  );
}
```

---

## Admin Panel

Access Django Admin at: `http://localhost:8000/admin/`

- View all users and their profiles
- Manage user preferences
- View saved alerts and forecasts
- Monitor notifications sent
- Check social sharing activity

---

## Database Models

All new models are available in Django Admin:

1. **UserProfile** - User profiles with locations and settings
2. **UserPreferences** - Alert and notification preferences
3. **SavedAlert** - Bookmarked alerts
4. **SavedForecast** - Bookmarked forecasts
5. **InAppNotification** - Real-time in-app notifications
6. **SharedContent** - Social media share tracking

---

## Troubleshooting

### Issue: "Token not found" error
- Make sure you include the Authorization header in your requests
- Format: `Authorization: Token YOUR_TOKEN_HERE`

### Issue: "User not found" on profile endpoints
- Profile is automatically created on registration
- Try re-registering if needed

### Issue: Email notifications not working
- Check EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in settings
- Make sure you're using Gmail App Passwords (not your actual password)

### Issue: SMS notifications not working
- Verify Twilio credentials are set correctly
- Check TWILIO_PHONE_NUMBER format (must include country code)
- Make sure the recipient phone number is in E.164 format (+1234567890)

---

## Next Steps

1. ✅ Test all API endpoints with curl
2. ✅ Configure email/SMS services
3. ✅ Integrate with React frontend
4. ✅ Create notification dashboard
5. ✅ Add user preferences UI
6. ✅ Implement share buttons in alerts page
7. ✅ Set up Celery tasks for scheduled notifications

For detailed API documentation, see `AUTH_IMPLEMENTATION.md`
