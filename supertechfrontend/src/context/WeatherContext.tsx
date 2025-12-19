import { createContext, useContext, useState, ReactNode } from 'react';
import { Location, CurrentWeather, Alert, WeatherContextType } from '../types/weather.types';

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
  const [loading, setLoading] = useState(false);

  const value: WeatherContextType = {
    selectedLocation,
    setSelectedLocation,
    currentWeather,
    setCurrentWeather,
    alerts,
    setAlerts,
    temperatureUnit,
    setTemperatureUnit,
    loading,
    setLoading,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
