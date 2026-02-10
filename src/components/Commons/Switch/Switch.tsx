import styles from './Switch.module.css';

interface SwitchProps {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

export const Switch = ({ label, value, onChange }: SwitchProps) => (
    <div className={styles.switchRow} onClick={() => onChange(!value)}>
        <span>{label}</span>
        <div className={`${styles.toggle} ${value ? styles.active : ''}`}>
            <div className={styles.knob} />
        </div>
    </div>
);
