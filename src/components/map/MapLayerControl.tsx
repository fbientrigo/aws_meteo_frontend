import { useState } from 'react';
import { Layers, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface MapLayerControlProps {
  onBaseLayerChange: (layer: 'streets' | 'satellite' | 'terrain' | 'hybrid') => void;
  currentBaseLayer: string;
}

const MapLayerControl = ({ onBaseLayerChange, currentBaseLayer }: MapLayerControlProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeRisks, toggleRisk, mapLayers, toggleMapLayer } = useAppStore();

  const riskLayers = [
    { id: 'drought', label: 'Drought', icon: '💧' },
    { id: 'flooding', label: 'Flooding', icon: '🌊' },
    { id: 'erosion', label: 'Erosion', icon: '🏔️' },
    { id: 'frost', label: 'Frost', icon: '❄️' },
    { id: 'heatwave', label: 'Heat Wave', icon: '🔥' }
  ];

  const baseLayers = [
    { id: 'streets', label: 'Streets', icon: '🗺️' },
    { id: 'satellite', label: 'Satellite', icon: '🛰️' },
    { id: 'terrain', label: 'Terrain', icon: '🏔️' }
  ];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-card/80 backdrop-blur-md border-border/50 shadow-lg"
      >
        <Layers className="w-4 h-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 10 }}
            className="absolute top-0 right-full mr-2 bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-xl p-4 w-64 z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Map Layers
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6"
              >
                <ChevronDown className="w-3 h-3" />
              </Button>
            </div>

            {/* Base Layers */}
            <div className="mb-4">
              <Label className="text-xs text-muted-foreground mb-2 block">Base Map</Label>
              <RadioGroup value={currentBaseLayer} onValueChange={onBaseLayerChange}>
                {baseLayers.map((layer) => (
                  <div key={layer.id} className="flex items-center space-x-2 py-1">
                    <RadioGroupItem value={layer.id} id={layer.id} />
                    <Label
                      htmlFor={layer.id}
                      className="text-sm font-normal cursor-pointer flex items-center gap-2"
                    >
                      <span>{layer.icon}</span>
                      {layer.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="border-t border-border my-3" />

            {/* Risk Layers */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Risk Layers</Label>
              <div className="space-y-2">
                {riskLayers.map((layer) => (
                  <div key={layer.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={layer.id}
                      checked={activeRisks.includes(layer.id as any)}
                      onCheckedChange={() => toggleRisk(layer.id as any)}
                    />
                    <Label
                      htmlFor={layer.id}
                      className="text-sm font-normal cursor-pointer flex items-center gap-2"
                    >
                      <span>{layer.icon}</span>
                      {layer.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border my-3" />

            {/* Additional Layers */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Other Layers</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="crops"
                    checked={mapLayers.crops}
                    onCheckedChange={() => toggleMapLayer('crops')}
                  />
                  <Label htmlFor="crops" className="text-sm font-normal cursor-pointer">
                    🌱 My Plots
                  </Label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapLayerControl;