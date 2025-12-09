// Polygon Edit Mode Hook
// This hook enables visual editing of polygons when editingPolygonId is set
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import * as turf from '@turf/turf';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

export const usePolygonEditMode = (map: L.Map | null) => {
    const editingPolygonId = useAppStore(state => state.editingPolygonId);
    const setEditingPolygon = useAppStore(state => state.setEditingPolygon);
    const updatePolygonInHistory = useAppStore(state => state.updatePolygonInHistory);
    const polygonHistory = useAppStore(state => state.polygonHistory);
    const parcels = useAppStore(state => state.parcels);

    const editingLayerRef = useRef<L.Layer | null>(null);
    const originalStyleRef = useRef<any>(null);
    const mapClickHandlerRef = useRef<((e: L.LeafletMouseEvent) => void) | null>(null);

    useEffect(() => {
        if (!map || !editingPolygonId) {
            // Clean up if no editing
            if (editingLayerRef.current) {
                const layer: any = editingLayerRef.current;

                // Disable editing
                if (layer.disableEdit) {
                    layer.disableEdit();
                }

                // Restore original style
                if (originalStyleRef.current && layer.setStyle) {
                    layer.setStyle(originalStyleRef.current);
                }

                editingLayerRef.current = null;
                originalStyleRef.current = null;
            }

            // Remove map click handler if exists
            if (mapClickHandlerRef.current) {
                map?.off('click', mapClickHandlerRef.current);
                mapClickHandlerRef.current = null;
            }

            return;
        }

        // Find the polygon in history
        const historyEntry = polygonHistory.find(e => e.id === editingPolygonId);
        if (!historyEntry) {
            toast.error('Polígono no encontrado');
            setEditingPolygon(null);
            return;
        }

        // Find the corresponding parcel/paddock
        const parcel = parcels.find(p =>
            p.id === editingPolygonId ||
            p.paddocks.some(pad => pad.id === editingPolygonId)
        );

        if (!parcel) {
            toast.error('No se pudo encontrar el polígono en el mapa');
            setEditingPolygon(null);
            return;
        }

        // Find the layer on the map
        let targetLayer: any = null;

        map.eachLayer((layer: any) => {
            if (layer.feature && layer.feature.properties) {
                // Check if this layer matches our polygon
                if (layer.feature.properties.id === editingPolygonId) {
                    targetLayer = layer;
                }
            }

            // Also check GeoJSON layers
            if (layer instanceof L.GeoJSON) {
                layer.eachLayer((subLayer: any) => {
                    if (subLayer.feature && subLayer.feature.properties &&
                        subLayer.feature.properties.id === editingPolygonId) {
                        targetLayer = subLayer;
                    }
                });
            }
        });

        if (!targetLayer) {
            // If not found, create a temporary editable layer
            const tempLayer = L.geoJSON(historyEntry.geoJSON, {
                style: {
                    color: '#3B82F6',
                    weight: 3,
                    fillOpacity: 0.2,
                    dashArray: '5, 5'
                }
            });

            tempLayer.addTo(map);
            targetLayer = tempLayer.getLayers()[0];
        }

        if (!targetLayer) {
            toast.error('No se pudo activar el modo de edición');
            setEditingPolygon(null);
            return;
        }

        // Save original style
        if (targetLayer.options) {
            originalStyleRef.current = { ...targetLayer.options };
        }

        // Apply editing style
        if (targetLayer.setStyle) {
            targetLayer.setStyle({
                color: '#10B981', // Green for editing
                weight: 3,
                fillOpacity: 0.3,
                dashArray: undefined
            });
        }

        // Enable editing using Leaflet.Editable if available
        if (map.editTools && targetLayer.enableEdit) {
            targetLayer.enableEdit();
            editingLayerRef.current = targetLayer;

            toast.info('Arrastra los vértices para editar. Haz clic fuera para guardar.');

            // Listen for edit events
            const handleEdit = () => {
                const geoJSON = targetLayer.toGeoJSON();
                const area = turf.area(geoJSON) / 10000; // Convert to hectares

                // Update in history
                updatePolygonInHistory(editingPolygonId, {
                    geoJSON: geoJSON.geometry,
                    area: Math.round(area * 100) / 100,
                    lastModifiedBy: 'Usuario'
                });

                toast.success('Polígono actualizado');
                setEditingPolygon(null);
            };

            targetLayer.on('editable:editing', handleEdit);

            // Handle click outside to save
            const handleMapClick = (e: L.LeafletMouseEvent) => {
                if (!targetLayer.getBounds().contains(e.latlng)) {
                    handleEdit();
                    if (mapClickHandlerRef.current) {
                        map.off('click', mapClickHandlerRef.current);
                        mapClickHandlerRef.current = null;
                    }
                }
            };

            mapClickHandlerRef.current = handleMapClick;
            map.on('click', handleMapClick);

        } else {
            // Fallback: simple message
            toast.warning('Modo de edición no disponible. Instala Leaflet.Editable.');
            setEditingPolygon(null);
        }

        return () => {
            // Cleanup function
            if (editingLayerRef.current) {
                const layer: any = editingLayerRef.current;
                if (layer.disableEdit) {
                    layer.disableEdit();
                }
            }

            // Remove map click handler
            if (mapClickHandlerRef.current && map) {
                map.off('click', mapClickHandlerRef.current);
                mapClickHandlerRef.current = null;
            }
        };

    }, [map, editingPolygonId, polygonHistory, parcels, setEditingPolygon, updatePolygonInHistory]);
};
