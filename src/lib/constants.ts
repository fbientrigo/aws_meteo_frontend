// Risk colors and metadata
export const RISK_METADATA = {
  drought: {
    emoji: '💧',
    label: 'Drought',
    description: 'Prolonged water deficit',
    color: 'hsl(var(--risk-drought))',
  },
  flooding: {
    emoji: '🌊',
    label: 'Flooding',
    description: 'Excess precipitation',
    color: 'hsl(var(--risk-flooding))',
  },
  erosion: {
    emoji: '🏔️',
    label: 'Erosion',
    description: 'Soil degradation',
    color: 'hsl(var(--risk-erosion))',
  },
  frost: {
    emoji: '❄️',
    label: 'Frost',
    description: 'Below zero temperatures',
    color: 'hsl(var(--risk-frost))',
  },
  heatwave: {
    emoji: '🔥',
    label: 'Heat Wave',
    description: 'Extreme temperatures',
    color: 'hsl(var(--risk-heatwave))',
  },
} as const;

export type RiskType = keyof typeof RISK_METADATA;

// Helper functions
export const getRiskColor = (type: RiskType) => RISK_METADATA[type]?.color || 'hsl(var(--muted))';
export const getRiskEmoji = (type: RiskType) => RISK_METADATA[type]?.emoji || '⚠️';
export const getRiskIcon = getRiskEmoji; // Alias for consistency
export const getRiskName = (type: RiskType) => RISK_METADATA[type]?.label || type;
export const getRiskDescription = (type: RiskType) => RISK_METADATA[type]?.description || '';
