import { STIDataResponse } from '@/types';
import {
    getMockRuns,
    getMockSteps,
    generateMockSTIData
} from '@/data/mockClimatData';

/**
 * STI Service - Handles interaction with STI/SEPI API
 * Currently using mock data for demonstration
 */

const API_BASE_URL = import.meta.env.VITE_STI_API_URL || '';
const USE_MOCK = !API_BASE_URL || API_BASE_URL === '';

/**
 * Get list of available runs
 */
export const getRuns = async (): Promise<string[]> => {
    if (USE_MOCK) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return getMockRuns();
    }

    try {
        const response = await fetch(`${API_BASE_URL}/sti/runs`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching runs:', error);
        throw error;
    }
};

/**
 * Get forecast steps for a specific run
 */
export const getStepsForRun = async (run: string): Promise<string[]> => {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 200));
        return getMockSteps();
    }

    try {
        const response = await fetch(`${API_BASE_URL}/sti/${run}/steps`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching steps for run ${run}:`, error);
        throw error;
    }
};

/**
 * Get STI data subset for a specific region
 */
export const getSTISubset = async (
    run: string,
    step: string,
    bounds: {
        lat_min: number;
        lat_max: number;
        lon_min: number;
        lon_max: number;
    }
): Promise<STIDataResponse> => {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateMockSTIData(
            run,
            step,
            bounds.lat_min,
            bounds.lat_max,
            bounds.lon_min,
            bounds.lon_max
        );
    }

    try {
        const params = new URLSearchParams({
            lat_min: bounds.lat_min.toString(),
            lat_max: bounds.lat_max.toString(),
            lon_min: bounds.lon_min.toString(),
            lon_max: bounds.lon_max.toString()
        });

        const response = await fetch(
            `${API_BASE_URL}/sti/${run}/${step}/subset?${params}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching STI subset for run ${run}, step ${step}:`, error);
        throw error;
    }
};

/**
 * Get SEPI data subset (placeholder for future implementation)
 */
export const getSEPISubset = async (
    run: string,
    step: string,
    bounds: {
        lat_min: number;
        lat_max: number;
        lon_min: number;
        lon_max: number;
    }
): Promise<STIDataResponse> => {
    // SEPI not yet implemented - return STI data as placeholder
    console.warn('SEPI not yet available, returning STI data');
    return getSTISubset(run, step, bounds);
};

export const stiService = {
    getRuns,
    getStepsForRun,
    getSTISubset,
    getSEPISubset
};
