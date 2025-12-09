export type RiskType = 'drought' | 'flooding' | 'erosion' | 'frost' | 'heatwave' | 'fire';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type TimePeriod = 'current' | 'projection';

export interface RiskData {
  id: string;
  type: RiskType;
  level: RiskLevel;
  name: string;
  coordinates: [number, number];
  radius: number;
  affectedArea: number;
  geometry?: GeoJSON.Polygon;
  timeline: { year: number; intensity: number }[];
  recommendations: string[];
  description: string;
}

export interface DrawnPolygon {
  id: string;
  type: 'polygon' | 'circle' | 'marker' | 'polyline';
  coordinates: Array<[number, number]>;
  area: number;
  center: { lat: number; lng: number };
  createdAt: Date;
  analysis?: {
    detectedRisks: string[];
    recommendation?: string;
  };
}

export interface Crop {
  id: string;
  name: string;
  area: number;
  distribution: number;
  irrigationSystem: string;
  avgYield: number;
  riskLevel: RiskLevel;
}

export interface FarmData {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  area: number;
  crops: Crop[];
  soilType: string;
  irrigationSystem: string;
  historicalYield: { year: number; crop: string; yield: number }[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  solution?: {
    title: string;
    waterSaving: number;
    costReduction: number;
    roi: number;
  };
}

export interface DashboardMetrics {
  riskScore: number;
  affectedArea: number;
  cropsAtRisk: number;
  potentialSavings: number;
  trend: 'improving' | 'stable' | 'worsening';
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  type: 'structural' | 'vegetative' | 'management';
  relatedRisks: RiskType[];
  benefits: { label: string; value: string }[];
  cost: 'low' | 'medium' | 'high';
  timeToImpact: string;
  roi: string;
  imageUrl?: string;
}

// Agro-Climate System Types
export type CropType = 'maiz' | 'trigo' | 'vid' | 'palto' | 'arandano';
export type ClimatVariable = 'sti' | 'sepi' | 'temperature' | 'evapotranspiration' | 'precipitation';
export type SeverityLevel = 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';

export interface STIDataResponse {
  run: string;
  step: string;
  latitudes: number[];
  longitudes: number[];
  sti: number[][];
}

export interface CropLayer {
  id: string;
  type: CropType;
  name: string;
  geometry: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
  area: number; // hectares
  currentRiskLevel: SeverityLevel;
  metadata?: {
    soilType?: string;
    irrigation?: string;
    expectedYield?: number;
  };
}

export interface NatureSolution {
  id: string;
  title: string;
  description: string;
  location: { lat: number; lng: number };
  type: 'structural' | 'vegetative' | 'management';
  benefits: string[];
  relatedRisks: RiskType[];
  cost: 'low' | 'medium' | 'high';
  implementationDate?: string;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  value: number;
  severity: SeverityLevel;
}

// New Types for Phase 2 & 3
export interface Paddock {
  id: string;
  name: string;
  cropType: string;
  area: number;
  coordinates: GeoJSON.Polygon;
}

export interface FarmDataExtended {
  id: string;
  ownerName: string;
  farmName: string;
  totalArea: number;
  paddocks: Paddock[];
  location: { lat: number; lng: number }; // Center of the farm
  geometry: GeoJSON.Polygon; // Farm boundary
}

export interface RiskIndex {
  id: string;
  name: string;
  description: string;
  value: number;
  level: number; // 1-5
}

export interface RiskCategory {
  id: string;
  name: string;
  icon: string;
  level: number; // 1-5
  indices: RiskIndex[];
}

// Parcel-Paddock Hierarchy Types
export interface PaddockDetailed {
  id: string;
  name: string;
  description?: string;
  geoJSON: any;
  area: number;
  cropType: string;
  irrigationType: string;
  attachedFile?: {
    name: string;
    url: string;
    size: number;
  };
  createdAt: Date;
}

export interface Parcel {
  id: string;
  name: string;
  ownerName?: string;
  geoJSON: any;
  area: number;
  paddocks: PaddockDetailed[];
  createdAt: Date;
  // Analysis data (if analyzed)
  risks?: any[];
  estimatedSavings?: number;
}

export type DrawingMode = 'parcel' | 'paddock' | null;

// Risk Heatmap Types
export interface RiskHeatmapPoint {
  lat: number;
  lng: number;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  intensity?: number; // 0.0 to 1.0, calculated from riskLevel
}

export interface RiskHeatmapData {
  riskType: RiskType;
  points: RiskHeatmapPoint[];
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export type HeatmapGradient = Record<number, string>;

export interface HeatmapConfig {
  radius: number;
  blur: number;
  maxOpacity: number;
  gradient: HeatmapGradient;
}

// Polygon History System
export interface PolygonHistoryEntry {
  id: string;
  type: 'parcel' | 'paddock';
  name: string;
  geoJSON: any;
  area: number;
  createdAt: Date;
  createdBy: string; // Usuario que creó
  notes?: string; // Notas adicionales
  parentId?: string; // Para potreros (ID del predio padre)
  lastModified?: Date;
  lastModifiedBy?: string;
}

