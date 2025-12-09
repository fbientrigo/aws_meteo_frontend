import { create } from 'zustand';
import { RiskData, FarmData, TimePeriod, Message, RiskType, CropType, ClimatVariable, FarmDataExtended, RiskCategory, Parcel, PaddockDetailed, DrawingMode, PolygonHistoryEntry } from '@/types';
import { api } from '@/services/api';
import { mockFarmData, mockRisksData } from '@/data/mockFarmData';

export interface DrawnPolygon {
  id: string;
  geoJSON: GeoJSON.Polygon;
  area: number; // in hectares
  risks: {
    type: RiskType;
    intensity: number;
    affectedArea: number;
  }[];
  estimatedCropsAtRisk: number;
  estimatedSavings: number;
}

interface AppState {
  selectedTimePeriod: TimePeriod;
  selectedFarm: FarmData | null;

  // New Data Structures
  farmData: FarmDataExtended | null;
  farmRisks: RiskCategory[];

  activeRisks: RiskType[];
  selectedCrops: string[];
  selectedRiskOnMap: string | null;
  selectedPolygon: DrawnPolygon | null;

  farms: FarmData[];
  risks: RiskData[];
  chatHistory: Message[];
  drawnPolygons: DrawnPolygon[];
  isLoading: boolean;

  // Map Interaction
  flyToLocation: { lat: number; lng: number; zoom: number } | null;

  mapLayers: {
    risks: boolean;
    crops: boolean;
    irrigation: boolean;
    elevation: boolean;
  };

  baseLayer: 'streets' | 'satellite' | 'terrain' | 'hybrid';
  showOnboarding: boolean;

  // Agro-Climate System State
  selectedRun: string | null;
  selectedStep: string | null;
  selectedVariable: ClimatVariable;
  activeCropLayers: CropType[];
  showNatureSolutions: boolean;

  // Analysis Mode State
  analysisLayers: {
    indices: boolean;
    crops: boolean;
    solutions: boolean;
  };
  analysisIndex: 'sti' | 'sepi' | 'temperature' | 'precipitation' | 'evapotranspiration';

  fetchInitialData: () => Promise<void>;
  setTimePeriod: (period: TimePeriod) => void;
  setSelectedFarm: (farm: FarmData | null) => void;
  addFarm: (farm: FarmData) => void;
  removeFarm: (farmId: string) => void;
  toggleRisk: (risk: RiskType) => void;
  toggleCrop: (cropId: string) => void;
  setSelectedRiskOnMap: (riskId: string | null) => void;
  setSelectedPolygon: (polygon: DrawnPolygon | null) => void;
  addDrawnPolygon: (polygon: DrawnPolygon) => void;
  removeDrawnPolygon: (polygonId: string) => void;
  toggleMapLayer: (layer: keyof AppState['mapLayers']) => void;
  addMessage: (message: Message) => void;
  clearChat: () => void;
  setBaseLayer: (layer: 'streets' | 'satellite' | 'terrain' | 'hybrid') => void;
  setShowOnboarding: (show: boolean) => void;
  triggerFlyTo: (location: { lat: number; lng: number; zoom: number }) => void;

  // Agro-Climate Actions
  setSelectedRun: (run: string | null) => void;
  setSelectedStep: (step: string | null) => void;
  setSelectedVariable: (variable: ClimatVariable) => void;
  toggleCropLayer: (crop: CropType) => void;
  setActiveCropLayers: (crops: CropType[]) => void;
  setShowNatureSolutions: (show: boolean) => void;

  // Analysis Actions
  setAnalysisLayers: (layers: { indices: boolean; crops: boolean; solutions: boolean }) => void;
  setAnalysisIndex: (index: 'sti' | 'sepi' | 'temperature' | 'precipitation' | 'evapotranspiration') => void;

  // UI Actions
  isChatOpen: boolean;
  toggleChat: () => void;
  showAddFarmDialog: boolean;
  setShowAddFarmDialog: (show: boolean) => void;

  // Drawing State
  activeDrawingTool: 'polygon' | 'edit' | 'delete' | 'measure' | null;
  setActiveDrawingTool: (tool: 'polygon' | 'edit' | 'delete' | 'measure' | null) => void;

  // Parcel-Paddock Hierarchy
  parcels: Parcel[];
  selectedParcel: Parcel | null;
  drawingMode: DrawingMode;
  addParcel: (parcel: Parcel) => void;
  addPaddockToParcel: (parcelId: string, paddock: PaddockDetailed) => void;
  setSelectedParcel: (parcel: Parcel | null) => void;
  setDrawingMode: (mode: DrawingMode) => void;
  removeParcel: (parcelId: string) => void;
  removePaddockFromParcel: (parcelId: string, paddockId: string) => void;

  // Polygon History System
  polygonHistory: PolygonHistoryEntry[];
  editingPolygonId: string | null;
  addToHistory: (entry: PolygonHistoryEntry) => void;
  updatePolygonInHistory: (id: string, updates: Partial<PolygonHistoryEntry>) => void;
  deleteFromHistory: (id: string) => void;
  setEditingPolygon: (id: string | null) => void;

