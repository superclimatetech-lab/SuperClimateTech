import api from './api';
import { Location, CurrentWeather, Forecast, Alert, HistoricalData } from '../types/weather.types';

export const weatherService = {
  // Location endpoints
  getLocations: async () => {
    const response = await api.get<Location[]>('/locations/');
    return response.data;
  },

  getLocationById: async (id: number) => {
    const response = await api.get<Location>(`/locations/${id}/`);
    return response.data;
  },

  getFeaturedLocations: async () => {
    const response = await api.get<Location[]>('/locations/featured/');
    return response.data;
  },

  searchLocations: async (query: string) => {
    const response = await api.get<Location[]>('/locations/', {
      params: { search: query },
    });
    return response.data;
  },

  getNearbyLocations: async (locationId: number) => {
    const response = await api.get<Location[]>(`/locations/${locationId}/nearby/`);
    return response.data;
  },

  // Current weather endpoints
  getCurrentWeather: async () => {
    const response = await api.get<CurrentWeather[]>('/current-weather/');
    return response.data;
  },

  getCurrentWeatherByLocation: async (locationId: number) => {
    const response = await api.get<CurrentWeather>('/current-weather/by_location/', {
      params: { location_id: locationId },
    });
    return response.data;
  },

  getHottestLocations: async (limit: number = 10) => {
    const response = await api.get<CurrentWeather[]>('/current-weather/hottest_locations/', {
      params: { limit },
    });
    return response.data;
  },

  getColdestLocations: async (limit: number = 10) => {
    const response = await api.get<CurrentWeather[]>('/current-weather/coldest_locations/', {
      params: { limit },
    });
    return response.data;
  },

  // Forecast endpoints
  getShortTermForecast: async (locationId: number) => {
    const response = await api.get<Forecast[]>('/forecast/short_term/', {
      params: { location_id: locationId },
    });
    return response.data;
  },

  getLongTermForecast: async (locationId: number) => {
    const response = await api.get<Forecast[]>('/forecast/long_term/', {
      params: { location_id: locationId },
    });
    return response.data;
  },

  // Alert endpoints
  getActiveAlerts: async () => {
    const response = await api.get<Alert[]>('/alerts/active_alerts/');
    return response.data;
  },

  getHeatWaveAlerts: async () => {
    const response = await api.get<Alert[]>('/alerts/heat_wave_alerts/');
    return response.data;
  },

  getColdWaveAlerts: async () => {
    const response = await api.get<Alert[]>('/alerts/cold_wave_alerts/');
    return response.data;
  },

  getAlertsByLocation: async (locationId: number) => {
    const response = await api.get<Alert[]>('/alerts/by_location/', {
      params: { location_id: locationId },
    });
    return response.data;
  },

  getAllAlerts: async () => {
    const response = await api.get<Alert[]>('/alerts/');
    return response.data;
  },

  // Historical data endpoints
  getHistoricalData: async (locationId: number, dateFrom?: string, dateTo?: string) => {
    const response = await api.get<HistoricalData[]>('/historical/by_location/', {
      params: {
        location_id: locationId,
        date_from: dateFrom,
        date_to: dateTo,
      },
    });
    return response.data;
  },

  compareHistoricalData: async (locationIds: number[]) => {
    const response = await api.get<HistoricalData[]>('/historical/comparison/', {
      params: {
        location_ids: locationIds.join(','),
      },
    });
    return response.data;
  },
};
