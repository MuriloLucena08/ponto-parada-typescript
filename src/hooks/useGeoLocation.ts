import { useState, useEffect } from 'react';

interface GeoLocationState {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    loading: boolean;
}

export const useGeoLocation = () => {
    const [location, setLocation] = useState<GeoLocationState>({
        latitude: null,
        longitude: null,
        error: null,
        loading: true,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation(prev => ({ ...prev, error: 'Geolocation is not supported by your browser', loading: false }));
            return;
        }

        const handleSuccess = (position: GeolocationPosition) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
                loading: false,
            });
        };

        const handleError = (error: GeolocationPositionError) => {
            setLocation(prev => ({ ...prev, error: error.message, loading: false }));
        };

        const watcher = navigator.geolocation.watchPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        });

        return () => navigator.geolocation.clearWatch(watcher);
    }, []);

    return location;
};
