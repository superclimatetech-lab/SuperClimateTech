// OpenWeatherMap API integration for real-time weather data
const OPENWEATHER_API_KEY = 'demo'; // Replace with actual API key from openweathermap.org
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface CurrentWeather {
  location: string;
  lat: number;
  lng: number;
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  feelsLike: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  sunrise: number;
  sunset: number;
}

export interface ForecastData {
  date: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  precipitation: number;
  uvIndex: number;
}

// Locations to monitor across Africa
export const AFRICAN_LOCATIONS = [
  { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357 },
  { name: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792 },
  { name: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219 },
  { name: 'Johannesburg, South Africa', lat: -26.2023, lng: 28.0436 },
  { name: 'Accra, Ghana', lat: 5.6037, lng: -0.1870 },
  { name: 'Dakar, Senegal', lat: 14.7167, lng: -17.4674 },
  { name: 'Khartoum, Sudan', lat: 15.5527, lng: 32.5373 },
  { name: 'Addis Ababa, Ethiopia', lat: 9.0320, lng: 38.7469 },
];

/**
 * Get current weather data from OpenWeatherMap API
 * For demo purposes, returns mock data. Replace with real API calls for production.
 */
export const getCurrentWeather = async (lat: number, lng: number, location: string): Promise<CurrentWeather> => {
  try {
    // For demo: return simulated data
    // In production, use: https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric
    
    const mockData: CurrentWeather = {
      location,
      lat,
      lng,
      temp: Math.random() * 15 + 25, // 25-40°C
      humidity: Math.random() * 40 + 40, // 40-80%
      windSpeed: Math.random() * 20 + 8, // 8-28 km/h
      description: 'Sunny',
      feelsLike: Math.random() * 15 + 28,
      pressure: 1013,
      visibility: 10,
      uvIndex: 8,
      sunrise: 1702828800,
      sunset: 1702866000,
    };

    return mockData;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

/**
 * Get current weather for multiple locations
 */
export const getCurrentWeatherMultiple = async (locations: typeof AFRICAN_LOCATIONS): Promise<CurrentWeather[]> => {
  try {
    const weatherData = await Promise.all(
      locations.map(loc => getCurrentWeather(loc.lat, loc.lng, loc.name))
    );
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather for multiple locations:', error);
    throw error;
  }
};

/**
 * Get 7-day forecast from OpenWeatherMap (requires paid API)
 * Using Open-Meteo API as free alternative
 */
export const getShortTermForecast = async (lat: number, lng: number): Promise<ForecastData[]> => {
  try {
    // Using Open-Meteo API (free, no key required)
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,uv_index_max&timezone=auto&forecast_days=7`
    );
    const data = await response.json();

    if (!data.daily) {
      throw new Error('Invalid forecast response');
    }

    const forecast: ForecastData[] = data.daily.time.map((date: string, idx: number) => ({
      date,
      temp: data.daily.temperature_2m_max[idx],
      humidity: 65, // Average humidity (not provided by Open-Meteo free tier)
      windSpeed: data.daily.windspeed_10m_max[idx],
      description: 'Clear',
      precipitation: data.daily.precipitation_sum[idx] || 0,
      uvIndex: data.daily.uv_index_max[idx] || 0,
    }));

    return forecast;
  } catch (error) {
    console.error('Error fetching short-term forecast:', error);
    throw error;
  }
};

/**
 * Get 30-day long-term forecast from Open-Meteo
 */
export const getLongTermForecast = async (lat: number, lng: number): Promise<ForecastData[]> => {
  try {
    // Open-Meteo provides up to 90 days forecast
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto&forecast_days=30`
    );
    const data = await response.json();

    if (!data.daily) {
      throw new Error('Invalid forecast response');
    }

    const forecast: ForecastData[] = data.daily.time.map((date: string, idx: number) => ({
      date,
      temp: data.daily.temperature_2m_max[idx],
      humidity: 65,
      windSpeed: data.daily.windspeed_10m_max[idx],
      description: 'Forecast',
      precipitation: data.daily.precipitation_sum[idx] || 0,
      uvIndex: 0,
    }));

    return forecast;
  } catch (error) {
    console.error('Error fetching long-term forecast:', error);
    throw error;
  }
};

/**
 * Get hourly forecast for detailed short-term predictions
 */
export const getHourlyForecast = async (lat: number, lng: number, days: number = 1): Promise<any[]> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,relative_humidity_2m,windspeed_10m,precipitation&timezone=auto&forecast_days=${days}`
    );
    const data = await response.json();

    if (!data.hourly) {
      throw new Error('Invalid hourly forecast response');
    }

    // Return first 24 hours
    const hourlyData = data.hourly.time.slice(0, 24).map((time: string, idx: number) => ({
      time,
      temp: data.hourly.temperature_2m[idx],
      humidity: data.hourly.relative_humidity_2m[idx],
      windSpeed: data.hourly.windspeed_10m[idx],
      precipitation: data.hourly.precipitation[idx] || 0,
    }));

    return hourlyData;
  } catch (error) {
    console.error('Error fetching hourly forecast:', error);
    throw error;
  }
};

/**
 * Get historical weather data for comparison
 */
export const getHistoricalData = async (lat: number, lng: number, startDate: string, endDate: string): Promise<any[]> => {
  try {
    const response = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
    );
    const data = await response.json();

    if (!data.daily) {
      throw new Error('Invalid historical data response');
    }

    const historical = data.daily.time.map((date: string, idx: number) => ({
      date,
      highTemp: data.daily.temperature_2m_max[idx],
      lowTemp: data.daily.temperature_2m_min[idx],
      precipitation: data.daily.precipitation_sum[idx] || 0,
    }));

    return historical;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};

/**
 * Detect temperature anomalies
 */
export const detectAnomalies = (currentData: ForecastData[], historicalData: any[], threshold: number = 5): any[] => {
  const anomalies: any[] = [];

  currentData.forEach((current, idx) => {
    if (historicalData[idx]) {
      const historicalAvg = (historicalData[idx].highTemp + historicalData[idx].lowTemp) / 2;
      const difference = Math.abs(current.temp - historicalAvg);

      if (difference > threshold) {
        anomalies.push({
          date: current.date,
          type: current.temp > historicalAvg ? 'Heat Anomaly' : 'Cold Anomaly',
          currentTemp: current.temp,
          historicalAvg,
          difference,
          severity: difference > threshold * 2 ? 'Extreme' : 'Moderate',
        });
      }
    }
  });

  return anomalies;
};

/**
 * Check for heat wave conditions (3+ consecutive days above 35°C)
 */
export const detectHeatWaves = (forecastData: ForecastData[], threshold: number = 35, consecutiveDays: number = 3): any[] => {
  const heatWaves: any[] = [];
  let consecutiveCount = 0;
  let waveStartDate = '';

  forecastData.forEach((day, idx) => {
    if (day.temp >= threshold) {
      if (consecutiveCount === 0) {
        waveStartDate = day.date;
      }
      consecutiveCount++;
    } else {
      if (consecutiveCount >= consecutiveDays) {
        heatWaves.push({
          startDate: waveStartDate,
          endDate: forecastData[idx - 1].date,
          duration: consecutiveCount,
          maxTemp: Math.max(...forecastData.slice(idx - consecutiveCount, idx).map(d => d.temp)),
        });
      }
      consecutiveCount = 0;
    }
  });

  // Check if wave extends to end of forecast
  if (consecutiveCount >= consecutiveDays) {
    heatWaves.push({
      startDate: waveStartDate,
      endDate: forecastData[forecastData.length - 1].date,
      duration: consecutiveCount,
      maxTemp: Math.max(...forecastData.slice(-consecutiveCount).map(d => d.temp)),
    });
  }

  return heatWaves;
};

/**
 * Check for cold wave conditions (3+ consecutive days below 10°C)
 */
export const detectColdWaves = (forecastData: ForecastData[], threshold: number = 10, consecutiveDays: number = 3): any[] => {
  const coldWaves: any[] = [];
  let consecutiveCount = 0;
  let waveStartDate = '';

  forecastData.forEach((day, idx) => {
    if (day.temp <= threshold) {
      if (consecutiveCount === 0) {
        waveStartDate = day.date;
      }
      consecutiveCount++;
    } else {
      if (consecutiveCount >= consecutiveDays) {
        coldWaves.push({
          startDate: waveStartDate,
          endDate: forecastData[idx - 1].date,
          duration: consecutiveCount,
          minTemp: Math.min(...forecastData.slice(idx - consecutiveCount, idx).map(d => d.temp)),
        });
      }
      consecutiveCount = 0;
    }
  });

  if (consecutiveCount >= consecutiveDays) {
    coldWaves.push({
      startDate: waveStartDate,
      endDate: forecastData[forecastData.length - 1].date,
      duration: consecutiveCount,
      minTemp: Math.min(...forecastData.slice(-consecutiveCount).map(d => d.temp)),
    });
  }

  return coldWaves;
};
