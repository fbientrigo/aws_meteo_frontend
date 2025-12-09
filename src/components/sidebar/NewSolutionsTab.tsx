import { Card, CardContent } from "@/components/ui/card";
import { Sprout, Construction } from "lucide-react";

const NewSolutionsTab = () => {
    return (
        <div className="space-y-6">
            <div className="text-center py-10 space-y-4">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Sprout className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Soluciones Basadas en Naturaleza</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                        Las recomendaciones personalizadas para mitigar los riesgos detectados estarán disponibles próximamente.
                    </p>
                </div>

                <Card className="mt-8 bg-muted/30 border-dashed">
                    <CardContent className="p-6 flex flex-col items-center gap-3 text-muted-foreground">
                        <Construction className="w-6 h-6" />
                        <span className="text-sm font-medium">En desarrollo</span>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default NewSolutionsTab;
