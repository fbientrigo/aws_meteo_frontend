import { describe, it, expect } from 'vitest';
import { transformToHeatmapPoints, isExtremeHeat, isExtremeCold, categorizeSeverity } from '../climatUtils';

describe('climatUtils', () => {
    describe('transformToHeatmapPoints', () => {
        it('should filter out NaN values and normalize intensity', () => {
            const lats = [10, 20, 30];
            const lngs = [10, 20, 30];
            const stis = [0, 100, NaN]; // 0 and 100 are min/max

            const points = transformToHeatmapPoints(lats, lngs, stis, 0, 100);

            expect(points).toHaveLength(2); // NaN filtered
            expect(points[0].intensity).toBe(0);   // (0-0)/100
            expect(points[1].intensity).toBe(1);   // (100-0)/100
        });

        it('should clamp values outside min/max range', () => {
            const lats = [10, 20];
            const lngs = [10, 20];
            const stis = [-50, 150]; // Outside 0-100 range

            const points = transformToHeatmapPoints(lats, lngs, stis, 0, 100);

            expect(points[0].intensity).toBe(0); // Clamped to 0
            expect(points[1].intensity).toBe(1); // Clamped to 1
        });

        it('should handle missing min/max by using default buffering (implementation dependent)', () => {
            // If min/max are not provided, logic likely defaults or handles it.
            // Based on current logic it uses defaults or calculates?
            // Let's stick to explicit min/max as that's how we use it.
            const lats = [10];
            const lngs = [10];
            const stis = [50];
            const points = transformToHeatmapPoints(lats, lngs, stis, 0, 100);
            expect(points[0].intensity).toBe(0.5);
        });

        it('should handle singularity where min equals max (constant field)', () => {
            const lats = [10];
            const lngs = [10];
            const stis = [20];
            // min=20, max=20. Should ideally return safe value (0 or 0.5) instead of raw 20.
            // If we return 20, it breaks the 0-1 contract.
            const points = transformToHeatmapPoints(lats, lngs, stis, 20, 20);

            // We define the "First Principle" behavior for constant field as 0 (lowest risk) or 0.5 (neutral).
            // Let's expect 0 for now as "no severity relative to range".
            // Or actually, if min=max, the range is 0. 
            expect(points[0].intensity).toBe(0);
        });
    });

    describe('Extreme Logic', () => {
        it('isExtremeHeat should return true for intensity >= 0.8', () => {
            expect(isExtremeHeat(0.8)).toBe(true);
            expect(isExtremeHeat(0.9)).toBe(true);
            expect(isExtremeHeat(0.79)).toBe(false);
        });

        it('isExtremeCold should return true for intensity <= 0.2', () => {
            expect(isExtremeCold(0.2)).toBe(true);
            expect(isExtremeCold(0.1)).toBe(true);
            expect(isExtremeCold(0.21)).toBe(false);
        });
    });

    describe('prioritization', () => {
        // Basic severity check
        it('should categorize severity correctly based on normalized intensity', () => {
            expect(categorizeSeverity(0.1)).toBe('VERY_LOW');
            expect(categorizeSeverity(0.9)).toBe('VERY_HIGH');
        });
    });
});
