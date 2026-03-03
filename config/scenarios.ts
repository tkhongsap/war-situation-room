export interface ScenarioImpact {
  label: string;
  value: string;
  direction: 'up' | 'down' | 'neutral';
}

export interface Scenario {
  id: string;
  name: string;
  probability: number;
  variant: 'base' | 'escalation' | 'deescalation';
  description: string;
  timeline: string;
  impacts: ScenarioImpact[];
}

export const scenarios: Scenario[] = [
  {
    id: 'base',
    name: 'BASE CASE',
    probability: 55,
    variant: 'base',
    timeline: '2-4 Weeks',
    description: 'Hormuz remains partially restricted with intermittent closures. Conflict contained to current theater with no expansion to Saudi Arabia or broader GCC. Limited diplomatic engagement begins via back-channels.',
    impacts: [
      { label: 'Energy Costs', value: '+15% to +25%', direction: 'up' },
      { label: 'Freight Rates', value: '+30% to +50%', direction: 'up' },
      { label: 'Raw Materials', value: '+8% to +15%', direction: 'up' },
      { label: 'FX Impact (USD/THB)', value: '+2% to +4%', direction: 'up' },
    ],
  },
  {
    id: 'escalation',
    name: 'ESCALATION',
    probability: 30,
    variant: 'escalation',
    timeline: '1-3 Months',
    description: 'Full Hormuz closure sustained. Conflict expands with strikes on Saudi Aramco infrastructure. US ground operations commence. Global recession risk elevated significantly.',
    impacts: [
      { label: 'Energy Costs', value: '+40% to +80%', direction: 'up' },
      { label: 'Freight Rates', value: '+100% to +200%', direction: 'up' },
      { label: 'Raw Materials', value: '+20% to +40%', direction: 'up' },
      { label: 'FX Impact (USD/THB)', value: '+6% to +12%', direction: 'up' },
    ],
  },
  {
    id: 'deescalation',
    name: 'DE-ESCALATION',
    probability: 15,
    variant: 'deescalation',
    timeline: '2 Weeks',
    description: 'Ceasefire brokered via Qatari/Omani mediation within 2 weeks. Iran stands down naval assets. Hormuz reopens progressively. Markets begin pricing in normalization.',
    impacts: [
      { label: 'Energy Costs', value: '-8% to -12%', direction: 'down' },
      { label: 'Freight Rates', value: 'Normalize 4-6 weeks', direction: 'down' },
      { label: 'Raw Materials', value: '-3% to -6%', direction: 'down' },
      { label: 'FX Impact (USD/THB)', value: '-1% to -2%', direction: 'down' },
    ],
  },
];
