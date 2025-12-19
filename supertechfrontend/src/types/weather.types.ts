// Location interface
export interface Location {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// Current Weather interface
export interface CurrentWeather {
  id: number;
  location: number;
  location_data: Location;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  condition: string;
  description: string;
  timestamp: string;
}

// Forecast interface
export interface Forecast {
  id: number;
  location: number;
  location_data: Location;
  forecast_type: 'short_term' | 'long_term';
  forecast_date: string;
  max_temperature: number;
  min_temperature: number;
  avg_temperature: number;
  condition: string;
  precipitation_chance: number;
  wind_speed: number;
  humidity: number;
  created_at: string;
  updated_at: string;
}

// Alert interface
export interface Alert {
  id: number;
  location: number;
  location_data: Location;
  alert_type: 'heat_wave' | 'cold_wave';
  severity: 'warning' | 'severe' | 'extreme';
  description: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  temperature_value: number;
  created_at: string;
  updated_at: string;
}

// Historical Data interface
export interface HistoricalData {
  id: number;
  location: number;
  location_data: Location;
  date: string;
  max_temperature: number;
  min_temperature: number;
  avg_temperature: number;
  precipitation: number | null;
  humidity: number;
  wind_speed: number;
  condition: string;
  created_at: string;
}

// Weather Context Type
export interface WeatherContextType {
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
  currentWeather: CurrentWeather | null;
  setCurrentWeather: (weather: CurrentWeather | null) => void;
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  temperatureUnit: 'C' | 'F';
  setTemperatureUnit: (unit: 'C' | 'F') => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}
