import { DashboardLayout } from '../components/Dashboard/DashboardLayout';
import { Card } from '../components/shared';
import { WeatherMap } from '../components/Map/WeatherMap';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDHB4sh9YIhktkXeDXYETgNQCdEZGWJagk';

export const RealTimeMonitoring = () => {
  return (
    <DashboardLayout>
      <div className="w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">Real-Time Monitoring</h1>

        <Card className="overflow-hidden mb-6">
          <div className="bg-gray-50 rounded-lg overflow-hidden w-full" style={{ minHeight: '300px' }}>
            <WeatherMap apiKey={GOOGLE_MAPS_API_KEY} />
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 border border-orange-200 hover:shadow-lg">
            <div className="flex flex-col">
              <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2">Hottest Region</p>
              <p className="text-lg sm:text-2xl md:text-3xl font-bold text-orange-700 mb-2">Cairo, Egypt</p>
              <div className="flex items-baseline">
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-600">45</p>
                <p className="text-lg sm:text-2xl text-orange-600 font-semibold ml-1">°C</p>
              </div>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 border border-gray-300 hover:shadow-lg">
            <div className="flex flex-col">
              <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2">Average Temperature</p>
              <div className="flex items-baseline">
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">28.5</p>
                <p className="text-lg sm:text-2xl text-gray-600 font-semibold ml-1">°C</p>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-3">Across monitored regions</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 border border-blue-200 hover:shadow-lg">
            <div className="flex flex-col">
              <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2">Coldest Region</p>
              <p className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-700 mb-2">Johannesburg, ZA</p>
              <div className="flex items-baseline">
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600">12</p>
                <p className="text-lg sm:text-2xl text-blue-600 font-semibold ml-1">°C</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
