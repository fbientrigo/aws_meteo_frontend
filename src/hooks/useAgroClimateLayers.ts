import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { HeatmapPoint, CropLayer, NatureSolution } from '@/types';
import { toLeafletHeatFormat, getHeatmapGradient, getSeverityColor, getSeverityLabel, getRecommendation, CROP_LABELS } from '@/utils/climatUtils';

interface UseAgroClimateLayersProps {
    map: L.Map | null;
    stiData: { points: HeatmapPoint[] } | undefined;
    activeCrops: CropLayer[];
    natureSolutions: NatureSolution[];
    selectedVariable: string;
    showNatureSolutions: boolean;

    // Analysis Props
    isAnalysisMode?: boolean;
    analysisLayers?: {
        indices: boolean;
        crops: boolean;
        solutions: boolean;
    };
    analysisIndex?: string;
}

export const useAgroClimateLayers = ({
    map,
    stiData,
    activeCrops,
    natureSolutions,
    selectedVariable,
    showNatureSolutions,
    isAnalysisMode = false,
    analysisLayers,
    analysisIndex
}: UseAgroClimateLayersProps) => {
    const layersRef = useRef<{
        heatmap: any | null;
        crops: L.LayerGroup | null;
        solutions: L.LayerGroup | null;
    }>({
        heatmap: null,
        crops: null,
        solutions: null
    });

    // Determine visibility based on mode
    const showHeatmap = isAnalysisMode ? analysisLayers?.indices : (selectedVariable === 'sti');
    const showCrops = isAnalysisMode ? analysisLayers?.crops : (activeCrops.length > 0);
    const showSolutions = isAnalysisMode ? analysisLayers?.solutions : showNatureSolutions;

    // Manage STI Heatmap Layer
    useEffect(() => {
        if (!map) return;

        // Remove existing heatmap
        if (layersRef.current.heatmap) {
            map.removeLayer(layersRef.current.heatmap);
            layersRef.current.heatmap = null;
        }

        if (showHeatmap && stiData?.points && stiData.points.length > 0) {
            // Validate map container dimensions to prevent "source width is 0" error
            const container = map.getContainer();
            if (container.offsetWidth === 0 || container.offsetHeight === 0) {
                console.warn('Map container has no dimensions, skipping heatmap render');
                return;
            }

            const heatData = toLeafletHeatFormat(stiData.points);

            // @ts-ignore
            const heatLayer = L.heatLayer(heatData, {
                radius: 25,
                blur: 15,
                maxZoom: 13,
                max: 5, // Max intensity
                gradient: getHeatmapGradient()
            });

            heatLayer.addTo(map);
            layersRef.current.heatmap = heatLayer;
        }
    }, [map, stiData, showHeatmap]);

    // Manage Crop Polygons Layer
    useEffect(() => {
        if (!map) return;

        if (layersRef.current.crops) {
            map.removeLayer(layersRef.current.crops);
            layersRef.current.crops = null;
        }

        if (showCrops && activeCrops.length > 0) {
            const cropGroup = L.layerGroup();

            activeCrops.forEach(crop => {
                const color = getSeverityColor(crop.currentRiskLevel);

                // Determine style based on mode
                const style: L.PathOptions = {
                    color: color,
                    weight: 2,
                    opacity: 0.8,
                    fillOpacity: 0.4
                };

                if (isAnalysisMode) {
                    // Apply SVG patterns in analysis mode
                    const patternId = `pattern-${crop.type}`;
                    // @ts-ignore - Leaflet supports fill string for patterns if SVG is in DOM
                    style.fillColor = `url(#${patternId})`;
                    style.fillOpacity = 0.7; // Higher opacity for patterns
                } else {
                    style.fillColor = color;
                }

                const geoJsonLayer = L.geoJSON(crop.geometry, {
                    style: style,
                    // Force SVG renderer to support patterns
                    renderer: L.svg(),
                    onEachFeature: (feature, layer) => {
                        // Create popup content
                        const content = `
              <div class="p-2 font-sans">
                <h3 class="font-semibold text-base mb-2">${crop.name}</h3>
                <div class="space-y-1 text-sm">
                  <p><strong>Tipo:</strong> ${CROP_LABELS[crop.type]}</p>
                  <p><strong>Área:</strong> ${crop.area} ha</p>
                  <p><strong>Nivel de Riesgo:</strong> 
                    <span style="color: ${color}; font-weight: bold;">
                      ${getSeverityLabel(crop.currentRiskLevel)}
                    </span>
                  </p>
                  ${crop.metadata?.soilType ? `<p><strong>Suelo:</strong> ${crop.metadata.soilType}</p>` : ''}
                  ${crop.metadata?.irrigation ? `<p><strong>Riego:</strong> ${crop.metadata.irrigation}</p>` : ''}
                  <div class="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    ${getRecommendation(crop.currentRiskLevel)}
                  </div>
                </div>
              </div>
            `;
                        layer.bindPopup(content, { maxWidth: 300 });

                        // Hover effects
                        layer.on({
                            mouseover: (e: any) => {
                                const target = e.target;
                                target.setStyle({
                                    weight: 4,
                                    opacity: 1
                                });
                            },
                            mouseout: (e: any) => {
                                const target = e.target;
                                target.setStyle({
                                    weight: 2,
                                    opacity: 0.8
                                });
                            }
                        });
                    }
                });

                cropGroup.addLayer(geoJsonLayer);
            });

            cropGroup.addTo(map);
            layersRef.current.crops = cropGroup;
        }
    }, [map, activeCrops, showCrops, isAnalysisMode]);

    // Manage Nature Solutions Layer
    useEffect(() => {
        if (!map) return;

        if (layersRef.current.solutions) {
            map.removeLayer(layersRef.current.solutions);
            layersRef.current.solutions = null;
        }

        if (showSolutions && natureSolutions.length > 0) {
            const solutionsGroup = L.layerGroup();

            natureSolutions.forEach(solution => {
                const iconHtml = `
          <div style="
            background-color: ${getSolutionColor(solution.type)};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            color: white;
            font-weight: bold;
            font-size: 14px;
          ">
            ${getSolutionIcon(solution.type)}
          </div>
        `;

                const icon = L.divIcon({
                    html: iconHtml,
                    className: 'custom-solution-marker',
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                    popupAnchor: [0, -16]
                });

                const marker = L.marker([solution.location.lat, solution.location.lng], { icon });

                const content = `
          <div class="p-2 font-sans">
            <h3 class="font-semibold text-base mb-2">${solution.title}</h3>
            <p class="text-sm text-gray-600 mb-3">${solution.description}</p>
            <div class="space-y-2 text-sm">
              <div><strong>Tipo:</strong> ${getSolutionTypeLabel(solution.type)}</div>
              <div><strong>Costo:</strong> ${getCostLabel(solution.cost)}</div>
              <div>
                <strong>Beneficios:</strong>
                <ul class="list-disc list-inside ml-2 mt-1 text-xs">
                  ${solution.benefits.map(b => `<li>${b}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        `;

                marker.bindPopup(content, { maxWidth: 300 });
                solutionsGroup.addLayer(marker);
            });

            solutionsGroup.addTo(map);
            layersRef.current.solutions = solutionsGroup;
        }
    }, [map, showSolutions, natureSolutions]);
};

// Helpers
const getSolutionColor = (type: string) => {
    switch (type) {
        case 'structural': return '#3B82F6';
        case 'vegetative': return '#22C55E';
        case 'management': return '#F59E0B';
        default: return '#6B7280';
    }
};

const getSolutionIcon = (type: string) => {
    // Simple ASCII/Emoji icons as fallback for HTML string
    switch (type) {
        case 'structural': return '🏗️';
        case 'vegetative': return '🌳';
        case 'management': return '⚙️';
        default: return '•';
    }
};

const getSolutionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
        structural: 'Estructural',
        vegetative: 'Vegetativo',
        management: 'Manejo'
    };
    return labels[type] || type;
};

const getCostLabel = (cost: string) => {
    const labels: Record<string, string> = {
        low: 'Bajo',
        medium: 'Medio',
        high: 'Alto'
    };
    return labels[cost] || cost;
};
