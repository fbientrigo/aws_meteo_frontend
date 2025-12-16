import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Sprout, Map, X, History, Sparkles } from "lucide-react";
import FarmDataTab from "./sidebar/FarmDataTab";
import NewRisksTab from "./sidebar/NewRisksTab";
import NewSolutionsTab from "./sidebar/NewSolutionsTab";
import HistoryTab from "./sidebar/HistoryTab";
import SidebarChatTab from "./sidebar/SidebarChatTab";
import { ExportPDFButton } from "@/components/export/ExportPDF";

interface SidebarProps {
  onClose: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Sidebar Header */}
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Panel de Control</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex gap-2"
            title="Verificar Conexión y Datos"
            onClick={async () => {
              try {
                const { stiService } = await import('@/services/stiService');
                const { toast } = await import('sonner');
                const { useAppStore } = await import('@/store/useAppStore');

                const url = import.meta.env.VITE_STI_API_URL;
                toast.info(`Probando conexión a: ${url}...`);

                try {
                  const health = await fetch(`${url}/health`).catch(e => { throw new Error(e.message) });
                  if (!health.ok) throw new Error(`Health status: ${health.status}`);
                  toast.success("Health Check: OK");
                } catch (e: any) {
                  toast.error(`Error de Red: ${e.message}`);
                  return;
                }

                const runs = await stiService.getRuns();

                if (runs && runs.length > 0) {
                  toast.success(`Runs: ${runs.join(', ')}`);

                  const latestRun = runs[0];
                  useAppStore.getState().setSelectedRun(latestRun);

                  const steps = await stiService.getStepsForRun(latestRun);
                  if (steps && steps.length > 0) {
                    useAppStore.getState().setSelectedStep(steps[0]);
                    toast.success(`Cargando run: ${latestRun}`);
                  }
                } else {
                  toast.warning('No runs available');
                }
              } catch (e: any) {
                console.error(e);
                const { toast } = await import('sonner');
                toast.error(`Error: ${e.message}`);
              }
            }}
          >
            <span className="text-xs">🛰️ TEST</span>
          </Button>
          <ExportPDFButton />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Tabs con iconos */}
      <Tabs defaultValue="farm" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full grid grid-cols-5 p-1 bg-muted rounded-none flex-shrink-0 sticky top-0 z-10 border-b border-border h-auto">
          <TabsTrigger
            value="farm"
            data-tour="farm-tab"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-md py-2.5 h-auto transition-all px-0"
          >
            <div className="flex flex-col items-center gap-1.5">
              <Map className="w-4 h-4" />
              <span className="text-[10px] font-medium">Datos</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="risks"
            data-tour="risks-tab"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-md py-2.5 h-auto transition-all px-0"
          >
            <div className="flex flex-col items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-[10px] font-medium">Riesgos</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="solutions"
            data-tour="solutions-tab"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-md py-2.5 h-auto transition-all px-0"
          >
            <div className="flex flex-col items-center gap-1.5">
              <Sprout className="w-4 h-4" />
              <span className="text-[10px] font-medium">Soluciones</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            data-tour="history-tab"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-md py-2.5 h-auto transition-all px-0"
          >
            <div className="flex flex-col items-center gap-1.5">
              <History className="w-4 h-4" />
              <span className="text-[10px] font-medium">Historial</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            data-tour="chat-tab"
            className="data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-md py-2.5 h-auto transition-all px-0"
          >
            <div className="flex flex-col items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-medium">Chat IA</span>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Contenido con scroll optimizado */}
        <div className="flex-1 overflow-y-auto bg-background/50">
          <TabsContent value="farm" className="m-0 p-5 h-full">
            <FarmDataTab />
          </TabsContent>

          <TabsContent value="risks" className="m-0 p-5 h-full">
            <NewRisksTab />
          </TabsContent>

          <TabsContent value="solutions" className="m-0 p-5 h-full">
            <NewSolutionsTab />
          </TabsContent>

          <TabsContent value="history" className="m-0 p-5 h-full">
            <HistoryTab />
          </TabsContent>

          <TabsContent value="chat" className="m-0 p-5 h-full">
            <SidebarChatTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Sidebar;
