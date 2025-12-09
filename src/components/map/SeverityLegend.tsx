import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SEVERITY_COLORS, SEVERITY_LABELS } from '@/utils/climatUtils';
import { SeverityLevel } from '@/types';

/**
 * Severity Legend Component
 * Displays the 5-level traffic light system legend for climate indices
 */
export const SeverityLegend = () => {
    const levels: SeverityLevel[] = [
        'VERY_LOW',
        'LOW',
        'MODERATE',
        'HIGH',
        'VERY_HIGH'
    ];

    return (
        <div className="absolute bottom-4 right-4 z-[1000] pointer-events-none">
            <Card className="bg-background/95 backdrop-blur-sm shadow-lg border-border pointer-events-auto">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">
                        Nivel de Riesgo
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5">
                    {levels.map((level) => (
                        <div key={level} className="flex items-center gap-2">
                            <div
                                className="w-6 h-4 rounded border border-border/50"
                                style={{ backgroundColor: SEVERITY_COLORS[level] }}
                            />
                            <span className="text-xs font-medium text-foreground/90">
                                {SEVERITY_LABELS[level]}
                            </span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default SeverityLegend;
