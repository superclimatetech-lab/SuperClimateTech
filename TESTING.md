# SuperTech Testing Guide

## Testing Strategy

SuperTech uses a comprehensive testing approach to ensure code quality and reliability.

## Backend Testing

### 1. Django Unit Tests

Run all tests:
```bash
python manage.py test
```

Run specific app tests:
```bash
python manage.py test weather_api
```

Run specific test class:
```bash
python manage.py test weather_api.tests.LocationTests
```

Run with coverage:
```bash
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Generate HTML report
```

### 2. API Endpoint Testing

#### Manual Testing with curl

Test locations endpoint:
```bash
curl http://localhost:8000/api/locations/
```

Test with filtering:
```bash
curl "http://localhost:8000/api/locations/?country=Egypt"
```

Test pagination:
```bash
curl "http://localhost:8000/api/locations/?page=2"
```

#### Automated API Testing (pytest)

```bash
pip install pytest pytest-django djangorestframework-simplejwt
```

Create `tests/test_api.py`:
```python
import pytest
from rest_framework.test import APIClient
from weather_api.models import Location

@pytest.mark.django_db
class TestLocationAPI:
    def test_get_locations(self):
        client = APIClient()
        response = client.get('/api/locations/')
        assert response.status_code == 200
    
    def test_get_featured_locations(self):
        Location.objects.create(
            name='Cairo',
            country='Egypt',
            latitude=30.0444,
            longitude=31.2357,
            is_featured=True
        )
        client = APIClient()
        response = client.get('/api/locations/featured/')
        assert response.status_code == 200
        assert len(response.data) > 0
```

Run pytest:
```bash
pytest weather_api/tests/
```

### 3. Model Testing

Test model creation and validation:
```python
from weather_api.models import Location, CurrentWeather
from django.test import TestCase

class LocationModelTest(TestCase):
    def setUp(self):
        self.location = Location.objects.create(
            name='Test City',
            country='Test Country',
            latitude=0.0,
            longitude=0.0
        )
    
    def test_location_str(self):
        self.assertEqual(str(self.location), 'Test City, Test Country')
    
    def test_location_coordinates(self):
        self.assertEqual(self.location.latitude, 0.0)
        self.assertEqual(self.location.longitude, 0.0)
```

### 4. Celery Task Testing

Test Celery tasks:
```python
from celery.result import EagerResult
from django.test import TestCase
from weather_api.tasks import fetch_current_weather

class CeleryTaskTest(TestCase):
    def test_fetch_current_weather_task(self):
        # Use CELERY_ALWAYS_EAGER = True in test settings
        result = fetch_current_weather.delay()
        self.assertIsNotNone(result)
```

Configure test settings (`settings_test.py`):
```python
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True
```

## Frontend Testing

### 1. Component Testing with Vitest

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Create `src/components/__tests__/Button.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../shared';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

Run tests:
```bash
npm run test
```

### 2. API Service Testing

Create `src/services/__tests__/weatherService.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest';
import { weatherService } from '../weatherService';
import api from '../api';

vi.mock('../api');

describe('Weather Service', () => {
  it('fetches locations', async () => {
    const mockData = [
      { id: 1, name: 'Cairo', country: 'Egypt' }
    ];
    
    vi.mocked(api.get).mockResolvedValue({ data: mockData });
    
    const result = await weatherService.getLocations();
    expect(result).toEqual(mockData);
  });
});
```

### 3. Integration Testing

Test complete user flows:
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { Dashboard } from '../pages/Dashboard';
import { WeatherProvider } from '../context/WeatherContext';

describe('Dashboard Integration', () => {
  it('loads and displays featured locations', async () => {
    render(
      <WeatherProvider>
        <Dashboard />
      </WeatherProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Featured Locations/i)).toBeInTheDocument();
    });
  });
});
```

### 4. E2E Testing with Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

Create `e2e/weather.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('navigate through dashboard', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Click dashboard button
  await page.click('button:has-text("Access Dashboard")');
  
  // Wait for dashboard to load
  await expect(page).toHaveTitle(/Dashboard/);
  
  // Check for featured locations
  await expect(page.locator('text=Featured Locations')).toBeVisible();
});
```

Run E2E tests:
```bash
npx playwright test
```

