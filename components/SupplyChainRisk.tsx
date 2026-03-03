import { riskCategories, compositeRiskScore, compositeRiskLabel } from '@/config/risk-data';
import { TrendingUp, TrendingDown, Minus, AlertOctagon } from 'lucide-react';

const riskConfig = {
  5: { label: 'CRITICAL', color: 'text-red-400', hexColor: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/30', bar: 'bg-red-500' },
  4: { label: 'HIGH', color: 'text-orange-400', hexColor: '#f97316', bg: 'bg-orange-500/10', border: 'border-orange-500/30', bar: 'bg-orange-500' },
  3: { label: 'ELEVATED', color: 'text-yellow-400', hexColor: '#eab308', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', bar: 'bg-yellow-500' },
  2: { label: 'MODERATE', color: 'text-blue-400', hexColor: '#3b82f6', bg: 'bg-blue-500/10', border: 'border-blue-500/30', bar: 'bg-blue-500' },
  1: { label: 'LOW', color: 'text-green-400', hexColor: '#22c55e', bg: 'bg-green-500/10', border: 'border-green-500/30', bar: 'bg-green-500' },
} as const;

const BAR_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e'];
function barColor(level: number): string {
  return BAR_COLORS[5 - level] ?? '#6b7280';
}

export default function SupplyChainRisk() {
  const compositeConfig = compositeRiskScore >= 4.5 ? riskConfig[5] : compositeRiskScore >= 3.5 ? riskConfig[4] : riskConfig[3];
  const gaugeColor = compositeConfig.hexColor;
  const gaugePct = compositeRiskScore / 5;

  return (
    <div className="bg-[#07090f] border border-[#1a2a3a] rounded-sm overflow-hidden h-full flex flex-col">
      {/* Header — title + big conic gauge */}
      <div className="border-b border-[#1a2a3a] px-4 py-3 flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <AlertOctagon className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
          <h2 className="text-[11px] font-semibold text-gray-300 uppercase tracking-[0.15em]">
            Supply Chain Risk
          </h2>
        </div>
        {/* Conic gauge */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div
            className="w-16 h-16 rounded-full flex-shrink-0"
            style={{
              background: `conic-gradient(${gaugeColor} 0% ${gaugePct * 100}%, #1e2d3d ${gaugePct * 100}% 100%)`,
              padding: '5px',
            }}
          >
            <div className="w-full h-full rounded-full bg-[#07090f] flex flex-col items-center justify-center">
              <span className={`text-xl font-bold font-mono tabular-nums leading-none ${compositeConfig.color}`}>
                {compositeRiskScore.toFixed(1)}
              </span>
              <span className="text-[7px] text-gray-600 tracking-wide mt-0.5">/ 5.0</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 uppercase tracking-widest">Composite</span>
            <span className={`text-base font-bold tracking-widest ${compositeConfig.color}`}>
              {compositeRiskLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Risk Categories — clean scannable rows */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-0">
        {riskCategories.map((cat) => {
          const config = riskConfig[cat.level];
          return (
            <div
              key={cat.id}
              className="flex items-center gap-3 py-2 border-b border-[#0f1825] last:border-0"
            >
              {/* Category name */}
              <div className="flex-1 min-w-0">
                <span className="text-[12px] text-gray-300">{cat.name}</span>
              </div>

              {/* Risk bar (thin) */}
              <div className="w-20 h-1.5 bg-gray-800 rounded-full flex-shrink-0">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(cat.level / 5) * 100}%`,
                    backgroundColor: barColor(cat.level),
                  }}
                />
              </div>

              {/* Trend arrow */}
              <div className="flex-shrink-0 w-4 flex justify-center">
                {cat.trend === 'up' ? (
                  <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                ) : cat.trend === 'down' ? (
                  <TrendingDown className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-gray-600" />
                )}
              </div>

              {/* Level label */}
              <div className={`flex-shrink-0 text-[10px] font-bold tracking-widest w-16 text-right ${config.color}`}>
                {config.label}
              </div>

              {/* Numeric score */}
              <div className={`flex-shrink-0 text-base font-bold font-mono tabular-nums w-5 text-right ${config.color}`}>
                {cat.level}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
