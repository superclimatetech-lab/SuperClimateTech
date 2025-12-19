# System Architecture & Data Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SUPERTECH FRONTEND                           │
│                       (React/TypeScript)                            │
│  ┌──────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Auth Page  │  │ Profile Mgmt│  │Dashboard    │              │
│  │ (Login/Reg)  │  │             │  │(Alerts/Saved)             │
│  └──────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ (API Calls)
         ┌────────────────────┴────────────────────┐
         │                                         │
┌────────▼──────────────────────────────────────────────────┐
│         DJANGO REST API ENDPOINTS                         │
│ (Token Authentication - rest_framework.authtoken)        │
│                                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │ /api/weather/auth/*          (5 endpoints)      │  │
│  │ /api/weather/profiles/*      (5 endpoints)      │  │
│  │ /api/weather/preferences/*   (3 endpoints)      │  │
│  │ /api/weather/saved-alerts/*  (3 endpoints)      │  │
│  │ /api/weather/saved-forecasts/(3 endpoints)      │  │
│  │ /api/weather/notifications/* (5 endpoints)      │  │
│  │ /api/weather/shared-content/*)(4 endpoints)     │  │
│  └──────────────────────────────────────────────────┘  │
└────────┬──────────────────────────────────────────────────┘
         │
    ┌────▼─────────────────────────────────────────────┐
    │     BUSINESS LOGIC LAYER                         │
    │                                                   │
    │  ┌────────────────────────────────────────────┐ │
    │  │ auth_views.py - Authentication & Profiles  │ │
    │  ├────────────────────────────────────────────┤ │
    │  │ - User registration/login/logout           │ │
    │  │ - Profile management                       │ │
    │  │ - Preference updates                       │ │
    │  │ - Saved content management                 │ │
    │  └────────────────────────────────────────────┘ │
    │                                                   │
    │  ┌────────────────────────────────────────────┐ │
    │  │ notification_service.py - Notifications    │ │
    │  ├────────────────────────────────────────────┤ │
    │  │ - NotificationService (Email/SMS/InApp)    │ │
    │  │ - AlertNotificationService                 │ │
    │  │ - SocialSharingService                     │ │
    │  └────────────────────────────────────────────┘ │
    └────┬──────────────────────────────────────────────┘
         │
    ┌────▼─────────────────────────────────────────────┐
    │    DATA ACCESS LAYER (Django ORM)               │
    │                                                   │
    │  ┌────────────────────────────────────────────┐ │
    │  │ Models (auth_models.py & models.py)        │ │
    │  ├────────────────────────────────────────────┤ │
    │  │ - UserProfile                              │ │
    │  │ - UserPreferences                          │ │
    │  │ - SavedAlert / SavedForecast               │ │
    │  │ - InAppNotification                        │ │
    │  │ - SharedContent                            │ │
    │  │ - Alert, Forecast, Location (existing)     │ │
    │  └────────────────────────────────────────────┘ │
    └────┬──────────────────────────────────────────────┘
         │
    ┌────▼──────────────────────────────────────────────┐
    │        EXTERNAL SERVICES                          │
    │                                                    │
    │  ┌─────────────────────────────────────────────┐ │
    │  │ EMAIL SERVICE                               │ │
    │  │ SMTP Server (Gmail/Custom)                  │ │
    │  │ → send_email_notification()                 │ │
    │  └─────────────────────────────────────────────┘ │
    │                                                    │
    │  ┌─────────────────────────────────────────────┐ │
    │  │ SMS SERVICE                                 │ │
    │  │ Twilio API                                  │ │
    │  │ → send_sms_notification()                   │ │
    │  └─────────────────────────────────────────────┘ │
    │                                                    │
    │  ┌─────────────────────────────────────────────┐ │
    │  │ DATABASE                                    │ │
    │  │ SQLite (dev) / PostgreSQL (prod)            │ │
    │  │ → All models stored here                    │ │
    │  └─────────────────────────────────────────────┘ │
    └────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
USER REGISTRATION
├─ POST /auth/register/
├─ Validate credentials
├─ Create User instance
├─ Auto-create UserProfile
├─ Auto-create UserPreferences
├─ Generate auth Token
└─ Return token to client

USER LOGIN
├─ POST /auth/login/
├─ Validate credentials
├─ Check password hash
├─ Get or create Token
└─ Return token to client

AUTHENTICATED API CALLS
├─ Include: Authorization: Token {token}
├─ DRF validates token
├─ Load User from token
├─ Check permissions
├─ Execute endpoint
└─ Return user-specific data
```

---

## Notification Flow

```
ALERT TRIGGERED
├─ Alert created in database
├─ Check affected users
└─ For each user:
   ├─ Load UserPreferences
   ├─ Check if notifications enabled
   ├─ Check alert type filter
   ├─ Check frequency setting
   │
   ├─ IF email_notifications=True:
   │  └─ send_email_notification()
   │     ├─ Format HTML email
   │     ├─ Add alert details
   │     └─ Send via SMTP
   │
   ├─ IF sms_notifications=True:
   │  └─ send_sms_notification()
   │     ├─ Format SMS message
   │     ├─ Send via Twilio
   │     └─ Log delivery
   │
   └─ IF in_app_notifications=True:
      └─ send_in_app_notification()
         ├─ Create InAppNotification
         ├─ Mark unread
         └─ Push to browser

DIGEST MODE (Daily/Weekly)
├─ Celery task triggered on schedule
├─ Collect alerts for period
├─ Group by user
├─ Create digest for each user
└─ Send single email with all alerts
```

---

## Social Sharing Flow

```
USER SHARES ALERT/FORECAST
├─ POST /shared-content/share_alert/ or share_forecast/
├─ Load Alert/Forecast
├─ Get share platform from request
│
├─ Generate share message
│  ├─ Format with content details
│  ├─ Add hashtags (#WeatherAlert #SuperTech)
│  └─ Truncate if needed (Twitter 280 chars)
│
├─ Generate platform-specific URL
│  ├─ Twitter: https://twitter.com/intent/tweet?text={msg}
│  ├─ Facebook: https://facebook.com/sharer?quote={msg}
│  ├─ LinkedIn: https://linkedin.com/sharing/share-offsite/
│  └─ WhatsApp: https://wa.me/?text={msg}
│
├─ Create SharedContent record
│  ├─ Link user
│  ├─ Link alert/forecast
│  ├─ Store message & URL
│  └─ Record timestamp
│
└─ Return share URL to frontend
   └─ Frontend opens URL in new window
```

---

## Data Model Relationships

```
User
├─ 1:1 ─→ UserProfile
│         ├─ M:M ─→ Location (preferred_locations)
│         └─ contains: phone, country, temp_unit
│
├─ 1:1 ─→ UserPreferences
│         └─ contains: alert_types, frequency, thresholds
│
├─ 1:M ─→ SavedAlert
│         └─ M:1 ─→ Alert
│
├─ 1:M ─→ SavedForecast
│         └─ M:1 ─→ Forecast
│
├─ 1:M ─→ InAppNotification
│         ├─ 0:1 ─→ Alert (optional)
│         └─ contains: title, message, type
│
└─ 1:M ─→ SharedContent
          ├─ 0:1 ─→ Alert (optional)
          ├─ 0:1 ─→ Forecast (optional)
          └─ contains: platform, message, url
```

---

## Request/Response Examples

### Authentication Example

```
CLIENT: Register
────────────────
POST /api/weather/auth/register/
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "password_confirm": "SecurePass123!"
}

SERVER: Response
────────────────
HTTP 201 Created
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "abc123def456xyz789",
  "message": "User registered successfully"
}

SUBSEQUENT REQUESTS
───────────────────
Authorization: Token abc123def456xyz789
```

### Save Alert Example

```
CLIENT: Save Alert
──────────────────
POST /api/weather/saved-alerts/
Authorization: Token abc123def456xyz789
{
  "alert_id": 5,
  "notes": "Critical heat wave"
}

SERVER: Response
────────────────
HTTP 201 Created
{
  "id": 1,
  "user": 1,
  "alert": 5,
  "alert_data": {
    "location": "Cairo, Egypt",
    "alert_type": "heat_wave",
    "severity": "extreme",
    "temperature_value": 42.5
  },
  "saved_at": "2025-12-18T10:30:00Z",
  "notes": "Critical heat wave"
}
```

### Share Content Example

```
CLIENT: Share Alert
───────────────────
POST /api/weather/shared-content/share_alert/
Authorization: Token abc123def456xyz789
{
  "alert_id": 5,
  "platform": "twitter"
}

SERVER: Response
────────────────
HTTP 201 Created
{
  "id": 1,
  "user": 1,
  "content_type": "alert",
  "platform": "twitter",
  "alert": 5,
  "share_message": "🚨 WEATHER ALERT: Extreme Heat Wave at Cairo!...",
  "share_url": "https://twitter.com/intent/tweet?text=🚨+WEATHER+ALERT...",
  "shared_at": "2025-12-18T11:00:00Z"
}

FRONTEND: Opens share_url in new window
```

---

## Notification Channels Comparison

| Channel | Speed | Format | Cost | Setup | Reach |
|---------|-------|--------|------|-------|-------|
| **Email** | Medium | HTML | Free | SMTP | High |
| **SMS** | Fast | Text | $0.01/msg | Twilio | Medium |
| **In-App** | Instant | JSON | Free | Built-in | Active users |

### Recommended Usage

- **Immediate Alerts**: In-App (instant) + Email (confirmation)
- **Daily Digest**: Email (once per day, low frequency)
- **Critical Events**: SMS (high urgency)
- **Background Info**: In-App (non-intrusive)

---

## Security Considerations

```
1. AUTHENTICATION
   ├─ Token stored in localStorage (frontend)
   ├─ HTTPS required in production
   ├─ Tokens expire (optional, can be added)
   └─ Session-independent (stateless)

2. AUTHORIZATION
   ├─ Users can only access their own data
   ├─ Staff/admin can access all data
   └─ Queryset filtering per user

3. DATA VALIDATION
   ├─ Email validation on registration
   ├─ Phone validation for SMS
   ├─ Temperature range validation
   └─ Serializer validation

4. PRIVACY
   ├─ Personal data encrypted at rest (optional)
   ├─ Passwords hashed with PBKDF2
   ├─ No passwords in API responses
   └─ Audit logging of shares (optional)
```

---

## Performance Optimization

```
DATABASE QUERIES
├─ Indexes on: (user, is_read), (platform), (content_type)
├─ select_related() for FK relationships
├─ prefetch_related() for M2M relationships
└─ Pagination on list endpoints

CACHING
├─ User preferences cache (optional)
├─ Location data cache
├─ Share template cache
└─ TTL: 1 hour (configurable)

ASYNC OPERATIONS
├─ Celery tasks for email sending
├─ Async SMS delivery
├─ Background digest creation
└─ Scheduled: Daily/Weekly

API OPTIMIZATION
├─ Pagination (20 items/page)
├─ Filtering on list endpoints
├─ Search on username/location
└─ Ordering by date/relevance
```

---

## Deployment Checklist

- [ ] Set EMAIL_HOST_USER and EMAIL_HOST_PASSWORD
- [ ] Set TWILIO credentials (if using SMS)
- [ ] Configure DEBUG=False
- [ ] Set ALLOWED_HOSTS
- [ ] Generate new SECRET_KEY
- [ ] Run `python manage.py migrate`
- [ ] Run `python manage.py collectstatic`
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS_ALLOWED_ORIGINS
- [ ] Set up database backups
- [ ] Configure Celery with Redis
- [ ] Set up logging
- [ ] Enable rate limiting
- [ ] Set up monitoring/alerts

---

## Scaling Considerations

For production systems with high volume:

1. **Database**: PostgreSQL (replace SQLite)
2. **Cache**: Redis for caching
3. **Queue**: Redis + Celery for async tasks
4. **Email**: SendGrid/AWS SES for bulk email
5. **SMS**: Dedicated SMS gateway
6. **Load Balancer**: Nginx for multiple app servers
7. **Monitoring**: Sentry for error tracking
8. **CDN**: CloudFlare for static assets
