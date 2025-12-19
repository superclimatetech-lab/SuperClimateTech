import { useEffect, useState } from 'react';
import { Alert } from '../../types/weather.types';
import { AlertCard } from './AlertCard';
import { LoadingSpinner } from '../shared';
import { weatherService } from '../../services/weatherService';

interface AlertListProps {
  type?: 'all' | 'heat_wave' | 'cold_wave';
}

export const AlertList = ({ type = 'all' }: AlertListProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        let data;
        
        if (type === 'heat_wave') {
          data = await weatherService.getHeatWaveAlerts();
        } else if (type === 'cold_wave') {
          data = await weatherService.getColdWaveAlerts();
        } else {
          data = await weatherService.getActiveAlerts();
        }
        
        setAlerts(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch alerts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [type]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No active alerts</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  );
};
