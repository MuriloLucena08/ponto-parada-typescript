import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePonto } from '../../context/PontoContext';
import { useAuth } from '../../context/AuthContext';
import { IPonto, IAbrigo } from '../../types/Ponto';
import styles from './formulario.module.css';
import AbrigoList from './AbrigoList';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { AddressService } from '../../services/address';
import { Header } from '../../components/Commons/Header/Header';
import { Main } from '../../components/Commons/Main/Main';
import { Input } from '../../components/Commons/Input/Input';
import { Button } from '../../components/Commons/Button/Button';
import { formatDateForInput } from '../../utils/formatters';
import { Switch } from '../../components/Commons/Switch/Switch';
// Icons need to be setup locally or imported
const PinIcon = L.divIcon({
    html: '<span style="font-size: 30px; color: red;">📍</span>',
    className: 'emoji-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});

export const FormularioPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addPonto, pontos, updatePonto } = usePonto();
    const { getUsuarioId } = useAuth(); // We need to expose getUsuarioId or user object

    const query = new URLSearchParams(location.search);
    const lat = parseFloat(query.get('lat') || '0');
    const lng = parseFloat(query.get('lng') || '0');
    const ilat = parseFloat(query.get('ilat') || '0');
    const ilng = parseFloat(query.get('ilng') || '0');
    const editId = query.get('edit');

    const [endereco, setEndereco] = useState('');
    const [linhaEscolares, setLinhaEscolares] = useState(false);
    const [linhaStpc, setLinhaStpc] = useState(false);
    const [baia, setBaia] = useState(false);
    const [rampa, setRampa] = useState(false);
    const [pisoTatil, setPisoTatil] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_patologia, setPatologia] = useState(false);
    // Flutter: `_patologia = ...` then `_temPatologia = ...`. 
    // Wait, `_patologia` seems to be general field, `temPatologia` is boolean for abrigos logic.

    const [dataVisita, setDataVisita] = useState<string>(formatDateForInput(new Date())); // datetime-local format
    const [abrigos, setAbrigos] = useState<IAbrigo[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const init = async () => {
            if (editId) {
                // Load existing
                const id = parseInt(editId);
                const p = pontos.find(p => p.id === id);
                if (p) {
                    setEndereco(p.endereco);
                    setLinhaEscolares(p.linhaEscolares);
                    setLinhaStpc(p.linhaStpc);
                    setBaia(p.baia);
                    setRampa(p.rampa);
                    setPisoTatil(p.pisoTatil);
                    setPatologia(p.patologia);
                    setDataVisita(formatDateForInput(p.dataVisita));
                    setAbrigos(p.abrigos);
                }
            } else {
                // Reverse geocode if new
                try {
                    // If address not passed, fetch it
                    const addr = await AddressService.getAddress(lat, lng);
                    const fullAddr = `${addr.road}, ${addr.neighbourhood}, ${addr.city}`;
                    setEndereco(fullAddr.replace(/^, /, '').replace(/, $/, ''));
                } catch (e) {
                    console.warn('Address fetch failed');
                }
            }
        };
        init();
    }, [editId, lat, lng, pontos]);

    const handleSave = async () => {
        if (!endereco) {
            alert('Endereço obrigatório');
            return;
        }

        const userId = getUsuarioId();
        if (!userId) {
            alert('Usuário não logado');
            return;
        }

        setLoading(true);

        const ponto: IPonto = {
            id: editId ? parseInt(editId) : undefined,
            idUsuario: userId,
            endereco,
            latitude: lat,
            longitude: lng,
            linhaEscolares,
            linhaStpc,
            baia,
            rampa,
            pisoTatil,
            patologia: abrigos.some(a => a.temPatologia), // Logic: if any shelter has pathology? Or redundant field?
            latitudeInterpolado: ilat,
            longitudeInterpolado: ilng,
            dataVisita: new Date(dataVisita).toISOString(),
            abrigos,
            imgBlobPaths: [],
            imagensPatologiaPaths: [],
            syncStatus: 'pending'
        };

        try {
            if (editId && ponto.id) {
                await updatePonto(ponto);
            } else {
                await addPonto(ponto);
            }
            navigate('/registros');
        } catch (e) {
            console.error(e);
            alert('Erro ao salvar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Header title="Formulário da Parada" onBack={() => navigate(-1)} />

            <Main className={styles.content}>
                <div className={styles.section}>
                    <Input
                        label="Endereço"
                        type="text"
                        value={endereco}
                        onChange={e => setEndereco(e.target.value)}
                    />
                </div>

                <div className={styles.mapPreview}>
                    <MapContainer center={[lat, lng]} zoom={16} zoomControl={false} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[lat, lng]} icon={PinIcon} />
                    </MapContainer>
                </div>

                <div className={styles.switches}>
                    <Switch label="Linhas Escolares" value={linhaEscolares} onChange={setLinhaEscolares} />
                    <Switch label="Linhas STPC" value={linhaStpc} onChange={setLinhaStpc} />
                    <Switch label="Baia" value={baia} onChange={setBaia} />
                </div>

                <h3>Acessibilidade</h3>
                <div className={styles.switches}>
                    <Switch label="Rampa" value={rampa} onChange={setRampa} />
                    <Switch label="Piso Tátil" value={pisoTatil} onChange={setPisoTatil} />
                </div>

                <div className={styles.section}>
                    <Input
                        label="Data e Hora da Visita"
                        type="datetime-local"
                        value={dataVisita}
                        onChange={e => setDataVisita(e.target.value)}
                    />
                </div>

                <div className={styles.divider} />

                <AbrigoList abrigos={abrigos} setAbrigos={setAbrigos} />

                <Button onClick={handleSave} isLoading={loading} className={styles.saveButton}>
                    Salvar Parada
                </Button>
            </Main>
        </div>
    );
};


