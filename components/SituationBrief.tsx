import { situationData } from '@/config/situation-data';
import { Shield, AlertTriangle, Clock } from 'lucide-react';

const threatColors = {
  CRITICAL: { bg: 'bg-red-500/15', border: 'border-red-500/40', text: 'text-red-400', badge: 'bg-red-500/20 text-red-300 border-red-500/40' },
  HIGH: { bg: 'bg-orange-500/15', border: 'border-orange-500/40', text: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
  ELEVATED: { bg: 'bg-yellow-500/15', border: 'border-yellow-500/40', text: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
  MODERATE: { bg: 'bg-blue-500/15', border: 'border-blue-500/40', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  LOW: { bg: 'bg-green-500/15', border: 'border-green-500/40', text: 'text-green-400', badge: 'bg-green-500/20 text-green-300 border-green-500/40' },
};

const statStatusColors = {
  critical: 'text-red-400',
  warning: 'text-orange-400',
  alert: 'text-yellow-400',
  normal: 'text-gray-300',
};

export default function SituationBrief() {
  const colors = threatColors[situationData.threatLevel];
  const updateDate = new Date(situationData.lastUpdated);

  return (
    <div className={`h-full flex flex-col border ${colors.border} bg-[#07090f] rounded-sm overflow-hidden`}>
      {/* Header */}
      <div className={`border-b ${colors.border} px-5 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Shield className={`w-3.5 h-3.5 ${colors.text}`} />
          <span className="text-[12px] font-semibold text-gray-300 tracking-[0.13em] uppercase">
            Situation Brief
          </span>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border ${colors.badge} text-[10px] font-bold tracking-widest`}>
          <AlertTriangle className="w-2.5 h-2.5" />
          {situationData.threatLevel}
        </div>
      </div>

      {/* Operation Name */}
      <div className={`border-b ${colors.border} px-5 py-3 ${colors.bg}`}>
        <div className="text-[10px] text-gray-500 tracking-widest uppercase mb-0.5">Operation</div>
        <div className={`text-sm font-bold ${colors.text} tracking-wider`}>
          {situationData.operationName}
        </div>
      </div>

      {/* Key Stats */}
      <div className="border-b border-[#1a2a3a] px-5 py-3.5 grid grid-cols-2 gap-3">
        {situationData.keyStats.map((stat, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-600 uppercase tracking-widest leading-none">{stat.label}</span>
            <span className={`text-[11px] font-medium ${statStatusColors[stat.status]} leading-tight`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Bullet Points */}
      <div className="flex-1 overflow-y-auto px-5 py-3.5 space-y-3">
        {situationData.bulletPoints.map((point, i) => (
          <div key={i} className="flex gap-2.5">
            <span className={`text-[10px] ${colors.text} mt-0.5 flex-shrink-0`}>&#9656;</span>
            <p className="text-[12px] text-gray-400 leading-relaxed">{point}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-[#1a2a3a] px-5 py-2.5 flex items-center gap-2">
        <Clock className="w-2.5 h-2.5 text-gray-600" />
        <span className="text-[9px] text-gray-600 tracking-wide">
          Brief updated: <span className="font-mono">{updateDate.toUTCString()}</span>
        </span>
      </div>
    </div>
  );
}
