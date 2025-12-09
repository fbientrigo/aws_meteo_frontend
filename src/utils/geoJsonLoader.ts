/**
 * GeoJSON file loader and validator utilities
 */

import L from 'leaflet';

/**
 * Parse and validate a GeoJSON file
 */
export async function parseGeoJSONFile(file: File): Promise<GeoJSON.Polygon> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const geoJSON = JSON.parse(content);

                if (!validateGeoJSON(geoJSON)) {
                    reject(new Error('Archivo GeoJSON inválido'));
                    return;
                }

                // Extract polygon from different GeoJSON structures
                let polygon: GeoJSON.Polygon;

                if (geoJSON.type === 'Polygon') {
                    polygon = geoJSON;
                } else if (geoJSON.type === 'Feature' && geoJSON.geometry?.type === 'Polygon') {
                    polygon = geoJSON.geometry;
                } else if (geoJSON.type === 'FeatureCollection' && geoJSON.features?.[0]?.geometry?.type === 'Polygon') {
                    polygon = geoJSON.features[0].geometry;
                } else {
                    reject(new Error('El archivo debe contener un polígono'));
                    return;
                }

                resolve(polygon);
            } catch (error) {
                reject(new Error('Error al leer el archivo GeoJSON'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Error al leer el archivo'));
        };

        reader.readAsText(file);
    });
}

/**
 * Validate GeoJSON structure
 */
export function validateGeoJSON(geoJSON: any): boolean {
    if (!geoJSON || typeof geoJSON !== 'object') {
        return false;
    }

    // Check if it's a valid GeoJSON type
    const validTypes = ['Polygon', 'Feature', 'FeatureCollection'];
    if (!validTypes.includes(geoJSON.type)) {
        return false;
    }

    // Validate Polygon
    if (geoJSON.type === 'Polygon') {
        return validatePolygonCoordinates(geoJSON.coordinates);
    }

    // Validate Feature
    if (geoJSON.type === 'Feature') {
        return geoJSON.geometry?.type === 'Polygon' &&
            validatePolygonCoordinates(geoJSON.geometry.coordinates);
    }

    // Validate FeatureCollection
    if (geoJSON.type === 'FeatureCollection') {
        return Array.isArray(geoJSON.features) &&
            geoJSON.features.length > 0 &&
            geoJSON.features[0].geometry?.type === 'Polygon' &&
            validatePolygonCoordinates(geoJSON.features[0].geometry.coordinates);
    }

    return false;
}

/**
 * Validate polygon coordinates structure
 */
function validatePolygonCoordinates(coordinates: any): boolean {
    if (!Array.isArray(coordinates) || coordinates.length === 0) {
        return false;
    }

    const ring = coordinates[0];
    if (!Array.isArray(ring) || ring.length < 4) {
        return false;
    }

    // Check each coordinate is [lng, lat]
    return ring.every((coord: any) =>
        Array.isArray(coord) &&
        coord.length >= 2 &&
        typeof coord[0] === 'number' &&
        typeof coord[1] === 'number'
    );
}

/**
 * Calculate area from GeoJSON polygon (in hectares)
 */
export function calculateAreaFromGeoJSON(geoJSON: GeoJSON.Polygon): number {
    try {
        // Convert GeoJSON to Leaflet LatLngs
        const coordinates = geoJSON.coordinates[0];
        const latLngs = coordinates.map(coord => L.latLng(coord[1], coord[0]));

        // Calculate area using Leaflet GeometryUtil
        if (L.GeometryUtil && L.GeometryUtil.geodesicArea) {
            const areaInSquareMeters = L.GeometryUtil.geodesicArea(latLngs);
            const areaInHectares = areaInSquareMeters / 10000;
            return Math.round(areaInHectares * 100) / 100;
        }

        return 0;
    } catch (error) {
        console.error('Error calculating area:', error);
        return 0;
    }
}

/**
 * Convert GeoJSON to Leaflet layer for preview
 */
export function geoJSONToLeafletLayer(geoJSON: GeoJSON.Polygon): L.Polygon {
    const coordinates = geoJSON.coordinates[0];
    const latLngs = coordinates.map(coord => L.latLng(coord[1], coord[0]));

    return L.polygon(latLngs, {
        color: '#3b82f6',
        weight: 3,
        fillOpacity: 0.15
    });
}
