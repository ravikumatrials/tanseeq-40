
import { useState, useEffect } from 'react';

interface LocationData {
  latitude: number | null;
  longitude: number | null;
  address: string;
  isLoading: boolean;
  error: string | null;
}

export const useLocation = () => {
  const [locationData, setLocationData] = useState<LocationData>({
    latitude: null,
    longitude: null,
    address: '',
    isLoading: true,
    error: null
  });

  const getLocation = () => {
    setLocationData(prev => ({ ...prev, isLoading: true, error: null }));
    
    if (!navigator.geolocation) {
      setLocationData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Geolocation is not supported by your browser'
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // In a real app, we would use a reverse geocoding service
          // For now, let's simulate a resolved address
          const simulatedAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          
          setLocationData({
            latitude,
            longitude,
            address: simulatedAddress,
            isLoading: false,
            error: null
          });
        } catch (error) {
          setLocationData(prev => ({
            ...prev,
            isLoading: false,
            error: 'Failed to get address information'
          }));
        }
      },
      (error) => {
        setLocationData(prev => ({
          ...prev,
          isLoading: false,
          error: `Failed to get location: ${error.message}`
        }));
      }
    );
  };

  // Initial location fetch on mount
  useEffect(() => {
    getLocation();
  }, []);

  return { ...locationData, getLocation };
};
