import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import { RiskType } from '@/types';

interface RiskHeatmapLayerProps {
    map: L.Map | null;
    points: [number, number, number][]; // [lat, lng, intensity]
    riskType: RiskType;
    visible: boolean;
    opacity: number;
    zIndex: number;
}

const RiskHeatmapLayer = ({
    map,
    points,
    riskType,
    visible,
    opacity,
    zIndex
}: RiskHeatmapLayerProps) => {
    const layerRef = useRef<any>(null);

    // Gradient configuration based on risk type
    // All use the same Green -> Red scale as requested, but we could vary if needed
    const getGradient = (type: RiskType) => {
        return {
            0.2: '#00ff00', // Green (Level 1)
            0.4: '#ffff00', // Yellow (Level 2)
            0.6: '#ff9900', // Orange (Level 3)
            0.8: '#ff3300', // Red (Level 4)
            1.0: '#cc0000'  // Dark Red (Level 5)
        };
    };

    useEffect(() => {
        if (!map) return;

        // cleanup previous layer
        if (layerRef.current) {
            map.removeLayer(layerRef.current);
            layerRef.current = null;
        }

        if (!visible || points.length === 0) return;

        // Check if map container has valid dimensions
        const container = map.getContainer();
        if (!container || container.offsetWidth <= 0 || container.offsetHeight <= 0) {
            // Map not visible or ready yet
            return;
        }

        try {
            // Create pane if it doesn't exist
            const paneName = `risk-pane-${riskType}`;
            if (!map.getPane(paneName)) {
                map.createPane(paneName);
                map.getPane(paneName)!.style.zIndex = zIndex.toString();
            }

            // @ts-ignore - leaflet.heat extends L
            const layer = L.heatLayer(points, {
                radius: 25,
                blur: 35,
                maxZoom: 17,
                max: 1.0,
                gradient: getGradient(riskType),
                minOpacity: 0.05,
                pane: paneName
            });

            // Add to map
            layer.addTo(map);
            layerRef.current = layer;

            // Hack to set z-index on the canvas element if possible (fallback)
            if (layer._canvas) {
                layer._canvas.style.zIndex = zIndex;
            }

        } catch (error) {
            console.error(`Error creating heatmap for ${riskType}:`, error);
        }

        return () => {
            if (layerRef.current && map) {
                map.removeLayer(layerRef.current);
            }
        };
    }, [map, points, visible, riskType]);

    // Handle opacity updates efficiently without recreating layer
    useEffect(() => {
        if (layerRef.current && layerRef.current.setOptions) {
            // Note: leaflet.heat might not expose setOptions for opacity directly 
            // in the way we want (it has minOpacity).
            // If we need global opacity control, we might need to set it on the canvas element.
            if (layerRef.current._canvas) {
                layerRef.current._canvas.style.opacity = opacity;
            }
        }
    }, [opacity]);

    return null;
};

export default RiskHeatmapLayer;
