from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LocationViewSet, CurrentWeatherViewSet, ForecastViewSet,
    AlertViewSet, HistoricalDataViewSet
)
from .auth_views import (
    register_user, login_user, logout_user,
    UserProfileViewSet, UserPreferencesViewSet,
    SavedAlertViewSet, SavedForecastViewSet,
    NotificationViewSet, SharedContentViewSet
)

router = DefaultRouter()
router.register(r'locations', LocationViewSet, basename='location')
router.register(r'current-weather', CurrentWeatherViewSet, basename='current-weather')
router.register(r'forecast', ForecastViewSet, basename='forecast')
router.register(r'alerts', AlertViewSet, basename='alert')
router.register(r'historical', HistoricalDataViewSet, basename='historical')

# Auth and user management routes
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'preferences', UserPreferencesViewSet, basename='preferences')
router.register(r'saved-alerts', SavedAlertViewSet, basename='saved-alert')
router.register(r'saved-forecasts', SavedForecastViewSet, basename='saved-forecast')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'shared-content', SharedContentViewSet, basename='shared-content')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', register_user, name='register'),
    path('auth/login/', login_user, name='login'),
    path('auth/logout/', logout_user, name='logout'),
    
    # API routes
    path('', include(router.urls)),
]
