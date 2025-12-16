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
    // Green -> Yellow -> Red scale
    const getGradient = (type: RiskType) => {
        return {
            0.1: '#00ff00', // Green
            0.4: '#ffff00', // Yellow
            0.6: '#ff9900', // Orange
            0.8: '#ff3300', // Red
            1.0: '#cc0000'  // Dark Red
        };
    };

    useEffect(() => {
        if (!map) return;

        // cleanup previous layer
        if (layerRef.current) {
            try {
                map.removeLayer(layerRef.current);
            } catch (e) {
                console.warn('Error removing previous layer:', e);
            }
            layerRef.current = null;
        }

        if (!visible || points.length === 0) return;

        // Check if map container has valid dimensions
        const container = map.getContainer();
        if (!container || container.offsetWidth <= 0 || container.offsetHeight <= 0) {
            return;
        }

        try {
            // Create pane if it doesn't exist to control Z-Index
            const paneName = `risk-pane-${riskType}`;
            if (!map.getPane(paneName)) {
                map.createPane(paneName);
                const pane = map.getPane(paneName);
                if (pane) {
                    pane.style.zIndex = zIndex.toString();
                    pane.style.pointerEvents = 'none'; // Allow clicking through
                }
            }

            // Check if heatLayer is available
            // @ts-ignore
            if (!L.heatLayer) {
                console.error('Leaflet.heat is not loaded!');
                return;
            }

            // @ts-ignore - leaflet.heat options definition is incomplete
            const layer = L.heatLayer(points, {
                radius: 35, // Increased from 25 for better coverage
                blur: 45,   // Increased from 35 for smoother gradient
                maxZoom: 12,
                max: 1.0,
                gradient: getGradient(riskType),
                minOpacity: 0.1, // Increased to ensure visibility
                pane: paneName
            } as any);

            // Add to map
            layer.addTo(map);
            layerRef.current = layer;

            // Force opacity update
            if ((layer as any)._canvas) {
                (layer as any)._canvas.style.opacity = opacity;
            }

        } catch (error) {
            console.error(`Error creating heatmap for ${riskType}:`, error);
        }

        return () => {
            if (layerRef.current && map) {
                try {
                    map.removeLayer(layerRef.current);
                } catch (e) {
                    // Ignore removal errors on cleanup
                }
            }
        };
    }, [map, points, visible, riskType, zIndex]); // Re-create if these change

    // Handle independent opacity updates
    useEffect(() => {
        if (layerRef.current && (layerRef.current as any)._canvas) {
            (layerRef.current as any)._canvas.style.opacity = opacity;
        }
    }, [opacity]);

    return null;
};

export default RiskHeatmapLayer;
