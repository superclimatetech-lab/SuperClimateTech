import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/Dashboard/DashboardLayout';
import { Card } from '../components/shared';
import { getHistoricalData } from '../services/weatherAPI';

interface HistoricalRecord {
  date: string;
  highTemp: number;
  lowTemp: number;
  precipitation: number;
}

export const HistoricalDataPage = () => {
  const [data, setData] = useState<HistoricalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching historical data...');
        
        // Cairo coordinates as example
        const lat = 30.0444;
        const lng = 31.2357;
        
        // Get last 30 days of historical data
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        console.log('Date range:', { startDate, endDate });
        const historicalData = await getHistoricalData(lat, lng, startDate, endDate);
        console.log('Fetched data:', historicalData);
        
        if (!historicalData || historicalData.length === 0) {
          setError('No historical data returned from API');
          setData([]);
        } else {
          setData(historicalData);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch historical data';
        setError(errorMsg);
        console.error('Error fetching historical data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, []);

  const avgTemp = data.length > 0 
    ? (data.reduce((sum, d) => sum + (d.highTemp + d.lowTemp) / 2, 0) / data.length).toFixed(1)
    : 'N/A';

  const maxTemp = data.length > 0 
    ? Math.max(...data.map(d => d.highTemp)).toFixed(1)
    : 'N/A';

  const minTemp = data.length > 0 
    ? Math.min(...data.map(d => d.lowTemp)).toFixed(1)
    : 'N/A';

  const totalPrecipitation = data.length > 0 
    ? data.reduce((sum, d) => sum + d.precipitation, 0).toFixed(1)
    : 'N/A';

  return (
    <DashboardLayout>
      <div className="w-full">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Historical Climate Data</h1>
          <p className="text-sm text-gray-600 mt-1">30-day weather analysis and climate patterns</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-3 sm:p-4">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Statistics Cards Section */}
        <div className="mb-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Climate Statistics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {/* Average Temperature Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition">
              <p className="text-xs text-gray-600 font-semibold mb-1">Average Temperature</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{avgTemp}°C</p>
              <p className="text-xs text-gray-500">30-day average</p>
            </div>

            {/* Maximum Temperature Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition">
              <p className="text-xs text-gray-600 font-semibold mb-1">Maximum Temperature</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600 mb-1">{maxTemp}°C</p>
              <p className="text-xs text-gray-500">Peak value</p>
            </div>

            {/* Minimum Temperature Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition">
              <p className="text-xs text-gray-600 font-semibold mb-1">Minimum Temperature</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{minTemp}°C</p>
              <p className="text-xs text-gray-500">Lowest value</p>
            </div>

            {/* Total Precipitation Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition">
              <p className="text-xs text-gray-600 font-semibold mb-1">Total Precipitation</p>
              <p className="text-2xl sm:text-3xl font-bold text-cyan-600 mb-1">{totalPrecipitation}mm</p>
              <p className="text-xs text-gray-500">Cumulative rainfall</p>
            </div>
          </div>
        </div>

        {/* Daily Records Section */}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Daily Climate Records</h2>

          {loading ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 text-center">
              <div className="inline-flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-gray-600 text-sm">Loading historical data...</span>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 text-center">
              <p className="text-gray-600 text-sm">No historical data available for this period</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="lg:hidden space-y-2">
                {data.map((record, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
                    <p className="font-semibold text-gray-900 text-sm mb-2">
                      {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-red-50 p-2 rounded border border-red-100">
                        <p className="text-gray-600 font-medium">Max: {record.highTemp.toFixed(1)}°C</p>
                      </div>
                      <div className="bg-blue-50 p-2 rounded border border-blue-100">
                        <p className="text-gray-600 font-medium">Min: {record.lowTemp.toFixed(1)}°C</p>
                      </div>
                      <div className="bg-orange-50 p-2 rounded border border-orange-100">
                        <p className="text-gray-600 font-medium">Avg: {((record.highTemp + record.lowTemp) / 2).toFixed(1)}°C</p>
                      </div>
                      <div className="bg-cyan-50 p-2 rounded border border-cyan-100">
                        <p className="text-gray-600 font-medium">Precip: {record.precipitation.toFixed(1)}mm</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Maximum</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Minimum</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Average</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Precipitation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.map((record, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-gray-800">{new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                        <td className="px-4 py-3">
                          <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-semibold">{record.highTemp.toFixed(1)}°C</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">{record.lowTemp.toFixed(1)}°C</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-semibold">{((record.highTemp + record.lowTemp) / 2).toFixed(1)}°C</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-cyan-50 text-cyan-700 px-2 py-1 rounded text-xs font-semibold">{record.precipitation.toFixed(1)}mm</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
