import { LatLngExpression } from 'leaflet';

export interface IVia {
    polylines: LatLngExpression[][];
}

export interface IViaGeoJSON {
    // Basic typing for the GeoJSON structure we receive
    vias_proximas?: {
        type: string;
        coordinates: number[][][]; // MultiLineString
    }
}
