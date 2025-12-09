import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useAppStore } from '@/store/useAppStore';

export const useFarmLayers = (map: L.Map | null) => {
    const parcels = useAppStore(state => state.parcels);
    const selectedParcel = useAppStore(state => state.selectedParcel);

    const layersRef = useRef<{
        parcels: L.LayerGroup | null;
    }>({
        parcels: null
    });

    useEffect(() => {
        if (!map) return;

        // Clear existing layers
        if (layersRef.current.parcels) {
            map.removeLayer(layersRef.current.parcels);
            layersRef.current.parcels = null;
        }

        if (parcels.length === 0) return;


        // Create custom panes for proper Z-index ordering
        // Heatmaps use Z-index 600+, so parcels and paddocks must be below
        if (!map.getPane('parcels-pane')) {
            const parcelsPane = map.createPane('parcels-pane');
            parcelsPane.style.zIndex = '500'; // Below heatmaps (600+)
        }

        if (!map.getPane('paddocks-pane')) {
            const paddocksPane = map.createPane('paddocks-pane');
            paddocksPane.style.zIndex = '400'; // Below parcels
        }

        const parcelsGroup = L.layerGroup();

        parcels.forEach(parcel => {
            // Render Parcel Boundary
            if (parcel.geoJSON) {
                const isSelected = selectedParcel?.id === parcel.id;

                const parcelLayer = L.geoJSON(parcel.geoJSON, {
                    pane: 'parcels-pane', // Use custom pane with Z-index 500
                    style: {
                        fillColor: 'transparent',
                        color: '#FFFFFF', // White for high contrast against heatmap
                        weight: isSelected ? 3 : 2,
                        dashArray: '10, 5', // Distinct dashed pattern
                        fillOpacity: 0,
                        opacity: 0.9,
                        className: 'parcel-boundary' // Add class for potential CSS targeting
                    },
                    onEachFeature: (feature, layer) => {
                        layer.on('click', () => {
                            useAppStore.getState().setSelectedParcel(parcel);
                        });

                        // Add tooltip with name
                        layer.bindTooltip(parcel.name, {
                            permanent: false,
                            direction: 'center',
                            className: 'parcel-tooltip'
                        });
                    }
                });
                parcelsGroup.addLayer(parcelLayer);
            }

            // Render Paddocks for this parcel
            if (parcel.paddocks && parcel.paddocks.length > 0) {
                parcel.paddocks.forEach(paddock => {
                    if (paddock.geoJSON) {
                        const paddockLayer = L.geoJSON(paddock.geoJSON, {
                            pane: 'paddocks-pane', // Use custom pane with Z-index 400
                            style: {
                                fillColor: 'transparent',
                                fillOpacity: 0, // Completely transparent
                                color: '#E5E7EB', // Very light gray - almost invisible
                                weight: 1,
                                dashArray: '3, 3', // Subtle dashed line
                                opacity: 0.4 // Very low opacity
                            },
                            onEachFeature: (feature, layer) => {
                                layer.bindPopup(`
                                    <div class="p-2">
                                        <h3 class="font-bold">${paddock.name}</h3>
                                        <p class="text-sm">Cultivo: ${paddock.cropType}</p>
                                        <p class="text-sm">Riego: ${paddock.irrigationType}</p>
                                        <p class="text-sm">Superficie: ${paddock.area} ha</p>
                                    </div>
                                `);

                                // Hover effects
                                layer.on({
                                    mouseover: (e: any) => {
                                        const target = e.target;
                                        target.setStyle({
                                            weight: 2,
                                            opacity: 0.7,
                                            fillOpacity: 0
                                        });
                                    },
                                    mouseout: (e: any) => {
                                        const target = e.target;
                                        target.setStyle({
                                            weight: 1,
                                            opacity: 0.4,
                                            fillOpacity: 0
                                        });
                                    }
                                });
                            }
                        });
                        parcelsGroup.addLayer(paddockLayer);
                    }
                });
            }
        });

        parcelsGroup.addTo(map);
        layersRef.current.parcels = parcelsGroup;

        return () => {
            if (layersRef.current.parcels) {
                map.removeLayer(layersRef.current.parcels);
            }
        };
    }, [map, parcels, selectedParcel]);
};
