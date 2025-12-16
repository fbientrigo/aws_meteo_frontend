import { HeatmapPoint, SeverityLevel } from '@/types';

// Severity Colors (Traffic Light System)
export const SEVERITY_COLORS: Record<SeverityLevel, string> = {
    VERY_LOW: '#22C55E',    // Green
    LOW: '#84CC16',         // Light Green
    MODERATE: '#EAB308',    // Yellow
    HIGH: '#F97316',        // Orange
    VERY_HIGH: '#DC2626'    // Red-600 (Darker Red for better contrast)
};

// Severity Labels
export const SEVERITY_LABELS: Record<SeverityLevel, string> = {
    VERY_LOW: 'Muy Bajo',
    LOW: 'Bajo',
    MODERATE: 'Moderado',
    HIGH: 'Alto',
    VERY_HIGH: 'Muy Alto'
};

// Crop Labels
export const CROP_LABELS: Record<string, string> = {
    maiz: 'Maíz',
    trigo: 'Trigo',
    soja: 'Soja',
    arroz: 'Arroz',
    viñedo: 'Viñedo',
    frutales: 'Frutales'
};

/**
 * Transform raw STI data to heatmap points with severity categorization
 * @param latitudes Array of latitude values
 * @param longitudes Array of longitude values
 * @param stiValues Array of raw STI values
 * @param min Global minimum value for normalization
 * @param max Global maximum value for normalization
 */
export function transformToHeatmapPoints(
    latitudes: number[],
    longitudes: number[],
    stiValues: number[],
    min?: number,
    max?: number
): HeatmapPoint[] {
    // Ensure all arrays are same length to avoid undefined access
    const length = Math.min(latitudes.length, longitudes.length, stiValues.length);

    // Validate min/max
    const validRange = typeof min === 'number' && typeof max === 'number';

    // CLAMP LIMITS
    const CLAMP_MIN = -8.0;
    const CLAMP_MAX = 8.0;

    // Calculate effective min/max for normalization, respecting the clamp limits
    let effectiveMin = validRange ? Math.max(CLAMP_MIN, min!) : 0;
    let effectiveMax = validRange ? Math.min(CLAMP_MAX, max!) : 1;

    // Handle singularity or inverted range after clamping
    if (effectiveMin >= effectiveMax) {
        if (validRange && min! < max!) {
            // If original range was valid but clamping collapsed it (unlikely unless data is all outliers)
            effectiveMin = CLAMP_MIN;
            effectiveMax = CLAMP_MAX;
        }
    }

    // If even after adjustment they are equal, handle singularity
    const isSingularity = effectiveMin === effectiveMax;
    const range = effectiveMax - effectiveMin;

    const points: HeatmapPoint[] = [];

    for (let i = 0; i < length; i++) {
        const lat = latitudes[i];
        const lng = longitudes[i];
        let rawValue = stiValues[i];

        // Filter out invalid coordinates or values
        if (
            Number.isFinite(lat) &&
            Number.isFinite(lng) &&
            Number.isFinite(rawValue)
        ) {
            // Apply Clamp to Data Point
            rawValue = Math.max(CLAMP_MIN, Math.min(CLAMP_MAX, rawValue));

            // Normalize intensity based on MAGNITUDE (Severity)
            // 0 -> Safe (Green)
            // Extremes (+/- 8) -> Dangerous (Red)
            // We saturate at +/- 5 to ensure high visibility of severe events
            const MAX_SEVERITY_REF = 5.0;
            let intensity = Math.min(1.0, Math.abs(rawValue) / MAX_SEVERITY_REF);

            points.push({
                lat,
                lng,
                intensity, // Normalized magnitude (0 to 1) for heatmap color
                rawValue,  // Raw signed value for logic
                severity: categorizeSeverity(rawValue) // Use RAW value for categorization
            });
        }
    }

    return points;
}

/**
 * Categorize STI value into severity level
 * Uses raw STI value (not normalized)
 */
export function categorizeSeverity(value: number): SeverityLevel {
    const absVal = Math.abs(value);

    // Thresholds based on user input:
    // Near 0 (-1 to 1) -> Low/Very Low
    // +/- 3 -> Severe (High)

    if (absVal < 1.0) return 'VERY_LOW';
    if (absVal < 2.0) return 'LOW';
    if (absVal < 3.0) return 'MODERATE';
    if (absVal < 4.0) return 'HIGH';
    return 'VERY_HIGH';
}

/**
 * Determine if intensity represents extreme heat (Top 20%)
 * Uses raw STI value
 */
export function isExtremeHeat(value: number): boolean {
    return value >= 3.0; // Heatwave starts at +3 based on user input
}

/**
 * Determine if intensity represents extreme cold (Bottom 20%)
 * Uses raw STI value
 */
export function isExtremeCold(value: number): boolean {
    return value <= -3.0; // Frost starts at -3 based on user input
}

/**
 * Convert heatmap points to Leaflet heat format
 */
export function toLeafletHeatFormat(points: HeatmapPoint[]): [number, number, number][] {
    return points.map(p => [p.lat, p.lng, p.intensity]);
}

/**
 * Get heatmap gradient configuration
 */
export function getHeatmapGradient(): Record<number, string> {
    return {
        0.0: SEVERITY_COLORS.VERY_LOW,
        0.25: SEVERITY_COLORS.LOW,
        0.5: SEVERITY_COLORS.MODERATE,
        0.75: SEVERITY_COLORS.HIGH,
        1.0: SEVERITY_COLORS.VERY_HIGH
    };
}

/**
 * Get severity color
 */
export function getSeverityColor(severity: SeverityLevel): string {
    return SEVERITY_COLORS[severity] || SEVERITY_COLORS.MODERATE;
}

/**
 * Get severity label
 */
export function getSeverityLabel(severity: SeverityLevel): string {
    return SEVERITY_LABELS[severity] || 'Desconocido';
}

/**
 * Get recommendation based on severity
 */
export function getRecommendation(severity: SeverityLevel): string {
    const recommendations: Record<SeverityLevel, string> = {
        VERY_LOW: '✅ Condiciones óptimas. Continuar con prácticas normales.',
        LOW: '✅ Condiciones favorables. Monitoreo regular recomendado.',
        MODERATE: '⚠️ Condiciones moderadas. Implementar medidas preventivas.',
        HIGH: '⚠️ Riesgo elevado. Aplicar medidas de mitigación inmediatas.',
        VERY_HIGH: '🚨 Riesgo crítico. Acción urgente requerida.'
    };
    return recommendations[severity] || 'Monitoreo recomendado.';
}
