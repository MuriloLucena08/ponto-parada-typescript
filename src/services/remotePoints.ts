import { api } from './api';

export interface RemotePoint {
    id: number;
    latitude: number;
    longitude: number;
    endereco?: string;
    bacia?: string;
    ra?: string;
    codigo?: string;
    // Add other fields from ParadaModel if needed
}

export const RemotePointsService = {
    async getAll(): Promise<RemotePoint[]> {
        try {
            const response = await api.get('/pontos/novos/pontos');
            if (response.status === 200) {
                return response.data;
            }
            return [];
        } catch (e) {
            console.error('Error fetching remote points', e);
            return [];
        }
    },

    async getByRa(ra: string): Promise<RemotePoint[]> {
        try {
            const response = await api.get(`/pontos/novos/pontos/ras/${encodeURIComponent(ra)}`);
            if (response.status === 200) {
                return response.data;
            }
            return [];
        } catch (e) {
            console.error('Error fetching points by RA', e);
            return [];
        }
    },

    async getByBacia(bacia: string): Promise<RemotePoint[]> {
        try {
            const response = await api.get(`/pontos/novos/pontos/bacias/${encodeURIComponent(bacia)}`);
            if (response.status === 200) {
                return response.data;
            }
            return [];
        } catch (e) {
            console.error('Error fetching points by Bacia', e);
            return [];
        }
    }
};
