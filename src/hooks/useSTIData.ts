import { useQuery } from '@tanstack/react-query';
import { stiService } from '@/services/stiService';
import { HeatmapPoint } from '@/types';
import { transformToHeatmapPoints } from '@/utils/climatUtils';

interface Bounds {
    lat_min: number;
    lat_max: number;
    lon_min: number;
    lon_max: number;
}

/**
 * Hook to fetch and manage STI data with React Query
 * Automatically caches and refetches data when run/step/bounds change
 */
export const useSTIData = (run: string | null, step: string | null, bounds: Bounds) => {
    return useQuery({
        queryKey: ['sti-data', run, step, bounds],
        queryFn: async () => {
            if (!run || !step) {
                return null;
            }
            console.log(`📥 [useSTIData] Fetching subset for run=${run}, step=${step}...`);
            const data = await stiService.getSTISubset(run, step, bounds);

            // Calculate statistics for normalization
            const stiValues = data.sti;
            const validValues = stiValues.filter(v => !isNaN(v));

            const min = validValues.length > 0 ? Math.min(...validValues) : 0;
            const max = validValues.length > 0 ? Math.max(...validValues) : 1;
            const mean = validValues.length > 0 ? validValues.reduce((a, b) => a + b, 0) / validValues.length : 0;

            console.log("🔍 STI Data Debug:", {
                run,
                step,
                totalPoints: stiValues.length,
                validPoints: validValues.length,
                step,
                totalPoints: stiValues.length,
                validPoints: validValues.length,
                stats: { min, max, mean },
                validSample: validValues.slice(0, 5),
                rawSample: stiValues.slice(0, 5),
                typeOfFirst: typeof stiValues[0]
            });

            // Transform to heatmap points with severity categorization using global min/max
            const points = transformToHeatmapPoints(
                data.latitudes,
                data.longitudes,
                data.sti,
                min,
                max
            );

            return {
                raw: data,
                points,
                stats: { min, max, mean }
            };
        },
        enabled: !!run && !!step,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 2
    });
};

/**
 * Hook to fetch available runs
 */
export const useAvailableRuns = () => {
    return useQuery({
        queryKey: ['sti-runs'],
        queryFn: () => stiService.getRuns(),
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000 // 30 minutes
    });
};

/**
 * Hook to fetch steps for a specific run
 */
export const useRunSteps = (run: string | null) => {
    return useQuery({
        queryKey: ['sti-steps', run],
        queryFn: () => {
            if (!run) return [];
            return stiService.getStepsForRun(run);
        },
        enabled: !!run,
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000
    });
};
