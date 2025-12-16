import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { HeatmapPoint } from '@/types';
import { getSeverityColor, getSeverityLabel } from '@/utils/climatUtils';

interface DebugGridLayerProps {
    map: L.Map | null;
    points: HeatmapPoint[];
    visible: boolean;
    onHover?: (point: HeatmapPoint | null) => void;
}

const DebugGridLayer = ({ map, points, visible, onHover }: DebugGridLayerProps) => {
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

        // DEBUG: Sample the first few points to check color/severity
        if (renderPoints.length > 0) {
            const sample = renderPoints[0];
            const sampleColor = getSeverityColor(sample.severity);
            console.log("🐛 [DebugGridLayer] Sample Point:", {
                severity: sample.severity,
                color: sampleColor,
                lat: sample.lat,
                int: sample.intensity
            });
        }

        renderPoints.forEach(p => {
            const color = getSeverityColor(p.severity);

            // Create a small circle marker for each point
            const marker = L.circleMarker([p.lat, p.lng], {
                radius: 5, // Slightly larger
                fillColor: color, // First attempt
                color: '#fff',
                weight: 1.5,
                opacity: 1,
                fillOpacity: 0.9,
                fill: true, // Explicitly enable fill
                interactive: true,
                bubblingMouseEvents: false
            });

            // FORCE STYLE UPDATE (Double-tap to ensure React/Leaflet didn't miss it)
            // Sometimes custom props need a tick or explicit set
            marker.setStyle({ fillColor: color, fillOpacity: 0.9 });

            // Hover Events
            if (onHover) {
                marker.on('mouseover', (e) => {
                    onHover(p);
                    e.target.setStyle({ weight: 3, color: '#000' });
                });
                marker.on('mouseout', (e) => {
                    onHover(null);
                    e.target.setStyle({ weight: 1.5, color: '#fff' });
                });
            }

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
