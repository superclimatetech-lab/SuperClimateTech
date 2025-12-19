import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/Dashboard/DashboardLayout';
import { Card, LoadingSpinner } from '../components/shared';
import { useWeather } from '../context/WeatherContext';
import { weatherService } from '../services/weatherService';
import { Location } from '../types/weather.types';
import { AlertList } from '../components/Alerts';

export const Dashboard = () => {
  const { setSelectedLocation, setCurrentWeather, setAlerts } = useWeather();
  const [featuredLocations, setFeaturedLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch locations, but don't fail if they don't exist
        try {
          const locations = await weatherService.getFeaturedLocations();
          setFeaturedLocations(locations);

          if (locations.length > 0) {
            setSelectedLocation(locations[0]);
            const weather = await weatherService.getCurrentWeatherByLocation(locations[0].id);
            setCurrentWeather(weather);
          }
        } catch (locError) {
          console.warn('Could not fetch locations:', locError);
          setFeaturedLocations([]);
        }

        // Try to fetch alerts
        try {
          const alerts = await weatherService.getActiveAlerts();
          setAlerts(alerts);
        } catch (alertError) {
          console.warn('Could not fetch alerts:', alertError);
          setAlerts([]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Error loading dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setSelectedLocation, setCurrentWeather, setAlerts]);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Weather Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Real-time monitoring and alerts across Africa</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-3 sm:p-4">
            <p className="text-red-800 text-sm font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {/* Featured Locations */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition">
              <p className="text-xs text-gray-600 font-semibold mb-1">Featured Locations</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{featuredLocations.length}</p>
              <p className="text-xs text-gray-500 mt-1">Active sites</p>
            </div>

            {/* Monitored Regions */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition">
              <p className="text-xs text-gray-600 font-semibold mb-1">Regions</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{featuredLocations.length}</p>
              <p className="text-xs text-gray-500 mt-1">Monitored</p>
            </div>

            {/* Heat Wave Alerts */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition">
              <p className="text-xs text-gray-600 font-semibold mb-1">Heat Alerts</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">0</p>
              <p className="text-xs text-gray-500 mt-1">Active</p>
            </div>

            {/* Cold Wave Alerts */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition">
              <p className="text-xs text-gray-600 font-semibold mb-1">Cold Alerts</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">0</p>
              <p className="text-xs text-gray-500 mt-1">Active</p>
            </div>
          </div>
        </div>

        {/* Featured Locations Section */}
        {featuredLocations.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Featured Locations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {featuredLocations.map((location) => (
                <div
                  key={location.id}
                  className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="relative z-10">
                    {/* Location Name and Country */}
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{location.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{location.country}</p>

                    {/* Coordinates */}
                    <div className="space-y-2 my-3">
                      <div className="bg-gray-50 rounded p-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-600">Lat</span>
                          <span className="text-xs font-bold text-orange-600">{location.latitude.toFixed(4)}°</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-600">Lng</span>
                          <span className="text-xs font-bold text-blue-600">{location.longitude.toFixed(4)}°</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded border border-green-200">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Live
                      </span>
                    </div>

                    {/* Action Button */}
                    <button className="w-full py-2 px-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded transition">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Alerts Section */}
        <div className="pt-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Active Alerts</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <p className="text-sm font-bold text-gray-900">Live Alert Feed</p>
            </div>
            <div className="p-4 sm:p-6">
              <AlertList type="all" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
