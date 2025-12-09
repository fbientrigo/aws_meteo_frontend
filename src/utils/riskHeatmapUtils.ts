import * as turf from '@turf/turf';
import { RiskType } from '@/types';

export interface RiskPoint {
    lat: number;
    lng: number;
    intensity: number; // 0-1
}

/**
 * Generates a grid of risk points within a polygon
 * In a real app, this would likely come from an API
 */
export const generateRiskHeatmapPoints = (
    polygonGeoJSON: any,
    riskType: RiskType
): [number, number, number][] => {
    if (!polygonGeoJSON) return [];

    // Get bounding box of the polygon
    const bbox = turf.bbox(polygonGeoJSON);

    // Create a grid of points within the bbox
    // Adjust cellSide based on polygon size for performance vs resolution
    const cellSide = 0.05; // km
    const options = { units: 'kilometers' as const };
    const grid = turf.pointGrid(bbox, cellSide, options);

    const points: [number, number, number][] = [];

    // Filter points inside the polygon
    turf.featureEach(grid, (currentFeature) => {
        if (turf.booleanPointInPolygon(currentFeature, polygonGeoJSON)) {
            const coords = turf.getCoord(currentFeature);
            // Generate mock intensity based on risk type and location
            // This creates some "noise" pattern for demo purposes
            const intensity = getMockIntensity(coords[1], coords[0], riskType);

            // Leaflet.heat expects [lat, lng, intensity]
            points.push([coords[1], coords[0], intensity]);
        }
    });

    return points;
};

/**
 * Generates a mock intensity value (0-1) based on coordinates and risk type
 */
const getMockIntensity = (lat: number, lng: number, riskType: RiskType): number => {
    // Simple hash function to get consistent random-looking values
    const seed = lat * 1000 + lng * 1000;
    const x = Math.sin(seed) * 10000;
    const random = x - Math.floor(x);

    // Base intensity
    let intensity = random;

    // Adjust based on risk type for variety
    switch (riskType) {
        case 'drought':
            // Higher intensity in general
            intensity = 0.3 + (intensity * 0.7);
            break;
        case 'flooding':
            // More sparse, high intensity spots
            intensity = intensity > 0.7 ? intensity : 0;
            break;
        case 'frost':
            // Gradient-like
            intensity = (Math.sin(lat * 100) + 1) / 2;
            break;
        case 'fire':
            // Very sparse, very high intensity
            intensity = intensity > 0.85 ? 1 : 0;
            break;
    }

    return intensity;
};

/**
 * Filters existing points to keep only those inside the polygon
 */
export const filterPointsInPolygon = (
    points: [number, number, number][],
    polygonGeoJSON: any
): [number, number, number][] => {
    if (!polygonGeoJSON || !points) return [];

    return points.filter(point => {
        const pt = turf.point([point[1], point[0]]); // turf uses [lng, lat]
        return turf.booleanPointInPolygon(pt, polygonGeoJSON);
    });
};
