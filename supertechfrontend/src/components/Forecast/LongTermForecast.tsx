import { useEffect, useState } from 'react';
import { Forecast } from '../../types/weather.types';
import { Card, LoadingSpinner } from '../shared';
import { ForecastChart } from './ForecastChart';
import { weatherService } from '../../services/weatherService';
import { format } from 'date-fns';

interface LongTermForecastProps {
  locationId: number;
}

export const LongTermForecast = ({ locationId }: LongTermForecastProps) => {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        const data = await weatherService.getLongTermForecast(locationId);
        setForecasts(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch long-term forecast');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (locationId) {
      fetchForecast();
    }
  }, [locationId]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  const avgTemp = forecasts.length > 0
    ? (forecasts.reduce((sum, f) => sum + f.avg_temperature, 0) / forecasts.length).toFixed(1)
    : 0;

  const maxTemp = forecasts.length > 0
    ? Math.max(...forecasts.map(f => f.max_temperature))
    : 0;

  const minTemp = forecasts.length > 0
    ? Math.min(...forecasts.map(f => f.min_temperature))
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <h3 className="text-gray-600 text-sm font-medium">Highest Temperature</h3>
          <p className="text-3xl font-bold text-orange-primary mt-2">{maxTemp}°C</p>
        </Card>
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
          <h3 className="text-gray-600 text-sm font-medium">Average Temperature</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{avgTemp}°C</p>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <h3 className="text-gray-600 text-sm font-medium">Lowest Temperature</h3>
          <p className="text-3xl font-bold text-blue-light mt-2">{minTemp}°C</p>
        </Card>
      </div>

      {/* Chart and Details */}
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Long-Term Forecast (8-30 Days)</h2>
        {forecasts.length > 0 ? (
          <>
            <ForecastChart data={forecasts} type="bar" />
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Max °C</th>
                    <th className="px-4 py-2 text-left">Min °C</th>
                    <th className="px-4 py-2 text-left">Avg °C</th>
                    <th className="px-4 py-2 text-left">Condition</th>
                    <th className="px-4 py-2 text-left">Rain %</th>
                  </tr>
                </thead>
                <tbody>
                  {forecasts.map((forecast) => (
                    <tr key={forecast.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{format(new Date(forecast.forecast_date), 'MMM dd')}</td>
                      <td className="px-4 py-2 text-orange-primary font-semibold">{forecast.max_temperature}</td>
                      <td className="px-4 py-2 text-blue-light font-semibold">{forecast.min_temperature}</td>
                      <td className="px-4 py-2">{forecast.avg_temperature.toFixed(1)}</td>
                      <td className="px-4 py-2">{forecast.condition}</td>
                      <td className="px-4 py-2">{forecast.precipitation_chance}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-gray-600">No forecast data available</p>
        )}
      </Card>
    </div>
  );
};
