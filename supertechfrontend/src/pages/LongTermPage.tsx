import { useState } from 'react';
import { DashboardLayout } from '../components/Dashboard/DashboardLayout';
import { LongTermForecast } from '../components/Forecast/LongTermForecast';
import { WeatherMap } from '../components/Map/WeatherMap';
import { useWeather } from '../context/WeatherContext';

export const LongTermPage = () => {
  const { selectedLocation, setSelectedLocation } = useWeather();
  const [showMap, setShowMap] = useState(true);

  const locations = [
    { id: 1, name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357, temp: 28, condition: 'Sunny' },
    { id: 2, name: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792, temp: 26, condition: 'Cloudy' },
    { id: 3, name: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219, temp: 20, condition: 'Rainy' },
    { id: 4, name: 'Johannesburg, South Africa', lat: -26.2023, lng: 28.0436, temp: 22, condition: 'Sunny' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-3 sm:space-y-4 h-full flex flex-col">
        {/* Header with toggle */}
        <div className="flex items-center justify-between flex-shrink-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Long-Term Forecast</h1>
          <button
            onClick={() => setShowMap(!showMap)}
            className="px-3 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition"
          >
            {showMap ? 'View Data' : 'View Map'}
          </button>
        </div>

        {/* Location Selector - Quick buttons */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Select Location</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  setSelectedLocation(loc);
                  setShowMap(false);
                }}
                className={`p-2 rounded-lg text-xs font-medium transition-all ${
                  selectedLocation?.id === loc.id
                    ? 'bg-orange-600 text-white border border-orange-700 shadow-lg'
                    : 'bg-gray-50 text-gray-900 border border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="font-semibold">{loc.name.split(',')[0]}</div>
                <div className="text-xs mt-0.5">{loc.temp}°C</div>
              </button>
            ))}
          </div>
        </div>

        {/* Map or Data View - Fill remaining space */}
        {showMap ? (
          <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col min-h-0 flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex-shrink-0">Location Map - Click to Select</h3>
            <div className="flex-1 min-h-0">
              <WeatherMap locations={locations} apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''} />
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto">
            {selectedLocation ? (
              <LongTermForecast locationId={selectedLocation.id} />
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center h-full flex items-center justify-center">
                <p className="text-gray-600 text-sm">Select a location to view the forecast</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
