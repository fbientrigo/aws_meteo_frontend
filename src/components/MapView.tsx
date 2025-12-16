import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
// @ts-ignore
import "leaflet.heat";
import { ZoomIn, ZoomOut, Locate, Layers, Map as MapIcon, Search, X, MousePointer2, Ruler, MapPin, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { analyzePolygon } from "@/utils/polygonAnalysis";
import MapSearchBar from "@/components/map/MapSearchBar";
import MapLayerControl from "@/components/map/MapLayerControl";
import OnboardingTutorial from "@/components/map/OnboardingTutorial";
import EnhancedDrawingToolbar from "@/components/map/EnhancedDrawingToolbar";
import { enhancedVertexStyles } from "@/components/map/DrawingStatusPanel";
import PolygonConfirmDialog from "@/components/map/PolygonConfirmDialog";
import AddPaddockDialog, { PaddockFormData } from "@/components/map/AddPaddockDialog";
import { useMapLayers } from "@/hooks/useMapLayers";
import { toLeafletHeatFormat } from "@/utils/heatmapGenerator";
import { MapSkeleton } from "@/components/ui/skeleton-loader";
import { DrawnPolygon } from "@/store/useAppStore";

// Agro-Climate Components
// Agro-Climate Components
import SeverityLegend from "./map/SeverityLegend";
import TimeSlider from "./map/TimeSlider";
import { useSTIData } from "@/hooks/useSTIData";
import { useAgroClimateLayers } from "@/hooks/useAgroClimateLayers";
import { getCropLayersByType, getMockNatureSolutions, getMockAnalysisCrops } from "@/data/mockClimatData";

import { useFarmLayers } from "@/hooks/useFarmLayers";
import { usePolygonEditMode } from "@/hooks/usePolygonEditMode";
import RiskHeatmapLayer from "@/components/map/RiskHeatmapLayer";
import { generateRiskHeatmapPoints } from "@/utils/riskHeatmapUtils";
import DebugGridLayer from "@/components/map/DebugGridLayer";
import VisualizationControls from "@/components/map/VisualizationControls";
import { isExtremeHeat, isExtremeCold } from "@/utils/climatUtils";

const MapView = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Layer[]>([]);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const heatLayersRef = useRef<Map<string, any>>(new Map());
  const drawControlRef = useRef<any>(null);
  const [currentTile, setCurrentTile] = useState<L.TileLayer | null>(null);
  const activeDrawingTool = useAppStore(state => state.activeDrawingTool);
  const setActiveDrawingTool = useAppStore(state => state.setActiveDrawingTool);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const selectedFarm = useAppStore(state => state.selectedFarm);
  const farmData = useAppStore(state => state.farmData);
  const selectedTimePeriod = useAppStore(state => state.selectedTimePeriod);
  const risks = useAppStore(state => state.risks);
  const activeRisks = useAppStore(state => state.activeRisks);
  const selectedRiskOnMap = useAppStore(state => state.selectedRiskOnMap);
  const setSelectedRiskOnMap = useAppStore(state => state.setSelectedRiskOnMap);
  const mapLayers = useAppStore(state => state.mapLayers);
  const addDrawnPolygon = useAppStore(state => state.addDrawnPolygon);
  const removeDrawnPolygon = useAppStore(state => state.removeDrawnPolygon);
  const selectedPolygon = useAppStore(state => state.selectedPolygon);
  const setSelectedPolygon = useAppStore(state => state.setSelectedPolygon);
  const drawnPolygons = useAppStore(state => state.drawnPolygons);
  const baseLayer = useAppStore(state => state.baseLayer);
  const setBaseLayer = useAppStore(state => state.setBaseLayer);
  const showOnboarding = useAppStore(state => state.showOnboarding);
  const setShowOnboarding = useAppStore(state => state.setShowOnboarding);
  const flyToLocation = useAppStore(state => state.flyToLocation);
  const triggerFlyTo = useAppStore(state => state.triggerFlyTo);
  // Agro-Climate State
  const selectedRun = useAppStore(state => state.selectedRun);
  const selectedStep = useAppStore(state => state.selectedStep);
  const selectedVariable = useAppStore(state => state.selectedVariable);
  const activeCropLayers = useAppStore(state => state.activeCropLayers);
  const showNatureSolutions = useAppStore(state => state.showNatureSolutions);

  // Analysis State
  const analysisLayers = useAppStore(state => state.analysisLayers);
  const analysisIndex = useAppStore(state => state.analysisIndex);

  // Parcel/Paddock State
  const selectedParcel = useAppStore(state => state.selectedParcel);
  const editingPolygonId = useAppStore(state => state.editingPolygonId);
  const setEditingPolygon = useAppStore(state => state.setEditingPolygon);
  const updatePolygonInHistory = useAppStore(state => state.updatePolygonInHistory);
  const polygonHistory = useAppStore(state => state.polygonHistory);

  // Initialize Farm Layers (Boundary & Paddocks)
  useFarmLayers(mapRef.current);

  // Initialize Polygon Edit Mode
  usePolygonEditMode(mapRef.current);

  // Fetch STI Data with dynamic bounds based on selection or map center
  // For demo, we use a wider range to ensure coverage
  const { data: stiData } = useSTIData(
    selectedRun,
    selectedStep,
    { lat_min: -58, lat_max: -17, lon_min: -80, lon_max: -60 }
  );

  // Get active crop layers
  // In Analysis Mode, we use the mock analysis crops for the selected polygon
  const activeCrops = selectedPolygon
    ? getMockAnalysisCrops(selectedPolygon.geoJSON)
    : activeCropLayers.flatMap(type => getCropLayersByType(type));

  // Get nature solutions
  const natureSolutions = showNatureSolutions ? getMockNatureSolutions() : [];

  // Initialize Agro-Climate Layers Hook
  // We pass mapLayers.risks to control heatmap visibility
  useAgroClimateLayers({
    map: mapRef.current,
    stiData: stiData ? { points: stiData.points } : undefined,
    activeCrops,
    natureSolutions,
    selectedVariable,
    showNatureSolutions,
    // Analysis Props
    isAnalysisMode: !!selectedPolygon,
    analysisLayers: {
      ...analysisLayers,
      indices: mapLayers.risks // Override with global risk toggle
    },
    analysisIndex
  });

  const [mapReady, setMapReady] = useState(false);
  const [pendingPolygon, setPendingPolygon] = useState<DrawnPolygon | null>(null);
  const [pendingLayer, setPendingLayer] = useState<any>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Paddock dialog state
  const [showPaddockDialog, setShowPaddockDialog] = useState(false);
  const [pendingPaddockData, setPendingPaddockData] = useState<{
    geoJSON: any;
    area: number;
    layer: any;
  } | null>(null);

  const centerLat = selectedFarm?.location.lat || -33.6642;
  const centerLng = selectedFarm?.location.lng || -70.9289;

  const { heatmapData } = useMapLayers(centerLat, centerLng);

  // Visualization Controls State
  const [showTempIndex, setShowTempIndex] = useState(true);
  const [showExtremeHeat, setShowExtremeHeat] = useState(false);
  const [showExtremeCold, setShowExtremeCold] = useState(false);

  // Debug State - initialized from env
  const [showDebugGrid, setShowDebugGrid] = useState(import.meta.env.VITE_DEBUG_MODE === 'true');

  // TRIGGER DIAGNOSTIC LOGS
  useEffect(() => {
    console.log("🚀 [MapView] MOUNTED");
    console.log("🐛 [MapView] VITE_DEBUG_MODE raw:", import.meta.env.VITE_DEBUG_MODE);
    console.log("🐛 [MapView] showDebugGrid state:", showDebugGrid);
  }, []); // Run once on mount

  // Trigger debug logging manually
  useEffect(() => {
    if (showDebugGrid && stiData) {
      console.log("🐞 [MapView] Debug Mode Active: Showing Grid Layer");
    }
    if (stiData) {
      console.log("📊 [MapView] STI Data Present. Points:", stiData.points?.length);
    } else {
      console.log("⚠️ [MapView] STI Data is NULL");
    }
  }, [showDebugGrid, stiData]);

  // Derived datasets for visualization
  const visualizationPoints = useMemo(() => {
    if (!stiData || !stiData.points) return { heat: [], cold: [], all: [] };

    return {
      all: stiData.points,
      heat: stiData.points.filter(p => isExtremeHeat(p.intensity)),
      cold: stiData.points.filter(p => isExtremeCold(p.intensity))
    };
  }, [stiData]);

  // Handle FlyTo from Store
  useEffect(() => {
    if (mapRef.current && flyToLocation) {
      mapRef.current.flyTo(
        [flyToLocation.lat, flyToLocation.lng],
        flyToLocation.zoom,
        { duration: 1.5 }
      );
    }
  }, [flyToLocation]);

  // Auto-Fly to STI Data Bounds
  // Auto-Fly to STI Data Bounds
  useEffect(() => {
    if (mapRef.current && stiData && stiData.points && stiData.points.length > 0) {
      try {
        // Calculate bounds dynamically from valid points
        const points = stiData.points.map(p => [p.lat, p.lng] as [number, number]);
        const bounds = L.latLngBounds(points);

        if (bounds.isValid()) {
          mapRef.current.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
          toast.success("Enfocando datos satelitales...");
        }
      } catch (error) {
        console.error("Error calculating bounds:", error);
      }
    }
  }, [stiData]);

  const filteredRisks = useMemo(() => {
    const periodMultiplier = selectedTimePeriod === 'current' ? 1 : 1.35;
    return risks
      .filter(risk => activeRisks.includes(risk.type))
      .map(risk => ({
        ...risk,
        timeline: risk.timeline.map(t => ({
          ...t,
          intensity: selectedTimePeriod === 'projection'
            ? Math.min(100, t.intensity * periodMultiplier)
            : t.intensity
        }))
      }));
  }, [selectedTimePeriod, risks, activeRisks]);

  // Inject enhanced vertex styles
  useEffect(() => {
    const styleId = 'enhanced-vertex-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = enhancedVertexStyles;
      document.head.appendChild(styleElement);
    }

    return () => {
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  // Manage visibility of drawn polygons when in analysis mode
  useEffect(() => {
    if (!drawnItemsRef.current) return;

    drawnItemsRef.current.eachLayer((layer: any) => {
      const layerId = L.Util.stamp(layer);
      const polygonId = `polygon-${layerId}`;

      // If this is the selected polygon, hide it (make it transparent)
      // so the analysis layers (crops/heatmap) can be seen clearly
      if (selectedPolygon && selectedPolygon.id === polygonId) {
        if (layer.setStyle) {
          layer.setStyle({
            opacity: 0,
            fillOpacity: 0,
            interactive: false // Disable interaction while analyzing to prevent clicks on the hidden layer
          });
        }
      } else {
        // Restore default style
        if (layer.setStyle) {
          layer.setStyle({
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.4,
            weight: 3,
            opacity: 0.8,
            interactive: true
          });
        }
      }
    });
  }, [selectedPolygon]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false
    }).setView([centerLat, centerLng], 13);

    const streetsLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    streetsLayer.addTo(map);
    setCurrentTile(streetsLayer);

    // Initialize drawing feature group
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    // Initialize draw control (but don't add it to the map - we'll use our custom toolbar)
    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false,
          drawError: {
            color: '#e74c3c',
            message: '<strong>¡Error!</strong> Los bordes no pueden cruzarse'
          },
          shapeOptions: {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.4,
            weight: 3,
            opacity: 0.8
          },
          repeatMode: false
        },
        rectangle: {
          shapeOptions: {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.4,
            weight: 3,
            opacity: 0.8
          },
          repeatMode: false
        },
        circle: false,
        marker: false,
        polyline: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItems,
        remove: true
      }
    });

    // Store reference for programmatic access
    drawControlRef.current = drawControl;

    // Handle polygon creation - Show confirmation dialog
    map.on(L.Draw.Event.CREATED, (event: any) => {
      console.log('🎨 Polygon CREATED event fired!');
      const layer = event.layer;
      const layerId = L.Util.stamp(layer);
      const drawingMode = useAppStore.getState().drawingMode;
      const selectedParcel = useAppStore.getState().selectedParcel;

      console.log('📐 Layer ID:', layerId);
      console.log('🎯 Drawing Mode:', drawingMode);

      const latLngs = layer.getLatLngs()[0];
      const geoJSON = layer.toGeoJSON().geometry as GeoJSON.Polygon;

      // Validate geoJSON structure
      if (!geoJSON || !geoJSON.coordinates || geoJSON.coordinates.length === 0) {
        toast.error('Error al crear el polígono. Por favor intenta nuevamente.');
        layer.remove();
        return;
      }

      const area = L.GeometryUtil ? L.GeometryUtil.geodesicArea(latLngs) : 0;
      const areaInHectares = area / 10000;

      // Validate area
      if (areaInHectares <= 0) {
        toast.error('El área del polígono debe ser mayor a 0');
        layer.remove();
        return;
      }

      console.log('📊 Area calculated:', areaInHectares, 'ha');

      // Handle based on drawing mode
      // Handle based on drawing mode
      if (drawingMode === 'parcel') {
        // Retrieve pending farm data from sessionStorage
        const pendingFarmStr = sessionStorage.getItem('pendingFarm');
        let farmName = `Parcela ${useAppStore.getState().parcels.length + 1}`;
        let ownerName = '';

        if (pendingFarmStr) {
          try {
            const pendingFarm = JSON.parse(pendingFarmStr);
            farmName = pendingFarm.name;
            ownerName = pendingFarm.ownerName; // We might want to store this in the parcel or farm object
            // Clear storage
            sessionStorage.removeItem('pendingFarm');
          } catch (e) {
            console.error('Error parsing pending farm data', e);
          }
        }

        // Creating a new parcel (Predio)
        const newParcel = {
          id: `parcel-${Date.now()}`,
          name: farmName,
          geoJSON,
          area: Math.round(areaInHectares * 100) / 100,
          paddocks: [],
          createdAt: new Date(),
          ownerName: ownerName // Add ownerName to Parcel type if needed or handle it
        };

        // Add to store
        useAppStore.getState().addParcel(newParcel);

        // Auto-select the new parcel to enable adding paddocks immediately
        useAppStore.getState().setSelectedParcel(newParcel);

        // Register in history
        useAppStore.getState().addToHistory({
          id: newParcel.id,
          type: 'parcel',
          name: newParcel.name,
          geoJSON: newParcel.geoJSON,
          area: newParcel.area,
          createdAt: newParcel.createdAt,
          createdBy: ownerName || 'Usuario',
          notes: `Predio creado mediante dibujo manual en el mapa`
        });

        // Add layer to map with parcel styling
        // Remove the temporary drawing layer as useFarmLayers will render it from store
        layer.remove();

        toast.success(`Predio "${newParcel.name}" creado exitosamente`);
        useAppStore.getState().setDrawingMode(null);
        setActiveDrawingTool(null);
        setActiveDrawingTool(null);

      } else if (drawingMode === 'paddock') {
        // Creating a paddock inside selected parcel
        if (!selectedParcel) {
          toast.error('Debes seleccionar una parcela primero');
          layer.remove();
          return;
        }

        // Validate paddock is inside parcel
        import('@/utils/geoValidation').then(({ validatePaddockInParcel }) => {
          const validation = validatePaddockInParcel(
            geoJSON,
            selectedParcel.geoJSON,
            selectedParcel.paddocks.map(p => ({ geoJSON: p.geoJSON }))
          );

          if (!validation.valid) {
            toast.error(validation.error || 'El potrero no es válido');
            layer.remove();
            return;
          }

          // Store pending paddock data and show dialog
          setPendingPaddockData({
            geoJSON,
            area: Math.round(areaInHectares * 100) / 100,
            layer
          });

          // Add layer to map temporarily with paddock styling
          if (drawnItemsRef.current) {
            layer.setStyle({
              color: '#22c55e',
              weight: 2,
              dashArray: '5, 5',
              fillOpacity: 0.1
            });
            drawnItemsRef.current.addLayer(layer);
          }

          setShowPaddockDialog(true);
          useAppStore.getState().setDrawingMode(null);
          setActiveDrawingTool(null);
        });

      } else {
        // Legacy mode - old polygon system
        const analysis = analyzePolygon(geoJSON, areaInHectares, risks, activeRisks);

        const newPolygon = {
          id: `polygon-${layerId}`,
          geoJSON,
          area: Math.round(areaInHectares * 100) / 100,
          createdAt: new Date(),
          ...analysis
        };

        // Add layer to map temporarily
        if (drawnItemsRef.current) {
          drawnItemsRef.current.addLayer(layer);
        }

        // Store pending polygon and layer
        setPendingPolygon(newPolygon);
        setPendingLayer(layer);

        // Show dialog
        setTimeout(() => {
          setShowConfirmDialog(true);
          setActiveDrawingTool(null);
        }, 300);
      }

      console.log('✅ Polygon creation handled');
    });

    map.on(L.Draw.Event.DELETED, (event: any) => {
      const layers = event.layers;
      let count = 0;
      layers.eachLayer((layer: any) => {
        const layerId = L.Util.stamp(layer);
        const polygonId = `polygon-${layerId}`;
        removeDrawnPolygon(polygonId);
        count++;
      });
      setActiveDrawingTool(null); // Reset active tool
      toast.info(`${count} polígono(s) eliminado(s)`);
    });

    map.on(L.Draw.Event.EDITSTOP, () => {
      setActiveDrawingTool(null);
    });

    map.on(L.Draw.Event.DELETESTOP, () => {
      setActiveDrawingTool(null);
    });

    map.whenReady(() => {
      setIsMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update base layer
  useEffect(() => {
    if (!mapRef.current) return;

    const tileLayers: Record<string, string> = {
      streets: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      terrain: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
    };

    if (currentTile) {
      mapRef.current.removeLayer(currentTile);
    }

    const newTile = L.tileLayer(tileLayers[baseLayer] || tileLayers.streets, {
      attribution: baseLayer === 'satellite'
        ? '&copy; Esri'
        : baseLayer === 'terrain'
          ? '&copy; OpenTopoMap'
          : '&copy; OpenStreetMap'
    });

    newTile.addTo(mapRef.current);
    setCurrentTile(newTile);
  }, [baseLayer]);

  // Generate heatmap points for active risks
  const riskHeatmapPoints = useMemo(() => {
    const geometry = selectedParcel?.geoJSON || farmData?.geometry;
    if (!geometry) return {};

    const points: Record<string, any[]> = {};

    // Only generate points if we have a valid geometry
    if (geometry) {
      activeRisks.forEach(riskType => {
        // Import dynamically to avoid circular dependencies if any, or just use the imported function
        // We need to make sure generateRiskHeatmapPoints is imported
        points[riskType] = generateRiskHeatmapPoints(geometry, riskType);
      });
    }

    return points;
  }, [selectedParcel, selectedFarm, activeRisks]);

  // Calculate opacity based on number of active layers
  const heatmapOpacity = activeRisks.length > 1 ? 0.5 : 0.7;

  // Z-Index configuration
  const Z_INDICES = {
    BASE_MAP: 0,
    POTREROS: 400,
    PREDIOS: 500,
    HEATMAP_BASE: 600
  };

  const handleZoomIn = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  }, []);

  const handleLocate = useCallback(() => {
    if (mapRef.current && selectedFarm) {
      mapRef.current.flyTo([selectedFarm.location.lat, selectedFarm.location.lng], 13, {
        duration: 1.5
      });
    }
  }, [selectedFarm]);

  const handleLocationSelect = useCallback((lat: number, lng: number, zoom: number = 13) => {
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], zoom, {
        duration: 1.5
      });
    }
  }, []);

  // Effect to handle tool changes from store
  useEffect(() => {
    const tool = activeDrawingTool;
    console.log('🔧 Active tool changed to:', tool);

    if (!mapRef.current || !drawnItemsRef.current) {
      return;
    }

    const map = mapRef.current;

    // Disable any existing handlers
    // @ts-ignore
    if (map._toolbars) {
      // @ts-ignore
      Object.values(map._toolbars).forEach((toolbar: any) => {
        if (toolbar.disable) toolbar.disable();
      });
    }

    // Also try to disable via drawControl if possible, but Leaflet Draw is tricky.
    // The best way is to re-enable the specific tool we want.

    if (!tool) {
      return;
    }

    switch (tool) {
      case 'polygon':
        console.log('🔷 Enabling polygon draw...');
        // @ts-ignore
        new L.Draw.Polygon(map, drawControlRef.current?.options.draw.polygon).enable();
        toast.success('Dibuja el polígono marcando los puntos en el mapa');
        break;
      case 'edit':
        console.log('✏️ Enabling edit mode...');
        // @ts-ignore
        new L.EditToolbar.Edit(map, {
          featureGroup: drawnItemsRef.current
        }).enable();
        toast.success('Selecciona y arrastra para editar');
        break;
      case 'delete':
        console.log('🗑️ Enabling delete mode...');
        // @ts-ignore
        new L.EditToolbar.Delete(map, {
          featureGroup: drawnItemsRef.current
        }).enable();
        toast.success('Haz clic en las parcelas para eliminar');
        break;
      case 'measure':
        console.log('📏 Enabling measure tool...');
        // @ts-ignore
        new L.Draw.Polyline(map, {
          shapeOptions: {
            color: '#f59e0b',
            weight: 3,
            dashArray: '5, 10'
          },
          metric: true
        }).enable();
        toast.info('Dibuja una línea para medir la distancia');
        break;
    }
  }, [activeDrawingTool]);

  const handleToolSelect = useCallback((tool: 'polygon' | 'edit' | 'delete' | 'measure' | null) => {
    setActiveDrawingTool(tool);
  }, [setActiveDrawingTool]);

  // Handlers for polygon confirmation dialog
  const handleApprovePolygon = useCallback(() => {
    if (!pendingPolygon || !pendingLayer || !drawnItemsRef.current) {
      toast.error('Error: No hay polígono pendiente');
      return;
    }

    // Final validation before approval
    if (pendingPolygon.area <= 0) {
      toast.error('El área del polígono debe ser mayor a 0');
      return;
    }

    // Layer is already added, just need to update state
    addDrawnPolygon(pendingPolygon);

    toast.success('✓ Polígono aprobado y analizado', {
      description: `Área: ${pendingPolygon.area} ha | Riesgos: ${pendingPolygon.risks.length} | Ahorro: $${(pendingPolygon.estimatedSavings / 1000).toFixed(1)} k`
    });

    setShowConfirmDialog(false);
    setPendingPolygon(null);
    setPendingLayer(null);
  }, [pendingPolygon, pendingLayer, addDrawnPolygon]);

  const handleEditPolygon = useCallback(() => {
    if (pendingLayer && mapRef.current && drawnItemsRef.current) {
      // Layer is already added, just enable edit mode
      // @ts-ignore
      new L.EditToolbar.Edit(mapRef.current, {
        featureGroup: drawnItemsRef.current
      }).enable();

      setActiveDrawingTool('edit');
      setShowConfirmDialog(false);

      toast.info('Modo de edición activado', {
        description: 'Arrastra los puntos para ajustar el polígono. Luego presiona "Guardar".'
      });
    }
  }, [pendingLayer]);

  const handleCancelPolygon = useCallback(() => {
    if (pendingLayer && drawnItemsRef.current) {
      // Remove the layer from the map
      drawnItemsRef.current.removeLayer(pendingLayer);
    }

    setShowConfirmDialog(false);
    setPendingPolygon(null);
    setPendingLayer(null);

    toast.info('Polígono descartado');
  }, [pendingLayer]);

  // Paddock dialog handlers
  const handleConfirmPaddock = useCallback((formData: PaddockFormData) => {
    const selectedParcel = useAppStore.getState().selectedParcel;
    if (!selectedParcel || !pendingPaddockData) return;

    const newPaddock = {
      id: `paddock-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      geoJSON: pendingPaddockData.geoJSON,
      area: pendingPaddockData.area,
      cropType: formData.cropType,
      irrigationType: formData.irrigationType,
      attachedFile: formData.attachedFile ? {
        name: formData.attachedFile.name,
        url: URL.createObjectURL(formData.attachedFile),
        size: formData.attachedFile.size
      } : undefined,
      createdAt: new Date()
    };

    // Add to parcel
    useAppStore.getState().addPaddockToParcel(selectedParcel.id, newPaddock);

    // Register in history
    useAppStore.getState().addToHistory({
      id: newPaddock.id,
      type: 'paddock',
      name: newPaddock.name,
      geoJSON: newPaddock.geoJSON,
      area: newPaddock.area,
      createdAt: newPaddock.createdAt,
      createdBy: 'Usuario', // Could be enhanced with actual user info
      notes: formData.description || `Potrero creado mediante dibujo manual. Cultivo: ${formData.cropType}, Riego: ${formData.irrigationType}`,
      parentId: selectedParcel.id
    });

    // Remove the temporary drawing layer as useFarmLayers will render it from store
    if (drawnItemsRef.current && pendingPaddockData.layer) {
      drawnItemsRef.current.removeLayer(pendingPaddockData.layer);
    }

    toast.success(`Potrero "${newPaddock.name}" agregado a "${selectedParcel.name}"`);

    setShowPaddockDialog(false);
    setPendingPaddockData(null);
  }, [pendingPaddockData]);

  const handleCancelPaddock = useCallback(() => {
    if (pendingPaddockData?.layer && drawnItemsRef.current) {
      drawnItemsRef.current.removeLayer(pendingPaddockData.layer);
    }

    setShowPaddockDialog(false);
    setPendingPaddockData(null);
    toast.info('Potrero descartado');
  }, [pendingPaddockData]);


  // ... previous imports ...
  // Inside MapView component
  // ... existing code ...

  return (
    <div className="flex-1 relative min-h-0 map-wrapper" id="welcome-step">
      <div ref={mapContainerRef} id="map-container" className="absolute inset-0" />

      {/* Visualization Controls Panel */}
      <VisualizationControls
        showTempIndex={showTempIndex}
        setShowTempIndex={setShowTempIndex}
        showExtremeHeat={showExtremeHeat}
        setShowExtremeHeat={setShowExtremeHeat}
        showExtremeCold={showExtremeCold}
        setShowExtremeCold={setShowExtremeCold}
        showDebugGrid={showDebugGrid}
        setShowDebugGrid={setShowDebugGrid}
        debugModeAvailable={import.meta.env.VITE_DEBUG_MODE === 'true' || import.meta.env.DEV}
      />

      {/* Map Loading Skeleton */}
      {!isMapLoaded && (
        <div className="absolute inset-0 z-50">
          <MapSkeleton />
        </div>
      )}

      {/* STI Heatmap Layer (Standard) */}
      {isMapLoaded && showTempIndex && stiData && (
        <RiskHeatmapLayer
          map={mapRef.current}
          points={toLeafletHeatFormat(visualizationPoints.all)} // Use all points for general index
          riskType="drought" // Re-using heat ramp from drought/heat
          visible={true}
          opacity={0.6}
          zIndex={500}
        />
      )}

      {/* Extreme Heat Overlay */}
      {isMapLoaded && showExtremeHeat && (
        <DebugGridLayer
          map={mapRef.current}
          points={visualizationPoints.heat}
          visible={true}
        />
      )}

      {/* Extreme Cold Overlay - Reusing DebugGrid for now but could be a distinct blue layer if needed. 
          For now, DebugGrid handles color based on severity so it should look okay (Low Severity = Blueish). 
      */}
      {isMapLoaded && showExtremeCold && (
        <DebugGridLayer
          map={mapRef.current}
          points={visualizationPoints.cold}
          visible={true}
        />
      )}

      {/* Debug Grid Layer (Full Raw Data) */}
      {isMapLoaded && showDebugGrid && !showExtremeHeat && !showExtremeCold && (
        <DebugGridLayer
          map={mapRef.current}
          points={stiData?.points || []}
          visible={true}
        />
      )}

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-5 left-5 z-[1000]"
        id="search-bar"
      >
        <MapSearchBar onLocationSelect={handleLocationSelect} />
      </motion.div>

      {/* Drawing Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-5 z-[1000] top-24 md:top-20"
        id="drawing-toolbar"
        data-tour="draw-tools"
      >
        <EnhancedDrawingToolbar
          onToolSelect={handleToolSelect}
          activeTool={activeDrawingTool}
        />
      </motion.div>



      {/* Map Controls */}
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 items-end">
        <MapLayerControl
          currentBaseLayer={baseLayer}
          onBaseLayerChange={setBaseLayer}
        />

        <Button
          variant="secondary"
          size="icon"
          onClick={() => {
            if (mapRef.current && selectedFarm) {
              mapRef.current.flyTo([selectedFarm.location.lat, selectedFarm.location.lng], 14, {
                duration: 1.5
              });
            }
          }}
          title="Centrar en parcela"
          className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg"
        >
          <Locate className="w-4 h-4" />
        </Button>
      </div>



      {/* Onboarding Overlay */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[2000] bg-black/50 flex items-center justify-center p-4"
          >
            <Card className="max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold">Bienvenido a SbNAI</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowOnboarding(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-muted-foreground">
                Esta plataforma te ayuda a identificar riesgos climáticos y encontrar soluciones basadas en la naturaleza.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">1</div>
                  <span>Explora el mapa y las capas de riesgo.</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">2</div>
                  <span>Usa las herramientas de dibujo para marcar tu parcela.</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">3</div>
                  <span>Obtén un diagnóstico y recomendaciones personalizadas.</span>
                </li>
              </ul>
              <Button className="w-full" onClick={() => setShowOnboarding(false)}>
                Comenzar
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Polygon Confirmation Dialog */}
      <PolygonConfirmDialog
        open={showConfirmDialog}
        polygon={pendingPolygon}
        onApprove={handleApprovePolygon}
        onEdit={handleEditPolygon}
        onCancel={handleCancelPolygon}
      />

      {/* Paddock Details Dialog */}
      <AddPaddockDialog
        open={showPaddockDialog}
        onClose={handleCancelPaddock}
        onConfirm={handleConfirmPaddock}
        parcelName={useAppStore.getState().selectedParcel?.name || ""}
        area={pendingPaddockData?.area || 0}
      />


      {/* SVG Patterns Definitions */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          {/* Maíz: Diagonal Lines */}
          <pattern id="pattern-maiz" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke="#FFD700" strokeWidth="4" strokeOpacity="0.6" />
          </pattern>
          {/* Trigo: Horizontal Lines */}
          <pattern id="pattern-trigo" patternUnits="userSpaceOnUse" width="10" height="10">
            <line x1="0" y1="5" x2="10" y2="5" stroke="#DEB887" strokeWidth="4" strokeOpacity="0.6" />
          </pattern>
          {/* Vid: Vertical Lines */}
          <pattern id="pattern-vid" patternUnits="userSpaceOnUse" width="10" height="10">
            <line x1="5" y1="0" x2="5" y2="10" stroke="#800080" strokeWidth="4" strokeOpacity="0.6" />
          </pattern>
          {/* Palto: Cross Hatch */}
          <pattern id="pattern-palto" patternUnits="userSpaceOnUse" width="10" height="10">
            <path d="M0,0 L10,10 M10,0 L0,10" stroke="#228B22" strokeWidth="2" strokeOpacity="0.6" />
          </pattern>
          {/* Arándano: Dots */}
          <pattern id="pattern-arandano" patternUnits="userSpaceOnUse" width="10" height="10">
            <circle cx="5" cy="5" r="2.5" fill="#4169E1" fillOpacity="0.6" />
          </pattern>
        </defs>
      </svg>
    </div>
  );
};

export default MapView;