## Performance Testing

### 1. Backend Performance

Use Django Debug Toolbar:
```bash
pip install django-debug-toolbar
```

Add to `settings.py`:
```python
INSTALLED_APPS += ['debug_toolbar']
MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
INTERNAL_IPS = ['127.0.0.1']
```

Add to `urls.py`:
```python
import debug_toolbar
urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
```

### 2. Frontend Performance

Use Lighthouse:
```bash
# Run via Chrome DevTools or CLI
npx lighthouse http://localhost:5173 --view
```

### 3. Load Testing

Use locust:
```bash
pip install locust
```

Create `locustfile.py`:
```python
from locust import HttpUser, task, between

class WeatherUser(HttpUser):
    wait_time = between(1, 3)
    
    @task
    def get_locations(self):
        self.client.get("/api/locations/")
    
    @task
    def get_alerts(self):
        self.client.get("/api/alerts/active_alerts/")
```

Run:
```bash
locust -f locustfile.py --host=http://localhost:8000
```

## Code Quality

### 1. Backend Code Quality

Linting:
```bash
pip install flake8 pylint
flake8 weather_api/
pylint weather_api/
```

Code formatting:
```bash
pip install black
black weather_api/
```

### 2. Frontend Code Quality

Linting:
```bash
npm install -D eslint
npm run lint
```

TypeScript checking:
```bash
npm run type-check
```

## Security Testing

### 1. Backend Security

CSRF testing:
```python
from django.test import TestCase, Client

class CSRFTest(TestCase):
    def test_csrf_protection(self):
        client = Client(enforce_csrf_checks=True)
        response = client.post('/api/alerts/', {})
        self.assertEqual(response.status_code, 403)
```

### 2. Dependency Scanning

```bash
pip install safety
safety check

# For JavaScript
npm audit
```

### 3. OWASP Testing

Security checklist:
- [ ] SQL Injection prevention (using ORM)
- [ ] XSS protection (React auto-escaping)
- [ ] CSRF tokens enabled
- [ ] HTTPS enforced (production)
- [ ] Authentication implemented
- [ ] Rate limiting added
- [ ] Input validation in place
- [ ] CORS properly configured

## Test Coverage Goals

| Component | Target Coverage |
|-----------|-----------------|
| Models | 90%+ |
| Serializers | 85%+ |
| Views | 80%+ |
| Services | 90%+ |
| React Components | 70%+ |

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/tests.yml`:
```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - run: pip install -r requirements.txt
      - run: python manage.py migrate
      - run: python manage.py test

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd supertech-frontend && npm install
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

## Test Data Seeding

Create fixtures for consistent test data:

`fixtures/test_data.json`:
```json
[
  {
    "model": "weather_api.location",
    "pk": 1,
    "fields": {
      "name": "Test Cairo",
      "country": "Egypt",
      "latitude": 30.0444,
      "longitude": 31.2357,
      "is_featured": true
    }
  }
]
```

Load in tests:
```python
from django.test import TestCase

class WeatherTest(TestCase):
    fixtures = ['test_data.json']
```

## Debugging

### Backend Debugging

Using Django shell:
```bash
python manage.py shell
>>> from weather_api.models import Location
>>> Location.objects.all()
```

Using pdb:
```python
import pdb; pdb.set_trace()
```

### Frontend Debugging

React DevTools:
- Install Chrome extension
- Use `<React.StrictMode>` in development

Browser DevTools:
- Press F12 to open
- Network tab for API calls
- Console for JavaScript errors

## Testing Checklist

- [ ] All endpoints tested
- [ ] All components render
- [ ] API calls work correctly
- [ ] Error handling tested
- [ ] Edge cases covered
- [ ] Performance acceptable
- [ ] Security vulnerabilities checked
- [ ] Accessibility verified
- [ ] Mobile responsiveness tested
- [ ] Database migrations tested

## Running Full Test Suite

```bash
# Backend
python manage.py test --verbose 2

# Frontend
npm run test

# All tests with coverage
coverage run manage.py test && coverage report
npm run test:coverage
```

## Continuous Testing

Monitor code quality:
```bash
# Watch for changes and auto-run tests
pytest-watch

# Watch frontend tests
npm run test -- --watch
```

---

**Happy Testing!** 🧪
