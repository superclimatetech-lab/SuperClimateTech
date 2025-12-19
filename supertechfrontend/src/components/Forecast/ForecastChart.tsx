import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Forecast } from '../../types/weather.types';
import { format } from 'date-fns';

interface ForecastChartProps {
  data: Forecast[];
  type?: 'line' | 'bar';
}

export const ForecastChart = ({ data, type = 'line' }: ForecastChartProps) => {
  const chartData = data.map((item) => ({
    date: format(new Date(item.forecast_date), 'MMM dd'),
    max: item.max_temperature,
    min: item.min_temperature,
    avg: item.avg_temperature,
  }));

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="max" fill="#FF6B35" name="Max Temp" />
          <Bar dataKey="min" fill="#4FC3F7" name="Min Temp" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="max" stroke="#FF6B35" name="Max Temp" strokeWidth={2} />
        <Line type="monotone" dataKey="avg" stroke="#333333" name="Avg Temp" strokeWidth={2} />
        <Line type="monotone" dataKey="min" stroke="#4FC3F7" name="Min Temp" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};
