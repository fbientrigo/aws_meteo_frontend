import { FarmDataExtended, RiskCategory } from '@/types';

export const mockFarmData: FarmDataExtended = {
    id: "predio-001",
    ownerName: "Juanita González",
    farmName: "Santa María",
    location: { lat: -33.45, lng: -70.45 }, // Approximate center
    geometry: {
        type: "Polygon",
        coordinates: [[[-70.5, -33.5], [-70.4, -33.5], [-70.4, -33.4], [-70.5, -33.4], [-70.5, -33.5]]]
    },
    totalArea: 15.5,
    paddocks: [
        {
            id: "pot-001",
            name: "Potrero de las ovejas",
            cropType: "Pastos",
            area: 5.2,
            coordinates: {
                type: "Polygon",
                coordinates: [[[-70.5, -33.5], [-70.45, -33.5], [-70.45, -33.45], [-70.5, -33.45], [-70.5, -33.5]]]
            }
        },
        {
            id: "pot-002",
            name: "Norte alto",
            cropType: "Maíz",
            area: 3.8,
            coordinates: {
                type: "Polygon",
                coordinates: [[[-70.45, -33.5], [-70.4, -33.5], [-70.4, -33.45], [-70.45, -33.45], [-70.45, -33.5]]]
            }
        },
        {
            id: "pot-003",
            name: "Al lado del alfalfal",
            cropType: "Palta",
            area: 6.5,
            coordinates: {
                type: "Polygon",
                coordinates: [[[-70.5, -33.45], [-70.4, -33.45], [-70.4, -33.4], [-70.5, -33.4], [-70.5, -33.45]]]
            }
        }
    ]
};

export const mockRisksData: RiskCategory[] = [
    {
        id: "drought",
        name: "Sequía",
        icon: "💧",
        level: 4,
        indices: [
            {
                id: "humedad_suelo",
                name: "Índice de Humedad del Suelo",
                value: 0.23,
                level: 4,
                description: "Mide la cantidad de agua disponible en el suelo"
            },
            {
                id: "evapotranspiracion",
                name: "Evapotranspiración",
                value: 6.8,
                level: 3,
                description: "Agua perdida por evaporación y transpiración"
            }
        ]
    },
    {
        id: "flooding",
        name: "Inundación",
        icon: "🌊",
        level: 2,
        indices: [
            {
                id: "precipitacion_acumulada",
                name: "Precipitación Acumulada",
                value: 45.2,
                level: 2,
                description: "Lluvia acumulada en las últimas 24 horas"
            }
        ]
    },
    {
        id: "frost",
        name: "Heladas",
        icon: "❄️",
        level: 3,
        indices: [
            {
                id: "temp_minima",
                name: "Temperatura Mínima",
                value: -2.5,
                level: 3,
                description: "Temperatura mínima registrada en la madrugada"
            }
        ]
    },
    {
        id: "fire",
        name: "Incendio",
        icon: "🔥",
        level: 1,
        indices: [
            {
                id: "temp_maxima",
                name: "Temperatura Máxima",
                value: 32.0,
                level: 2,
                description: "Temperatura máxima diaria"
            },
            {
                id: "viento",
                name: "Velocidad del Viento",
                value: 15.0,
                level: 1,
                description: "Velocidad promedio del viento"
            }
        ]
    }
];
