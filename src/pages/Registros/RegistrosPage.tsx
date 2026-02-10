import { usePonto } from '../../context/PontoContext';
import styles from './registros.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Main } from '../../components/Commons/Main/Main';

export const RegistrosPage = () => {
    const { pontos, syncPontos, pendingCount } = usePonto();
    const [syncing, setSyncing] = useState(false);
    const navigate = useNavigate();

    const handleSync = async () => {
        if (pendingCount === 0) return;
        setSyncing(true);
        await syncPontos();
        setSyncing(false);
        // Show snackbar/toast
    };

    const handleEdit = (id: number) => {
        // Navigate to MapPage with ID to edit
        navigate(`/?edit=${id}`);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleDelete = (_id: number) => {
        // Implement delete if needed (soft delete or remove from dexie)
        console.log('Delete not implemented yet');
    };

    return (
        <Main className={styles.container}>
            {syncing && (
                <div className={styles.syncOverlay}>
                    <div className={styles.syncBox}>
                        <p>Enviando paradas...</p>
                        {/* Progress bar could go here */}
                    </div>
                </div>
            )}

            {pontos.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>Paradas criadas estarão disponíveis aqui para gravar ao banco de dados</p>
                </div>
            ) : (
                <div className={styles.list}>
                    {pontos.map((ponto, index) => (
                        <div key={ponto.id || index} className={styles.card}>
                            <div className={styles.cardContent}>
                                <div className={styles.imageContainer}>
                                    {/* Show verification if image exists */}
                                    <span className={styles.locationIcon}>📍</span>
                                </div>
                                <div className={styles.info}>
                                    <h3 className={styles.address}>{ponto.endereco}</h3>
                                    <div className={styles.details}>
                                        <p>Há Abrigo: {ponto.abrigos.length > 0 ? 'Sim' : 'Não'}</p>
                                        <p>Patologias: {ponto.abrigos.some(a => a.temPatologia) ? 'Sim' : 'Não'}</p>
                                        <p>Acessibilidade: {(ponto.pisoTatil || ponto.rampa) ? 'Sim' : 'Não'}</p>
                                        <p>Linhas: {ponto.linhaStpc ? 'Sim' : 'Não'}</p>
                                        <p className={styles.status}>Status: {ponto.syncStatus || 'Pending'}</p>
                                    </div>
                                </div>
                                <div className={styles.actions}>
                                    <button onClick={() => ponto.id && handleEdit(ponto.id)} className={styles.iconBtn}>✏️</button>
                                    <button onClick={() => ponto.id && handleDelete(ponto.id)} className={styles.iconBtn}>🗑️</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button
                className={styles.fab}
                onClick={handleSync}
                disabled={syncing || pendingCount === 0}
            >
                {syncing ? '...' : '☁️'}
            </button>
        </Main>
    );
};


