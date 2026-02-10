import { api } from './api';

// Mocking storage key
const USER_ID_KEY = 'idUsuario';

export const AuthService = {
    async login(nome: string, matricula: string): Promise<{ idUsuario?: number; error?: string }> {
        try {
            const response = await api.post('/usuarios/verificar', {
                nome,
                matricula,
            });

            if (response.status === 201) {
                const { idUsuario } = response.data;
                if (idUsuario) {
                    localStorage.setItem(USER_ID_KEY, idUsuario.toString());
                    // Optional: Store user info in db or just ID
                    return { idUsuario };
                }
            }
            return { error: 'Login falhou' };
        } catch (error) {
            console.error('Login error:', error);
            return { error: 'Erro de conexão' };
        }
    },

    getUsuarioId(): number | null {
        const id = localStorage.getItem(USER_ID_KEY);
        return id ? parseInt(id, 10) : null;
    },

    logout() {
        localStorage.removeItem(USER_ID_KEY);
    }
};
