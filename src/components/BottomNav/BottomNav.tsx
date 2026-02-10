import { useNavigate, useLocation } from 'react-router-dom';
import styles from './bottomNav.module.css';
import clsx from 'clsx';

export const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className={styles.bottomNav}>
            <button
                className={clsx(styles.navItem, location.pathname === '/' && styles.active)}
                onClick={() => navigate('/')}
            >
                <span className={styles.icon}>🗺️</span>
            </button>

            <div className={styles.fabContainer}>
                {/* Curved effect placeholder if needed, usually handled by CSS/SVG */}
            </div>

            <button
                className={clsx(styles.navItem, location.pathname === '/registros' && styles.active)}
                onClick={() => navigate('/registros')}
            >
                <span className={styles.icon}>➕</span>
            </button>
        </nav>
    );
};

