import { riskCategories, compositeRiskScore, compositeRiskLabel } from '@/config/risk-data';
import { TrendingUp, TrendingDown, Minus, AlertOctagon } from 'lucide-react';

const riskConfig = {
  5: { label: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', bar: 'bg-red-500' },
  4: { label: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', bar: 'bg-orange-500' },
  3: { label: 'ELEVATED', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', bar: 'bg-yellow-500' },
  2: { label: 'MODERATE', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', bar: 'bg-blue-500' },
  1: { label: 'LOW', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', bar: 'bg-green-500' },
} as const;

export default function SupplyChainRisk() {
  const compositeConfig = compositeRiskScore >= 4.5 ? riskConfig[5] : compositeRiskScore >= 3.5 ? riskConfig[4] : riskConfig[3];

  return (
    <div className="bg-[#07090f] border border-[#1a2a3a] rounded-sm overflow-hidden h-full">
      {/* Header */}
      <div className="border-b border-[#1a2a3a] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-3.5 h-3.5 text-orange-400" />
          <h2 className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-[0.15em]">
            Supply Chain Risk Assessment
          </h2>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded border ${compositeConfig.border} ${compositeConfig.bg}`}>
          <span className="text-[10px] font-mono text-gray-500">COMPOSITE</span>
          <span className={`text-lg font-mono font-bold ${compositeConfig.color} tabular-nums`}>{compositeRiskScore.toFixed(1)}</span>
          <span className={`text-[10px] font-mono font-bold ${compositeConfig.color} tracking-widest`}>{compositeRiskLabel}</span>
        </div>
      </div>

      {/* Risk Categories Grid */}
      <div className="p-4 grid grid-cols-2 lg:grid-cols-3 gap-3">
        {riskCategories.map((cat) => {
          const config = riskConfig[cat.level];
          return (
            <div key={cat.id} className={`rounded-sm border ${config.border} ${config.bg} p-3`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none mb-1">{cat.name}</div>
                  <div className={`text-xs font-mono font-bold ${config.color} tracking-widest`}>{config.label}</div>
                </div>
                <div className="flex items-center gap-1">
                  {cat.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-red-400" />
                  ) : cat.trend === 'down' ? (
                    <TrendingDown className="w-3 h-3 text-green-400" />
                  ) : (
                    <Minus className="w-3 h-3 text-gray-500" />
                  )}
                  <span className={`text-lg font-mono font-bold ${config.color} tabular-nums`}>{cat.level}</span>
                </div>
              </div>

              {/* Risk bar */}
              <div className="h-1 bg-gray-800 rounded-full mb-2">
                <div
                  className={`h-full rounded-full ${config.bar} transition-all duration-500`}
                  style={{ width: `${(cat.level / 5) * 100}%` }}
                ></div>
              </div>

              <p className="text-[10px] text-gray-500 leading-relaxed font-mono">{cat.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
