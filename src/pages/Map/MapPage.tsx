import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Polyline } from 'react-leaflet';
import { LatLng, findInterpolatedPoint } from '../../utils/geoUtils';
import { AddressService } from '../../services/address';
import { ViaService } from '../../services/via';
import styles from './mapPage.module.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconRetinaUrl: iconRetina,
    iconUrl: iconMarker,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const UserIcon = L.icon({
    iconUrl: '/src/assets/images/user_location.png', // Ensure path handles vite correctly
    iconSize: [40, 40],
    iconAnchor: [20, 20] // Center? Flutter: Transform.translate(0, -22) -> bottom anchor
});

const PinIcon = L.divIcon({
    html: '<span style="font-size: 35px; color: red;">📍</span>',
    className: styles.emojiIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
});

const GreenPinIcon = L.divIcon({
    html: '<span style="font-size: 35px; color: green;">📍</span>',
    className: styles.emojiIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
});

const OrangePinIcon = L.divIcon({
    html: '<span style="font-size: 35px; color: orange;">📍</span>',
    className: styles.emojiIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
});

// Component to handle map clicks
const MapEvents = ({ onMapClick, onMapMove }: any) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
        moveend(e) {
            onMapMove(e.target.getCenter());
        }
    });
    return null;
};

const MapController = ({ center }: { center: LatLng | null }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo([center.lat, center.lng], 17);
        }
    }, [center, map]);
    return null;
};

export const MapPage = () => {
    const [userLocation, setUserLocation] = useState<LatLng | null>(null);
    const [selectedPoint, setSelectedPoint] = useState<LatLng | null>(null);
    const [confirmedPoint, setConfirmedPoint] = useState<LatLng | null>(null);
    const [interpolatedPoint, setInterpolatedPoint] = useState<LatLng | null>(null);
    const [polylines, setPolylines] = useState<LatLng[][]>([]);
    const [viaConfirmada, setViaConfirmada] = useState(false);
    const [showSatellite, setShowSatellite] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
                    setUserLocation(loc);
                    setLoading(false);
                    loadVias(loc);
                },
                (error) => {
                    console.error('Error getting location', error);
                    setLoading(false);
                    // Default location (Brasilia approx)
                    setUserLocation({ lat: -15.7942, lng: -47.8822 });
                },
                { enableHighAccuracy: true }
            );
        }
    }, []);

    const loadVias = async (loc: LatLng) => {
        const vias = await ViaService.getNearbyVias(loc);
        setPolylines(vias);
    };

    const handleMapClick = (latlng: any) => {
        if (!viaConfirmada) {
            setSelectedPoint({ lat: latlng.lat, lng: latlng.lng });
        } else {
            // If we are selecting point on line phases?
            // Flutter: If viaConfirmada is true, we already confirmed interpolation.
            // Actually Flutter logic:
            // 1. Select Point (Red Pin).
            // 2. Click "Confirmar Ponto Parada" -> _pontoParadaConfirmado = _pontoSelecionado.
            // 3. Click "Confirmar Via da Parada" -> Interpolates -> _viaConfirmada = true.
            // 4. Click "Cadastrar" -> Form.
        }
    };

    const handleConfirmPonto = async () => {
        if (!selectedPoint) return;
        setConfirmedPoint(selectedPoint);

        // Check Address
        try {
            const addr = await AddressService.getAddress(selectedPoint.lat, selectedPoint.lng);
            // Show tooltip or snackbar?
            console.log('Endereço', addr);
        } catch (e) {
            console.error('Addr error', e);
        }
    };

    const handleConfirmVia = () => {
        if (!selectedPoint || !polylines.length) return; // Changed tempMarker to selectedPoint, selectedVia to polylines.length for existing context

        // Calculate interpolation
        const interpolated = findInterpolatedPoint(selectedPoint, polylines); // Changed selectedVia.geometry.coordinates to polylines
        if (interpolated) {
            navigate(`/formulario?lat=${selectedPoint.lat}&lng=${selectedPoint.lng}&ilat=${interpolated.lat}&ilng=${interpolated.lng}`); // Changed tempMarker to selectedPoint
        } else {
            alert('Não foi possível interpolar o ponto na via selecionada.');
        }
    };

    const handleClear = () => {
        setSelectedPoint(null);
        setViaConfirmada(false);
        setPolylines([]);
    };

    const handleCadastrar = () => {
        if (!userLocation) return;
        navigate(`/formulario?lat=${userLocation.lat}&lng=${userLocation.lng}`);
    };

    return (
        <div className={styles.container}>
            {loading && <div className={styles.loading}>Carregando mapa...</div>}

            <MapContainer
                center={userLocation ? [userLocation.lat, userLocation.lng] : [-15.7942, -47.8822]}
                zoom={17}
                style={{ height: '100%', width: '100%' }}
            >
                <MapController center={userLocation} />
                <MapEvents onMapClick={handleMapClick} onMapMove={() => { }} />

                <TileLayer
                    url={showSatellite
                        ? 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
                    attribution='&copy; OpenStreetMap contributors'
                />

                {/* Polylines */}
                {polylines.map((line, idx) => (
                    <Polyline key={idx} positions={line.map(p => [p.lat, p.lng])} color="blue" weight={5} />
                ))}

                {/* User Marker */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={UserIcon} />
                )}

                {/* Confirmed Point (Green) */}
                {confirmedPoint && (
                    <Marker position={[confirmedPoint.lat, confirmedPoint.lng]} icon={GreenPinIcon} />
                )}

                {/* Interpolated Point (Orange) */}
                {interpolatedPoint && (
                    <Marker position={[interpolatedPoint.lat, interpolatedPoint.lng]} icon={OrangePinIcon} />
                )}

                {/* Selection Marker (Red) - Only if not confirmed yet, or just show selection? */}
                {!confirmedPoint && selectedPoint && (
                    <Marker position={[selectedPoint.lat, selectedPoint.lng]} icon={PinIcon} />
                )}

            </MapContainer>

            {/* UI Controls */}
            <div className={styles.controls}>
                <button className={styles.fab} onClick={() => setShowSatellite(!showSatellite)}>
                    {showSatellite ? 'Map' : 'Sat'}
                </button>

                <button className={styles.fab} onClick={() => {
                    navigator.geolocation.getCurrentPosition(p => {
                        const loc = { lat: p.coords.latitude, lng: p.coords.longitude };
                        setUserLocation(loc);
                        loadVias(loc);
                    });
                }}>
                    📍
                </button>

                {selectedPoint && (
                    <button className={styles.fabRed} onClick={handleClear}>🗑️</button>
                )}
            </div>

            <div className={styles.bottomBar}>
                <button
                    className={styles.actionButton}
                    onClick={
                        viaConfirmada ? handleCadastrar :
                            confirmedPoint ? handleConfirmVia :
                                handleConfirmPonto
                    }
                    disabled={!selectedPoint}
                >
                    {viaConfirmada ? 'Cadastrar Ponto' :
                        confirmedPoint ? 'Confirmar Via' :
                            'Confirmar Ponto'}
                </button>

                {confirmedPoint && !viaConfirmada && (
                    <button className={styles.secondaryButton} onClick={() => {
                        setInterpolatedPoint({ lat: 0, lng: 0 }); // 0,0 means 'no via'
                        setViaConfirmada(true);
                    }}>
                        Não há Vias
                    </button>
                )}
            </div>
        </div>
    );
};


