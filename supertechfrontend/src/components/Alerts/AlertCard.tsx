import { Alert } from '../../types/weather.types';
import { Card } from '../shared';
import { formatDistanceToNow } from 'date-fns';

interface AlertCardProps {
  alert: Alert;
}

export const AlertCard = ({ alert }: AlertCardProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme':
        return 'bg-red-100 border-l-4 border-red-600 text-red-900';
      case 'severe':
        return 'bg-orange-100 border-l-4 border-orange-600 text-orange-900';
      case 'warning':
        return 'bg-yellow-100 border-l-4 border-yellow-600 text-yellow-900';
      default:
        return 'bg-gray-100 border-l-4 border-gray-600 text-gray-900';
    }
  };

  const getAlertIcon = (type: string) => {
    return type === 'heat_wave' ? '🔥' : '❄️';
  };

  return (
    <Card className={getSeverityColor(alert.severity)}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="text-2xl">{getAlertIcon(alert.alert_type)}</div>
          <div>
            <h3 className="font-semibold text-lg">
              {alert.alert_type === 'heat_wave' ? 'Heat Wave' : 'Cold Wave'} - {alert.severity.toUpperCase()}
            </h3>
            <p className="text-sm mt-2">{alert.description}</p>
            <div className="mt-3 text-xs opacity-75">
              <p>Location: {alert.location_data.name}, {alert.location_data.country}</p>
              <p>Temperature: {alert.temperature_value}°C</p>
              <p>Started {formatDistanceToNow(new Date(alert.start_date), { addSuffix: true })}</p>
            </div>
          </div>
        </div>
        <div className="text-3xl">{getAlertIcon(alert.alert_type)}</div>
      </div>
    </Card>
  );
};
