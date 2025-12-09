import { STIDataResponse, CropLayer, NatureSolution, CropType } from '@/types';

/**
 * Generate mock STI runs (last 7 days)
 */
export const getMockRuns = (): string[] => {
    const runs: string[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Generate 2 runs per day (00 and 12)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        runs.push(`${year}${month}${day}00`);
        runs.push(`${year}${month}${day}12`);
    }

    return runs;
};

/**
 * Generate mock forecast steps (3-hour intervals up to 72 hours)
 */
export const getMockSteps = (): string[] => {
    const steps: string[] = [];
    for (let hour = 0; hour <= 72; hour += 3) {
        steps.push(String(hour).padStart(3, '0'));
    }
    return steps;
};

/**
 * Generate synthetic STI data for Chile central region
 * Region: approximately -34 to -33 lat, -71 to -70 lon
 */
export const generateMockSTIData = (
    run: string,
    step: string,
    latMin: number = -34,
    latMax: number = -33,
    lonMin: number = -71,
    lonMax: number = -70
): STIDataResponse => {
    // Grid resolution: 0.25 degrees
    const resolution = 0.25;

    const latitudes: number[] = [];
    const longitudes: number[] = [];

    for (let lat = latMax; lat >= latMin; lat -= resolution) {
        latitudes.push(Number(lat.toFixed(2)));
    }

    for (let lon = lonMin; lon <= lonMax; lon += resolution) {
        longitudes.push(Number(lon.toFixed(2)));
    }

    // Generate synthetic STI values
    // STI typically ranges from -3 to +3 (standardized)
    const sti: number[][] = [];

    // Use run and step to create variation
    const runSeed = parseInt(run.slice(-2));
    const stepSeed = parseInt(step);

    for (let i = 0; i < latitudes.length; i++) {
        sti[i] = [];
        for (let j = 0; j < longitudes.length; j++) {
            // Create pattern based on position
            const latEffect = Math.sin(i * 0.5) * 1.5;
            const lonEffect = Math.cos(j * 0.5) * 1.5;
            const timeEffect = Math.sin((runSeed + stepSeed) * 0.1) * 0.5;
            const noise = (Math.random() - 0.5) * 0.8;

            const value = latEffect + lonEffect + timeEffect + noise;
            sti[i][j] = Number(value.toFixed(2));
        }
    }

    return {
        run,
        step,
        latitudes,
        longitudes,
        sti
    };
};

/**
 * Mock GeoJSON polygons for crop areas in Chile central region
 */
export const getMockCropLayers = (): CropLayer[] => {
    // Base coordinates around -33.45, -70.66 (Santiago region)
    return [
        {
            id: 'crop-maiz-1',
            type: 'maiz',
            name: 'Maíz - Valle Central',
            area: 450,
            currentRiskLevel: 'MODERATE',
            geometry: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Polygon',
                    coordinates: [[
                        [-70.7, -33.4],
                        [-70.6, -33.4],
                        [-70.6, -33.5],
                        [-70.7, -33.5],
                        [-70.7, -33.4]
                    ]]
                }
            },
            metadata: {
                soilType: 'Franco-arcilloso',
                irrigation: 'Goteo',
                expectedYield: 12000
            }
        },
        {
            id: 'crop-trigo-1',
            type: 'trigo',
            name: 'Trigo - Secano',
            area: 230,
            currentRiskLevel: 'LOW',
            geometry: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Polygon',
                    coordinates: [[
                        [-70.8, -33.35],
                        [-70.7, -33.35],
                        [-70.7, -33.45],
                        [-70.8, -33.45],
                        [-70.8, -33.35]
                    ]]
                }
            },
            metadata: {
                soilType: 'Franco-arenoso',
                irrigation: 'Lluvia',
                expectedYield: 5500
            }
        },
        {
            id: 'crop-vid-1',
            type: 'vid',
            name: 'Vid - Valle del Maipo',
            area: 180,
            currentRiskLevel: 'HIGH',
            geometry: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Polygon',
                    coordinates: [[
                        [-70.75, -33.5],
                        [-70.65, -33.5],
                        [-70.65, -33.6],
                        [-70.75, -33.6],
                        [-70.75, -33.5]
                    ]]
                }
            },
            metadata: {
                soilType: 'Franco',
                irrigation: 'Goteo',
                expectedYield: 8000
            }
        },
        {
            id: 'crop-palto-1',
            type: 'palto',
            name: 'Palto - La Cruz',
            area: 120,
            currentRiskLevel: 'MODERATE',
            geometry: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Polygon',
                    coordinates: [[
                        [-70.95, -33.3],
                        [-70.85, -33.3],
                        [-70.85, -33.38],
                        [-70.95, -33.38],
                        [-70.95, -33.3]
                    ]]
                }
            },
            metadata: {
                soilType: 'Franco-limoso',
                irrigation: 'Microaspersión',
                expectedYield: 15000
            }
        },
        {
            id: 'crop-arandano-1',
            type: 'arandano',
            name: 'Arándano - Colina',
            area: 85,
            currentRiskLevel: 'VERY_HIGH',
            geometry: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Polygon',
                    coordinates: [[
                        [-70.55, -33.15],
                        [-70.45, -33.15],
                        [-70.45, -33.25],
                        [-70.55, -33.25],
                        [-70.55, -33.15]
                    ]]
                }
            },
            metadata: {
                soilType: 'Ácido',
                irrigation: 'Goteo',
                expectedYield: 9000
            }
        }
    ];
};

