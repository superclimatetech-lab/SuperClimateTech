import { useWeather } from '../../context/WeatherContext';
import { Button } from '../shared';

export const Header = () => {
  const { temperatureUnit, setTemperatureUnit, selectedLocation } = useWeather();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30 w-full">
      <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center gap-2 sm:gap-4 w-full">
          {/* Title - responsive with margin for mobile menu button */}
          <div className="flex-1 min-w-0 pl-14 sm:pl-0">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
              {selectedLocation ? selectedLocation.name : 'Dashboard'}
            </h1>
            {selectedLocation && (
              <p className="text-gray-600 text-xs sm:text-sm hidden sm:block truncate">
                {selectedLocation.country}
              </p>
            )}
          </div>

          {/* Temperature Toggle and Profile - touch-friendly */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Temperature Unit Toggle */}
            <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
              <button
                onClick={() => setTemperatureUnit('C')}
                className={`px-2 sm:px-3 py-2 min-h-[44px] text-xs sm:text-sm font-medium rounded transition-all ${
                  temperatureUnit === 'C'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-white active:bg-gray-200'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setTemperatureUnit('F')}
                className={`px-2 sm:px-3 py-2 min-h-[44px] text-xs sm:text-sm font-medium rounded transition-all ${
                  temperatureUnit === 'F'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-white active:bg-gray-200'
                }`}
              >
                °F
              </button>
            </div>

            {/* Profile Button */}
            <Button
              size="sm"
              onClick={() => {
                // Handle logout or settings
              }}
              className="text-xs sm:text-sm px-2 sm:px-4 py-2 min-h-[44px]"
            >
              👤
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
