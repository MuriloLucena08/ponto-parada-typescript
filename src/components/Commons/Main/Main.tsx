import React from 'react';
import styles from './Main.module.css';

interface MainProps {
    children: React.ReactNode;
    className?: string;
}

export const Main: React.FC<MainProps> = ({ children, className }) => {
    return (
        <main className={`${styles.main} ${className || ''}`}>
            {children}
        </main>
    );
};
