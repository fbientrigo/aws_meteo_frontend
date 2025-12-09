import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Maximize2, AlertCircle, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedDrawingStatusPanelProps {
  area: number;
  pointCount: number;
  isActive: boolean;
  maxPoints?: number;
  onComplete?: () => void;
  onCancel?: () => void;
}

export const EnhancedDrawingStatusPanel = ({
  area,
  pointCount,
  isActive,
  maxPoints = 4,
  onComplete,
  onCancel
}: EnhancedDrawingStatusPanelProps) => {
  if (!isActive) return null;

  const progress = (pointCount / maxPoints) * 100;
  const isComplete = pointCount >= maxPoints;
  const hasMinPoints = pointCount >= 3;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="absolute left-5 bottom-24 z-[1000]"
      >
        <Card className="p-4 shadow-2xl border-2 border-primary/30 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-md min-w-[280px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Dibujando Polígono</h3>
                <p className="text-xs text-muted-foreground">
                  {pointCount}/{maxPoints} puntos
                </p>
              </div>
            </div>
            <Badge
              variant={isComplete ? "default" : "secondary"}
              className={cn(
                "animate-pulse",
                isComplete && "bg-green-500 hover:bg-green-600"
              )}
            >
              {isComplete ? "Completo" : "Dibujando"}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  "h-full rounded-full transition-colors",
                  isComplete ? "bg-green-500" : "bg-primary"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg p-3 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Maximize2 className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs text-muted-foreground">Área</span>
              </div>
              <p className="text-lg font-bold text-blue-600">
                {area.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">hectáreas</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg p-3 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-xs text-muted-foreground">Puntos</span>
              </div>
              <p className="text-lg font-bold text-purple-600">
                {pointCount}
              </p>
              <p className="text-xs text-muted-foreground">de {maxPoints}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2 mb-4 p-3 bg-muted/50 rounded-lg border border-border/50">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
              <p className="text-xs text-muted-foreground">
                <kbd className="px-1.5 py-0.5 bg-background rounded text-xs border">Click</kbd> para agregar punto
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
              <p className="text-xs text-muted-foreground">
                <kbd className="px-1.5 py-0.5 bg-background rounded text-xs border">Doble-click</kbd> para finalizar
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
              <p className="text-xs text-muted-foreground">
                <kbd className="px-1.5 py-0.5 bg-background rounded text-xs border">ESC</kbd> para cancelar
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {hasMinPoints && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2"
            >
              {onCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={onCancel}
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </Button>
              )}
              {onComplete && (
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                  onClick={onComplete}
                  disabled={!isComplete}
                >
                  <Check className="w-4 h-4" />
                  Completar
                </Button>
              )}
            </motion.div>
          )}

          {/* Warning if not enough points */}
          {pointCount > 0 && pointCount < 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-2 mt-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg"
            >
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-600">
                Necesitas al menos 3 puntos para crear un polígono
              </p>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

// Enhanced vertex styles with modern animations and better visual feedback
export const enhancedVertexStyles = `
  /* Main vertex points - Enhanced with gradient and glow */
  .leaflet-vertex-icon {
    background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
    border: 3px solid #3b82f6;
    border-radius: 50%;
    width: 14px !important;
    height: 14px !important;
    margin-left: -7px !important;
    margin-top: -7px !important;
    box-shadow: 
      0 0 0 0 rgba(59, 130, 246, 0.4),
      0 2px 8px rgba(59, 130, 246, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.8);
    cursor: move;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 1000;
  }

  .leaflet-vertex-icon::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background: #3b82f6;
    border-radius: 50%;
    opacity: 0.8;
  }

  .leaflet-vertex-icon:hover {
    transform: scale(1.6);
    border-width: 4px;
    border-color: #2563eb;
    box-shadow: 
      0 0 0 4px rgba(59, 130, 246, 0.2),
      0 4px 16px rgba(59, 130, 246, 0.5),
      inset 0 1px 3px rgba(255, 255, 255, 0.9);
    z-index: 1002 !important;
  }

  .leaflet-vertex-icon:active {
    transform: scale(1.3);
    box-shadow: 
      0 0 0 2px rgba(59, 130, 246, 0.3),
      0 2px 8px rgba(59, 130, 246, 0.4);
  }

  /* Midpoint markers - For adding new vertices */
  .leaflet-editing-icon {
    background: linear-gradient(135deg, #ffffff 0%, #dbeafe 100%);
    border: 2px dashed #60a5fa;
    border-radius: 50%;
    width: 10px !important;
    height: 10px !important;
    margin-left: -5px !important;
    margin-top: -5px !important;
    opacity: 0.6;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 6px rgba(96, 165, 250, 0.2);
  }

  .leaflet-editing-icon:hover {
    opacity: 1;
    transform: scale(1.8);
    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
    border-style: solid;
    border-color: #2563eb;
    box-shadow: 
      0 0 0 3px rgba(59, 130, 246, 0.2),
      0 4px 12px rgba(59, 130, 246, 0.4);
  }

  /* Polygon lines - Enhanced with gradient stroke */
  .leaflet-interactive {
    stroke: #3b82f6;
    stroke-width: 3;
    stroke-opacity: 0.8;
    fill: #3b82f6;
    fill-opacity: 0.15;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.2));
  }

  .leaflet-interactive:hover {
    stroke-width: 4;
    stroke-opacity: 1;
    fill-opacity: 0.25;
    stroke: #2563eb;
    filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3));
  }

  /* Drawing tooltip - Modern card style */
  .leaflet-draw-tooltip {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 2px solid #3b82f6;
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(59, 130, 246, 0.1);
    backdrop-filter: blur(8px);
  }

  .leaflet-draw-tooltip-single {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  }

  /* Pulse animation for first vertex */
  @keyframes vertex-pulse {
    0%, 100% {
      box-shadow: 
        0 0 0 0 rgba(59, 130, 246, 0.4),
        0 2px 8px rgba(59, 130, 246, 0.3);
    }
    50% {
      box-shadow: 
        0 0 0 6px rgba(59, 130, 246, 0.1),
        0 4px 20px rgba(59, 130, 246, 0.6);
    }
  }

  .leaflet-vertex-icon:first-of-type {
    animation: vertex-pulse 2s ease-in-out infinite;
    border-color: #22c55e;
  }

  .leaflet-vertex-icon:first-of-type::before {
    background: #22c55e;
  }

  /* Last vertex - Different color to indicate completion point */
  .leaflet-vertex-icon:last-of-type {
    border-color: #f59e0b;
  }

  .leaflet-vertex-icon:last-of-type::before {
    background: #f59e0b;
  }

  /* Temporary marker while drawing */
  .leaflet-marker-icon.leaflet-draw-tooltip-single {
    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
    border: 3px solid white;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    box-shadow: 
      0 0 0 3px rgba(59, 130, 246, 0.3),
      0 2px 10px rgba(59, 130, 246, 0.5);
    animation: marker-pulse 1.5s ease-in-out infinite;
  }

  @keyframes marker-pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
  }

  /* Completed polygon - Success state */
  .leaflet-interactive.completed {
    stroke: #22c55e;
    fill: #22c55e;
    fill-opacity: 0.2;
  }

  /* Selected polygon - Highlight state */
  .leaflet-interactive.selected {
    stroke: #8b5cf6;
    stroke-width: 4;
    fill: #8b5cf6;
    fill-opacity: 0.25;
    filter: drop-shadow(0 4px 12px rgba(139, 92, 246, 0.4));
  }

  /* Error state */
  .leaflet-interactive.error {
    stroke: #ef4444;
    fill: #ef4444;
    fill-opacity: 0.15;
    animation: error-shake 0.5s ease-in-out;
  }

  @keyframes error-shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
`;
