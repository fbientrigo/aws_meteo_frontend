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
 */
export function transformToHeatmapPoints(
    latitudes: number[],
    longitudes: number[],
    stiValues: number[]
): HeatmapPoint[] {
    return latitudes.map((lat, i) => ({
        lat,
        lng: longitudes[i],
        intensity: stiValues[i],
        severity: categorizeSeverity(stiValues[i])
    }));
}

/**
 * Categorize STI value into severity level
 */
function categorizeSeverity(sti: number): SeverityLevel {
    if (sti < 1) return 'VERY_LOW';
    if (sti < 2) return 'LOW';
    if (sti < 3) return 'MODERATE';
    if (sti < 4) return 'HIGH';
    return 'VERY_HIGH';
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
