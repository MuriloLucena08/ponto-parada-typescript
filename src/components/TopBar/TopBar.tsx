import { useState } from 'react';
import styles from './topBar.module.css';
import {Sidebar} from '../Sidebar/Sidebar';
import { Header } from '../Commons/Header/Header';

export const TopBar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <Header
                onBack={() => setSidebarOpen(true)}
                backIcon={<span className={styles.menuIcon}>☰</span>}
            />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
    );
};