  // Backend Sync Functions
  isSyncing: boolean;
  syncError: string | null;
  loadParcelsFromBackend: () => Promise<void>;
  saveParcelToBackend: (parcel: Parcel) => Promise<void>;
  deleteParcelFromBackend: (parcelId: string) => Promise<void>;
  savePaddockToBackend: (parcelId: string, paddock: PaddockDetailed) => Promise<void>;
  deletePaddockFromBackend: (paddockId: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  selectedTimePeriod: 'current',
  selectedFarm: null,

  // Initialize with mock data
  farmData: mockFarmData,
  farmRisks: mockRisksData,

  activeRisks: ['drought', 'flooding'], // Activated by default for heatmap demo
  selectedCrops: [],
  selectedRiskOnMap: null,
  selectedPolygon: null,
  farms: [],
  risks: [],
  chatHistory: [],
  drawnPolygons: [],
  isLoading: false,
  flyToLocation: null,
  mapLayers: {
    risks: true,
    crops: false,
    irrigation: false,
    elevation: false,
  },

  baseLayer: 'streets',
  showOnboarding: false, // Desactivado por defecto para no bloquear la vista

  // Agro-Climate Initial State
  selectedRun: null,
  selectedStep: null,
  selectedVariable: 'sti',
  activeCropLayers: [],
  showNatureSolutions: false,

  // Analysis Initial State
  analysisLayers: {
    indices: true,
    crops: true,
    solutions: false
  },
  analysisIndex: 'sti',

  // UI State
  isChatOpen: false,
  showAddFarmDialog: false,

  // Drawing State
  activeDrawingTool: null,

  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      const [farms, risks] = await Promise.all([
        api.data.getFarms(),
        api.data.getRisks()
      ]);
      set({
        farms,
        risks,
        selectedFarm: farms[0] || null,
        isLoading: false
      });
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      set({ isLoading: false });
    }
  },

  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  setShowAddFarmDialog: (show) => set({ showAddFarmDialog: show }), // Implementation for setShowAddFarmDialog
  setActiveDrawingTool: (tool) => set({ activeDrawingTool: tool }),
  setTimePeriod: (period) => set({ selectedTimePeriod: period }),
  setSelectedFarm: (farm) => set({ selectedFarm: farm }),

  addFarm: (farm) => set((state) => ({
    farms: [...state.farms, farm],
    selectedFarm: farm
  })),

  removeFarm: (farmId) => set((state) => ({
    farms: state.farms.filter(f => f.id !== farmId),
    selectedFarm: state.selectedFarm?.id === farmId ? state.farms[0] || null : state.selectedFarm
  })),

  toggleRisk: (risk) => set((state) => ({
    activeRisks: state.activeRisks.includes(risk)
      ? state.activeRisks.filter(r => r !== risk)
      : [...state.activeRisks, risk]
  })),
  toggleCrop: (cropId) => set((state) => ({
    selectedCrops: state.selectedCrops.includes(cropId)
      ? state.selectedCrops.filter(c => c !== cropId)
      : [...state.selectedCrops, cropId]
  })),
  setSelectedRiskOnMap: (riskId) => set({ selectedRiskOnMap: riskId }),
  setSelectedPolygon: (polygon) => set({ selectedPolygon: polygon }),
  addDrawnPolygon: (polygon) => set((state) => ({
    drawnPolygons: [...state.drawnPolygons, polygon],
    selectedPolygon: polygon
  })),
  removeDrawnPolygon: (polygonId) => set((state) => ({
    drawnPolygons: state.drawnPolygons.filter(p => p.id !== polygonId),
    selectedPolygon: state.selectedPolygon?.id === polygonId ? null : state.selectedPolygon
  })),
  toggleMapLayer: (layer) => set((state) => ({
    mapLayers: {
      ...state.mapLayers,
      [layer]: !state.mapLayers[layer]
    }
  })),
  addMessage: (message) => set((state) => ({
    chatHistory: [...state.chatHistory, message]
  })),
  clearChat: () => set({ chatHistory: [] }),
  setBaseLayer: (layer) => set({ baseLayer: layer }),
  setShowOnboarding: (show) => {
    if (!show) {
      localStorage.setItem('onboardingCompleted', 'true');
    }
    set({ showOnboarding: show });
  },
  triggerFlyTo: (location) => set({ flyToLocation: location }),

  // Agro-Climate Actions Implementation
  setSelectedRun: (run) => set({ selectedRun: run }),
  setSelectedStep: (step) => set({ selectedStep: step }),
  setSelectedVariable: (variable) => set({ selectedVariable: variable }),
  toggleCropLayer: (crop) => set((state) => ({
    activeCropLayers: state.activeCropLayers.includes(crop)
      ? state.activeCropLayers.filter(c => c !== crop)
      : [...state.activeCropLayers, crop]
  })),
  setActiveCropLayers: (crops) => set({ activeCropLayers: crops }),
  setShowNatureSolutions: (show) => set({ showNatureSolutions: show }),

  // Analysis Actions Implementation
  setAnalysisLayers: (layers) => set({ analysisLayers: layers }),
  setAnalysisIndex: (index) => set({ analysisIndex: index }),

  // Parcel-Paddock State
  parcels: [],
  selectedParcel: null,
  drawingMode: null,

  // Polygon History State
  polygonHistory: [],
  editingPolygonId: null,

  addParcel: (parcel) => set((state) => ({
    parcels: [...state.parcels, parcel]
  })),

  addPaddockToParcel: (parcelId, paddock) => set((state) => ({
    parcels: state.parcels.map(parcel =>
      parcel.id === parcelId
        ? { ...parcel, paddocks: [...parcel.paddocks, paddock] }
        : parcel
    )
  })),

  setSelectedParcel: (parcel) => set({ selectedParcel: parcel }),

  setDrawingMode: (mode) => set({ drawingMode: mode }),

  removeParcel: (parcelId) => set((state) => ({
    parcels: state.parcels.filter(p => p.id !== parcelId),
    selectedParcel: state.selectedParcel?.id === parcelId ? null : state.selectedParcel
  })),

  removePaddockFromParcel: (parcelId, paddockId) => set((state) => ({
    parcels: state.parcels.map(parcel =>
      parcel.id === parcelId
        ? { ...parcel, paddocks: parcel.paddocks.filter(p => p.id !== paddockId) }
        : parcel
    )
  })),

  // Polygon History Actions
  addToHistory: (entry) => set((state) => ({
    polygonHistory: [...state.polygonHistory, entry]
  })),

  updatePolygonInHistory: (id, updates) => set((state) => ({
    polygonHistory: state.polygonHistory.map(entry =>
      entry.id === id
        ? { ...entry, ...updates, lastModified: new Date() }
        : entry
    )
  })),

  deleteFromHistory: (id) => set((state) => {
    const entry = state.polygonHistory.find(e => e.id === id);

    // If deleting a parcel, also delete its paddocks (cascade)
    if (entry?.type === 'parcel') {
      return {
        polygonHistory: state.polygonHistory.filter(
          e => e.id !== id && e.parentId !== id
        ),
        parcels: state.parcels.filter(p => p.id !== id)
      };
    }

    // If deleting a paddock
    return {
      polygonHistory: state.polygonHistory.filter(e => e.id !== id),
      parcels: state.parcels.map(parcel => ({
        ...parcel,
        paddocks: parcel.paddocks.filter(p => p.id !== id)
      }))
    };
  }),

  setEditingPolygon: (id) => set({ editingPolygonId: id }),

  // Backend Sync State
  isSyncing: false,
  syncError: null,

  // Load parcels from backend
  loadParcelsFromBackend: async () => {
    set({ isSyncing: true, syncError: null });
    try {
      const { backendApi } = await import('@/services/backendApi');
      const result = await backendApi.parcels.getAll();
      if (result.error) throw new Error(result.error);
      if (result.data) {
        set({ parcels: result.data });
      }
    } catch (error: any) {
      set({ syncError: error.message });
      console.error('Failed to load parcels:', error);
    } finally {
      set({ isSyncing: false });
    }
  },

  // Save parcel to backend
  saveParcelToBackend: async (parcel) => {
    set({ isSyncing: true, syncError: null });
    try {
      const { backendApi } = await import('@/services/backendApi');
      const result = await backendApi.parcels.create({
        name: parcel.name,
        area: parcel.area,
        geoJSON: parcel.geoJSON,
      });
      if (result.error) throw new Error(result.error);
    } catch (error: any) {
      set({ syncError: error.message });
      console.error('Failed to save parcel:', error);
    } finally {
      set({ isSyncing: false });
    }
  },

  // Delete parcel from backend
  deleteParcelFromBackend: async (parcelId) => {
    set({ isSyncing: true, syncError: null });
    try {
      const { backendApi } = await import('@/services/backendApi');
      const result = await backendApi.parcels.delete(parcelId);
      if (result.error) throw new Error(result.error);
    } catch (error: any) {
      set({ syncError: error.message });
      console.error('Failed to delete parcel:', error);
    } finally {
      set({ isSyncing: false });
    }
  },

  // Save paddock to backend
  savePaddockToBackend: async (parcelId, paddock) => {
    set({ isSyncing: true, syncError: null });
    try {
      const { backendApi } = await import('@/services/backendApi');
      const result = await backendApi.paddocks.create(parcelId, paddock);
      if (result.error) throw new Error(result.error);
    } catch (error: any) {
      set({ syncError: error.message });
      console.error('Failed to save paddock:', error);
    } finally {
      set({ isSyncing: false });
    }
  },

  // Delete paddock from backend
  deletePaddockFromBackend: async (paddockId) => {
    set({ isSyncing: true, syncError: null });
    try {
      const { backendApi } = await import('@/services/backendApi');
      const result = await backendApi.paddocks.delete(paddockId);
      if (result.error) throw new Error(result.error);
    } catch (error: any) {
      set({ syncError: error.message });
      console.error('Failed to delete paddock:', error);
    } finally {
      set({ isSyncing: false });
    }
  },
}));

