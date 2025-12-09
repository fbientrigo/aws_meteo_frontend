import { FarmData, RiskData } from '@/types';

export const getMockFarms = (): FarmData[] => [
  {
    id: 'farm-1',
    name: 'Cerro Campana',
    location: { lat: -33.6642, lng: -70.9289 },
    area: 120,
    soilType: 'Franco Arcilloso',
    irrigationSystem: 'Goteo y Aspersión',
    crops: [
      {
        id: 'crop-1',
        name: 'Trigo',
        area: 45,
        distribution: 37.5,
        irrigationSystem: 'Aspersión',
        avgYield: 5.2,
        riskLevel: 'high'
      },
      {
        id: 'crop-2',
        name: 'Maíz',
        area: 35,
        distribution: 29.2,
        irrigationSystem: 'Goteo',
        avgYield: 8.5,
        riskLevel: 'medium'
      },
      {
        id: 'crop-3',
        name: 'Uvas',
        area: 25,
        distribution: 20.8,
        irrigationSystem: 'Goteo',
        avgYield: 12.3,
        riskLevel: 'low'
      },
      {
        id: 'crop-4',
        name: 'Tomates',
        area: 15,
        distribution: 12.5,
        irrigationSystem: 'Goteo',
        avgYield: 45.8,
        riskLevel: 'medium'
      }
    ],
    historicalYield: [
      { year: 2020, crop: 'Trigo', yield: 4.8 },
      { year: 2021, crop: 'Trigo', yield: 5.1 },
      { year: 2022, crop: 'Trigo', yield: 4.9 },
      { year: 2023, crop: 'Trigo', yield: 5.2 },
      { year: 2024, crop: 'Trigo', yield: 5.0 },
      { year: 2020, crop: 'Maíz', yield: 7.8 },
      { year: 2021, crop: 'Maíz', yield: 8.2 },
      { year: 2022, crop: 'Maíz', yield: 8.0 },
      { year: 2023, crop: 'Maíz', yield: 8.5 },
      { year: 2024, crop: 'Maíz', yield: 8.3 },
    ]
  }
];

export const getMockRisks = (): RiskData[] => [
  {
    id: 'risk-1',
    type: 'drought',
    level: 'high',
    name: 'Sequía',
    coordinates: [-33.6642, -70.9289],
    radius: 500,
    affectedArea: 78.5,
    timeline: [
      { year: 2024, intensity: 65 },
      { year: 2025, intensity: 72 },
      { year: 2026, intensity: 78 },
      { year: 2027, intensity: 81 },
      { year: 2028, intensity: 85 },
      { year: 2029, intensity: 88 },
      { year: 2030, intensity: 92 }
    ],
    recommendations: [
      'Implementar sistema de riego por goteo subterráneo',
      'Plantar especies resistentes a la sequía como cultivos de cobertura',
      'Crear zanjas de infiltración para captar agua de lluvia',
      'Instalar sensores de humedad del suelo para optimizar riego'
    ],
    description: 'Zona con alto estrés hídrico. Precipitaciones 40% por debajo del promedio histórico.',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-70.9339, -33.6592],
        [-70.9239, -33.6592],
        [-70.9239, -33.6692],
        [-70.9339, -33.6692],
        [-70.9339, -33.6592]
      ]]
    }
  },
  {
    id: 'risk-2',
    type: 'flooding',
    level: 'medium',
    name: 'Inundación',
    coordinates: [-33.6700, -70.9200],
    radius: 400,
    affectedArea: 52.3,
    timeline: [
      { year: 2024, intensity: 45 },
      { year: 2025, intensity: 48 },
      { year: 2026, intensity: 52 },
      { year: 2027, intensity: 55 },
      { year: 2028, intensity: 58 },
      { year: 2029, intensity: 62 },
      { year: 2030, intensity: 65 }
    ],
    recommendations: [
      'Construir canales de drenaje en zonas bajas',
      'Plantar vegetación ribereña para estabilizar márgenes',
      'Crear humedales artificiales como zonas de amortiguamiento',
      'Elevar áreas de cultivo críticas con terrazas'
    ],
    description: 'Área propensa a encharcamiento por escorrentía. Riesgo aumenta en eventos de lluvia intensa.',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-70.9250, -33.6650],
        [-70.9150, -33.6650],
        [-70.9150, -33.6750],
        [-70.9250, -33.6750],
        [-70.9250, -33.6650]
      ]]
    }
  },
  {
    id: 'risk-3',
    type: 'erosion',
    level: 'medium',
    name: 'Erosión',
    coordinates: [-33.6580, -70.9350],
    radius: 350,
    affectedArea: 38.7,
    timeline: [
      { year: 2024, intensity: 50 },
      { year: 2025, intensity: 52 },
      { year: 2026, intensity: 55 },
      { year: 2027, intensity: 58 },
      { year: 2028, intensity: 61 },
      { year: 2029, intensity: 64 },
      { year: 2030, intensity: 68 }
    ],
    recommendations: [
      'Implementar agricultura en curvas de nivel',
      'Plantar barreras vivas con especies nativas',
      'Aplicar técnicas de labranza mínima o cero',
      'Usar coberturas vegetales permanentes entre hileras'
    ],
    description: 'Pendientes pronunciadas con pérdida de suelo. Requiere prácticas de conservación urgentes.'
  },
  {
    id: 'risk-4',
    type: 'frost',
    level: 'low',
    name: 'Heladas',
    coordinates: [-33.6720, -70.9380],
    radius: 300,
    affectedArea: 28.2,
    timeline: [
      { year: 2024, intensity: 25 },
      { year: 2025, intensity: 28 },
      { year: 2026, intensity: 30 },
      { year: 2027, intensity: 32 },
      { year: 2028, intensity: 35 },
      { year: 2029, intensity: 37 },
      { year: 2030, intensity: 40 }
    ],
    recommendations: [
      'Instalar sistemas de aspersión anti-heladas',
      'Plantar cortinas rompevientos en zonas vulnerables',
      'Usar cobertores térmicos en cultivos sensibles',
      'Implementar calentadores de huerta para cultivos de alto valor'
    ],
    description: 'Zona de acumulación de aire frío. Riesgo en primavera y otoño para cultivos sensibles.'
  },
  {
    id: 'risk-5',
    type: 'heatwave',
    level: 'high',
    name: 'Olas de Calor',
    coordinates: [-33.6600, -70.9220],
    radius: 450,
    affectedArea: 63.8,
    timeline: [
      { year: 2024, intensity: 68 },
      { year: 2025, intensity: 71 },
      { year: 2026, intensity: 75 },
      { year: 2027, intensity: 79 },
      { year: 2028, intensity: 83 },
      { year: 2029, intensity: 87 },
      { year: 2030, intensity: 91 }
    ],
    recommendations: [
      'Implementar sistemas de sombreado con mallas térmicas',
      'Establecer cortinas forestales para reducir temperatura',
      'Aplicar mulching orgánico para conservar humedad y enfriar suelo',
      'Ajustar calendarios de siembra para evitar períodos críticos'
    ],
    description: 'Temperaturas extremas cada vez más frecuentes. Estrés térmico afecta rendimiento y calidad.'
  }
];

