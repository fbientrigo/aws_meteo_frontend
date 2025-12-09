import { useAppStore } from "@/store/useAppStore";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const RISK_COLORS = {
    1: "bg-emerald-500", // Muy Bajo
    2: "bg-lime-500",    // Bajo
    3: "bg-amber-400",   // Moderado
    4: "bg-orange-500",  // Alto
    5: "bg-red-500"      // Muy Alto
};

const RISK_LABELS = {
    1: "Muy Bajo",
    2: "Bajo",
    3: "Moderado",
    4: "Alto",
    5: "Muy Alto"
};

const NewRisksTab = () => {
    const farmRisks = useAppStore((state) => state.farmRisks);
    const activeRisks = useAppStore((state) => state.activeRisks);
    const toggleRisk = useAppStore((state) => state.toggleRisk);
    const selectedParcel = useAppStore((state) => state.selectedParcel);
    const selectedFarm = useAppStore((state) => state.selectedFarm);

    // Show controls if either a parcel or a farm is selected (as fallback)
    const hasSelection = !!selectedParcel || !!selectedFarm;

    if (!hasSelection) {
        return (
            <div className="flex flex-col items-center justify-center h-40 text-center p-4 text-muted-foreground">
                <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Selecciona un predio en el mapa para ver los análisis de riesgo.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 3.1 Capas de Riesgo (Switches) */}
            <Card className="bg-card border-border">
                <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm">Capas de Riesgo</h3>
                        <span className="text-xs text-muted-foreground">
                            {activeRisks.length} activas
                        </span>
                    </div>

                    <div className="space-y-3">
                        {farmRisks.map((risk) => {
                            const isActive = activeRisks.includes(risk.id as any);
                            return (
                                <div key={risk.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={isActive}
                                            onCheckedChange={() => toggleRisk(risk.id as any)}
                                            id={`risk-switch-${risk.id}`}
                                        />
                                        <label
                                            htmlFor={`risk-switch-${risk.id}`}
                                            className="text-sm font-medium cursor-pointer flex items-center gap-2"
                                        >
                                            <span>{risk.icon}</span>
                                            {risk.name}
                                        </label>
                                    </div>

                                    {/* Risk Level Indicator (Bar) */}
                                    <div className="flex items-center gap-2" title={`Nivel de riesgo: ${risk.level}/5`}>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((lvl) => (
                                                <div
                                                    key={lvl}
                                                    className={`w-1.5 h-3 rounded-sm ${lvl <= risk.level
                                                            ? RISK_COLORS[risk.level as keyof typeof RISK_COLORS]
                                                            : 'bg-muted'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* 3.2 Detalles de Riesgo (Accordion) */}
            <div className="space-y-4">
                <h3 className="font-semibold text-base">Detalles del Análisis</h3>

                <Accordion type="single" collapsible className="w-full space-y-3">
                    {farmRisks.map((risk) => (
                        <AccordionItem key={risk.id} value={risk.id} className="border rounded-lg bg-card px-3">
                            <AccordionTrigger className="hover:no-underline py-3">
                                <div className="flex items-center justify-between w-full pr-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{risk.icon}</span>
                                        <span className="font-medium">{risk.name}</span>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`${RISK_COLORS[risk.level as keyof typeof RISK_COLORS]} text-white border-none`}
                                    >
                                        {RISK_LABELS[risk.level as keyof typeof RISK_LABELS]}
                                    </Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-1 pb-4 space-y-4">
                                {/* Sub-índices */}
                                <div className="space-y-3 pl-2 border-l-2 border-muted ml-2">
                                    {risk.indices.map((index) => (
                                        <div key={index.id} className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-medium">{index.name}</span>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Info className="w-3.5 h-3.5 text-muted-foreground" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="max-w-xs text-xs">{index.description}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                                <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${RISK_COLORS[index.level as keyof typeof RISK_COLORS]}`}>
                                                    Nivel {index.level}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground pl-5">
                                                <span>Valor actual: {index.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* Leyenda Simple */}
            <div className="pt-4 border-t">
                <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Niveles de Riesgo</h4>
                <div className="flex justify-between gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                        <div key={level} className="flex flex-col items-center gap-1 flex-1">
                            <div className={`w-full h-1.5 rounded-full ${RISK_COLORS[level as keyof typeof RISK_COLORS]}`} />
                            <span className="text-[10px] text-muted-foreground">{level}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-1">
                    <span>Bajo</span>
                    <span>Alto</span>
                </div>
            </div>
        </div>
    );
};

export default NewRisksTab;
