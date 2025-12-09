import { useAppStore } from "@/store/useAppStore";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sprout, MapPin, Ruler, User, Plus, ChevronDown, ChevronRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { toast } from "sonner";

const FarmDataTab = () => {
    const { profile } = useAuth();
    const parcels = useAppStore((state) => state.parcels);
    const selectedParcel = useAppStore((state) => state.selectedParcel);
    const setSelectedParcel = useAppStore((state) => state.setSelectedParcel);
    const setDrawingMode = useAppStore((state) => state.setDrawingMode);
    const setActiveDrawingTool = useAppStore((state) => state.setActiveDrawingTool);
    const setShowAddFarmDialog = useAppStore((state) => state.setShowAddFarmDialog);

    const [expandedParcels, setExpandedParcels] = useState<Set<string>>(new Set());

    // Calculate total area from all parcels
    const totalArea = useMemo(() => {
        return parcels.reduce((sum, parcel) => sum + parcel.area, 0);
    }, [parcels]);

    const toggleParcelExpansion = (parcelId: string) => {
        const newExpanded = new Set(expandedParcels);
        if (newExpanded.has(parcelId)) {
            newExpanded.delete(parcelId);
        } else {
            newExpanded.add(parcelId);
        }
        setExpandedParcels(newExpanded);
    };

    const handleNewFarm = () => {
        setShowAddFarmDialog(true);
    };

    const handleAddPaddock = (parcel: any) => {
        setSelectedParcel(parcel);
        setDrawingMode('paddock');
        setActiveDrawingTool('polygon');
        toast.info(`Dibuja el potrero dentro de "${parcel.name}"`);
    };

    return (
        <div className="space-y-6">
            {/* User Info */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Información del Usuario
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <User className="w-4 h-4" /> Nombre
                        </span>
                        <span className="font-medium">{profile?.full_name || 'Usuario'}</span>
                    </div>
                    {profile?.company && (
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Empresa
                            </span>
                            <span className="font-medium">{profile.company}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <Ruler className="w-4 h-4" /> Superficie Total
                        </span>
                        <span className="font-medium text-primary">{totalArea.toFixed(2)} ha</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <Layers className="w-4 h-4" /> Predios
                        </span>
                        <Badge variant="secondary">{parcels.length}</Badge>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Parcels Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-500" />
                        Mis Predios ({parcels.length})
                    </h3>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleNewFarm}
                        className="h-8 gap-1"
                    >
                        <Plus className="w-3 h-3" />
                        Nuevo Predio
                    </Button>
                </div>

                {parcels.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="py-8 text-center text-sm text-muted-foreground">
                            <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No hay predios creados</p>
                            <p className="text-xs mt-1">Haz clic en "Nuevo Predio" para comenzar</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-2">
                        {parcels.map((parcel) => {
                            const isExpanded = expandedParcels.has(parcel.id);
                            const isSelected = selectedParcel?.id === parcel.id;

                            return (
                                <Card
                                    key={parcel.id}
                                    className={`transition-all ${isSelected ? 'border-blue-500 border-2 shadow-md' : ''
                                        }`}
                                >
                                    <CardContent className="p-3 space-y-2">
                                        {/* Parcel Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 flex-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0"
                                                    onClick={() => toggleParcelExpansion(parcel.id)}
                                                >
                                                    {isExpanded ? (
                                                        <ChevronDown className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4" />
                                                    )}
                                                </Button>
                                                <div
                                                    className="flex-1 cursor-pointer"
                                                    onClick={() => setSelectedParcel(isSelected ? null : parcel)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-600" />
                                                        <span className="font-semibold text-sm">{parcel.name}</span>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {parcel.area.toFixed(2)} ha
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleAddPaddock(parcel)}
                                                className="h-7 gap-1 text-xs"
                                                disabled={!isSelected}
                                            >
                                                <Plus className="w-3 h-3" />
                                                Potrero
                                            </Button>
                                        </div>

                                        {/* Paddocks List (when expanded) */}
                                        {isExpanded && (
                                            <div className="ml-8 space-y-1 pt-2 border-l-2 border-blue-200 pl-3">
                                                {parcel.paddocks.length === 0 ? (
                                                    <p className="text-xs text-muted-foreground italic">
                                                        Sin potreros
                                                    </p>
                                                ) : (
                                                    parcel.paddocks.map((paddock) => (
                                                        <div
                                                            key={paddock.id}
                                                            className="flex flex-col gap-1 p-2 rounded-md hover:bg-muted/50 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-green-500 border border-green-600" />
                                                                <span className="text-xs font-medium flex-1">
                                                                    {paddock.name}
                                                                </span>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {paddock.area.toFixed(2)} ha
                                                                </Badge>
                                                            </div>
                                                            <div className="ml-4 flex flex-wrap gap-1">
                                                                <Badge variant="secondary" className="text-xs">
                                                                    <Sprout className="w-3 h-3 mr-1" />
                                                                    {paddock.cropType}
                                                                </Badge>
                                                                <Badge variant="outline" className="text-xs">
                                                                    💧 {paddock.irrigationType}
                                                                </Badge>
                                                            </div>
                                                            {paddock.description && (
                                                                <p className="ml-4 text-xs text-muted-foreground italic">
                                                                    {paddock.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FarmDataTab;
