'use client';

import { useAnalysisContext } from '@/contexts/AnalysisContext';
import { SituationBriefSkeleton } from '@/components/AnalysisSkeleton';
import { situationData as fallbackSituationData } from '@/config/situation-data';
import { Shield, AlertTriangle, Clock } from 'lucide-react';

const threatColors = {
  CRITICAL: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500/15 text-red-300 border-red-500/30', glow: 'glow-red' },
  HIGH: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30', glow: 'glow-amber' },
  ELEVATED: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', badge: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30', glow: 'glow-amber' },
  MODERATE: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30', glow: 'glow-cyan' },
  LOW: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', badge: 'bg-green-500/15 text-green-300 border-green-500/30', glow: 'glow-green' },
};

const statStatusColors: Record<string, string> = {
  critical: 'text-red-400 glow-red',
  warning: 'text-orange-400',
  alert: 'text-yellow-400',
  normal: 'text-gray-300',
};

export default function SituationBrief() {
  const { data, loading } = useAnalysisContext();

  if (loading && !data) return <SituationBriefSkeleton />;

  const situationData = data?.situationData ?? fallbackSituationData;
  const colors = threatColors[situationData.threatLevel];
  const updateDate = new Date(situationData.lastUpdated);

  return (
    <div className="panel h-full flex flex-col overflow-hidden" style={{ borderColor: `var(--threat-border)` }}>
      {/* Header */}
      <div className="panel-header px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className={`w-3.5 h-3.5 ${colors.text}`} />
          <span className="type-display text-[11px] text-gray-300">Situation Brief</span>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm border ${colors.badge} font-mono text-[10px] font-bold tracking-[0.15em]`}>
          <AlertTriangle className="w-2.5 h-2.5" />
          <span className={colors.glow}>{situationData.threatLevel}</span>
        </div>
      </div>

      {/* Operation Name */}
      <div className={`${colors.bg} px-5 py-3`} style={{ borderBottom: '1px solid rgba(30, 55, 85, 0.3)' }}>
        <div className="type-label mb-0.5">Operation</div>
        <div className={`font-mono text-sm font-bold ${colors.text} tracking-wider ${colors.glow}`}>
          {situationData.operationName}
        </div>
      </div>

      {/* Key Stats */}
      <div className="px-5 py-3.5 grid grid-cols-2 gap-3" style={{ borderBottom: '1px solid rgba(30, 55, 85, 0.25)' }}>
        {situationData.keyStats.map((stat, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            <span className="type-label" style={{ fontSize: '9px' }}>{stat.label}</span>
            <span className={`font-mono text-[11px] font-medium ${statStatusColors[stat.status]} leading-tight`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Bullet Points */}
      <div className="flex-1 overflow-y-auto px-5 py-3.5 space-y-3">
        {situationData.bulletPoints.map((point, i) => (
          <div key={i} className="flex gap-2.5">
            <span className={`text-[10px] ${colors.text} mt-0.5 flex-shrink-0`}>&#9656;</span>
            <p className="text-[12px] text-gray-400 leading-relaxed type-body">{point}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 flex items-center gap-2" style={{ borderTop: '1px solid rgba(30, 55, 85, 0.2)' }}>
        <Clock className="w-2.5 h-2.5 text-gray-600" />
        <span className="type-label font-mono" style={{ fontSize: '8px' }}>
          Brief updated: {updateDate.toUTCString()}
        </span>
      </div>
    </div>
  );
}
