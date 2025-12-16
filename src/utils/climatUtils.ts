import { HeatmapPoint, SeverityLevel } from '@/types';

// Severity Colors (Traffic Light System)
export const SEVERITY_COLORS: Record<SeverityLevel, string> = {
    VERY_LOW: '#22C55E',    // Green
    LOW: '#84CC16',         // Light Green
    MODERATE: '#EAB308',    // Yellow
    HIGH: '#F97316',        // Orange
    VERY_HIGH: '#EF4444'    // Red
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
    const isSingularity = validRange && min === max;
    const hasNormalization = validRange && max! > min!;
    const range = hasNormalization ? (max! - min!) : 1;

    const points: HeatmapPoint[] = [];

    for (let i = 0; i < length; i++) {
        const lat = latitudes[i];
        const lng = longitudes[i];
        const rawValue = stiValues[i];

        // Filter out invalid coordinates or values
        if (
            typeof lat === 'number' && !isNaN(lat) &&
            typeof lng === 'number' && !isNaN(lng) &&
            typeof rawValue === 'number' && !isNaN(rawValue)
        ) {
            // Normalize intensity to 0-1 range if scale is provided
            let intensity = rawValue;
            if (isSingularity) {
                // First Principle: If min == max, there is no variation.
                // We define this state as 'Neutral' or 'Low' risk depending on domain.
                // Returning 0 ensures it maps to the bottom of the scale (e.g. Green).
                intensity = 0;
            } else if (hasNormalization) {
                // Clamp and normalize
                intensity = (rawValue - min!) / range;
                intensity = Math.max(0, Math.min(1, intensity));
            }

            points.push({
                lat,
                lng,
                intensity,
                severity: categorizeSeverity(intensity) // Use normalized intensity for severity for now, or raw? 
                // Note: categorizeSeverity seems hardcoded for 0-5 range in original code. 
                // If we normalize to 0-1, we might need to adjust categorizeSeverity or map 0-1 back to 0-5.
                // For now, let's assume we want to map the Normalized 0-1 to Severity.
                // Wait, existing check `sti < 1` etc implies 0-5 range. 
                // Let's Scale 0-1 to 0-5 for severity categorization to keep logic consistent?
                // Or better, let's use the heatmap gradient logic which usually expects 0-1.
            });
        }
    }

    return points;
}

/**
 * Categorize STI value into severity level
 * Assumes input is normalized 0-1 or raw 0-5? 
 * Let's adjust this to work with the normalized 0-1 intensity we just calculated.
 */
export function categorizeSeverity(intensity: number): SeverityLevel {
    // Map 0-1 to severity levels
    if (intensity < 0.2) return 'VERY_LOW';
    if (intensity < 0.4) return 'LOW';
    if (intensity < 0.6) return 'MODERATE';
    if (intensity < 0.8) return 'HIGH';
    return 'VERY_HIGH';
}

/**
 * Determine if intensity represents extreme heat (Top 20%)
 */
export function isExtremeHeat(intensity: number): boolean {
    return intensity >= 0.8;
}

/**
 * Determine if intensity represents extreme cold (Bottom 20%)
 */
export function isExtremeCold(intensity: number): boolean {
    return intensity <= 0.2;
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
