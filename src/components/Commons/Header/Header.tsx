import React from 'react';
import styles from './Header.module.css';
import logo from '../../../assets/images/logo.png'; // Assuming logo path

interface HeaderProps {
    title?: string;
    onBack?: () => void;
    rightAction?: React.ReactNode;
    backIcon?: React.ReactNode;
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, rightAction, backIcon, children, style }) => {
    return (
        <header className={styles.header} style={style}>
            <div className={styles.left}>
                {onBack && (
                    <button onClick={onBack} className={styles.backButton}>
                        {backIcon || '‹'}
                    </button>
                )}
                {title ? (
                    <h1 className={styles.title}>{title}</h1>
                ) : children ? (
                    <div className={styles.title}>{children}</div>
                ) : (
                    <img src={logo} alt="Ponto Certo" className={styles.logo} />
                )}
            </div>
            {rightAction && <div className={styles.right}>{rightAction}</div>}
        </header>
    );
};
