import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { RemotePointsService, RemotePoint } from '../../services/remotePoints';
import styles from './paradasBanco.module.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

const RedPinIcon = L.divIcon({
    html: '<span style="font-size: 30px; color: red;">📍</span>',
    className: 'emoji-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});

const ParadasBancoPage = () => {
    const [points, setPoints] = useState<RemotePoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const navigate = useNavigate();


    const ras = [
        "ÁGUAS CLARAS", "BRASÍLIA", "BRAZLÂNDIA", "CANDANGOLÂNDIA", "CEILÂNDIA", "CRUZEIRO",
        "GAMA", "GUARÁ", "ITAPOÃ", "JARDIM BOTÂNICO", "LAGO NORTE", "LAGO SUL",
        "NÚCLEO BANDEIRANTE", "PARANOÁ", "PARK WAY", "PLANALTINA", "RECANTO DAS EMAS",
        "RIACHO FUNDO", "RIACHO FUNDO II", "SAMAMBAIA", "SANTA MARIA", "SÃO SEBASTIÃO",
        "SCIA", "SIA", "SOBRADINHO", "SOBRADINHO II", "SUDOESTE/OCTOGONAL", "TAGUATINGA",
        "VARJÃO", "VICENTE PIRES"
    ];

    const bacias = [
        'Sem Bacia', 'Norte', 'Sudeste', 'Sudoeste', 'Centro-Oeste', 'Noroeste'
    ];

    const [filterType, setFilterType] = useState<'RA' | 'Bacia' | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<string>('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            let data: RemotePoint[] = [];

            if (navigator.geolocation && !userLocation) {
                navigator.geolocation.getCurrentPosition(p => {
                    setUserLocation([p.coords.latitude, p.coords.longitude]);
                });
            }

            if (filterType === 'RA' && selectedFilter) {
                data = await RemotePointsService.getByRa(selectedFilter);
            } else if (filterType === 'Bacia' && selectedFilter) {
                data = await RemotePointsService.getByBacia(selectedFilter);
            } else {
                data = await RemotePointsService.getAll();
            }

            setPoints(data);
            setLoading(false);
        };
        load();
    }, [filterType, selectedFilter]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backBtn}>‹</button>
                <div className={styles.filters}>
                    <select
                        value={filterType || ''}
                        onChange={(e) => {
                            setFilterType(e.target.value as 'RA' | 'Bacia' || null);
                            setSelectedFilter('');
                        }}
                        className={styles.select}
                    >
                        <option value="">Todos</option>
                        <option value="RA">Região Administrativa</option>
                        <option value="Bacia">Bacia</option>
                    </select>

                    {filterType && (
                        <select
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">Selecione...</option>
                            {(filterType === 'RA' ? ras : bacias).map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
            {loading && <div className={styles.loading}>Carregando...</div>}
            <MapContainer center={userLocation || [-15.7942, -47.8822]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {points.map(p => (
                    <Marker key={p.id} position={[p.latitude, p.longitude]} icon={RedPinIcon}>
                        <Popup>
                            <div>
                                <strong>ID: {p.id}</strong><br />
                                {p.endereco && <>{p.endereco}<br /></>}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default ParadasBancoPage;
