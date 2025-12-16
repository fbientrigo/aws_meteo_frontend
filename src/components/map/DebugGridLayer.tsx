import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { HeatmapPoint } from '@/types';
import { getSeverityColor, getSeverityLabel } from '@/utils/climatUtils';

interface DebugGridLayerProps {
    map: L.Map | null;
    points: HeatmapPoint[];
    visible: boolean;
}

const DebugGridLayer = ({ map, points, visible }: DebugGridLayerProps) => {
    const layerGroupRef = useRef<L.LayerGroup | null>(null);

    useEffect(() => {
        if (!map) return;

        // Cleanup existing layer
        if (layerGroupRef.current) {
            map.removeLayer(layerGroupRef.current);
            layerGroupRef.current = null;
        }

        if (!visible || points.length === 0) return;

        console.log('🐞 DebugGridLayer rendering points:', points.length);

        const layerGroup = L.layerGroup();

        // SMART SAMPLING:
        // Instead of slicing the first N points (which clips the map), we sample evenly across the dataset.
        // Limit to ~4000 points to keep the DOM light.
        const MAX_POINTS = 4000;
        let renderPoints = points;

        if (points.length > MAX_POINTS) {
            const step = Math.ceil(points.length / MAX_POINTS);
            renderPoints = points.filter((_, i) => i % step === 0);
            console.log(`🐞 [DebugGridLayer] Sampling 1/${step} points. Showing ${renderPoints.length}/${points.length} for coverage.`);
        }

        renderPoints.forEach(p => {
            const color = getSeverityColor(p.severity);

            // Create a small circle marker for each point
            const marker = L.circleMarker([p.lat, p.lng], {
                radius: 4,
                fillColor: color,
                color: '#fff',
                weight: 1,
                opacity: 0.8,
                fillOpacity: 0.8
            });

            // Create detailed popup with raw data
            const popupContent = `
                <div class="p-2 text-xs font-mono">
                    <p><strong>Lat:</strong> ${p.lat.toFixed(4)}</p>
                    <p><strong>Lng:</strong> ${p.lng.toFixed(4)}</p>
                    <p><strong>Int:</strong> ${p.intensity.toFixed(4)}</p>
                    <p><strong>Sev:</strong> ${getSeverityLabel(p.severity)}</p>
                </div>
            `;

            marker.bindPopup(popupContent);
            layerGroup.addLayer(marker);
        });

        layerGroup.addTo(map);
        layerGroupRef.current = layerGroup;

        return () => {
            if (layerGroupRef.current && map) {
                map.removeLayer(layerGroupRef.current);
            }
        };
    }, [map, points, visible]);

    return null;
};

export default DebugGridLayer;
