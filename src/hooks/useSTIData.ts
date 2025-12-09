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
            const data = await stiService.getSTISubset(run, step, bounds);

            // Transform to heatmap points with severity categorization
            const points = transformToHeatmapPoints(
                data.latitudes,
                data.longitudes,
                data.sti
            );

            return {
                raw: data,
                points
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
