import { Bell, Menu, Settings, User, Loader2, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/store/useAppStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import AddFarmDialog from "./map/AddFarmDialog";
import { UserMenu } from "./auth/UserMenu";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { parcels, selectedParcel, setSelectedParcel, triggerFlyTo, showAddFarmDialog, setShowAddFarmDialog } = useAppStore();
  const [changingFarm, setChangingFarm] = useState(false);

  const handleFarmChange = async (parcelId: string) => {
    const parcel = parcels.find(p => p.id === parcelId);
    if (parcel) {
      setChangingFarm(true);
      toast.loading(`Cambiando a ${parcel.name}...`, { id: 'farm-change' });

      // Simulate loading for smooth UX
      await new Promise(resolve => setTimeout(resolve, 500));

      setSelectedParcel(parcel);

      // Fly to parcel location if it has geometry
      if (parcel.geoJSON) {
        // Calculate centroid or use first point
        // For simplicity, we can just let the map handle the selection change which triggers fitBounds in useFarmLayers
      }

      toast.dismiss('farm-change');
      toast.success(`Predio activo: ${parcel.name}`);
      setChangingFarm(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">S</span>
            </div>
            <span className="font-bold text-lg hidden md:inline-block">SbNAI</span>
          </div>

          <div className="h-6 w-px bg-border mx-2 hidden md:block" />

          {/* Farm Selector - Improved */}
          <div className="hidden md:flex items-center gap-2" data-tour="farm-selector">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <Select
              value={selectedParcel?.id}
              onValueChange={handleFarmChange}
              disabled={changingFarm || parcels.length === 0}
            >
              <SelectTrigger className="w-[220px] h-9">
                {changingFarm ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Cargando...</span>
                  </div>
                ) : (
                  <SelectValue placeholder={parcels.length === 0 ? "Sin predios" : "Seleccionar Predio"} />
                )}
              </SelectTrigger>
              <SelectContent>
                {parcels.map((parcel) => (
                  <SelectItem key={parcel.id} value={parcel.id}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span>{parcel.name}</span>
                      <span className="text-xs text-muted-foreground">({parcel.area} ha)</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-9"
              onClick={() => setShowAddFarmDialog(true)}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden lg:inline">Nuevo Predio</span>
            </Button>
          </div>

          {/* Info text for search */}
          <div className="hidden lg:flex items-center gap-2 ml-auto mr-4">
            <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border border-border/50">
              💡 Usa el buscador en el mapa para encontrar ubicaciones
            </div>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>
          <UserMenu />
        </div>
      </header>

      {/* Add Farm Dialog */}
      <AddFarmDialog open={showAddFarmDialog} onOpenChange={setShowAddFarmDialog} />
    </div>
  );
};

export default Header;

