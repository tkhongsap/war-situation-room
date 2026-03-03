// Shared TypeScript interfaces for AI analysis pipeline

export interface Bluf {
  keyChange: string;
  impact: string;
  watch: string;
}

export interface KeyStat {
  label: string;
  value: string;
  status: 'critical' | 'warning' | 'alert' | 'normal';
}

export interface SituationData {
  lastUpdated: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'MODERATE' | 'LOW';
  operationName: string;
  executiveSummary: string;
  bluf: Bluf;
  bulletPoints: string[];
  keyStats: KeyStat[];
}

export interface RiskCategory {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  trend: 'up' | 'down' | 'stable';
  description: string;
  impacts: string[];
}

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

export interface StrategicAction {
  action: string;
  priority: 'CRITICAL' | 'HIGH' | 'MODERATE';
  rationale: string;
}

export interface StrategicActionPhase {
  phase: 'immediate' | 'short-term' | 'medium-term';
  timeframe: string;
  actions: StrategicAction[];
}

export interface AnalysisMeta {
  generatedAt: string;
  expiresAt: string;
  model: string;
  stale?: boolean;
  dataInputs: {
    commodities: number;
    forex: number;
    headlines: number;
  };
}

export interface AnalysisResponse {
  situationData: SituationData;
  riskCategories: RiskCategory[];
  compositeRiskScore: number;
  compositeRiskLabel: string;
  scenarios: Scenario[];
  strategicActions: StrategicActionPhase[];
  meta: AnalysisMeta;
}
