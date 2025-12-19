import { useState } from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';

interface LocationMarker {
  id: number;
  name: string;
  lat: number;
  lng: number;
  temp: number;
  condition: string;
}

interface WeatherMapProps {
  locations?: LocationMarker[];
  apiKey: string;
}

export const WeatherMap = ({ 
  locations = [
    { id: 1, name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357, temp: 28, condition: 'Sunny' },
    { id: 2, name: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792, temp: 26, condition: 'Cloudy' },
    { id: 3, name: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219, temp: 20, condition: 'Rainy' },
    { id: 4, name: 'Johannesburg, South Africa', lat: -26.2023, lng: 28.0436, temp: 22, condition: 'Sunny' },
  ],
  apiKey
}: WeatherMapProps) => {
  const [selectedMarker, setSelectedMarker] = useState<LocationMarker | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '400px',
    borderRadius: '0.5rem',
  };

  const center = {
    lat: 0,
    lng: 20,
  };

  const options = {
    zoom: 3,
    mapTypeId: 'roadmap' as const,
  };

  const getMarkerColor = (temp: number) => {
    if (temp > 30) return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    if (temp > 25) return 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
    if (temp > 20) return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
  };

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={options.zoom}
        options={options}
      >
        {locations.map((location) => (
          <MarkerF
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            title={location.name}
            icon={getMarkerColor(location.temp)}
            onClick={() => setSelectedMarker(location)}
          >
            {selectedMarker?.id === location.id && (
              <InfoWindowF
                position={{ lat: location.lat, lng: location.lng }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div style={{ color: '#000', padding: '0.5rem' }}>
                  <h3 style={{ margin: '0.25rem 0', fontWeight: 'bold' }}>
                    {location.name}
                  </h3>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
                    Temperature: <strong>{location.temp}°C</strong>
                  </p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
                    Condition: <strong>{location.condition}</strong>
                  </p>
                </div>
              </InfoWindowF>
            )}
          </MarkerF>
        ))}
      </GoogleMap>
    </LoadScript>
  );
};
