import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Layers, ThermometerSun, Snowflake, Grid } from "lucide-react";

interface VisualizationControlsProps {
    showTempIndex: boolean;
    setShowTempIndex: (show: boolean) => void;
    showExtremeHeat: boolean;
    setShowExtremeHeat: (show: boolean) => void;
    showExtremeCold: boolean;
    setShowExtremeCold: (show: boolean) => void;
    showDebugGrid: boolean;
    setShowDebugGrid: (show: boolean) => void;
    debugModeAvailable: boolean;
}

const VisualizationControls = ({
    showTempIndex,
    setShowTempIndex,
    showExtremeHeat,
    setShowExtremeHeat,
    showExtremeCold,
    setShowExtremeCold,
    showDebugGrid,
    setShowDebugGrid,
    debugModeAvailable
}: VisualizationControlsProps) => {
    return (
        <Card className="absolute bottom-24 right-4 z-[400] bg-white/95 backdrop-blur shadow-lg border-white/20 p-3 flex gap-4 rounded-full items-center">

            <div className="flex items-center space-x-2 border-r pr-4 border-gray-200">
                <Layers className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Capas:</span>
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="v-temp"
                    checked={showTempIndex}
                    onCheckedChange={(c) => setShowTempIndex(!!c)}
                />
                <Label htmlFor="v-temp" className="text-sm cursor-pointer flex items-center gap-1">
                    🌡️ Temp
                </Label>
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="v-heat"
                    checked={showExtremeHeat}
                    onCheckedChange={(c) => setShowExtremeHeat(!!c)}
                />
                <Label htmlFor="v-heat" className="text-sm cursor-pointer flex items-center gap-1 text-orange-600 font-medium">
                    <ThermometerSun className="h-3 w-3" /> Calor Extremo
                </Label>
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="v-cold"
                    checked={showExtremeCold}
                    onCheckedChange={(c) => setShowExtremeCold(!!c)}
                />
                <Label htmlFor="v-cold" className="text-sm cursor-pointer flex items-center gap-1 text-blue-600 font-medium">
                    <Snowflake className="h-3 w-3" /> Frío Extremo
                </Label>
            </div>

            {debugModeAvailable && (
                <div className="flex items-center space-x-2 border-l pl-4 border-gray-200 ml-2">
                    <Checkbox
                        id="v-debug"
                        checked={showDebugGrid}
                        onCheckedChange={(c) => setShowDebugGrid(!!c)}
                    />
                    <Label htmlFor="v-debug" className="text-xs cursor-pointer flex items-center gap-1 text-gray-500 font-mono">
                        <Grid className="h-3 w-3" /> Debug Grid
                    </Label>
                </div>
            )}
        </Card>
    );
};

export default VisualizationControls;
