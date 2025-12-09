import { RiskType } from '@/types';

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number; // 0-1
}

/**
 * Generates heatmap points for a given risk type in a region
 * This simulates risk intensity data across the map
 */
export const generateRiskHeatmap = (
  riskType: RiskType,
  centerLat: number,
  centerLng: number,
  radius: number = 0.05, // degrees
  points: number = 100
): HeatmapPoint[] => {
  const heatmapPoints: HeatmapPoint[] = [];
  
  // Define base intensity patterns for different risk types
  const intensityPatterns: Record<RiskType, (distance: number) => number> = {
    drought: (distance) => Math.max(0, 0.9 - distance * 1.2 + Math.random() * 0.3),
    flooding: (distance) => Math.max(0, 0.7 - distance * 0.8 + Math.random() * 0.4),
    erosion: (distance) => Math.max(0, 0.6 - distance * 1.5 + Math.random() * 0.3),
    frost: (distance) => Math.max(0, 0.5 - distance * 1.0 + Math.random() * 0.35),
    heatwave: (distance) => Math.max(0, 0.8 - distance * 1.3 + Math.random() * 0.25)
  };
  
  const getIntensity = intensityPatterns[riskType];
  
  // Generate points in a circular pattern with varying intensity
  for (let i = 0; i < points; i++) {
    const angle = (Math.PI * 2 * i) / points + Math.random() * 0.5;
    const distance = Math.random() * radius;
    
    const lat = centerLat + Math.cos(angle) * distance;
    const lng = centerLng + Math.sin(angle) * distance;
    const normalizedDistance = distance / radius;
    const intensity = Math.min(1, Math.max(0, getIntensity(normalizedDistance)));
    
    if (intensity > 0.1) { // Only add points with significant intensity
      heatmapPoints.push({ lat, lng, intensity });
    }
  }
  
  // Add some random hotspots
  const hotspots = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < hotspots; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius * 0.7;
    const lat = centerLat + Math.cos(angle) * distance;
    const lng = centerLng + Math.sin(angle) * distance;
    
    // Create cluster around hotspot
    for (let j = 0; j < 10; j++) {
      const offsetAngle = Math.random() * Math.PI * 2;
      const offsetDistance = Math.random() * 0.005;
      heatmapPoints.push({
        lat: lat + Math.cos(offsetAngle) * offsetDistance,
        lng: lng + Math.sin(offsetAngle) * offsetDistance,
        intensity: 0.7 + Math.random() * 0.3
      });
    }
  }
  
  return heatmapPoints;
};

/**
 * Converts heatmap points to Leaflet.heat format
 * Returns array of [lat, lng, intensity] tuples
 */
export const toLeafletHeatFormat = (points: HeatmapPoint[]): [number, number, number][] => {
  if (!points || !Array.isArray(points)) {
    console.warn('Invalid points provided to toLeafletHeatFormat');
    return [];
  }
  
  return points
    .filter(p => 
      p && 
      typeof p.lat === 'number' && 
      typeof p.lng === 'number' && 
      typeof p.intensity === 'number' &&
      !isNaN(p.lat) && 
      !isNaN(p.lng) && 
      !isNaN(p.intensity) &&
      p.intensity > 0
    )
    .map(p => [p.lat, p.lng, p.intensity]);
};