/**
 * Mock nature-based solutions data
 */
export const getMockNatureSolutions = (): NatureSolution[] => {
    return [
        {
            id: 'solution-1',
            title: 'Cortinas Forestales',
            description: 'Plantación de especies nativas para protección contra vientos y reducción de erosión',
            location: { lat: -33.42, lng: -70.68 },
            type: 'vegetative',
            benefits: [
                'Reducción de erosión en 45%',
                'Mejora microclima local',
                'Incremento biodiversidad'
            ],
            relatedRisks: ['erosion', 'drought'],
            cost: 'medium',
            implementationDate: '2023-05-15'
        },
        {
            id: 'solution-2',
            title: 'Sistema de Retención de Aguas',
            description: 'Zanjas de infiltración y terrazas para captura de agua de lluvia',
            location: { lat: -33.55, lng: -70.72 },
            type: 'structural',
            benefits: [
                'Aumento disponibilidad hídrica',
                'Reducción escorrentía',
                'Recarga acuíferos'
            ],
            relatedRisks: ['drought', 'flooding'],
            cost: 'high',
            implementationDate: '2023-08-20'
        },
        {
            id: 'solution-3',
            title: 'Cultivos de Cobertura',
            description: 'Implementación de leguminosas entre hileras para mejorar salud del suelo',
            location: { lat: -33.38, lng: -70.78 },
            type: 'management',
            benefits: [
                'Mejora estructura suelo',
                'Fijación de nitrógeno',
                'Control de malezas'
            ],
            relatedRisks: ['erosion', 'drought'],
            cost: 'low',
            implementationDate: '2024-03-10'
        },
        {
            id: 'solution-4',
            title: 'Agroforestería',
            description: 'Integración de árboles frutales nativos con cultivos anuales',
            location: { lat: -33.25, lng: -70.52 },
            type: 'vegetative',
            benefits: [
                'Diversificación producción',
                'Sombra para cultivos',
                'Captura de carbono'
            ],
            relatedRisks: ['heatwave', 'drought'],
            cost: 'medium',
            implementationDate: '2023-11-05'
        },
        {
            id: 'solution-5',
            title: 'Mulching Orgánico',
            description: 'Aplicación de cobertura orgánica para conservación de humedad',
            location: { lat: -33.18, lng: -70.48 },
            type: 'management',
            benefits: [
                'Conservación humedad 60%',
                'Control temperatura suelo',
                'Aporte materia orgánica'
            ],
            relatedRisks: ['drought', 'heatwave'],
            cost: 'low',
            implementationDate: '2024-01-15'
        }
    ];
};

/**
 * Get crop layers by type
 */
export const getCropLayersByType = (type: CropType): CropLayer[] => {
    return getMockCropLayers().filter(layer => layer.type === type);
};

/**
 * Get all available crop types
 */
export const getAllCropTypes = (): CropType[] => {
    return ['maiz', 'trigo', 'vid', 'palto', 'arandano'];
};

/**
 * Generate mock crops for analysis mode based on a polygon
 * This creates 3 subdivisions of the polygon to represent different crops
 */
export const getMockAnalysisCrops = (polygonGeoJSON: any): CropLayer[] => {
    if (!polygonGeoJSON || !polygonGeoJSON.coordinates || polygonGeoJSON.coordinates.length === 0) {
        return [];
    }

    // Simply replicate the polygon with different IDs and types for demo purposes
    // In a real app, this would be a spatial intersection query
    const coords = polygonGeoJSON.coordinates[0];

    // Create 3 fake crop layers that are copies of the polygon (or slightly offset if we could)
    // For visual simplicity in this demo, we'll just return the same polygon with different styles
    // But since they overlap, only top one shows. 
    // Ideally we'd split the polygon. For now let's just return one "Maíz" layer that covers it all
    // to match the "Maíz" in the panel, or maybe we can create 3 small polygons inside.

    // Let's just return the 3 crops mentioned in the panel, but all using the same geometry for now
    // to ensure they show up. The user will see the pattern of the last one rendered if they overlap perfectly.
    // To make it better, let's try to offset them slightly if possible, or just return one for now.

    // Better approach for demo: Return 3 crops with same geometry but let the user toggle them in the panel.
    // The panel has toggles? No, the panel has a global "Crops" toggle.
    // The panel lists Maiz, Trigo, Vid.

    return [
        {
            id: 'analysis-maiz',
            type: 'maiz',
            name: 'Maíz (Lote A)',
            area: 145,
            currentRiskLevel: 'MODERATE',
            geometry: {
                type: 'Feature',
                properties: {},
                geometry: polygonGeoJSON
            }
        },
        {
            id: 'analysis-trigo',
            type: 'trigo',
            name: 'Trigo (Lote B)',
            area: 89,
            currentRiskLevel: 'LOW',
            geometry: {
                type: 'Feature',
                properties: {},
                geometry: polygonGeoJSON // Overlapping for now
            }
        },
        {
            id: 'analysis-vid',
            type: 'vid',
            name: 'Vid (Lote C)',
            area: 34,
            currentRiskLevel: 'HIGH',
            geometry: {
                type: 'Feature',
                properties: {},
                geometry: polygonGeoJSON // Overlapping for now
            }
        }
    ];
};
