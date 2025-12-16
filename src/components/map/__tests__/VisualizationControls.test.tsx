import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VisualizationControls from '../VisualizationControls';

describe('VisualizationControls', () => {
    const defaultProps = {
        showTempIndex: true,
        setShowTempIndex: vi.fn(),
        showExtremeHeat: false,
        setShowExtremeHeat: vi.fn(),
        showExtremeCold: false,
        setShowExtremeCold: vi.fn(),
        showDebugGrid: false,
        setShowDebugGrid: vi.fn(),
        debugModeAvailable: true
    };

    it('renders all checkboxes', () => {
        render(<VisualizationControls {...defaultProps} />);

        expect(screen.getByLabelText(/Temp/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Calor Extremo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Frío Extremo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Debug Grid/i)).toBeInTheDocument();
    });

    it('hides debug grid when not available', () => {
        render(<VisualizationControls {...defaultProps} debugModeAvailable={false} />);

        expect(screen.getByLabelText(/Temp/i)).toBeInTheDocument();
        expect(screen.queryByLabelText(/Debug Grid/i)).not.toBeInTheDocument();
    });

    it('calls handlers when toggled', () => {
        render(<VisualizationControls {...defaultProps} />);

        const heatCheckbox = screen.getByLabelText(/Calor Extremo/i);
        fireEvent.click(heatCheckbox);

        expect(defaultProps.setShowExtremeHeat).toHaveBeenCalledTimes(1);
    });
});
