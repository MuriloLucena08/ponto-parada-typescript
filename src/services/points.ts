import { api } from './api';
import { IPonto } from '../types/Ponto';
import { fileToBase64, getBlobFromUrl } from '../utils/file';

export const PointsService = {
    async getAll() {
        const response = await api.get('/paradas');
        return response.data;
    },

    async createPoint(ponto: IPonto) {
        // Transform IPonto to Backend JSON format
        const abrigosFormatados = await Promise.all(ponto.abrigos.map(async (abrigo) => {
            const imagensAbrigo = await Promise.all(abrigo.imgBlobPaths.map(async (path) => {
                // If path is a blob URL (from Dexie or generic), convert to base64
                // If it's already base64 (restored from DB?), handle it.
                // Assume it's a Blob URL or Object URL for now.
                let blob: Blob;
                if (path.startsWith('blob:')) {
                    blob = await getBlobFromUrl(path);
                } else {
                    // handle other cases? maybe it's just a placeholder or we can't read it?
                    // For now assume blob url.
                    // If we store Blobs in Dexie, we might pass the Blob object directly in a modified interface?
                    // But IPonto defines string[].
                    // Let's assume we handle blob conversion before calling this or inside.
                    // For now, fetch from URL.
                    blob = await getBlobFromUrl(path);
                }
                const base64 = await fileToBase64(blob);
                return { abrigo_img: base64 };
            }));

            let patologias: any[] = [];
            if (abrigo.temPatologia) {
                const imagensPatologia = await Promise.all(abrigo.imagensPatologiaPaths.map(async (path) => {
                    const blob = await getBlobFromUrl(path);
                    const base64 = await fileToBase64(blob);
                    return { patologias_img: base64 };
                }));

                patologias.push({
                    id_tipo_patologia: 1, // Default from flutter code
                    imagens: imagensPatologia
                });
            }

            return {
                id_tipo_abrigo: abrigo.idTipoAbrigo,
                imagens: imagensAbrigo,
                patologias: patologias
            };
        }));

        const payload = {
            id_usuario: ponto.idUsuario,
            endereco: ponto.endereco,
            latitude: ponto.latitude,
            longitude: ponto.longitude,
            linha_escolar: ponto.linhaEscolares,
            linha_stpc: ponto.linhaStpc,
            latitudeInterpolado: ponto.latitudeInterpolado,
            longitudeInterpolado: ponto.longitudeInterpolado,
            data_visita: ponto.dataVisita, // ISO string? Flutter writes toIso8601String()
            baia: ponto.baia,
            rampa_acessivel: ponto.rampa,
            piso_tatil: ponto.pisoTatil,
            patologia: ponto.patologia,
            abrigos: abrigosFormatados
        };

        const response = await api.post('/pontos/criar', payload);
        return response.status === 201;
    }
};
