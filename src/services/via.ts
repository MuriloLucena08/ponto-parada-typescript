import { LatLng, distanceBetween } from '../utils/geoUtils';

// We fetch the GeoJSON file. In Vite, assets in public or imported can be used.
// Since it's in src/assets/tab_rede_vias.geojson, we can import it if configured, or fetch it.
// Importing large JSONs can bundle them into the JS. 6MB is large.
// Better to move it to `public/` and fetch it, OR dynamic import.
// For now, let's try dynamic import.

export const ViaService = {
    async getNearbyVias(userLocation: LatLng): Promise<LatLng[][]> {
        try {
            // Adjust path based on where we put the file.
            // If we kept it in src/assets... dynamic import might work.
            // Load GeoJSON data
            // In a real app, this might be fetched from an API or loaded lazily
            // For now, we import the asset if it exists, or returns empty
            let geojson: any;
            try {
                const module = await import('../assets/tab_rede_vias.json');
                geojson = module.default || module;
            } catch (e) {
                console.error('Error loading vias', e);
                geojson = { type: 'FeatureCollection', features: [] };
            }

            const polylines: LatLng[][] = [];

            if (geojson.type === 'FeatureCollection') {
                for (const feature of geojson.features) {
                    if (feature.geometry.type === 'MultiLineString') {
                        const coordinates = feature.geometry.coordinates; // number[][][]

                        for (const linha of coordinates) {
                            // Convert [lon, lat] to {lat, lng}
                            // GeoJSON is [lon, lat]
                            const pontos: LatLng[] = linha.map((coord: number[]) => ({
                                lat: coord[1],
                                lng: coord[0]
                            }));

                            // Filter by distance (50m radius) - Flutter logic: 65m
                            const isClose = pontos.some(p =>
                                distanceBetween(userLocation, p) <= 65
                            );

                            if (isClose) {
                                polylines.push(pontos);
                            }
                        }
                    }
                }
            }
            return polylines;
        } catch (e) {
            console.error('Erro ao carregar GeoJSON', e);
            return [];
        }
    }
};
