import { useLoginLogic } from '../../hooks/useLoginLogic';
import styles from './login.module.css';
import logo from '../../assets/images/imagessemob.png'; // Verify path
import { Input } from '../../components/Commons/Input/Input';
import { Button } from '../../components/Commons/Button/Button';

export const Login = () => {
    const {
        nome,
        matricula,
        loading,
        error,
        success,
        handleNomeChange,
        handleMatriculaChange,
        handleSubmit
    } = useLoginLogic();

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.logoContainer}>
                    <img src={logo} alt="SEMOB" className={styles.logo} />
                </div>
                <h1 className={styles.title}>Entrar</h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        label="Nome completo"
                        id="nome"
                        type="text"
                        value={nome}
                        onChange={handleNomeChange}
                        required
                    />

                    <Input
                        label="Matrícula"
                        id="matricula"
                        type="text"
                        value={matricula}
                        onChange={handleMatriculaChange}
                        required
                        placeholder="000.000-0"
                    />

                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>{success}</p>}

                    <Button type="submit" isLoading={loading} className={styles.button}>
                        Entrar
                    </Button>
                </form>
            </div>
        </div>
    );
};


