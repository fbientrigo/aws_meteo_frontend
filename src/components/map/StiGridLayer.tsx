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

const StiGridLayer = ({ map, points, visible, onHover }: DebugGridLayerProps) => {
    const layerGroupRef = useRef<L.LayerGroup | null>(null);

    useEffect(() => {
        if (!map) return;

        // Cleanup existing layer
        if (layerGroupRef.current) {
            map.removeLayer(layerGroupRef.current);
            layerGroupRef.current = null;
        }

        if (!visible || points.length === 0) return;

        console.log('🐞 StiGridLayer rendering points:', points.length);

        const layerGroup = L.layerGroup();

        // SMART SAMPLING:
        // Instead of slicing the first N points (which clips the map), we sample evenly across the dataset.
        // Limit to ~4000 points to keep the DOM light.
        const MAX_POINTS = 4000;
        let renderPoints = points;

        if (points.length > MAX_POINTS) {
            const step = Math.ceil(points.length / MAX_POINTS);
            renderPoints = points.filter((_, i) => i % step === 0);
            console.log(`🐞 [StiGridLayer] Sampling 1/${step} points. Showing ${renderPoints.length}/${points.length} for coverage.`);
        }

        // DEBUG: Sample the first few points to check color/severity
        if (renderPoints.length > 0) {
            const sample = renderPoints[0];
            const sampleColor = getSeverityColor(sample.severity);
            console.log("🐛 [StiGridLayer] Sample Point:", {
                severity: sample.severity,
                color: sampleColor,
                lat: sample.lat,
                int: sample.intensity
            });
        }

        renderPoints.forEach(p => {
            const color = getSeverityColor(p.severity);

            // GRID SIZE ESTIMATION:
            // Standard global models are often 0.25 degrees (~27km).
            // We use half-width of 0.125 to create a square centered on the point.
            // Adjust this delta if gaps appear or overlap is too heavy.
            const delta = 0.125;
            const bounds: L.LatLngBoundsExpression = [
                [p.lat - delta, p.lng - delta],
                [p.lat + delta, p.lng + delta]
            ];

            // Render as a Rectangle (Grid Cell)
            const rectangle = L.rectangle(bounds, {
                color: color,       // Border color (same as fill to hide borders if needed)
                weight: 1,          // Thin border
                fillColor: color,
                fillOpacity: 0.6,   // Semi-transparent
                interactive: true,
                bubblingMouseEvents: false
            });

            // Hover Events
            if (onHover) {
                rectangle.on('mouseover', (e) => {
                    onHover(p);
                    e.target.setStyle({ weight: 2, color: '#000', fillOpacity: 0.9 }); // Highlight
                });
                rectangle.on('mouseout', (e) => {
                    onHover(null);
                    e.target.setStyle({ weight: 1, color: color, fillOpacity: 0.6 }); // Restore
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

            rectangle.bindPopup(popupContent);
            layerGroup.addLayer(rectangle);
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

export default StiGridLayer;
