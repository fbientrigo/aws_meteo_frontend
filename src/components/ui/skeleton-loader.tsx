import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Map } from "lucide-react";

export const MetricsSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i} className="p-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export const RiskListSkeleton = () => (
  <div className="space-y-2 p-5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Card key={i} className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2 w-full mt-2" />
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export const MapSkeleton = () => (
  <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-card mx-auto mb-4 flex items-center justify-center animate-bounce">
        <Map className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground font-medium">Cargando mapa...</p>
      <p className="text-xs text-muted-foreground mt-2">Esto puede tomar unos segundos</p>
    </div>
  </div>
);