export const getMockSolutions = (): import('@/types').Solution[] => [
  {
    id: 'sol-1',
    title: 'Barreras Vivas de Vetiver',
    description: 'Sistema de raíces profundas que estabiliza el suelo y reduce la velocidad de la escorrentía.',
    type: 'vegetative',
    relatedRisks: ['erosion', 'flooding'],
    benefits: [
      { label: 'Retención de Suelo', value: '90%' },
      { label: 'Infiltración', value: '+40%' }
    ],
    cost: 'low',
    timeToImpact: '6 meses',
    roi: '12 meses'
  },
  {
    id: 'sol-2',
    title: 'Zanjas de Infiltración (Swales)',
    description: 'Canales excavados a nivel para capturar y retener agua de lluvia en el paisaje.',
    type: 'structural',
    relatedRisks: ['drought', 'erosion'],
    benefits: [
      { label: 'Captura de Agua', value: '200m³/ha' },
      { label: 'Humedad del Suelo', value: '+50%' }
    ],
    cost: 'medium',
    timeToImpact: '1 año',
    roi: '2 años'
  },
  {
    id: 'sol-3',
    title: 'Agricultura Sintrópica',
    description: 'Sistema agroforestal de alta densidad que imita la regeneración natural de bosques.',
    type: 'management',
    relatedRisks: ['heatwave', 'drought', 'erosion'],
    benefits: [
      { label: 'Reducción Temp.', value: '-5°C' },
      { label: 'Biodiversidad', value: 'Alta' }
    ],
    cost: 'medium',
    timeToImpact: '2 años',
    roi: '3 años'
  },
  {
    id: 'sol-4',
    title: 'Cosecha de Agua de Lluvia',
    description: 'Infraestructura para recolectar y almacenar agua de techos y superficies impermeables.',
    type: 'structural',
    relatedRisks: ['drought'],
    benefits: [
      { label: 'Disponibilidad Agua', value: '+30%' },
      { label: 'Seguridad Hídrica', value: 'Alta' }
    ],
    cost: 'high',
    timeToImpact: 'Inmediato',
    roi: '5 años'
  },
  {
    id: 'sol-5',
    title: 'Coberturas Vegetales (Cover Crops)',
    description: 'Cultivos sembrados para cubrir el suelo en lugar de ser cosechados.',
    type: 'vegetative',
    relatedRisks: ['erosion', 'heatwave', 'drought'],
    benefits: [
      { label: 'Materia Orgánica', value: '+15%' },
      { label: 'Evaporación', value: '-30%' }
    ],
    cost: 'low',
    timeToImpact: '3 meses',
    roi: '6 meses'
  }
];
