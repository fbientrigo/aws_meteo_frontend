import { useState, useEffect } from 'react';
import { RiskType } from '@/types';
import { HeatmapPoint, generateRiskHeatmap } from '@/utils/heatmapGenerator';

export const useMapLayers = (centerLat: number, centerLng: number) => {
  const [heatmapData, setHeatmapData] = useState<Record<RiskType, HeatmapPoint[]>>({
    drought: [],
    flooding: [],
    erosion: [],
    frost: [],
    heatwave: []
  });

  useEffect(() => {
    // Generate heatmap data for each risk type
    const newHeatmapData: Record<RiskType, HeatmapPoint[]> = {
      drought: generateRiskHeatmap('drought', centerLat, centerLng),
      flooding: generateRiskHeatmap('flooding', centerLat - 0.006, centerLng + 0.011),
      erosion: generateRiskHeatmap('erosion', centerLat + 0.008, centerLng - 0.015),
      frost: generateRiskHeatmap('frost', centerLat - 0.014, centerLng - 0.008),
      heatwave: generateRiskHeatmap('heatwave', centerLat + 0.004, centerLng + 0.006)
    };

    setHeatmapData(newHeatmapData);
  }, [centerLat, centerLng]);

  return { heatmapData };
};