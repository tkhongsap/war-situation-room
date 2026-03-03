export interface SituationData {
  lastUpdated: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'MODERATE' | 'LOW';
  operationName: string;
  bulletPoints: string[];
  keyStats: {
    label: string;
    value: string;
    status: 'critical' | 'warning' | 'alert' | 'normal';
  }[];
}

export const situationData: SituationData = {
  lastUpdated: '2026-03-03T06:00:00Z',
  threatLevel: 'CRITICAL',
  operationName: 'OPERATION SHIELD OF JUDAH',
  bulletPoints: [
    'Coalition forces have conducted precision strikes on 14 identified nuclear and military infrastructure targets across Iran over a 72-hour period.',
    'Strait of Hormuz remains effectively closed — Iranian naval assets deployed across the chokepoint; maritime insurance suspended.',
    'IRGC ballistic missile salvos have struck Tel Aviv (47 intercepted, 3 impacted), Dubai International Airport (closed 48hrs), and Abu Dhabi industrial zone.',
    'US carrier strike groups (CVN-78, CVN-77) are positioned in Arabian Sea and Gulf of Oman; Rules of Engagement escalated to active defensive posture.',
    'UN Security Council emergency session convened — P5 divided; China and Russia vetoed ceasefire resolution; diplomatic track stalled.',
    'Global energy markets in extreme volatility — Brent crude up 35% in 72 hours; tanker insurers invoking war risk exclusions on all Gulf routes.',
  ],
  keyStats: [
    { label: 'OPERATION', value: 'SHIELD OF JUDAH — Day 4', status: 'critical' },
    { label: 'STRIKES CONDUCTED', value: '14 targets confirmed', status: 'critical' },
    { label: 'HORMUZ STATUS', value: 'CLOSED — War Risk Active', status: 'critical' },
    { label: 'RETALIATION', value: 'Active — 3 theaters', status: 'critical' },
    { label: 'DIPLOMATIC STATUS', value: 'Stalled — UNSC deadlocked', status: 'warning' },
    { label: 'US FORCE STATUS', value: '2 CSG deployed, DEFCON 3', status: 'warning' },
  ],
};
