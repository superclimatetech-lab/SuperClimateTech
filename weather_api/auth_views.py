"""
Views for user authentication, preferences, and notification management
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone

from .auth_models import UserProfile, UserPreferences, SavedAlert, SavedForecast
from .models import Alert, Forecast, InAppNotification, SharedContent
from .auth_serializers import (
    UserSerializer, UserProfileSerializer, UserPreferencesSerializer,
    SavedAlertSerializer, SavedForecastSerializer, UserRegistrationSerializer,
    InAppNotificationSerializer, SharedContentSerializer
)
from .notification_service import (
    NotificationService, AlertNotificationService, SocialSharingService
)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Register a new user"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """Login user and return token"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(username=username)
        if user.check_password(password):
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key,
            })
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """Logout user (invalidate token)"""
    request.user.auth_token.delete()
    return Response({'message': 'Logged out successfully'})


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for user profile management"""
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['user__username', 'country']

    def get_queryset(self):
        """Users can only see their own profile"""
        if self.request.user.is_staff:
            return UserProfile.objects.all()
        return UserProfile.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        """Get current user's profile"""
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def add_preferred_location(self, request):
        """Add a location to user's preferred locations"""
        location_id = request.data.get('location_id')
        if not location_id:
            return Response(
                {'error': 'location_id required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            profile = UserProfile.objects.get(user=request.user)
            from .models import Location
            location = Location.objects.get(id=location_id)
            profile.preferred_locations.add(location)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except (UserProfile.DoesNotExist, Location.DoesNotExist):
            return Response(
                {'error': 'Profile or location not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def remove_preferred_location(self, request):
        """Remove a location from user's preferred locations"""
        location_id = request.data.get('location_id')
        if not location_id:
            return Response(
                {'error': 'location_id required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            profile = UserProfile.objects.get(user=request.user)
            from .models import Location
            location = Location.objects.get(id=location_id)
            profile.preferred_locations.remove(location)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except (UserProfile.DoesNotExist, Location.DoesNotExist):
            return Response(
                {'error': 'Profile or location not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class UserPreferencesViewSet(viewsets.ModelViewSet):
    """ViewSet for user preferences management"""
    queryset = UserPreferences.objects.all()
    serializer_class = UserPreferencesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Users can only see their own preferences"""
        if self.request.user.is_staff:
            return UserPreferences.objects.all()
        return UserPreferences.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def my_preferences(self, request):
        """Get current user's preferences"""
        try:
            preferences = UserPreferences.objects.get(user=request.user)
            serializer = self.get_serializer(preferences)
            return Response(serializer.data)
        except UserPreferences.DoesNotExist:
            return Response(
                {'error': 'Preferences not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def update_notification_settings(self, request):
        """Update notification settings"""
        try:
            preferences = UserPreferences.objects.get(user=request.user)
            
            # Update notification preferences
            preferences.email_notifications = request.data.get(
                'email_notifications',
                preferences.email_notifications
            )
            preferences.sms_notifications = request.data.get(
                'sms_notifications',
                preferences.sms_notifications
            )
            preferences.in_app_notifications = request.data.get(
                'in_app_notifications',
                preferences.in_app_notifications
            )
            preferences.save()
            
            serializer = self.get_serializer(preferences)
            return Response(serializer.data)
        except UserPreferences.DoesNotExist:
            return Response(
                {'error': 'Preferences not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def update_alert_settings(self, request):
        """Update alert settings"""
        try:
            preferences = UserPreferences.objects.get(user=request.user)
            
            # Update alert preferences
            preferences.alert_types = request.data.get(
                'alert_types',
                preferences.alert_types
            )
            preferences.alert_frequency = request.data.get(
                'alert_frequency',
                preferences.alert_frequency
            )
            preferences.alert_threshold_temp = request.data.get(
                'alert_threshold_temp',
                preferences.alert_threshold_temp
            )
            preferences.save()
            
            serializer = self.get_serializer(preferences)
            return Response(serializer.data)
        except UserPreferences.DoesNotExist:
            return Response(
                {'error': 'Preferences not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class SavedAlertViewSet(viewsets.ModelViewSet):
    """ViewSet for saved alerts"""
    serializer_class = SavedAlertSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['saved_at']
    ordering = ['-saved_at']

    def get_queryset(self):
        """Users can only see their own saved alerts"""
        return SavedAlert.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Save an alert for user"""
        alert_id = request.data.get('alert_id')
        notes = request.data.get('notes', '')
        
        try:
            alert = Alert.objects.get(id=alert_id)
            saved_alert, created = SavedAlert.objects.get_or_create(
                user=request.user,
                alert=alert,
                defaults={'notes': notes}
            )
            serializer = self.get_serializer(saved_alert)
            status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
            return Response(serializer.data, status=status_code)
        except Alert.DoesNotExist:
            return Response(
                {'error': 'Alert not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    def destroy(self, request, *args, **kwargs):
        """Remove saved alert"""
        saved_alert = self.get_object()
        saved_alert.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SavedForecastViewSet(viewsets.ModelViewSet):
    """ViewSet for saved forecasts"""
    serializer_class = SavedForecastSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['saved_at']
    ordering = ['-saved_at']

    def get_queryset(self):
        """Users can only see their own saved forecasts"""
        return SavedForecast.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Save a forecast for user"""
        forecast_id = request.data.get('forecast_id')
        location_name = request.data.get('location_name', '')
        
        try:
            forecast = Forecast.objects.get(id=forecast_id)
            saved_forecast, created = SavedForecast.objects.get_or_create(
                user=request.user,
                forecast=forecast,
                defaults={'location_name': location_name}
            )
            serializer = self.get_serializer(saved_forecast)
            status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
            return Response(serializer.data, status=status_code)
        except Forecast.DoesNotExist:
            return Response(
                {'error': 'Forecast not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class NotificationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing in-app notifications"""
    serializer_class = InAppNotificationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['is_read', 'notification_type']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Users can only see their own notifications"""
        return InAppNotification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread notifications"""
        notifications = self.get_queryset().filter(is_read=False)
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all notifications as read"""
        notifications = self.get_queryset().filter(is_read=False)
        notifications.update(is_read=True, read_at=timezone.now())
        return Response({'message': 'All notifications marked as read'})

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get notification summary"""
        all_notif = self.get_queryset()
        unread_count = all_notif.filter(is_read=False).count()
        
        summary = {
            'total': all_notif.count(),
            'unread': unread_count,
            'by_type': {}
        }
        
        for notif_type, label in InAppNotification._meta.get_field('notification_type').choices:
            summary['by_type'][notif_type] = all_notif.filter(notification_type=notif_type).count()
        
        return Response(summary)


class SharedContentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing shared content"""
    serializer_class = SharedContentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['content_type', 'platform']
    ordering_fields = ['shared_at']
    ordering = ['-shared_at']

    def get_queryset(self):
        """Users can only see their own shared content"""
        return SharedContent.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def share_alert(self, request):
        """Share an alert on social media"""
        alert_id = request.data.get('alert_id')
        platform = request.data.get('platform', 'twitter')
        
        try:
            alert = Alert.objects.get(id=alert_id)
            share_data = SocialSharingService.create_shareable_alert(alert)
            
            shared_content = SharedContent.objects.create(
                user=request.user,
                content_type='alert',
                platform=platform,
                alert=alert,
                share_message=share_data['message'],
                share_url=share_data['url']
            )
            
            serializer = self.get_serializer(shared_content)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Alert.DoesNotExist:
            return Response(
                {'error': 'Alert not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def share_forecast(self, request):
        """Share a forecast on social media"""
        forecast_id = request.data.get('forecast_id')
        platform = request.data.get('platform', 'twitter')
        
        try:
            forecast = Forecast.objects.get(id=forecast_id)
            location = forecast.location
            share_data = SocialSharingService.create_shareable_forecast(forecast, location)
            
            shared_content = SharedContent.objects.create(
                user=request.user,
                content_type='forecast',
                platform=platform,
                forecast=forecast,
                share_message=share_data['message'],
                share_url=share_data['url']
            )
            
            serializer = self.get_serializer(shared_content)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Forecast.DoesNotExist:
            return Response(
                {'error': 'Forecast not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def share_stats(self, request):
        """Get sharing statistics"""
        shared = self.get_queryset()
        
        stats = {
            'total_shares': shared.count(),
            'by_platform': {},
            'by_content_type': {},
        }
        
        for platform, label in SharedContent._meta.get_field('platform').choices:
            stats['by_platform'][platform] = shared.filter(platform=platform).count()
        
        for content_type, label in SharedContent._meta.get_field('content_type').choices:
            stats['by_content_type'][content_type] = shared.filter(content_type=content_type).count()
        
        return Response(stats)
