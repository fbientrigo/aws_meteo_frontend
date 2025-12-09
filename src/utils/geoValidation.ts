/**
 * Geographic validation utilities for parcel-paddock hierarchy
 */

interface Point {
    lat: number;
    lng: number;
}

interface Polygon {
    coordinates: number[][][];
}

/**
 * Ray-casting algorithm to determine if a point is inside a polygon
 */
export function isPointInsidePolygon(point: Point, polygon: Polygon): boolean {
    const coords = polygon.coordinates[0]; // Get outer ring
    let inside = false;

    for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
        const xi = coords[i][1]; // lat
        const yi = coords[i][0]; // lng
        const xj = coords[j][1]; // lat
        const yj = coords[j][0]; // lng

        const intersect =
            yi > point.lng !== yj > point.lng &&
            point.lat < ((xj - xi) * (point.lng - yi)) / (yj - yi) + xi;

        if (intersect) inside = !inside;
    }

    return inside;
}

/**
 * Check if all points of inner polygon are inside outer polygon
 */
export function isPolygonInsidePolygon(
    innerPolygon: Polygon,
    outerPolygon: Polygon
): boolean {
    const innerCoords = innerPolygon.coordinates[0];

    // Check every vertex of inner polygon
    for (const coord of innerCoords) {
        const point: Point = { lat: coord[1], lng: coord[0] };
        if (!isPointInsidePolygon(point, outerPolygon)) {
            return false;
        }
    }

    return true;
}

/**
 * Check if two polygons overlap (for paddock collision detection)
 */
export function doPolygonsOverlap(poly1: Polygon, poly2: Polygon): boolean {
    const coords1 = poly1.coordinates[0];
    const coords2 = poly2.coordinates[0];

    // Check if any vertex of poly1 is inside poly2
    for (const coord of coords1) {
        const point: Point = { lat: coord[1], lng: coord[0] };
        if (isPointInsidePolygon(point, poly2)) {
            return true;
        }
    }

    // Check if any vertex of poly2 is inside poly1
    for (const coord of coords2) {
        const point: Point = { lat: coord[1], lng: coord[0] };
        if (isPointInsidePolygon(point, poly1)) {
            return true;
        }
    }

    return false;
}

/**
 * Validate that a paddock can be added to a parcel
 */
export function validatePaddockInParcel(
    paddockGeoJSON: any,
    parcelGeoJSON: any,
    existingPaddocks: any[] = []
): { valid: boolean; error?: string } {
    // Check if paddock is inside parcel
    if (!isPolygonInsidePolygon(paddockGeoJSON, parcelGeoJSON)) {
        return {
            valid: false,
            error: 'El potrero debe estar completamente dentro de la parcela',
        };
    }

    // Check for overlaps with existing paddocks
    for (const existingPaddock of existingPaddocks) {
        if (doPolygonsOverlap(paddockGeoJSON, existingPaddock.geoJSON)) {
            return {
                valid: false,
                error: 'El potrero se superpone con otro potrero existente',
            };
        }
    }

    return { valid: true };
}
