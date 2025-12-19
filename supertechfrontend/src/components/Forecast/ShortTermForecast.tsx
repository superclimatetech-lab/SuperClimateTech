import { useEffect, useState } from 'react';
import { Forecast } from '../../types/weather.types';
import { Card, LoadingSpinner } from '../shared';
import { ForecastChart } from './ForecastChart';
import { weatherService } from '../../services/weatherService';
import { format } from 'date-fns';

interface ShortTermForecastProps {
  locationId: number;
}

export const ShortTermForecast = ({ locationId }: ShortTermForecastProps) => {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        const data = await weatherService.getShortTermForecast(locationId);
        setForecasts(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch short-term forecast');
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

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Short-Term Forecast (1-7 Days)</h2>
        {forecasts.length > 0 ? (
          <>
            <ForecastChart data={forecasts} type="line" />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {forecasts.map((forecast) => (
                <div key={forecast.id} className="bg-gradient-to-br from-blue-50 to-orange-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900">
                    {format(new Date(forecast.forecast_date), 'EEE, MMM dd')}
                  </p>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>
                      <span className="text-orange-primary font-bold">{forecast.max_temperature}°</span>
                      {' / '}
                      <span className="text-blue-light font-bold">{forecast.min_temperature}°</span>
                    </p>
                    <p className="mt-1">{forecast.condition}</p>
                    <p className="text-xs">Precipitation: {forecast.precipitation_chance}%</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-600">No forecast data available</p>
        )}
      </Card>
    </div>
  );
};
