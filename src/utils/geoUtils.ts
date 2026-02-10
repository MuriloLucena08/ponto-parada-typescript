export const EARTH_RADIUS_METERS = 6371000;

export interface LatLng {
    lat: number;
    lng: number;
}

export const toRad = (value: number) => (value * Math.PI) / 180;
export const toDeg = (value: number) => (value * 180) / Math.PI;

export const distanceBetween = (p1: LatLng, p2: LatLng): number => {
    const dLat = toRad(p2.lat - p1.lat);
    const dLon = toRad(p2.lng - p1.lng);
    const lat1 = toRad(p1.lat);
    const lat2 = toRad(p2.lat);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_METERS * c;
};

// Simple projection of point onto line segment
export const projectPointOnSegment = (p: LatLng, a: LatLng, b: LatLng): LatLng => {
    const x = p.lng;
    const y = p.lat;
    const x1 = a.lng;
    const y1 = a.lat;
    const x2 = b.lng;
    const y2 = b.lat;

    const dx = x2 - x1;
    const dy = y2 - y1;

    if (dx === 0 && dy === 0) return a;

    let t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
    t = Math.max(0, Math.min(1, t));

    const projX = x1 + t * dx;
    const projY = y1 + t * dy;

    return { lat: projY, lng: projX };
};

export const findInterpolatedPoint = (point: LatLng, polylines: LatLng[][]): LatLng | null => {
    // Flatten polylines to consolidated points like Flutter? 
    // Flutter: _consolidatedPoints = _consolidarPontos(vias);
    // It seems Flutter logic consolidates ALL points from ALL nearby polylines into one massive list?
    // "List<LatLng> _consolidatedPoints = []... allPoints.addAll(polyline.points)"
    // And then iterates through them as a single continuous line? 
    // Wait, if multiple disconnected lines exist, connecting the last point of line A to first of line B is WRONG.
    // But looking at Flutter code:
    // `List<LatLng> _consolidatedPoints = _consolidarPontos(_polylines);`
    // `_consolidarPontos` just adds all points.
    // `acharPontoInterpolado` iterates `_consolidatedPoints.length - 1`.
    // YES, it treats separate polylines as one continuous web if they are in the list.
    // This might be a bug in Flutter or intended if data is clean. I will replicate exactly.

    let consolidatedPoints: LatLng[] = [];
    polylines.forEach(line => consolidatedPoints.push(...line));

    if (consolidatedPoints.length < 2) return null;

    let minDistance = Infinity;
    // double tamanhoTotal = tamanhoTotalLinha(); // Unused in final calculation logic shown in snippet?
    // Actually `acharPontoInterpolado` uses `projecaoMaisProxima` which is a factor (0-1) of TOTAL length.
    // And then `interpolateAlongLine(projecaoMaisProxima)` reconstructs it.
    // This essentially snaps the point to the nearest segment on the "concatenated" polyline.

    // To match logic:
    // 1. Calculate total length of the "consolidated" line.
    // 2. Find nearest projection on any segment.
    // 3. Store the "distance factor" (accumulated length to projection / total length).
    // 4. Re-interpolate.
    // This seems redundant (Projection -> Factor -> Point). Ideally we just take the Projected Point.
    // `interpolateAlongLine` just returns the coordinate at that distance.
    // So if I just find the closest point on any segment, that IS the result.
    // The "Factor" logic is likely for some other features (like "progress along route").
    // But for "acharPontoInterpolado", it returns LatLng.

    // Optimization: Just find the closest point on specific segment.

    let bestPoint: LatLng = consolidatedPoints[0];

    for (let i = 0; i < consolidatedPoints.length - 1; i++) {
        const start = consolidatedPoints[i];
        const end = consolidatedPoints[i + 1];

        // This connects end of Line A to start of Line B if they appeared sequentially in the list.
        // If they are far apart, it considers the imaginary line between them as valid.
        // We replicate this behavior as requested.

        const proj = projectPointOnSegment(point, start, end);
        const dist = distanceBetween(point, proj);

        if (dist < minDistance) {
            minDistance = dist;
            bestPoint = proj;
        }
    }

    return bestPoint;
};
