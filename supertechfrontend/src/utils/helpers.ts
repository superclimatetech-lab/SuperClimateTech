export const convertCelsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9/5) + 32;
};

export const convertFahrenheitToCelsius = (fahrenheit: number): number => {
  return (fahrenheit - 32) * 5/9;
};

export const getTemperatureColor = (temperature: number, unit: 'C' | 'F' = 'C'): string => {
  const celsius = unit === 'F' ? convertFahrenheitToCelsius(temperature) : temperature;
  
  if (celsius >= 40) return 'bg-red-600';
  if (celsius >= 35) return 'bg-red-500';
  if (celsius >= 30) return 'bg-orange-500';
  if (celsius >= 25) return 'bg-orange-400';
  if (celsius >= 20) return 'bg-yellow-400';
  if (celsius >= 15) return 'bg-blue-300';
  if (celsius >= 10) return 'bg-blue-400';
  return 'bg-blue-600';
};

export const getAlertColor = (type: 'heat_wave' | 'cold_wave', severity: string): string => {
  if (type === 'heat_wave') {
    switch (severity) {
      case 'extreme': return 'text-red-700 bg-red-100';
      case 'severe': return 'text-orange-700 bg-orange-100';
      case 'warning': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  } else {
    switch (severity) {
      case 'extreme': return 'text-blue-900 bg-blue-100';
      case 'severe': return 'text-blue-700 bg-blue-100';
      case 'warning': return 'text-cyan-700 bg-cyan-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  }
};

export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'C'): string => {
  const rounded = Math.round(temp * 10) / 10;
  return `${rounded}°${unit}`;
};

export const isHeatWaveCondition = (temperature: number): boolean => {
  return temperature >= 35;
};

export const isColdWaveCondition = (temperature: number): boolean => {
  return temperature < 10;
};

export const calculateHeatIndex = (temperature: number, humidity: number): number => {
  // Simplified heat index calculation
  const c1 = -42.379;
  const c2 = 2.04901523;
  const c3 = 10.14333127;
  const c4 = -0.22475541;
  const c5 = -0.00683783;
  const c6 = -0.05481717;
  const c7 = 0.00122874;
  const c8 = 0.00085282;
  const c9 = -0.00000199;

  const T = temperature * 9/5 + 32; // Convert to Fahrenheit
  const RH = humidity;

  const HI = c1 + (c2*T) + (c3*RH) + (c4*T*RH) + (c5*T*T) + (c6*RH*RH) + 
             (c7*T*T*RH) + (c8*T*RH*RH) + (c9*T*T*RH*RH);

  // Convert back to Celsius
  return (HI - 32) * 5/9;
};

export const getWindSpeedDescription = (windSpeed: number): string => {
  if (windSpeed < 2) return 'Calm';
  if (windSpeed < 6) return 'Light breeze';
  if (windSpeed < 12) return 'Moderate breeze';
  if (windSpeed < 20) return 'Fresh breeze';
  if (windSpeed < 29) return 'Strong breeze';
  if (windSpeed < 39) return 'Gale';
  if (windSpeed < 47) return 'Severe gale';
  return 'Hurricane';
};
