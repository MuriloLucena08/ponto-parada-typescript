import React from 'react';
import styles from './Footer.module.css';

interface FooterProps {
    children?: React.ReactNode;
}

export const Footer: React.FC<FooterProps> = ({ children }) => {
    return (
        <footer className={styles.footer}>
            {children || (
                <p>&copy; {new Date().getFullYear()} Ponto Certo - SEMOB/DF</p>
            )}
        </footer>
    );
};
