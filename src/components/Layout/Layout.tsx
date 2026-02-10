import { Outlet } from 'react-router-dom';
import {TopBar} from '../TopBar/TopBar';
import {BottomNav} from '../BottomNav/BottomNav';
import styles from './layout.module.css';

export const Layout = () => {
    return (
        <div className={styles.layoutContainer}>
            <TopBar />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
};


