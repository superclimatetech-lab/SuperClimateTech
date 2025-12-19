from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from datetime import timedelta

from .models import Location, CurrentWeather, Forecast, Alert, HistoricalData
from .serializers import (
    LocationSerializer, CurrentWeatherSerializer, ForecastSerializer,
    AlertSerializer, HistoricalDataSerializer
)


class LocationViewSet(viewsets.ModelViewSet):
    """ViewSet for Location management"""
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['country', 'is_featured']
    search_fields = ['name', 'country']
    ordering_fields = ['name', 'country', 'created_at']
    ordering = ['country', 'name']

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured locations"""
        featured_locations = self.queryset.filter(is_featured=True)
        serializer = self.get_serializer(featured_locations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def nearby(self, request, pk=None):
        """Get nearby locations"""
        location = self.get_object()
        # Simple distance-based search (within 2 degrees)
        nearby = self.queryset.exclude(id=location.id).filter(
            latitude__range=(location.latitude - 2, location.latitude + 2),
            longitude__range=(location.longitude - 2, location.longitude + 2)
        )[:10]
        serializer = self.get_serializer(nearby, many=True)
        return Response(serializer.data)


class CurrentWeatherViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for CurrentWeather data"""
    queryset = CurrentWeather.objects.all()
    serializer_class = CurrentWeatherSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['location__country', 'condition']
    ordering_fields = ['temperature', 'timestamp']
    ordering = ['-timestamp']

    @action(detail=False, methods=['get'])
    def by_location(self, request):
        """Get current weather for specific location"""
        location_id = request.query_params.get('location_id')
        if not location_id:
            return Response({'error': 'location_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        weather = self.queryset.filter(location_id=location_id).first()
        if not weather:
            return Response({'error': 'Weather data not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(weather)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def hottest_locations(self, request):
        """Get hottest locations"""
        limit = int(request.query_params.get('limit', 10))
        hottest = self.queryset.order_by('-temperature')[:limit]
        serializer = self.get_serializer(hottest, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def coldest_locations(self, request):
        """Get coldest locations"""
        limit = int(request.query_params.get('limit', 10))
        coldest = self.queryset.order_by('temperature')[:limit]
        serializer = self.get_serializer(coldest, many=True)
        return Response(serializer.data)


class ForecastViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Forecast data"""
    queryset = Forecast.objects.all()
    serializer_class = ForecastSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['location', 'forecast_type', 'forecast_date']
    ordering_fields = ['forecast_date']
    ordering = ['forecast_date']

    @action(detail=False, methods=['get'])
    def short_term(self, request):
        """Get short-term forecasts (1-7 days)"""
        location_id = request.query_params.get('location_id')
        if not location_id:
            return Response({'error': 'location_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        forecasts = self.queryset.filter(
            location_id=location_id,
            forecast_type='short_term',
            forecast_date__gte=timezone.now().date(),
            forecast_date__lte=timezone.now().date() + timedelta(days=7)
        ).order_by('forecast_date')
        
        serializer = self.get_serializer(forecasts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def long_term(self, request):
        """Get long-term forecasts (8-30 days)"""
        location_id = request.query_params.get('location_id')
        if not location_id:
            return Response({'error': 'location_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        forecasts = self.queryset.filter(
            location_id=location_id,
            forecast_type='long_term',
            forecast_date__gte=timezone.now().date() + timedelta(days=8),
            forecast_date__lte=timezone.now().date() + timedelta(days=30)
        ).order_by('forecast_date')
        
        serializer = self.get_serializer(forecasts, many=True)
        return Response(serializer.data)


class AlertViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Alert management"""
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['location', 'alert_type', 'severity', 'is_active']
    ordering_fields = ['created_at', 'severity']
    ordering = ['-created_at']

    @action(detail=False, methods=['get'])
    def active_alerts(self, request):
        """Get all active alerts"""
        alerts = self.queryset.filter(is_active=True)
        serializer = self.get_serializer(alerts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def heat_wave_alerts(self, request):
        """Get active heat wave alerts"""
        alerts = self.queryset.filter(alert_type='heat_wave', is_active=True)
        serializer = self.get_serializer(alerts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def cold_wave_alerts(self, request):
        """Get active cold wave alerts"""
        alerts = self.queryset.filter(alert_type='cold_wave', is_active=True)
        serializer = self.get_serializer(alerts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_location(self, request):
        """Get alerts for specific location"""
        location_id = request.query_params.get('location_id')
        if not location_id:
            return Response({'error': 'location_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        alerts = self.queryset.filter(location_id=location_id, is_active=True)
        serializer = self.get_serializer(alerts, many=True)
        return Response(serializer.data)


class HistoricalDataViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for HistoricalData"""
    queryset = HistoricalData.objects.all()
    serializer_class = HistoricalDataSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['location', 'date']
    ordering_fields = ['date']
    ordering = ['-date']

    @action(detail=False, methods=['get'])
    def by_location(self, request):
        """Get historical data for specific location"""
        location_id = request.query_params.get('location_id')
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        
        if not location_id:
            return Response({'error': 'location_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = self.queryset.filter(location_id=location_id)
        
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        
        serializer = self.get_serializer(queryset.order_by('-date'), many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def comparison(self, request):
        """Compare historical data for multiple locations"""
        location_ids = request.query_params.getlist('location_ids')
        if not location_ids:
            return Response({'error': 'location_ids are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        data = self.queryset.filter(location_id__in=location_ids).order_by('-date')
        serializer = self.get_serializer(data, many=True)
        return Response(serializer.data)
