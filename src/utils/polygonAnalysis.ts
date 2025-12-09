import { RiskData, RiskType } from '@/types';
import { DrawnPolygon } from '@/store/useAppStore';
import * as turf from '@turf/turf';

/**
 * Analyzes a drawn polygon and calculates risk metrics
 */
export const analyzePolygon = (
  geoJSON: GeoJSON.Polygon,
  area: number,
  risks: RiskData[],
  activeRisks: RiskType[]
): Omit<DrawnPolygon, 'id' | 'geoJSON' | 'area' | 'createdAt'> => {
  const polygon = turf.polygon(geoJSON.coordinates);
  
  // Calculate risk intersections
  const polygonRisks = risks
    .filter(risk => activeRisks.includes(risk.type))
    .map(risk => {
      let intersectionArea = 0;
      let intensity = risk.timeline[risk.timeline.length - 1].intensity;
      
      if (risk.geometry) {
        // Use actual polygon geometry
        const riskPolygon = turf.polygon(risk.geometry.coordinates);
        try {
          const intersection = turf.intersect(turf.featureCollection([polygon, riskPolygon]));
          if (intersection) {
            const intersectionAreaSqM = turf.area(intersection);
            intersectionArea = intersectionAreaSqM / 10000; // Convert to hectares
          }
        } catch (error) {
          console.error('Error calculating intersection:', error);
        }
      } else {
        // Fallback: use circle approximation
        const riskPoint = turf.point(risk.coordinates as [number, number]);
        const riskCircle = turf.circle(riskPoint, risk.radius / 1000, { units: 'kilometers' });
        
        try {
          const intersection = turf.intersect(turf.featureCollection([polygon, riskCircle]));
          if (intersection) {
            const intersectionAreaSqM = turf.area(intersection);
            intersectionArea = intersectionAreaSqM / 10000; // Convert to hectares
          }
        } catch (error) {
          console.error('Error calculating circle intersection:', error);
        }
      }
      
      return {
        type: risk.type,
        intensity,
        affectedArea: Math.round(intersectionArea * 100) / 100
      };
    })
    .filter(r => r.affectedArea > 0);
  
  // Calculate average risk score
  const avgIntensity = polygonRisks.length > 0
    ? polygonRisks.reduce((acc, r) => acc + r.intensity, 0) / polygonRisks.length
    : 0;
  
  // Estimate crops at risk (simplified: based on risk intensity)
  const estimatedCropsAtRisk = Math.ceil((avgIntensity / 100) * 4); // Max 4 crop types
  
  // Estimate potential savings (based on area and risk reduction potential)
  const estimatedSavings = Math.round(area * 450 * (avgIntensity / 100));
  
  return {
    risks: polygonRisks,
    estimatedCropsAtRisk,
    estimatedSavings
  };
};
