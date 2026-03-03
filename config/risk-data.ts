export interface RiskCategory {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  trend: 'up' | 'down' | 'stable';
  description: string;
  impacts: string[];
}

export const riskCategories: RiskCategory[] = [
  {
    id: 'energy',
    name: 'Energy & Fuel Costs',
    level: 5,
    trend: 'up',
    description: 'Brent crude +35% in 72 hours. Hormuz closure removes 20% of global oil supply from market.',
    impacts: ['Fuel surcharges escalating across all transport modes', 'Electricity price spikes in oil-dependent markets'],
  },
  {
    id: 'shipping',
    name: 'Shipping & Logistics',
    level: 5,
    trend: 'up',
    description: 'Hormuz effectively closed. All Gulf shipping rerouting via Cape of Good Hope adds 14-21 days transit.',
    impacts: ['Container freight rates +80-150% on Gulf routes', 'War risk insurance premiums unaffordable for most operators'],
  },
  {
    id: 'packaging',
    name: 'Packaging Materials',
    level: 4,
    trend: 'up',
    description: 'Aluminum up 18%, glass energy costs spiking. Supply chain disruptions hitting packaging manufacturers.',
    impacts: ['PET resin prices +12% on energy cost pass-through', 'Aluminum can surcharges from major suppliers'],
  },
  {
    id: 'raw-materials',
    name: 'Raw Materials',
    level: 3,
    trend: 'up',
    description: 'Agricultural commodities moderately disrupted. Wheat and sugar seeing price pressure from shipping cost escalation.',
    impacts: ['Palm oil shipping delays from Southeast Asia', 'Sugar freight costs +40% via Cape route'],
  },
  {
    id: 'currency',
    name: 'Currency Exposure',
    level: 4,
    trend: 'up',
    description: 'USD strengthening sharply as safe-haven demand surges. Emerging market currencies under pressure.',
    impacts: ['THB weakening against USD — import cost inflation', 'EUR and JPY volatility creating hedging challenges'],
  },
  {
    id: 'consumer',
    name: 'Consumer Demand',
    level: 2,
    trend: 'stable',
    description: 'Consumer confidence declining in conflict-exposed markets but domestic demand resilient short-term.',
    impacts: ['Premium segment softening in Middle East markets', 'Travel & hospitality exposure elevated'],
  },
];

export const compositeRiskScore = 4.2;
export const compositeRiskLabel = 'HIGH';
