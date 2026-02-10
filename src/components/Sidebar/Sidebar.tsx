import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './sidebar.module.css';
import clsx from 'clsx';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        onClose();
        navigate('/login');
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <>
            <div
                className={clsx(styles.overlay, isOpen && styles.open)}
                onClick={onClose}
            />
            <div className={clsx(styles.sidebar, isOpen && styles.open)}>
                <div className={styles.header}>
                    <h2>Menu</h2>
                </div>
                <nav className={styles.nav}>
                    <a href="#" className={styles.item} onClick={(e) => { e.preventDefault(); handleNavigate('/'); }}>
                        📍 Mapa / Paradas
                    </a>
                    <a href="#" className={styles.item} onClick={(e) => { e.preventDefault(); handleNavigate('/registros'); }}>
                        📋 Registros Pendentes
                    </a>
                    <a href="#" className={styles.item} onClick={(e) => { e.preventDefault(); handleNavigate('/sobre'); }}>
                        ℹ️ Sobre
                    </a>
                    <a href="#" className={styles.item} onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                        🚪 Sair
                    </a>
                </nav>
            </div>
        </>
    );
};


